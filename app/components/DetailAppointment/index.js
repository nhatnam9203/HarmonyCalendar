import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import moment from 'moment';
import { FaTimesCircle } from 'react-icons/fa';
import Enter from '../../images/enter.png';
import 'react-day-picker/lib/style.css';
import DayPicker from 'react-day-picker';

import 'rc-time-picker/assets/index.css';
import NumberFormat from 'react-number-format';
import { DatePicker } from 'antd-mobile';
import enUs from 'antd-mobile/lib/date-picker/locale/en_US';
import 'antd-mobile/dist/antd-mobile.css';
import OutsideClickHandler from 'react-outside-click-handler';
import { formatPhone } from '../../utils/helper';
import _ from 'lodash';
const statusConvertData = {
	ASSIGNED: 'unconfirm',
	CONFIRMED: 'confirm',
	CHECKED_IN: 'checkin',
	PAID: 'paid',
	WAITING: 'waiting',
	CANCEL: 'cancel'
};

const convertAppointment = (appointment) => {
	return {
		id: appointment.id,
		code: appointment.code,
		userFullName: appointment.firstName + ' ' + appointment.lastName,
		firstName: appointment.firstName,
		lastName: appointment.lastName,
		phoneNumber: appointment.phoneNumber,
		services: appointment.options.sort(function(a, b) {
			var c = a.bookingServiceId;
			var d = b.bookingServiceId;
			return d - c;
		}),
		products: appointment.products.sort(function(a, b) {
			var c = a.bookingProductId;
			var d = b.bookingProductId;
			return d - c;
		}),
		extras: appointment.extras.sort(function(a, b) {
			var c = a.bookingExtraId;
			var d = b.bookingExtraId;
			return d - c;
		}),
		status: statusConvertData[appointment.status],
		staffId: appointment.memberId,
		fromTime: appointment.start,
		toTime: appointment.end,
		userId: appointment.user_id,
		createDate: appointment.createDate,
		tipPercent: appointment.tipPercent,
		tipAmount: appointment.tipAmount,
		subTotal: appointment.subTotal,
		total: appointment.total,
		tax: appointment.tax,
		discount: appointment.discount,
		giftCard: appointment.giftCard,
		giftCards: appointment.giftCards ? appointment.giftCards : [],
		notes: appointment.notes
			? appointment.notes.sort(function(a, b) {
					var c = a.appointmentNoteId;
					var d = b.appointmentNoteId;
					return d - c;
				})
			: []
	};
};

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
	overflow-y: scroll;
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
	padding: 0.5rem;
	& > div {
		width: 50%;
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
	margin-top: 20px;
`;

const AdjustButton = styled.button`
	background: ${(props) => (props.active ? '#0071c5' : '#dddddd')};
	color: #ffffff;
	padding: 2px 15px;
	margin: 0 10px;
	border-radius: 6px;
	cursor: ${(props) => (props.active ? 'pointer' : 'initial')};
`;

const ButtonProduct = styled.button`
	background: ${(props) => (props.active ? '#0071c5' : '#dddddd')};
	color: #ffffff;
	padding: 2px 15px;
	margin: 0 10px;
	border-radius: 6px;
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
	width: calc(100%/3);
	float: left;
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
  height: 200px;
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

const initialState = {
	noteValue: '',
	confirmationModal: false,
	userFullName: '',
	services: [],
	products: [],
	extras: [],
	prices: [],
	old_prices: [],
	pricesExtras: [],
	old_priceExtras: [],
	old_total_duration: 0,
	dayChange: new Date(),
	fromTime: moment(),
	toTime: new Date(),
	notes: [],
	newNotes: [],
	time: new Date(),
	selectedStaff: '',
	isOpenStaffList: false,
	cloneAppointment: '',
	isPopupDay: false,
	isChange: false
};

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
			const selectedStaff = appointmentDetail
				? staffList.find((staff) => staff.id === appointmentDetail.memberId)
				: '';
			await this.resetState();
			const app_ = JSON.parse(JSON.stringify(appointmentDetail));
			const { options, userFullName, products, start, extras, notes } = app_;

			await this.setState({
				services: options,
				userFullName: userFullName,
				products: products,
				dayChange: currentDay,
				fromTime: moment(start),
				extras: extras,
				notes: notes,
				selectedStaff: selectedStaff,
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
					prices: [ ...this.state.prices, parseFloat(price) ],
					old_prices: [ ...this.state.prices, parseFloat(price) ]
				});
			}
			for (let i = 0; i < appointmentDetail.extras.length; i++) {
				const price = appointmentDetail.extras[i].price;
				this.setState({
					pricesExtras: [ ...this.state.pricesExtras, parseFloat(price) ],
					old_priceExtras: [ ...this.state.old_priceExtras, parseFloat(price) ]
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

	updateStatusPaid = (idAppointment) => {
		const { appointment } = this.props;

		const app = convertAppointment(appointment);

		const data = JSON.stringify({
			appointmentId: idAppointment,
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
				<AppointmentWrapper.Header color="#585858" backgroundColor="#FFFD71">
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

	onChangeFromTime(fromTime) {
		this.setState({ fromTime: fromTime });
		this.setChangeTrue();
	}
	onChangeToTime(toTime) {
		this.setState({ toTime });
		this.setChangeTrue();
	}

	onChangeSelectedStaff(staff, index) {
		this.setState({
			selectedStaff: staff
		});
		this.setChangeTrue();
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
		const { dayChange, isPopupDay } = this.state;
		return (
			<div
				onClick={() => this.setState({ isPopupDay: !isPopupDay })}
				style={{
					position: 'relative',
					paddingTop: 18
				}}
			>
				<div>{moment(dayChange).format('MM/DD/YYYY')}</div>
				{isPopupDay && (
					<OutsideClickHandler onOutsideClick={() => this.setState({ isPopupDay: !isPopupDay })}>
						<CalendarPopup>
							<CalendarPopup.Heading>Select Day</CalendarPopup.Heading>
							<CalendarPopup.Body>
								<DayPicker
									firstDayOfWeek={1}
									selectedDays={moment(dayChange).toDate()}
									onDayClick={(day) => this.setState({ dayChange: day })}
								/>
							</CalendarPopup.Body>
						</CalendarPopup>
					</OutsideClickHandler>
				)}
			</div>
		);
	}

	renderChangeAppointTime() {
		const { currentDay, appointment } = this.props;
		const { selectedStaff, isOpenStaffList } = this.state;
		return (
			<WrapperTimeChange>
				<SelectDateWrapper>
					<SelectDateWrapper.SelectDate>Date</SelectDateWrapper.SelectDate>
					{this.renderSelectDay()}
				</SelectDateWrapper>
				<SelectDateWrapper>
					<SelectDateWrapper.SelectDate>
						<div style={{ paddingLeft: '35%' }}>Time</div>
					</SelectDateWrapper.SelectDate>
					<div style={{ paddingLeft: '35%' }}>
						<DatePicker
							mode="time"
							minuteStep={15}
							use12Hours
							title="Select Time"
							// value={new Date(Date.now())}
							onChange={(time) => this.onChangeFromTime(time)}
							locale={enUs}
						>
							<p className="txtTimeChange">{moment(this.state.fromTime).format('hh:mm A').toString()}</p>
						</DatePicker>
					</div>
				</SelectDateWrapper>
				<SelectDateWrapper>
					<SelectDateWrapper.SelectStaff>Staff</SelectDateWrapper.SelectStaff>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							marginLeft : 20
						}}
					>
						<div style={{ position: 'relative', paddingTop: 3, color: '#333', paddingLeft: 60 }}>
							<div
								onClick={() => this.setState({ isOpenStaffList: !this.state.isOpenStaffList })}
								style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }}
							>
								<img
									style={{
										width: 40,
										height: 40,
										objectFit: 'cover',
										borderRadius: 30
									}}
									src={selectedStaff.imageUrl}
								/>
								<p
									style={{
										marginLeft: 10,
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap'
									}}
								>
									{selectedStaff.title}
								</p>
							</div>
							{isOpenStaffList && (
								<OutsideClickHandler
									onOutsideClick={() =>
										this.setState({ isOpenStaffList: false, indexSelectedStaff: '' })}
								>
									<div
										style={{
											height: 200,
											width: 170,
											overflowY: 'scroll',
											background: '#ffffff',
											zIndex: 9999,
											position: 'absolute',
											top: '110%',
											borderRadius: 5,
											boxShadow: '0 3px 9px rgba(0,0,0,.175)'
										}}
									>
										{this.renderStaffList()}
									</div>
								</OutsideClickHandler>
							)}
						</div>
					</div>
				</SelectDateWrapper>
				{/* <SelectDateWrapper>
					<SelectDateWrapper.SelectDate>&nbsp;&nbsp;</SelectDateWrapper.SelectDate>
					<ButtonChangeTime
						disabled={appointment.status === 'PAID'}
						onClick={() => this.ChangeAppointmentTime()}
					>
						Change
					</ButtonChangeTime>
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
									<div style={{ fontWeight: '600' }}>Subtotal : </div>
									<div>$ {parseFloat(appointment.subTotal).toFixed(2)}</div>
								</WrapperFooterPaid.ItemLeft>
								<WrapperFooterPaid.Item>
									<div style={{ fontWeight: '600' }}>Discount : </div>
									<div>$ {parseFloat(appointment.discount).toFixed(2)}</div>
								</WrapperFooterPaid.Item>
							</WrapperFooterPaid>
						</div>
						<div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
							<WrapperFooterPaid>
								<WrapperFooterPaid.ItemLeft>
									<div style={{ fontWeight: '600' }}>Tip : </div>
									<div>$ {parseFloat(appointment.tipAmount).toFixed(2)}</div>
								</WrapperFooterPaid.ItemLeft>
								<WrapperFooterPaid.Item>
									<div style={{ fontWeight: '600' }}>Gift card : </div>
									<div>$ {parseFloat(appointment.giftCard).toFixed(2)}</div>
								</WrapperFooterPaid.Item>
							</WrapperFooterPaid>
						</div>
						<div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
							<WrapperFooterPaid>
								<WrapperFooterPaid.ItemLeft>
									<div style={{ fontWeight: '600' }}>Tax : </div>
									<div style={{ paddingRight: 10 }}>$ {parseFloat(appointment.tax).toFixed(2)}</div>
								</WrapperFooterPaid.ItemLeft>
							</WrapperFooterPaid>
						</div>
						<FooterTotal>
							<div style={{ fontWeight: '900', fontSize: 20 }}>Total</div>
							<div style={{ fontWeight: '600', fontSize: 20, color: '#22DA26' }}>
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
		return (
			<AppointmentWrapper.Body>
				<UserInformation>
					<div>
						<span>Customer name: </span>
						<strong>{appointment.userFullName}</strong>
					</div>
					<div>
						<span>Phone number: </span>
						<strong>{formatPhone(appointment.phoneNumber)}</strong>
					</div>
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
		const { floatValue } = value;
		if (floatValue) {
			prices[index] = floatValue;
			services[index].price = floatValue;
			await this.setState({ prices, services });
		}

		if (this.isSame(this.state.prices, this.state.old_prices) === false) {
			this.setChangeTrue();
		}
	};

	renderService(service, index) {
		const { appointment } = this.props;
		if (appointment.status !== 'PAID') {
			return (
				<tr key={index}>
					<td>{service.serviceName}</td>
					{appointment.status !== 'PAID' && (
						<td style={{ textAlign: 'center' }}>
							<AdjustButton
								active={appointment.status !== 'PAID' && service.duration > 15}
								disabled={appointment.status === 'PAID' || service.duration <= 15}
								onClick={() => this.subtractService(index)}
							>
								-15&#39;
							</AdjustButton>
							{service.duration}
							<AdjustButton
								active={appointment.status !== 'PAID' && service.duration < 90}
								disabled={appointment.status === 'PAID' || service.duration >= 90}
								onClick={() => this.addService(index)}
							>
								+15&#39;
							</AdjustButton>
						</td>
					)}
					<td style={{ textAlign: 'center' }}>
						<NumberFormat
							value={parseFloat(this.state.prices[index]).toFixed(2)}
							onValueChange={(value) => this.onChangePrice(value, index)}
							thousandSeparator={false}
							disabled={appointment.status === 'PAID'}
							style={{ textAlign: 'center' }}
						/>
					</td>
				</tr>
			);
		} else {
			if (service.staff) {
				return (
					<tr key={index}>
						<td>{service.serviceName}</td>
						<td>
							<div style={{ display: 'flex', flexDirection: 'row' }}>
								<img
									src={service.staff.imageUrl}
									style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 25 }}
								/>
								<p style={{ marginLeft: 8 }}>{service.staff.displayName}</p>
							</div>
						</td>
						<td style={{ textAlign: 'center' }}>{service.staff.tip}</td>
						<td style={{ textAlign: 'center' }}>
							<NumberFormat
								value={parseFloat(this.state.prices[index]).toFixed(2)}
								onValueChange={(value) => this.onChangePrice(value, index)}
								thousandSeparator={false}
								disabled={appointment.status === 'PAID'}
								style={{ textAlign: 'center' }}
							/>
						</td>
					</tr>
				);
			} else {
				return (
					<tr key={index}>
						<td>{service.serviceName}</td>
						<td>You're in Offline</td>
						<td>You're in Offline</td>
						<td style={{ textAlign: 'center' }}>
							<NumberFormat
								value={parseFloat(this.state.prices[index]).toFixed(2)}
								onValueChange={(value) => this.onChangePrice(value, index)}
								thousandSeparator={false}
								disabled={appointment.status === 'PAID'}
								style={{ textAlign: 'center' }}
							/>
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
								<th width="50%">Selected Services</th>
								<th width="30%" style={{ textAlign: 'center' }}>
									Duration (min)
								</th>
								<th width="20%" style={{ textAlign: 'center' }}>
									Price ($)
								</th>
							</tr>
						</thead>
						<tbody>{services.map((s, i) => this.renderService(s, i))}</tbody>
					</table>
				);
			return (
				<table>
					<thead>
						<tr>
							<th width="25%">Selected Services</th>
							<th width="25%" style={{ textAlign: 'center' }}>
								Staff
							</th>
							<th width="25%" style={{ textAlign: 'center' }}>
								Tip ($)
							</th>
							<th width="25%" style={{ textAlign: 'center' }}>
								Service amount ($)
							</th>
						</tr>
					</thead>
					<tbody>{services.map((s, i) => this.renderService(s, i))}</tbody>
				</table>
			);
		}
	}

	renderProduct(product, index) {
		const { appointment } = this.props;
		return (
			<tr key={index}>
				<td>{product.productName}</td>
				<td style={{ textAlign: 'center' }}>
					<ButtonProduct
						active={
							appointment.status !== 'PAID' && product.quantity > 1
							// appointment.status !== 'CHECKED_IN'
						}
						disabled={
							appointment.status === 'PAID' || product.quantity <= 1
							// appointment.status === 'CHECKED_IN'
						}
						onClick={() => this.subtractProduct(index)}
					>
						-
					</ButtonProduct>
					{product.quantity}
					<ButtonProduct
						active={
							appointment.status !== 'PAID'
							// appointment.status !== 'CHECKED_IN'
						}
						disabled={
							appointment.status === 'PAID'
							// appointment.status === 'CHECKED_IN'
						}
						onClick={() => this.addProduct(index)}
					>
						+
					</ButtonProduct>
				</td>
				<td style={{ textAlign: 'center' }}>{parseFloat(product.price * product.quantity).toFixed(2)}</td>
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
		if (products.length > 0 || appointment.giftCards) {
			return (
				<table>
					<thead>
						<tr>
							<th style={{ width: '50%' }}>Selected Products</th>
							<th style={{ width: appointment.status === 'PAID' ? '25%' : '30%', textAlign: 'center' }}>
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

	subtractService(index) {
		this.setState((state) => {
			const { services, prices } = state;
			if (services[index].duration >= 30) {
				services[index].duration -= 15;
			}
			if (services[index].duration < 30) {
				services[index].duration = 15;
			}
			return {
				services
				//  prices
			};
		});
		this.setChangeTrue();
	}

	addService(index) {
		this.setState((state) => {
			const { services, prices } = state;
			services[index].duration += 15;
			// prices[index] = (services[index].price * (services[index].duration / 10))
			return {
				services
				// prices
			};
		});
		this.setChangeTrue();
	}

	subtractExtra(index) {
		this.setState((state) => {
			const { extras } = state;
			if (extras[index].duration >= 30) {
				extras[index].duration -= 15;
			}
			if (extras[index].duration < 30) {
				extras[index].duration = 15;
			}
			return {
				extras
			};
		});
		this.setChangeTrue();
	}

	addExtra(index) {
		this.setState((state) => {
			const { extras } = state;
			extras[index].duration += 15;
			return {
				extras
			};
		});
		this.setChangeTrue();
	}

	async onChangePriceExtra(value, index) {
		const { pricesExtras, extras } = this.state;
		const { floatValue } = value;
		if (floatValue) {
			pricesExtras[index] = floatValue;
			extras[index].price = floatValue;
			await this.setState({
				pricesExtras,
				extras
			});
		}
		if (this.isSame(this.state.prices, this.state.old_prices) === false) {
			this.setChangeTrue();
		}
	}

	renderExtra(extra, index) {
		const { appointment } = this.props;
		return (
			<tr key={index}>
				<td>{extra.extraName}</td>
				<td style={{ textAlign: 'center' }}>
					<AdjustButton
						active={
							// appointment.status !== 'CHECKED_IN' &&
							extra.duration > 15 && appointment.status !== 'PAID'
						}
						disabled={
							// appointment.status === 'CHECKED_IN' ||
							appointment.status === 'PAID' || extra.duration <= 15
						}
						onClick={() => this.subtractExtra(index)}
					>
						-15&#39;
					</AdjustButton>
					{extra.duration}
					<AdjustButton
						active={
							// appointment.status !== 'CHECKED_IN' &&
							extra.duration < 90 && appointment.status !== 'PAID'
						}
						disabled={
							// appointment.status === 'CHECKED_IN' ||
							extra.duration >= 90 || appointment.status === 'PAID'
						}
						onClick={() => this.addExtra(index)}
					>
						+15&#39;
					</AdjustButton>
				</td>
				<td style={{ textAlign: 'center' }}>
					<NumberFormat
						value={parseFloat(this.state.pricesExtras[index]).toFixed(2)}
						onValueChange={(value) => this.onChangePriceExtra(value, index)}
						thousandSeparator={false}
						disabled={appointment.status === 'PAID'}
						style={{ textAlign: 'center' }}
					/>
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
							<th style={{ width: appointment.status === 'PAID' ? '25%' : '30%', textAlign: 'center' }}>
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
				notes: [ note, ...notes ],
				newNotes: [ note, ...newNotes ],
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
						<Img src={Enter} alt="icon" />
					</button>
				</NoteWrapper.Form>
				{notes.map(this.renderNote)}
			</NoteWrapper>
		);
	}

	renderNextStatusButton() {
		const { appointment } = this.props;
		const { isChange } = this.state;
		if (!isChange) {
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
				<Button onClick={() => this.ChangeAppointmentTime()} primary="true">
					<strong>Change</strong>
				</Button>
			);
		}
	}

	getBoxShadow() {
		const { appointment } = this.props;
		let boxShadow = '';
		switch (appointment.status) {
			case 'ASSIGNED':
				boxShadow = '0 0px #fff inset, 0 0px 9px #FEE333';
				break;
			case 'CHECKED_IN':
				boxShadow = '0 1px #fff inset, 0 0.6px 9px #1FB5F4';
				break;
			case 'CONFIRMED':
				boxShadow = '0 1px #fff inset, 0 0.6px 9px #1FB5F4';
				break;

			case 'PAID':
				boxShadow = '0 0px #fff inset, 0 0.3px 9px #22DA27';
				break;

			default:
				break;
		}
		return boxShadow;
	}

	render() {
		const { appointment, appointmentDetail } = this.props;
		if (!appointment) return '';
		if (appointmentDetail === '') return '';
		const colorDelete =
			appointment.status === 'ASSIGNED' || appointment.status === 'CONFIRMED' ? '#585858' : 'white';
		return (
			<div>
				<AppointmentPopup
					// BoxShadow={this.getBoxShadow()}
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
			</div>
		);
	}
}

Appointment.propTypes = {
	appointment: PropTypes.any,
	deselectAppointment: PropTypes.func,
	cancelAppointment: PropTypes.func,
	nextStatus: PropTypes.func
	// services: PropTypes.any,
	// products: PropTypes.any,
};

export default Appointment;
