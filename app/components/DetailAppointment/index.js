import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import moment from 'moment';
import { FaTimesCircle } from 'react-icons/fa';
import 'react-day-picker/lib/style.css';
import DayPicker from 'react-day-picker';
import 'rc-time-picker/assets/index.css';
import NumberFormat from 'react-number-format';
import 'antd-mobile/dist/antd-mobile.css';
import OutsideClickHandler from 'react-outside-click-handler';
import { formatPhone } from '../../utils/helper';
import _ from 'lodash';
import { convertAppointment, statusConvertData, initialState } from './utilDetail';
import PopupStaff from './PopupStaff';
import { FaCaretDown } from 'react-icons/fa';
import PopupTimePicker from './PopupTimePicker';
import { MdSubdirectoryArrowLeft } from 'react-icons/md';
import PopupPrice from './PopupPrice';

const AppPopup = styled(Popup)`
	border-radius: 1.5rem;
	padding: 0 !important;
	border: none !important;
	box-shadow : ${(props) => props.BoxShadow};
	`;

const AppPopupWrapper = styled.div`position: relative;`;

AppPopupWrapper.Header = styled.div`
	height: 3rem;
	font-size: 23px;
	font-weight: 600;
	background: ${(props) => props.backgroundColor};
	color: ${(props) => (props.color ? props.color : 'white')};
	letter-spacing: 0.6;
	width: 100%;
	padding: 0.5rem 1rem;
	line-height: 1.5;
	text-align: center;
	border-top-left-radius: 1.5rem;
	border-top-right-radius: 1.5rem;
`;

AppPopupWrapper.Close = styled.div`
	position: absolute;
	right: 0.5rem;
	top: 0.25rem;
	line-height: 1;
	font-size: 2rem;
	color: #ffffff;
	cursor: pointer;
`;

AppPopupWrapper.Body = styled.div`
	background: #ffffff;
	width: 100%;
	padding: 1rem 1rem 0 1rem;
	height: 450px;
	overflow-y: ${(props) => (props.scroll ? 'scroll' : 'hidden')};
`;

AppPopupWrapper.Footer = styled.div`
	display: flex;
	padding: 0.5rem 1rem 1rem 1rem;
	& > div {
		width: 50%;
		text-align: center;
	}
`;

// ************************************************* //
// ************************************************ //
// ************************************************* //

const AppointmentPopup = styled(AppPopup)`
	width: 50rem !important;
	`;

const AppointmentWrapper = styled(AppPopupWrapper)`
	//
	`;

AppointmentWrapper.Header = styled(AppPopupWrapper.Header)`
	//
	`;

AppointmentWrapper.Close = styled(AppPopupWrapper.Close)`
	//
	`;

AppointmentWrapper.Body = styled(AppPopupWrapper.Body)`
	//
	`;

AppointmentWrapper.Footer = styled(AppPopupWrapper.Footer)`
	//
	`;

const UserInformation = styled.div`
	display: flex;
	flex-direction : row;
	justify-content : space-between;
	align-items: center;
	padding: 0.5rem;
	& > div {
		width: 35%;
		display: flex;
		justify-content: space-between;
	}
	& > div:nth-child(1) {
		margin-right: 1.5rem;
	}
`;

const WrapperCancelAppointment = styled.div`
	display: flex;
	width: 100%;
	justify-content: row;
	margin-top: 50px;
`;

const AdjustButton = styled.button`
	background: ${(props) => (props.active ? '#0071c5' : '#dddddd')};
	color: #ffffff;
	padding: 5px 15px;
	margin: 0 10px;
	width: 47px;
	border-radius: 3px;
	cursor: ${(props) => (props.active ? 'pointer' : 'initial')};
`;

const ButtonService = styled(AdjustButton)`
	background: ${(props) => props.backgroundColor};
`;

const ButtonExtra = styled(AdjustButton)`
	background: ${(props) => props.backgroundColor};
`;

const ButtonProduct = styled.button`
	background: ${(props) => props.backgroundColor};
	color: #ffffff;
	padding: 5px 15px;
	width: 47px;
	margin: 0 10px;
	border-radius: 3px;
	cursor: ${(props) => (props.active ? 'pointer' : 'initial')};
`;

const NoteWrapper = styled.div`
	border: 1px solid #dddddd;
	background: #eeeeee;
	padding: 0.5rem;
	overflow-x: scroll;
	height: 10rem;
`;

NoteWrapper.Form = styled.form`
	display: flex;
	& > input {
		flex: 1;
		background: #ffffff;
		border: 1px solid #dddddd;
		border-right: none;
		border-top-left-radius: 4px;
		border-bottom-left-radius: 4px;
		padding: 0 1rem;
		-moz-appearance: none;
		/* for Chrome */
		-webkit-appearance: none;
	}
	& > button {
		width: 5rem;
		border-top-right-radius: 4px;
		border-bottom-right-radius: 4px;
		background: #0071c5;
		color: #ffffff;
		line-height: 2.8;
		cursor: pointer;
		text-align: center;
	}
`;

const NoteInformation = styled.div`
	display: flex;
	padding: 0.5rem;
	& > div:nth-child(1),
	& > div:nth-child(2) {
		width: 20%;
	}
	& > div:last-child {
		width: 60%;
	}
`;

const AppointmentInformation = styled.div`
	display: flex;
	padding: 0.5rem;
	justify-content: space-between;
	& > div {
	}
`;

const TipPercent = styled.div`
	display: flex;
	padding: 0.5rem;
	& > div {
		width: 100%;
		display: flex;
		justify-content: flex-end;
	}
`;

const Button = styled.button`
	border-radius: 4px;
	background: ${(props) => (props.primary ? '#0071c5' : '#eeeeee')};
	color: ${(props) => (props.primary ? '#ffffff' : '#333333')};
	border: 1px solid #dddddd;
	font-size: 1rem;
	line-height: 2.8;
	height: 100%;
	cursor: pointer;
	text-align: center;
	padding: 0 2rem;
	width: 9rem;
`;

const ButtonChange = styled(Button)`
	box-shadow: 0 0px #fff inset, 0 0.6px 10px #1FB5F4;
	border: none !important;
`;

const ButtonChangeTime = styled.button`
	background: ${(props) => (props.disabled ? '#eeeeee' : '#0071c5')};
	color: ${(props) => (props.primary ? '#333333' : '#ffffff')};
	height: 40%;
	justify-content: center;
	align-items: center;
	margin-top: 5px;
	margin-left: 10px;
	width: 60%;
	float: right;
	cursor: pointer;
	border-radius: 4px;
	font-size: 1rem;
`;

const Img = styled.img`filter: invert(100%);`;

const WrapperTimeChange = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	margin-top: 1rem;
`;

const SelectDateWrapper = styled.div`
	width: calc(100%/2);
	float: left;
	/* background: #fffdeb; */
`;
SelectDateWrapper.SelectDate = styled.div`
	background: ${(props) => (props.NoneBackground ? '#ffffff' : '#585858')};
	color: #fff;
	font-size: 0.95rem;
	font-weight: 400;
	padding-left: 10px;
	line-height: 2;
`;
SelectDateWrapper.SelectStaff = styled(SelectDateWrapper.SelectDate)`
	padding-left : 50%;
	`;
// ************************************************* //
// ************************************************* //
// ************************************************* //

const ConfirmationPopup = styled(AppPopup)`
	width: 30rem !important;
	height: 10rem !important;
	`;

const ConfirmationWrapper = styled(AppPopupWrapper)`
	//
	`;

ConfirmationWrapper.Header = styled(AppPopupWrapper.Header)`
	//
	`;

ConfirmationWrapper.Body = styled(AppPopupWrapper.Body)`
	text-align: center;
	height: 150px;
	border-bottom-left-radius: 1.5rem;
	border-bottom-right-radius: 1.5rem;
	`;

ConfirmationWrapper.Close = styled(AppPopupWrapper.Close)`
	//
	`;

ConfirmationWrapper.Footer = styled(AppPopupWrapper.Footer)`
	//
	`;

const WrapperFooterPaid = styled.div`
	padding: 10px;
	display: flex;
	flex-direction: row;
`;
WrapperFooterPaid.Item = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	width: 50%;
	margin-left: 10px;
	color: #0b0b0b;
`;
WrapperFooterPaid.ItemLeft = styled(WrapperFooterPaid.Item)`
	padding-right : 4rem;
	`;

const FooterTotal = styled(WrapperFooterPaid)`
	justify-content : space-between;
	border-top: 1px solid #ebebeb;
	margin-top : 0.3rem;
	padding-left : 20px;
	`;

const MiniCalendarWrapper = styled.div`
	width: calc(5.05rem - 1px);
	height: 100%;
	text-align: center;
	border-right: 1px solid #3883bb;
	position: relative;
	padding: 0.5rem;
`;

MiniCalendarWrapper.Button = styled.div`
	border-radius: 4px;
	background: #0071c5;
	color: #ffffff;
	width: 100%;
	font-size: 1.5rem;
	line-height: 1.5;
	height: 100%;
	cursor: pointer;
`;

const CalendarPopup = styled.div`
	margin-top: 280px;
	position: absolute;
	transform: translate3d(0.5rem, calc(-18rem + 0.5rem), 0px);
	will-change: transform;
	z-index: 1;
	top: 3rem;
	left: 0;
	background: #fff;
	color: #000;
	height: 18rem;
	line-height: 1;
	box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
	border-radius: 8px;
	overflow: hidden;
`;

CalendarPopup.Heading = styled.div`
	background: #0071c5;
	color: #ffffff;
	height: 3rem;
	font-size: 1.2rem;
	line-height: 2;
	text-align: center;
	padding-top: 0.3rem;
`;

CalendarPopup.Body = styled.div``;

class Appointment extends React.Component {
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
			const { services, prices } = state;
			if (services[index].duration >= 5) {
				services[index].duration -= 5;
			}
			if (services[index].duration < 5) {
				services[index].duration = 5;
			}
			return {
				services
				//  prices
			};
		});
	}

	addService(index) {
		this.setState((state) => {
			const { services, prices } = state;
			services[index].duration += 5;
			// prices[index] = (services[index].price * (services[index].duration / 10))
			return {
				services
				// prices
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

			const selectedStaff = appointmentDetail
				? staffList.find((staff) => staff.id === appointmentDetail.memberId)
				: '';
			await this.resetState();
			const app_ = JSON.parse(JSON.stringify(appointmentDetail));
			const { options, userFullName, products, start, extras, notes } = app_;

			await this.setState({
				old_service: _services,
				old_product: appointmentDetail.products,
				old_extra: _extras,
				services: options,
				userFullName: userFullName,
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
		const { services } = this.state;
		const { appointment } = this.props;
		const servicesUpdate = services.map((service) => `${service.id}@${service.duration}@${appointment.memberId}`);
		if (appointment.status === 'ASSIGNED') {
			this.updateChangeAppointment('unconfirm', servicesUpdate);
		} else if (appointment.status === 'CONFIRMED') {
			this.updateChangeAppointment('unconfirm', servicesUpdate);
		} else if (appointment.status === 'CHECKED_IN') {
			this.updateChangeAppointment('checkin', servicesUpdate);
		} else {
			alert(`status appointment ${appointment.status}- id appointment ${appointment.id}`);
		}
		this.closeModal();
	}

	updateChangeAppointment(status, servicesUpdate) {
		const { products, fromTime, toTime, services, newNotes, selectedStaff, extras } = this.state;
		const { appointment, changeAppointmentTime } = this.props;
		changeAppointmentTime({
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
		});
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
			this.updateStatusPaid(appointment.id);
		} else {
			alert(`status appointment ${appointment.status} id appointment ${appointment.id}`);
		}
		this.closeModal();
	}

	updateStatusPaid = async (idAppointment) => {
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
		const { appointment, updateAppointment } = this.props;
		updateAppointment({
			appointment,
			servicesUpdate: services,
			productsUpdate: products,
			extrasUpdate: extras,
			status,
			notes: newNotes,
			old_duration: this.state.old_total_duration,
			old_status: appointment.status,
			old_appointment: cloneAppointment
		});
	}

	renderHeader() {
		const { appointment } = this.props;
		if (appointment.status === 'ASSIGNED') {
			return (
				<AppointmentWrapper.Header color="#585858" backgroundColor="#ffe559">
					{appointment.code} Unconfirmed Appointment
				</AppointmentWrapper.Header>
			);
		}
		if (appointment.status === 'CONFIRMED') {
			return (
				<AppointmentWrapper.Header color="#585858" backgroundColor="#c2f4ff">
					{appointment.code} Confirmed Appointment
				</AppointmentWrapper.Header>
			);
		}
		if (appointment.status === 'CHECKED_IN') {
			return (
				<AppointmentWrapper.Header backgroundColor="#00b4f7">
					{appointment.code} Checked-in Appointment
				</AppointmentWrapper.Header>
			);
		}
		if (appointment.status === 'PAID') {
			return (
				<AppointmentWrapper.Header backgroundColor="#00dc00">
					{appointment.code} Paid Appointment
				</AppointmentWrapper.Header>
			);
		}
		return <AppointmentWrapper.Header backgroundColor="#00dc00">Appointment</AppointmentWrapper.Header>;
	}

	renderStaffList() {
		const { staffList } = this.props;
		const { selectedStaff } = this.state;
		return staffList.map((staff, index) => {
			return (
				<div
					onClick={() => this.onChangeSelectedStaff(staff, index)}
					key={index}
					style={{
						display: 'flex',
						flexDirection: 'row',
						paddingLeft: 10,
						paddingTop: 10,
						cursor: 'pointer',
						fontWeight: selectedStaff.id === staff.id ? '600' : '400',
						color: selectedStaff.id === staff.id ? '#ffffff' : '#333',
						backgroundColor: selectedStaff.id === staff.id ? '#1073C2' : '#ffffff'
					}}
				>
					<img
						style={{
							width: 40,
							height: 40,
							objectFit: 'cover',
							borderRadius: 30
						}}
						src={staff ? staff.imageUrl : ''}
					/>
					<p
						style={{
							marginLeft: 10
						}}
					>
						{staff.title}
					</p>
				</div>
			);
		});
	}

	renderSelectDay() {
		const { dayChange, isPopupDay, old_dayChange } = this.state;

		return (
			<div
				style={{
					position: 'relative',
					paddingTop: 3,
				}}
			>
				<div onClick={() => this.setState({ isPopupDay: !isPopupDay })} style={style.buttonDayChange}>
					{moment(dayChange).format('MM/DD/YYYY')}
					<FaCaretDown style={{ marginLeft: 10, color: '#1173C3' }} />
				</div>
				{isPopupDay && (
					<OutsideClickHandler onOutsideClick={() => this.setState({ isPopupDay: !isPopupDay })}>
						<CalendarPopup>
							<CalendarPopup.Heading>Select Day</CalendarPopup.Heading>
							<CalendarPopup.Body>
								<DayPicker
									firstDayOfWeek={1}
									selectedDays={moment(dayChange).toDate()}
									onDayClick={(day) => {
										this.setState({ dayChange: day });
									}}
								/>
							</CalendarPopup.Body>
						</CalendarPopup>
					</OutsideClickHandler>
				)}
			</div>
		);
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

	renderChangeAppointTime() {
		const { selectedStaff, isOpenStaffList, fromTime, isPopupTimePicker } = this.state;

		return (
			<WrapperTimeChange>
				<SelectDateWrapper>
					<SelectDateWrapper.SelectDate>Date</SelectDateWrapper.SelectDate>
					{this.renderSelectDay()}
				</SelectDateWrapper>

				<SelectDateWrapper>
					<SelectDateWrapper.SelectDate>
						<div>Time</div>
					</SelectDateWrapper.SelectDate>
					<div style={{ paddingTop: 3, height: 42, }}>
						<div
							style={{
								position: 'relative'
							}}
						>
							<div style={style.buttonTime} onClick={() => this.openPopupTimePicker()}>
								{moment(fromTime).format('hh:mm A').toString()}
								<FaCaretDown style={{ marginLeft: 10, color: '#1173C3' }} />
							</div>
							{isPopupTimePicker && (
								<PopupTimePicker
									cancelTimePicker={() => this.cancelTimePicker()}
									doneTimePicker={(time) => this.doneTimePicker(time)}
									currentDay={this.props.currentDay}
									fromTime={fromTime}
								/>
							)}
						</div>
					</div>
				</SelectDateWrapper>

				{/* 		<SelectDateWrapper>
					<SelectDateWrapper.SelectStaff>Staff</SelectDateWrapper.SelectStaff>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							marginLeft: 20
						}}
					>
						<div style={{ position: 'relative', paddingTop: 3, color: '#333', paddingLeft: 60 }}>
							<div
								onClick={() => this.setState({ isOpenStaffList: !this.state.isOpenStaffList })}
								style={style.row2}
							>
								<img style={style.imgStaff} src={selectedStaff.imageUrl} />
								<p style={style.staffName2}>{selectedStaff.title}</p>
								<FaCaretDown style={{ marginLeft: 10 }} />
							</div>
							{isOpenStaffList && (
								<OutsideClickHandler
									onOutsideClick={() =>
										this.setState({ isOpenStaffList: false, indexSelectedStaff: '' })}
								>
									<div style={style.staffList}>{this.renderStaffList()}</div>
								</OutsideClickHandler>
							)}
						</div>
					</div>
				</SelectDateWrapper> */}
			</WrapperTimeChange>
		);
	}

	renderFooterAppointment(appointment) {
		if (appointment.status === 'PAID') {
			return (
				<React.Fragment>
					<div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
						<div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
							<WrapperFooterPaid>
								<WrapperFooterPaid.ItemLeft>
									<div style={{ fontWeight: '600', color: '#585858' }}>Subtotal : </div>
									<div>$ {parseFloat(appointment.subTotal).toFixed(2)}</div>
								</WrapperFooterPaid.ItemLeft>
								<WrapperFooterPaid.Item>
									<div style={{ fontWeight: '600', color: '#585858' }}>Discount : </div>
									<div>$ {parseFloat(appointment.discount).toFixed(2)}</div>
								</WrapperFooterPaid.Item>
							</WrapperFooterPaid>
						</div>
						<div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
							<WrapperFooterPaid>
								<WrapperFooterPaid.ItemLeft>
									<div style={{ fontWeight: '600', color: '#585858' }}>Tip : </div>
									<div>$ {parseFloat(appointment.tipAmount).toFixed(2)}</div>
								</WrapperFooterPaid.ItemLeft>
								<WrapperFooterPaid.Item>
									<div style={{ fontWeight: '600', color: '#585858' }}>Gift card : </div>
									<div>$ {parseFloat(appointment.giftCard).toFixed(2)}</div>
								</WrapperFooterPaid.Item>
							</WrapperFooterPaid>
						</div>
						<div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
							<WrapperFooterPaid>
								<WrapperFooterPaid.ItemLeft>
									<div style={{ fontWeight: '600', color: '#585858' }}>Tax : </div>
									<div style={{ paddingRight: 10 }}>$ {parseFloat(appointment.tax).toFixed(2)}</div>
								</WrapperFooterPaid.ItemLeft>
							</WrapperFooterPaid>
						</div>
						<FooterTotal>
							<div style={{ fontWeight: '900', fontSize: 20, color: '#585858' }}>Total</div>
							<div style={{ fontWeight: '600', fontSize: 20, color: '#585858' }}>
								$ {parseFloat(appointment.total).toFixed(2)}
							</div>
						</FooterTotal>
					</div>
				</React.Fragment>
			);
		} else {
			return (
				<React.Fragment>
					<div>
						<span>Arriving : </span>
						<strong>{moment(appointment.start).fromNow()}</strong>
					</div>
					<div>
						<span>Tip : </span>
						<strong>{parseFloat(appointment.tipPercent).toFixed(2)}</strong>
					</div>
					<div>
						<span>Total : </span>
						<strong>$ {parseFloat(appointment.subTotal).toFixed(2)}</strong>
					</div>
				</React.Fragment>
			);
		}
	}

	renderBody() {
		const { appointment, currentDay } = this.props;
		const { isVip } = appointment;
		const { isPopupTimePicker } = this.state;
		return (
			<AppointmentWrapper.Body scroll={isPopupTimePicker ? false : true}>
				<UserInformation>
					<div>
						<span>Customer name: </span>
						<span style={{ color: '#333', fontWeight: '600' }}>{appointment.userFullName}</span>
					</div>
					<div>
						<span>Phone number: </span>
						<span style={{ color: '#333', fontWeight: '600' }}>{formatPhone(appointment.phoneNumber)}</span>
					</div>
					{isVip === 1 &&
						<div style={{ width: '12%', borderRadius: 100, padding: 8, backgroundColor: '#52D969', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
							<img
								src={require('../../images/vip.png')}
								style={{
									width: 17,
									height: 17
								}}
							/>
							<span style={{ color: 'white' , marginLeft: 5 }}>VIP</span>
						</div>}
				</UserInformation>

				{appointment.status !== 'PAID' && this.renderChangeAppointTime()}
				{this.renderServices()}
				{this.renderProducts()}
				{this.renderExtras()}
				{this.renderNotes()}
				<AppointmentInformation>{this.renderFooterAppointment(appointment)}</AppointmentInformation>
				<TipPercent />
			</AppointmentWrapper.Body>
		);
	}

	isSame(arrayOne, arrayTwo) {
		var a = arrayOne,
			b = arrayTwo;

		if (arrayOne.length <= arrayTwo.length) {
			a = arrayTwo;
			b = arrayOne;
			return _.isEmpty(_.difference(a.sort(), b.sort()));
		} else {
			return false;
		}
	}

	onChangePrice = async (value, index) => {
		const { prices, services } = this.state;
		prices[index] = value;
		services[index].price = value;
		await this.setState({ prices, services });
	};

	buttonService(appointment, service, index) {
		const { old_service } = this.state;
		let backgroundColor = '#dddddd';
		if (appointment.status !== 'PAID' && service.duration > 5) backgroundColor = '#0071c5';
		// if (parseInt(old_service[index].duration) > parseInt(service.duration) && service.duration > 5)
		// 	backgroundColor = '#C3447A';
		return backgroundColor;
	}

	buttonService2(appointment, service, index) {
		const { old_service } = this.state;
		let backgroundColor = '#dddddd';
		if (appointment.status !== 'PAID') backgroundColor = '#0071c5';
		// if (parseInt(old_service[index].duration) < parseInt(service.duration)) backgroundColor = '#C3447A';
		return backgroundColor;
	}

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

	renderService(service, index) {
		const { appointment, staffList } = this.props;
		const staff = staffList.find((s) => parseInt(s.id) === parseInt(service.staffId));
		const { prices, isPopupStaff, indexPopupStaff } = this.state;

		let price = prices[index] ? parseFloat(prices[index]).toFixed(2) : "0.00";

		const duration =
			service.duration.toString().length === 1 ? '0' + service.duration.toString() : service.duration;
		const title = staff ? staff.title : '';

		if (appointment.status !== 'PAID') {
			return (
				<tr key={index}>
					<td style={{ borderRight: 0 }}>
						<div onClick={() => this.togglePopupStaff('', index)} style={style.staffService}>
							{/* <img src={staff.imageUrl ? staff.imageUrl : ''} style={style.imgStaff} /> */}
							<p style={style.staffNameColumn}>{title}</p>
							<FaCaretDown style={{ color: '#1173C3' }} />

							{isPopupStaff &&
								index === indexPopupStaff && (
									<PopupStaff
										togglePopupStaff={(staff) => this.togglePopupStaff(staff, index)}
										staffList={staffList}
										closePopupStaff={() => this.closePopupStaff()}
									/>
								)}
						</div>
					</td>

					<td style={{ borderLeft: 0 }}>
						<div style={style.serviceColumn}>
							<div style={style.serviceName}>{service.serviceName}</div>
						</div>
					</td>

					{appointment.status !== 'PAID' && (
						<td style={{ textAlign: 'center' }}>
							<ButtonService
								backgroundColor={this.buttonService(appointment, service, index)}
								disabled={appointment.status === 'PAID' || service.duration <= 5}
								onClick={() => this.subtractService(index)}
							>
								-5&#39;
							</ButtonService>

							{duration}

							<ButtonService
								backgroundColor={this.buttonService2(appointment, service, index)}
								disabled={appointment.status === 'PAID'}
								onClick={() => this.addService(index)}
							>
								+5&#39;
							</ButtonService>
						</td>
					)}
					<td>
						<div
							onClick={() => this.openPopupPrice(price, index, 'service')}
							style={style.row}
						>
							<div style={style.priceS}>{price}</div>
							<img
								src={require('../../images/edit.png')}
								style={{
									width: 16,
									height: 16,
								}}
							/>
						</div>
					</td>
				</tr>
			);
		} else {
			if (service.staff) {
				return (
					<tr key={index}>
						<td style={{ borderRight: 0 }}>
							<div style={{ display: 'flex', flexDirection: 'row' }}>
								<img
									src={service.staff.imageUrl}
									style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 25 }}
								/>
								<p style={{ marginLeft: 8 }}>{service.staff.displayName}</p>
							</div>
						</td>
						<td style={{ borderLeft: 0 }}>
							<div style={style.serviceName}>{service.serviceName}</div>
						</td>

						<td style={{ textAlign: 'center' }}>{service.staff.tip}</td>
						<td>
							<div style={{ textAlign: 'center' }}>{price}</div>
						</td>
					</tr>
				);
			} else {
				return (
					<tr key={index}>
						<td>{service.serviceName}</td>
						<td>You're in Offline</td>
						<td>You're in Offline</td>
						<td>
							<div style={style.row}>
								<NumberFormat
									value={price}
									onValueChange={(value) => this.onChangePrice(value, index)}
									thousandSeparator={false}
									disabled={appointment.status === 'PAID'}
									style={style.price}
									type="tel"
								/>
								<img
									src={require('../../images/edit.png')}
									style={{
										width: 16,
										height: 16
									}}
								/>
							</div>
						</td>
					</tr>
				);
			}
		}
	}

	renderServices() {
		const { services } = this.state;
		const { appointment } = this.props;
		if (services.length > 0) {
			if (appointment.status !== 'PAID')
				return (
					<table>
						<thead>
							<tr>
								<th
									width="25%"
									style={{
										borderRight: 0
									}}
								>
									Staff
								</th>

								<th
									width="25%"
									style={{
										borderLeft: 0
									}}
								>
									Services
								</th>

								<th width="25%" style={{ textAlign: 'center' }}>
									Duration (min)
								</th>
								<th style={{ textAlign: 'center' }}>Price ($)</th>
							</tr>
						</thead>
						<tbody>{services.map((s, i) => this.renderService(s, i))}</tbody>
					</table>
				);
			return (
				<table>
					<thead>
						<tr>
							<th
								style={{
									borderRight: 0
								}}
								width="25%"
							>
								Staff
							</th>
							<th
								style={{
									borderLeft: 0
								}}
								width="25%"
							>
								Services
							</th>
							<th width="25%" style={{ textAlign: 'center' }}>
								Tip ($)
							</th>
							<th width="25%" style={{ textAlign: 'center' }}>
								Price ($)
							</th>
						</tr>
					</thead>
					<tbody>{services.map((s, i) => this.renderService(s, i))}</tbody>
				</table>
			);
		}
	}

	buttonProduct(appointment, product, index) {
		const { old_product } = this.state;
		let backgroundColor = '#dddddd';
		if (appointment.status !== 'PAID' && product.quantity > 1) backgroundColor = '#0071c5';
		// if (parseInt(old_product[index].quantity) > parseInt(product.quantity) && product.quantity > 1)
		// 	backgroundColor = '#C3447A';
		return backgroundColor;
	}

	buttonProduct2(appointment, product, index) {
		const { old_product } = this.state;
		let backgroundColor = '#dddddd';
		if (appointment.status !== 'PAID') backgroundColor = '#0071c5';
		// if (parseInt(old_product[index].quantity) < parseInt(product.quantity)) backgroundColor = '#C3447A';
		return backgroundColor;
	}

	renderProduct(product, index) {
		const { appointment } = this.props;
		const { old_product } = this.state;

		const quantity =
			product.quantity.toString().length === 1 ? '0' + product.quantity.toString() : product.quantity;

		return (
			<tr key={index}>
				<td>{product.productName}</td>
				<td style={{ textAlign: 'center' }}>
					<ButtonProduct
						backgroundColor={this.buttonProduct(appointment, product, index)}
						disabled={appointment.status === 'PAID' || product.quantity <= 1}
						onClick={() => this.subtractProduct(index)}
					>
						-
					</ButtonProduct>
					{quantity}
					<ButtonProduct
						backgroundColor={this.buttonProduct2(appointment, product, index)}
						disabled={appointment.status === 'PAID'}
						onClick={() => this.addProduct(index)}
					>
						+
					</ButtonProduct>
				</td>
				<td>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center'
						}}
					>
						<div style={appointment.status !== 'PAID' ? style.price2 : {}}>{parseFloat(product.price * product.quantity).toFixed(2)}</div>
					</div>
				</td>
			</tr>
		);
	}

	renderGiftCard(giftCard, index) {
		if (giftCard) {
			return (
				<tr key={index}>
					<td>{giftCard.name ? giftCard.name : ''}</td>
					<td style={{ textAlign: 'center' }}>{giftCard.quantity}</td>
					<td style={{ textAlign: 'center' }}>{giftCard.price}</td>
				</tr>
			);
		}
	}

	renderProducts() {
		const { products } = this.state;
		const { appointment } = this.props;

		if (products.length > 0 || (appointment.giftCards && appointment.giftCards.length > 0)) {
			return (
				<table>
					<thead>
						<tr>
							<th style={{ width: '50%' }}>Selected Products</th>
							<th style={{ width: appointment.status === 'PAID' ? '25%' : '25%', textAlign: 'center' }}>
								Amount
							</th>
							<th style={{ textAlign: 'center' }}>Price ($)</th>
						</tr>
					</thead>
					<tbody>
						{products.map((p, i) => this.renderProduct(p, i))}
						{appointment.giftCards && appointment.giftCards.map((p, i) => this.renderGiftCard(p, i))}
					</tbody>
				</table>
			);
		}
	}

	buttonExtra(appointment, extra, index) {

		const { old_extra } = this.state;
		let backgroundColor = '#dddddd';
		if (appointment.status !== 'PAID' && extra.duration > 5) backgroundColor = '#0071c5';
		// if (parseInt(old_extra[index].duration) > parseInt(extra.duration) && extra.duration > 5)
		// 	backgroundColor = '#C3447A';
		return backgroundColor;
	}

	buttonExtra2(appointment, extra, index) {
		const { old_extra } = this.state;
		let backgroundColor = '#dddddd';
		if (appointment.status !== 'PAID') backgroundColor = '#0071c5';
		// if (parseInt(old_extra[index].duration) < parseInt(extra.duration)) backgroundColor = '#C3447A';
		return backgroundColor;
	}

	renderExtra(extra, index) {
		const { appointment } = this.props;
		const { pricesExtras } = this.state;

		let price = pricesExtras[index] ? parseFloat(pricesExtras[index]).toFixed(2) : '0.00'

		return (
			<tr key={index}>
				<td>{extra.extraName}</td>
				<td style={{ textAlign: 'center' }}>
					<ButtonExtra
						backgroundColor={this.buttonExtra(appointment, extra, index)}
						disabled={appointment.status === 'PAID' || extra.duration <= 5}
						onClick={() => this.subtractExtra(index)}
					>
						-5&#39;
					</ButtonExtra>
					{extra.duration}
					<ButtonExtra
						backgroundColor={this.buttonExtra2(appointment, extra, index)}
						disabled={appointment.status === 'PAID'}
						onClick={() => this.addExtra(index)}
					>
						+5&#39;
					</ButtonExtra>
				</td>
				<td style={{ textAlign: 'center' }}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center'
						}}
					>
						<div
							onClick={
								appointment.status !== 'PAID' ? (
									() =>
										this.openPopupPrice(price, index, 'extra')
								) : (
										() => { }
									)
							}
						>
							<div style={appointment.status !== 'PAID' ? style.priceS : {}}>{price}</div>
						</div>

						{appointment.status !== 'PAID' && (
							<img
								src={require('../../images/edit.png')}
								style={{
									width: 16,
									height: 16
								}}
							/>
						)}
					</div>
				</td>
			</tr>
		);
	}

	renderExtras() {
		const { extras } = this.state;
		const { appointment } = this.props;
		if (extras.length > 0) {
			return (
				<table>
					<thead>
						<tr>
							<th style={{ width: '50%' }}>Selected Extras</th>
							<th style={{ width: appointment.status === 'PAID' ? '25%' : '25%', textAlign: 'center' }}>
								Duration (min)
							</th>
							<th style={{ textAlign: 'center' }}>Price ($)</th>
						</tr>
					</thead>
					<tbody>{extras.map((p, i) => this.renderExtra(p, i))}</tbody>
				</table>
			);
		}
	}

	renderNote = (note, index) => (
		<NoteInformation key={index}>
			<div>
				<strong>{moment(note.createDate).format('MM/DD/YYYY')}</strong>
			</div>
			<div>
				<i>{note.note}</i>
			</div>
		</NoteInformation>
	);

	addNote() {
		const { newNotes, notes, noteValue } = this.state;
		const note = {
			createDate: new Date(),
			note: noteValue
		};
		if (noteValue.trim() !== '') {
			this.setState({
				notes: [note, ...notes],
				newNotes: [note, ...newNotes],
				noteValue: ''
			});
		}
	}

	renderNotes() {
		const { notes } = this.state;
		return (
			<NoteWrapper>
				<NoteWrapper.Form onSubmit={(e) => this.handleSubmit(e)}>
					<input value={this.state.noteValue} onChange={(e) => this.handleChange(e)} />
					<button onClick={() => this.addNote()} type="button">
						{/* <Img src={Enter} alt="icon" /> */}
						<MdSubdirectoryArrowLeft
							style={{
								width: 33,
								height: 33
							}}
						/>
					</button>
				</NoteWrapper.Form>
				{notes.map(this.renderNote)}
			</NoteWrapper>
		);
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
		return false;
	};

	renderNextStatusButton() {
		const { appointment } = this.props;
		if (this.conditionButtonChange()) {
			if (appointment.status === 'ASSIGNED')
				return (
					<Button onClick={() => this.nextStatus()} primary="true">
						Confirm
					</Button>
				);
			if (appointment.status === 'CONFIRMED')
				return (
					<Button onClick={() => this.nextStatus()} primary="true">
						Check In
					</Button>
				);
			if (appointment.status === 'CHECKED_IN')
				return (
					<Button onClick={() => this.nextStatus()} primary="true">
						Check out
					</Button>
				);
		} else {
			return (
				<ButtonChange onClick={() => this.ChangeAppointmentTime()} primary="true">
					<strong>Change</strong>
				</ButtonChange>
			);
		}
	}

	render() {
		const { appointment, appointmentDetail } = this.props;
		const { isPoupPrice } = this.state;
		if (!appointment) return '';
		if (appointmentDetail === '') return '';
		const colorDelete =
			appointment.status === 'ASSIGNED' || appointment.status === 'CONFIRMED' ? '#585858' : 'white';
		return (
			<div>
				<AppointmentPopup
					closeOnDocumentClick
					open
					onOpen={() => this.openModal()}
					onClose={() => this.closeModal()}
				>
					<AppointmentWrapper>
						<AppointmentWrapper.Close onClick={() => this.closeModal()}>
							<FaTimesCircle color={colorDelete} />
						</AppointmentWrapper.Close>
						{this.renderHeader()}
						{this.renderBody()}
						<AppointmentWrapper.Footer>
							{appointment.status !== 'PAID' && (
								<div>
									<Button onClick={() => this.openConfirmationModal()}>Cancel</Button>
								</div>
							)}
							<div>{this.renderNextStatusButton()}</div>
						</AppointmentWrapper.Footer>
					</AppointmentWrapper>
				</AppointmentPopup>

				<ConfirmationPopup open={this.state.confirmationModal}>
					<ConfirmationWrapper>
						<ConfirmationWrapper.Close onClick={() => this.closeConfirmationModal()}>
							<FaTimesCircle color={'white'} />
						</ConfirmationWrapper.Close>
						<ConfirmationWrapper.Header backgroundColor="#00b4f7">Confirmation</ConfirmationWrapper.Header>
						<ConfirmationWrapper.Body>
							Do you want to Cancel this Appointment?
							<WrapperCancelAppointment>
								<div style={{ width: '50%', textAlign: 'center' }}>
									<Button onClick={() => this.confirmCancelAppointment()}>Yes</Button>
								</div>
								<div style={{ width: '50%', textAlign: 'center' }}>
									<Button primary onClick={() => this.closeConfirmationModal()}>
										No
									</Button>
								</div>
							</WrapperCancelAppointment>
						</ConfirmationWrapper.Body>
					</ConfirmationWrapper>
				</ConfirmationPopup>

				<PopupPrice
					indexPrice={this.state.indexPrice}
					valuePriceIndex={this.state.valuePriceIndex}
					isPoupPrice={isPoupPrice}
					donePopupPrice={(price, index) => this.donePopupPrice(price, index)}
					closePopupPrice={() => this.closePopupPrice()}
					onChangePrice={(value, index) => this.onChangePrice(value, index)}
				/>
			</div>
		);
	}
}

const style = {
	staffList: {
		height: 200,
		width: 170,
		overflowY: 'scroll',
		background: '#ffffff',
		zIndex: 9999,
		position: 'absolute',
		top: '110%',
		borderRadius: 5,
		boxShadow: '0 3px 9px rgba(0,0,0,.175)'
	},
	imgStaff: {
		width: 40,
		height: 40,
		objectFit: 'cover',
		borderRadius: 30
		// border: '1.5px solid grey',
		// boxShadow: '0 2px #fff inset, 0 0.8px 4px grey'
	},
	price: {
		fontWeight: '700',
		color: '#1366AF',
		width: 60,
		textAlign: 'center'
	},
	price2: {
		fontWeight: '900',
		color: '#1366AF',
		width: 60,
		textAlign: 'center',
		marginLeft: -15,
		fontSize: 13,
		letterSpacing: 0.06,
		fontFamily: 'sans-serif'
	},
	row: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center'
	},
	buttonTime: {
		backgroundColor: '#EEEEEE',
		borderRadius: 5,
		padding: 10,
		textAlign: 'center',
		width: 120,
		position: 'relative'
	},
	buttonDayChange: {
		backgroundColor: '#EEEEEE',
		borderRadius: 5,
		padding: 10,
		textAlign: 'center',
		width: 130
	},
	staffService: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		position: 'relative',
		backgroundColor: '#EEEEEE',
		borderRadius: 5,
		maxWidth: 120,
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		height: 40,
		paddingRight: 10,
	},
	serviceColumn: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	staffNameColumn: {
		marginLeft: 8,
	},
	serviceName: {
		width: 150,
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis'
	},
	row2: {
		display: 'flex',
		flexDirection: 'row',
		cursor: 'pointer',
		alignItems: 'center'
	},
	staffName2: {
		marginLeft: 10,
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap'
	},
	row3: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	priceS: {
		color: '#1173C3',
		fontWeight: 'bold',
		marginRight: 5,
		fontFamily: 'sans-serif'
	}
};

Appointment.propTypes = {
	appointment: PropTypes.any,
	deselectAppointment: PropTypes.func,
	cancelAppointment: PropTypes.func,
	nextStatus: PropTypes.func
	// services: PropTypes.any,
	// products: PropTypes.any,
};

export default Appointment;
