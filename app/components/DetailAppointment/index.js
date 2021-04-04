import PropTypes from 'prop-types';
import moment from 'moment';
import { isEqual } from 'lodash'
import { convertAppointment, initialState , statusConvertData } from './widget/utilDetail';
import Layout from './layout'
import { addLastStaff } from "../../containers/AppointmentPage/utilSaga"
import { checkStringNumber2, PromiseAction } from "../../utils/helper"
import { staffId } from '../../../app-constants';
import $ from 'jquery';

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

	subtractExtra(ex) {
		const { bookingExtraId } = ex;
		const { extras } = this.state;
		const index = extras.findIndex(obj => obj.bookingExtraId === bookingExtraId);
		if (index !== -1) {
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
	}

	addExtra(ex) {
		const { bookingExtraId } = ex;
		const { extras } = this.state;
		const index = extras.findIndex(obj => obj.bookingExtraId === bookingExtraId);
		if (index !== -1) {
			this.setState((state) => {
				const { extras } = state;
				extras[index].duration += 5;
				return {
					extras
				};
			});
		}
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
				isEqual(old_service.sort(), services.sort()) &&
				isEqual(old_product.sort(), products.sort()) &&
				isEqual(old_extra.sort(), extras.sort()) &&
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
			const lastStaff = addLastStaff();

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
				element.price = element.price;
			});
			_extras.forEach((element) => {
				element.price = element.price;
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
				companionName: parseInt(appointmentDetail.companionName) !== 0 ? appointmentDetail.companionName : '',
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
			this.checkPhoneCompanion(appointmentDetail.companionPhone)

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
					prices: [...this.state.prices, price],
					old_prices: [...this.state.prices, price]
				});
			}
			for (let i = 0; i < appointmentDetail.extras.length; i++) {
				const price = appointmentDetail.extras[i].price;
				this.setState({
					pricesExtras: [...this.state.pricesExtras, price],
					old_priceExtras: [...this.state.old_priceExtras, price]
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
		const { appointment } = this.props;

		if (appointment.status === 'ASSIGNED') {
			this.updateChangeAppointment('unconfirm');
		} else if (appointment.status === 'CONFIRMED') {
			this.updateChangeAppointment('unconfirm');
		} else if (appointment.status === 'CHECKED_IN') {
			this.updateChangeAppointment('checkin');
		} else {
			// alert(`status appointment ${appointment.status} - id appointment ${appointment.id}`);
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

	toggleEditPaidAppointment() {
		const { isEditPaidAppointment } = this.state;
		this.setState({
			isEditPaidAppointment: !isEditPaidAppointment
		})
	}

	updateStaffAppointmentPaid() {
		const { appointment } = this.props;
		const { services } = this.state;
		this.props.updateStaffAppointmentPaid({ appointment, services });
		this.closePopupTip();
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
			staffId : appointment.memberId,
			action: 'checkout'
		});

		window.postMessage(data);
	};


	addMore = () => {
		const { appointment } = this.props;
		const data = JSON.stringify({
			appointmentId: appointment.id,
			staffId : appointment.memberId,
			status : statusConvertData[appointment.status],
			action : (parseInt(appointment.memberId) === 0) ? 'addMoreAnyStaff' : 'addMore'
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
	}

	loadingPopupDetail() {
		this.setState({ isLoadingCompanion: true });
		this.props.loadingPopup(true);
	}

	async searchPhoneCompanion() {
		const { companionPhone, companionPhoneHeader } = this.state;
		if (companionPhone.toString().trim() !== '') {
			const phone = companionPhoneHeader + checkStringNumber2(companionPhone);
			const data = { phone };
			const action = this.props.searchPhoneCompanion;
			const _promise = await PromiseAction(action, data);
			if (_promise.success) {
				this.setState({ companionName: _promise.data })
			}
		}
	}

	async updateCompanion() {
		const { appointment: { id } } = this.props;
		let { companionPhone, companionName, companionPhoneHeader, isLoadingCompanion } = this.state;
		companionPhone = companionPhoneHeader + checkStringNumber2(companionPhone);
		const action = this.props.updateCompanion;
		const data = { companionPhone, companionName, id };
		this.loadingPopupDetail();
		const _promise = await PromiseAction(action, data);
		if (_promise.success) {
			this.setState({ isLoadingCompanion: false })
		}

	}

	openPopupTimePicker(indexFromTime, fromTimeService) {
		this.setState({
			isPopupTimePicker: true,
			indexFromTime,
			fromTimeService
		});
	}

	closePopupTimePicker() {
		const { isPopupTimePicker } = this.state;
		this.setState({
			isPopupTimePicker: !isPopupTimePicker
		});
	}

	doneTimePicker(time, index) {
		const { services } = this.state;
		services[index].fromTime = time;
		this.setState({
			services
		});
		this.closePopupTimePicker();
	}

	cancelTimePicker() {
		this.closePopupTimePicker();
	}

	checkPhoneCompanion = (phone) => {
		if (phone && phone.toString().includes('+84')) {
			this.setState({
				companionPhoneHeader: "+84",
				companionPhone: phone.toString().substring(3)
			})
		} else if (phone && phone.toString().includes('+1')) {
			this.setState({
				companionPhoneHeader: "+1",
				companionPhone: phone.toString().substring(2)
			})
		} else {
			this.setState({
				companionPhone: ""
			})
		}
	}

	onChangePrice = async (value, index) => {
		const { prices, services } = this.state;
		prices[index] = value;
		services[index].price = value;
		await this.setState({ prices, services });
	};

	onChangeTip = async (value, index) => {
		const { services } = this.state;
		services[index].tipAmount = value;
		await this.setState({ services });
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

	openPopupTip(tip, index) {
		this.setState({
			isPopupTip: true,
			indexPopupTip: index,
			valueTip: tip,
		});
	}

	closePopupTip() {
		this.setState({
			isPopupTip: false
		})
	}

	closePopupPrice() {
		this.setState({
			isPoupPrice: false
		});
	}

	donePopupTip(price, index) {
		this.onChangeTip(price, index);
		this.closePopupTip();
	}

	donePopupPrice(price, index) {
		const { isPopupPriceState } = this.state;
		if (isPopupPriceState === 'service') this.onChangePrice(price, index);
		else if (isPopupPriceState === 'extra') this.onChangePriceExtra(price, index);
		this.closePopupPrice();
	}

	onChangeCompanionName = (e) => {
		this.setState({ companionName: e.target.value });
	}

	onChangeCompanionPhone = async (e) => {
		const val = e.target.value;
		if (e.target.validity.valid) await this.setState({ companionPhone: e.target.value.replace(/^0+/, '') });
		else if (val === '' || val === '-') await this.setState({ companionPhone: val });
		await this.searchPhoneCompanion();
	}

	async addNote(e) {
		if (e) {
			e.preventDefault();
		}
		const { newNotes, notes, noteValue } = await this.state;
		if (noteValue.trim() !== '') {
			const { appointment, staffList } = this.props;
			const staff = staffList.find(obj => parseInt(obj.id) === parseInt(staffId));
			const note = await {
				createDate: new Date(),
				note: noteValue,
				staffName: staff ? staff.title : "",
			};
			if (noteValue.trim() !== '') {
				$("#containerNotes").animate({ scrollTop: 0 }, "fast");
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
