import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import { convertAppointment, statusConvertData, initialState } from './widget/utilDetail';
import Layout from './layout'
import { store } from 'app';

class Appointment extends Layout {
	constructor(props) {
		super(props);
		this.state = initialState;
	}

	addService(index) {
		this.setState((state) => {
			const { services } = state;
			services[index].duration += 15;
			return {
				services
			};
		});
	}

	subtractProduct(index) {
		this.setState((state) => {
			const { products } = state;
			if (products[index].quantity >= 1) {
				products[index].quantity -= 1;
			}
			return {
				products
			};
		});
	}

	addProduct(index) {
		this.setState((state) => {
			const { products } = state;
			products[index].quantity += 1;
			return {
				products
			};
		});
	}

	onChangeFromTime(fromTime) {
		this.setState({ fromTime: fromTime });
	}
	onChangeToTime(toTime) {
		this.setState({ toTime });
	}

	onChangeSelectedStaff(staff, index) {
		this.setState({
			selectedStaff: staff
		});
	}

	subtractService(index) {
		this.setState((state) => {
			const { services } = state;
			if (services[index].duration >= 5) {
				services[index].duration -= 5;
			}
			if (services[index].duration < 5) {
				services[index].duration = 5;
			}
			return {
				services
			};
		});
	}

	addService(index) {
		this.setState((state) => {
			const { services } = state;
			services[index].duration += 5;
			return {
				services
			};
		});
	}

	subtractExtra(index) {
		this.setState((state) => {
			const { extras } = state;
			if (extras[index].duration >= 5) {
				extras[index].duration -= 5;
			}
			if (extras[index].duration < 5) {
				extras[index].duration = 5;
			}
			return {
				extras
			};
		});
	}

	addExtra(index) {
		this.setState((state) => {
			const { extras } = state;
			extras[index].duration += 5;
			return {
				extras
			};
		});
	}

	async onChangePriceExtra(value, index) {
		const { pricesExtras, extras } = this.state;
		pricesExtras[index] = value;
		extras[index].price = value;
		await this.setState({
			pricesExtras,
			extras
		});
	}

	conditionButtonChange = () => {
		const {
			old_service,
			old_product,
			old_extra,
			services,
			products,
			extras,
			old_fromTime,
			fromTime,
			dayChange,
			old_dayChange,
			selectedStaff,
			old_selectedStaff
		} = this.state;

		if (selectedStaff && old_selectedStaff) {
			if (
				_.isEqual(old_service.sort(), services.sort()) &&
				_.isEqual(old_product.sort(), products.sort()) &&
				_.isEqual(old_extra.sort(), extras.sort()) &&
				moment(old_fromTime).format('hh:mm A') === moment(fromTime).format('hh:mm A') &&
				moment(dayChange).format('MM/DD/YYYY') === moment(old_dayChange).format('MM/DD/YYYY') &&
				selectedStaff.id === old_selectedStaff.id
			) {
				return true;
			}
		}
		return false;
	};

	handleSubmit(e) {
		const { notes, noteValue, userFullName } = this.state;
		e.preventDefault();
		this.setState({
			noteValue: '',
			notes: [
				{
					name: userFullName,
					date: moment().format('DD/MM/YYYY'),
					content: noteValue
				},
				...notes
			]
		});
	}

	handleChange(e) {
		const note = {
			note: e.target.value
		};
		this.setState({
			noteValue: note.note
		});
	}

	getTotalPrice() {
		const { products, pricesExtras, prices } = this.state;
		let total = 0;
		prices.forEach((price) => {
			total += parseInt(price);
		});
		products.forEach((product) => {
			total += product.price * product.quantity;
		});
		pricesExtras.forEach((price) => {
			total += parseInt(price);
		});
		return total;
	}

	getTotalDuration() {
		const { services } = this.state;
		let total = 0;
		services.forEach((service) => {
			total += service.duration;
		});
		return total;
	}

	closeModal() {
		const { deselectAppointment, disableCalendar } = this.props;
		deselectAppointment();
		disableCalendar(false);
	}

	setChangeTrue() {
		this.setState({ isChange: true });
	}

	setChangeFalse() {
		this.setState({ isChange: false });
	}

	reMakeStaffList(staffList) {
		let staff0 = staffList.find((s) => s.id === 0);
		let _staffList = staffList;
		if (!staff0) {
			const lastStaff = {
				id: 0,
				title: `Any staff`,
				imageUrl: '',
				orderNumber: 0,
				workingTimes: _staffList[_staffList.length - 2].workingTimes,
				isDisabled: false,
				pincode: 0,
				isNextAvailableStaff: false,
				blockTime: [],
				timeLogin: 0
			};

			_staffList.push(lastStaff);
		}
		return _staffList;
	}

	async componentWillReceiveProps(nextProps) {
		const { currentDay, staffList, appointmentDetail } = nextProps;
		if (appointmentDetail) {
			let _services = appointmentDetail.options;
			let _extras = appointmentDetail.extras;
			_services.forEach((element) => {
				element.price = parseFloat(element.price);
			});
			_extras.forEach((element) => {
				element.price = parseFloat(element.price);
			});

			let _staffList = this.reMakeStaffList(staffList);

			const selectedStaff = appointmentDetail
				? _staffList.find((staff) => staff.id === appointmentDetail.memberId)
				: '';

			await this.resetState();
			const app_ = JSON.parse(JSON.stringify(appointmentDetail));
			const { options, userFullName, products, start, extras, notes, firstName, lastName } = app_;

			await this.setState({
				old_service: _services,
				old_product: appointmentDetail.products,
				old_extra: _extras,
				services: options,
				userFullName: firstName + ' ' + lastName,
				products: products,
				dayChange: currentDay,
				old_dayChange: currentDay,
				fromTime: moment(start),
				old_fromTime: moment(start),
				extras: extras,
				notes: notes,
				selectedStaff: selectedStaff,
				old_selectedStaff: selectedStaff,
				cloneAppointment: JSON.parse(JSON.stringify(appointmentDetail))
			});

			let old_duration = 0;
			await appointmentDetail.options.forEach((el) => {
				old_duration += parseInt(el.duration);
			});
			await appointmentDetail.extras.forEach((el) => {
				old_duration += parseInt(el.duration);
			});
			this.setState({
				old_total_duration: old_duration
			});

			await this.setState({ prices: [], pricesExtras: [] });
			for (let i = 0; i < appointmentDetail.options.length; i++) {
				const price = appointmentDetail.options[i].price;
				this.setState({
					prices: [...this.state.prices, parseFloat(price)],
					old_prices: [...this.state.prices, parseFloat(price)]
				});
			}
			for (let i = 0; i < appointmentDetail.extras.length; i++) {
				const price = appointmentDetail.extras[i].price;
				this.setState({
					pricesExtras: [...this.state.pricesExtras, parseFloat(price)],
					old_priceExtras: [...this.state.old_priceExtras, parseFloat(price)]
				});
			}
		}
	}

	resetState() {
		this.setState(initialState);
	}

	openConfirmationModal() {
		this.setState({
			confirmationModal: true
		});
	}

	closeConfirmationModal() {
		this.setState({
			confirmationModal: false
		});
	}

	confirmCancelAppointment() {
		this.closeConfirmationModal();
		const { appointment, cancelAppointment, disableCalendar } = this.props;
		const { services } = this.state;
		cancelAppointment(appointment.id);
		const servicesUpdate = services.map((service) => `${service.id}@${service.duration}@${appointment.memberId}`);
		this.updateStatus('cancel', servicesUpdate);
		disableCalendar(false);
	}

	ChangeAppointmentTime() {
		// const { services } = this.state;
		const { appointment } = this.props;
		// const servicesUpdate = services.map((service) => `${service.id}@${service.duration}@${appointment.memberId}`);

		if (appointment.status === 'ASSIGNED') {
			this.updateChangeAppointment('unconfirm');
		} else if (appointment.status === 'CONFIRMED') {
			this.updateChangeAppointment('unconfirm');
		} else if (appointment.status === 'CHECKED_IN') {
			this.updateChangeAppointment('checkin');
		} else {
			alert(`status appointment ${appointment.status} - id appointment ${appointment.id}`);
		}
		this.closeModal();
	}

	updateChangeAppointment(status) {
		const { products, fromTime, toTime, services, newNotes, selectedStaff, extras } = this.state;
		const { appointment } = this.props;

		const payload = {
			appointment,
			total: this.getTotalPrice(),
			duration: this.getTotalDuration(),
			servicesUpdate: services,
			productsUpdate: products,
			extrasUpdate: extras,
			status,
			old_duration: this.state.old_total_duration,
			fromTime,
			toTime,
			notes: newNotes,
			dayPicker: this.state.dayChange,
			selectedStaff: selectedStaff
		}

		this.props.changeAppointmentTime(payload)
	}

	nextStatus() {
		const { appointment } = this.props;
		const { services } = this.state;
		const servicesUpdate = services.map((service) => `${service.id}@${service.duration}@${appointment.memberId}`);

		if (appointment.status === 'ASSIGNED') {
			this.updateStatus('confirm', servicesUpdate);
		} else if (appointment.status === 'CONFIRMED') {
			this.updateStatus('checkin', servicesUpdate);
		} else if (appointment.status === 'CHECKED_IN') {
			this.checkOut(appointment.id);
		} else {
			alert(`status appointment ${appointment.status} id appointment ${appointment.id}`);
		}
		this.closeModal();
	}

	checkOut = async (idAppointment) => {
		const { appointment } = this.props;

		const app = await convertAppointment(appointment);

		const data = await JSON.stringify({
			appointmentId: idAppointment ? idAppointment : 'web',
			appointment: app,
			action: 'checkout'
		});

		window.postMessage(data);
	};

	updateStatus(status, servicesUpdate) {
		const { products, services, extras, newNotes, cloneAppointment } = this.state;
		const { appointment } = this.props;

		const payload = {
			appointment,
			servicesUpdate: services,
			productsUpdate: products,
			extrasUpdate: extras,
			status,
			notes: newNotes,
			old_duration: this.state.old_total_duration,
			old_status: appointment.status,
			old_appointment: cloneAppointment
		}
		this.props.updateAppointment(payload);

		// console.log({ appointment });
		// if(appointment.memberId !== 0){
		// 	const payload = {
		// 		appointment,
		// 		servicesUpdate: services,
		// 		productsUpdate: products,
		// 		extrasUpdate: extras,
		// 		status,
		// 		notes: newNotes,
		// 		old_duration: this.state.old_total_duration,
		// 		old_status: appointment.status,
		// 		old_appointment: cloneAppointment
		// 	}
		// 	this.props.updateAppointment(payload);
		// }else{
		// 	const allAppointment = store.getState().getIn(['appointment', 'appointments', 'allAppointment']);
		// 	allAppointment.forEach(app => {
		// 		if(app.memberId === 0 && appointment.start === app.start){
		// 			console.log({app})
		// 		}
		// 	});
		// }
	}


	openPopupTimePicker() {
		this.setState({
			isPopupTimePicker: true
		});
	}

	closePopupTimePicker() {
		const { isPopupTimePicker } = this.state;
		this.setState({
			isPopupTimePicker: !isPopupTimePicker
		});
	}

	doneTimePicker(time) {
		this.setState({
			fromTime: time
		});
		this.closePopupTimePicker();
	}

	cancelTimePicker() {
		this.closePopupTimePicker();
	}

	onChangePrice = async (value, index) => {
		const { prices, services } = this.state;
		prices[index] = value;
		services[index].price = value;
		await this.setState({ prices, services });
	};

	togglePopupStaff = (staff, index) => {
		if (staff.id) {
			let { services } = this.state;
			services[index].staffId = staff.id;
			this.setState({ services });
		}
		const { isPopupStaff } = this.state;
		this.setState({
			isPopupStaff: !isPopupStaff,
			indexPopupStaff: index
		});
	};

	closePopupStaff() {
		const { isPopupStaff } = this.state;
		this.setState({
			isPopupStaff: !isPopupStaff
		});
	}

	openPopupPrice(price, index, state) {
		this.setState({
			isPoupPrice: true,
			indexPrice: index,
			valuePriceIndex: price,
			isPopupPriceState: state
		});
	}

	closePopupPrice() {
		this.setState({
			isPoupPrice: false
		});
	}

	donePopupPrice(price, index) {
		const { isPopupPriceState } = this.state;
		if (isPopupPriceState === 'service') this.onChangePrice(price, index);
		else if (isPopupPriceState === 'extra') this.onChangePriceExtra(price, index);
		this.closePopupPrice();
	}

	async addNote(e) {
		if(e){
			e.preventDefault();
		}
		const { newNotes, notes, noteValue } = await this.state;
		if (noteValue.trim() !== '') {
			const { appointment } = this.props;
			const note = await {
				createDate: new Date(),
				note: noteValue
			};
			if (noteValue.trim() !== '') {
				await this.setState({
					notes: [note, ...notes],
					newNotes: [note, ...newNotes],
					noteValue: ''
				});
			}

			this.props.updateNote({ notes: noteValue, idAppointment: appointment.id });
		}
	}
}

Appointment.propTypes = {
	appointment: PropTypes.any,
	deselectAppointment: PropTypes.func,
	cancelAppointment: PropTypes.func,
	nextStatus: PropTypes.func
};

export default Appointment;
