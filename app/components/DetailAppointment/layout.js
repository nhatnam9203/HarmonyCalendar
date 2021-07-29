import React from 'react';
import 'react-day-picker/lib/style.css';
import styled from 'styled-components';
import Popup from 'reactjs-popup';
import moment from 'moment';
import DayPicker from 'react-day-picker';
import OutsideClickHandler from 'react-outside-click-handler';
import { formatPhone } from '../../utils/helper';
import { PopupTimePicker } from './widget';
import NumberFormat from 'react-number-format';
import {
	FooterAppointment, PopupPrice, Product, Service,
	PopupTip, Header, PopupCancel, BottomButton
} from './widget';
import ReactLoading from 'react-loading';
import LoadingDetail from "./widget/LoadingDetail";
import closeBlack from '../../images/close_black.png';
import closeWhite from '../../images/close_white.png'
import iconCalendarGrey from '../../images/iconCalendarGrey.png';
import topArrow from '../../images/top_arrow@3x.png';
import alertIcon from "../../images/alert.png";
import { appointmentMoved } from '../../containers/AppointmentPage/actions';

const AppPopup = styled(Popup)`
	border-radius: 1.5rem;
	border-top-left-radius: 1.7rem;
	border-top-right-radius: 1.7rem;
	padding: 0 !important;
	border: none !important;
	box-shadow : ${(props) => props.BoxShadow};
`;

const AppPopupWrapper = styled.div`position: relative;`;

const LoadingCompanion = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 9999;
	border-radius: 25px;
	background: rgba(255, 255, 255, 0.4);
	display: flex;
	justify-content: center;
	align-items: center;
`;

AppPopupWrapper.Header = styled.div`
	height: 3rem;
	font-size: 22px;
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

const BtnClose = styled.div`
	position: absolute;
	right: 0.5rem;
	top: 0.25rem;
	line-height: 1;
	font-size: 2rem;
	color: #ffffff;
	cursor: pointer;
	& > img {
		width: 32px;
		height: 32px;
	}
`;

const BtnCloseSelectDay = styled(BtnClose)`
	& > img{
		width : 32px;
		height : 32px;
	}
`;

AppPopupWrapper.Body = styled.div`
	background: #ffffff;
	width: 100%;
	padding: 1rem 1rem 0 1rem;
	height: 460px;
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

const AppointmentPopup = styled(AppPopup)`
	width: 50rem !important;
	position: relative;
	`;

const AppointmentWrapper = styled(AppPopupWrapper)`
	//
	`;

AppointmentWrapper.Body = styled(AppPopupWrapper.Body)`
	//
	`;

const UserInformation = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 0.5rem;
	padding-bottom: 0.8rem;
	border-bottom: 1px solid #eeeeee;
	& > div:nth-child(1) {
		display: flex;
		flex-direction: row;
		& > div:nth-child(1) {
			background-color: #e5e5e5;
			width: 3.5rem;
			height: 3.5rem;
			border-radius: 50%;
			display: flex;
			padding: 0px !important;
			justify-content: center;
			align-items: center;
			& > span:nth-child(1) {
				color: #404040;
				font-weight: 600;
				font-size: 1.5rem;
			}
		}
		& > div:nth-child(2) {
			margin-left: 0.5rem;
			& > div:nth-child(1) {
				font-weight: 600;
				font-size: 1.1rem;
				color: #0764b0;
			}
			& > div:nth-child(2) {
				font-size: 0.9rem;
				width: 9rem;
				color: #585858;
				margin-top: 0.3rem;
			}
		}
		& > div:nth-child(3) {
			font-weight: 500;
			font-size: 1rem;
			color: #404040;
			margin-left: 1rem;
			display: flex;
			flex-direction: row;
			& > div:nth-child(2) {
				margin-left: 1rem;
				color: #585858;
				width: 25rem;
			}
		}
	}
`;

const NoteWrapper = styled.div`
	border: 1px solid #dddddd;
	background: #eeeeee;
	padding: 0.5rem;
	min-height: 10rem;
	max-height : 14.5rem;
`;

const TextNoteAppointment = styled.div`
	margin-top : 0.5rem;
	margin-bottom : 0.5rem !important;
	color : #585858;
	font-size : 0.9rem;
	font-weight : 600;
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
		-webkit-appearance: none;
	}
	& > button {
		width: 5rem;
		border-top-right-radius: 4px;
		border-bottom-right-radius: 4px;
		background: #1366ae;
		color: #ffffff;
		line-height: 2.8;
		cursor: pointer;
		text-align: center;
	}
`;

const NoteInformation = styled.div`
	display: flex;
	padding: 0.5rem;
	& > div:nth-child(1) {
		& > div:nth-child(1) {
			color: #585858;
		}
	}
	& > div:nth-child(2) {
		margin-left: 3rem;
		& > div:nth-child(1) {
			color: #585858;
			font-weight: 600;
		}
	}
	& > div:nth-child(3) {
		margin-left: 3rem;
		& > div:nth-child(1) {
			color: #585858;
		}
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
	line-height: 1;
	box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
	border-radius: 8px;
	overflow: hidden;
`;

CalendarPopup.Heading = styled.div`
	background: #0071c5;
	color: #ffffff;
	height: 3.4rem;
	font-size: 1.5rem;
	line-height: 2;
	text-align: center;
	padding-top: 0.3rem;
	position: relative;
`;

const LogoVip = styled.div`
	border-radius: 100px;
	padding: 6.7px 22px;
	background-color: #22da27;
	align-items: center !important;
	justify-content: center !important;
	display: flex !important;
	& > span {
		color: white;
		margin-left: 5px;
	}
	& > img {
		width: 17px;
		height: 17px;
	}
`;

const LogoVip2 = styled.div`
	border-radius: 100px;
	padding: 6px 15px;
	background-color: #22da27;
	align-items: center !important;
	justify-content: center !important;
	display: flex !important;
	& > span {
		color: white;
		margin-left: 5px;
		font-size: 13px;
	}
	& > img {
		width: 13px;
		height: 13px;
	}
`;

const ButtonDayChange = styled.div`
	background-color: #eeeeee;
	border-radius: 5px;
	padding: 10px;
	width: 150px;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const ImageEnter = styled.img`
	width: 1.3rem;
	height: 1.3rem;
`;

const ImgButton = styled.img`
	width: 12px;
	height: 6px;
	margin-left: 8px;
`;

CalendarPopup.Body = styled.div``;

const CompanionWrapper = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: space-between;
	align-items: center;
	& > div:nth-child(2) {
		justify-content: flex-end !important;
	}
`;

const CompanionWrapperName = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: space-between;
	align-items: center;
`;

CompanionWrapper.Column = styled.div`
	display: flex;
	flex-direction: row;
	width: 50%;
	justify-content: space-between;
	align-items: center;
	& > input {
		width: 15rem;
		height: 2.3rem;
		border: 1px solid #dddddd;
		border-radius: 3px;
		background-color: #fafafa;
		padding: 5px;
	}
	& > img {
		width: 35px;
		height: 35px;
		margin-left: 1rem;
	}
	& > select {
		border: 1px solid #dddddd;
		border-radius: 3px;
		background-color: #fafafa;
		height: 2.3rem;
		width: 4rem;
		display: flex;
		justify-content: center;
		align-items: center;
		padding-left: 0.8rem;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		border-right-width: 0;
	}
`;

CompanionWrapper.ColumnName = styled.div`
	display: flex;
	flex-direction: row;
	width: 50%;
	align-items: center;
`;

const IconCalendar = styled.img`
	width: 22px;
	height: 22px;
	margin-right: 8px;
`;

const ContainerNotes = styled.div`
	min-height : 3.5rem;
	max-height : 7.5rem;
	width: 100%;
	overflow-y : scroll;
`;

const ContainerAddMore = styled.div`
	display : flex;
	flex-direction : row;
	align-items : center;
	margin : 1rem 0px;
	&>img{
		width : 22px;
		height : 22px;
	}
	&>div{
		font-size : 1rem;
		font-weight : 600;
		color : #136AB7;
		margin-left : 5px;
		margin-top : 2px;
	}
`;

const WrapAlert = styled.div`
	display: flex;
	align-items: center;
	color : red;
	&>img{
		width : 28px;
		height : 28px;
		object-fit: contain;
		margin-right : 10px;
	}
`;

const RowAlert = styled.div`
	position: relative;
	display: flex ;
	align-items: center;
	justify-content: space-between ;
	margin-bottom : 2px;
`;

class Appointment extends React.Component {
	renderNote = (note, index) => {
		return (
			<NoteInformation key={index}>
				<div>
					<div>{moment(note.createDate).format('MM/DD/YYYY, hh:mm A')}</div>
				</div>
				<div style={{ width: 130 }}>
					<div>{note.staffName}</div>
				</div>
				<div>
					<div>{note.note}</div>
				</div>
			</NoteInformation>
		);
	};

	renderNotes() {
		const { notes } = this.state;
		return (
			<NoteWrapper>
				<TextNoteAppointment>Appointment note:</TextNoteAppointment>
				<ContainerNotes id='containerNotes'>
					{notes.map(this.renderNote)}
				</ContainerNotes>
				<NoteWrapper.Form onSubmit={(e) => this.addNote(e)}>
					<input
						value={this.state.noteValue}
						onChange={(e) => this.handleChange(e)}
					/>
					<button
						onClick={() => this.addNote()}
						type="button"
					>
						<ImageEnter src={require('../../images/enter@3x.png')} />
					</button>
				</NoteWrapper.Form>
			</NoteWrapper>
		);
	}

	/********************************* RENDER GIFT CARD *********************************/
	renderGiftCard(giftCard, index) {
		if (giftCard) {
			const quantity =
				giftCard.quantity.toString().length === 1 ? '0' + giftCard.quantity.toString() : giftCard.quantity;
			let price = giftCard.price ? parseFloat(giftCard.price.toString().replace(/,/g, '')).toFixed(2) : '0.00';
			return (
				<tr key={index}>
					<td>{giftCard.name ? giftCard.name : ''}</td>
					<td style={{ textAlign: 'center' }}>{quantity}</td>
					<td style={{ textAlign: 'center' }}>
						<div style={{ color: '#0764B0', fontWeight: '900', fontFamily: 'sans-serif' }}>{price}</div>
					</td>
				</tr>
			);
		}
	}

	/********************************* RENDER DAY PICKER  *********************************/
	renderSelectDay() {
		const { dayChange, isPopupDay } = this.state;
		const { appointment } = this.props;
		const { status } = appointment;
		if (status !== 'PAID' && status !== 'VOID' && status !== 'REFUND') {
			return (
				<div style={{ position: 'relative', paddingTop: 3, marginBottom: 15 }}>
					<ButtonDayChange
						onClick={() => {
							this.setState({ isPopupDay: !isPopupDay });
						}}
					>
						<IconCalendar src={iconCalendarGrey} />
						{moment(dayChange).format('MM/DD/YYYY')}
						<ImgButton src={topArrow} />
					</ButtonDayChange>

					{isPopupDay && (
						<OutsideClickHandler
							onOutsideClick={() => this.setState({ isPopupDay: !isPopupDay })}
						>
							<CalendarPopup>
								<CalendarPopup.Heading>
									Select Day
									<BtnCloseSelectDay
										onClick={() => this.setState({ isPopupDay: !isPopupDay })}
									>
										{<img src={closeWhite} />}
									</BtnCloseSelectDay>
								</CalendarPopup.Heading>
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
		return <div />
	}

	renderWrongAlert() {
		if (this.conditionRenderAlertService())
			return (
				<WrapAlert>
					<img src={alertIcon} />
					<div>There are services cannot be performed</div>
				</WrapAlert>
			);
	}

	renderTileColumn() {
		const { appointment } = this.props;
		const { status } = appointment;
		if (status === 'PAID' || status === 'VOID' || status === 'REFUND' || status === "no show") {
			return (
				<tr>
					<th width="25%" style={{ borderRight: 0 }}>
						{' '}
						Services
					</th>
					<th width="25%">Staff</th>
					{(status === 'PAID' || status === 'VOID' || status === 'REFUND' || status === "no show") &&
						(
							<th width="25%" style={{ textAlign: 'center' }}>
								Tip ($)
							</th>
						)}
					<th style={{ textAlign: 'center' }}>Price ($)</th>
				</tr>
			);
		} else {
			return (
				<tr>
					<th width="20%" style={{ borderRight: 0 }}>
						{' '}
						Servives
					</th>
					<th width="20%">Start time</th>
					<th width="20%" style={{ borderLeft: 0 }}>
						Staff
					</th>
					<th width="20%" style={{ borderLeft: 0, textAlign: 'center' }}>
						Duration (min)
					</th>
					<th style={{ textAlign: 'center' }}>Price ($)</th>
				</tr>
			);
		}
	}

	/********************************* RENDER SERVICES *********************************/
	renderServices() {
		const { services } = this.state;
		const { prices, isPopupStaff, indexPopupStaff, extras } = this.state;
		const { appointment, staffList , getStaffOfService , staffOfService } = this.props;
		if (services.length > 0) {
			return (
				<table>
					<thead>{this.renderTileColumn()}</thead>
					<tbody>
						{services.map((s, i) => (
							<Service
								key={'service' + i}
								service={s}
								index={i}
								appointment={appointment}
								staffList={staffList}
								prices={prices}
								isPopupStaff={isPopupStaff}
								indexPopupStaff={indexPopupStaff}
								togglePopupStaff={(staff, index) => this.togglePopupStaff(staff, index)}
								closePopupStaff={() => this.closePopupStaff()}
								subtractService={(index) => this.subtractService(index)}
								addService={(index) => this.addService(index)}
								openPopupPrice={(price, index, key) => this.openPopupPrice(price, index, key)}
								onChangePrice={(value, index) => this.onChangePrice(value, index)}
								isEditPaidAppointment={this.state.isEditPaidAppointment}
								openPopupTip={(price, index) => this.openPopupTip(price, index)}
								openPopupTimePicker={(indexFromTime, fromTimeService) =>
									this.openPopupTimePicker(indexFromTime, fromTimeService)}
								extras={extras.filter((obj) => obj.bookingServiceId === s.bookingServiceId)}
								extraAll={extras}
								subtractExtra={(extra) => this.subtractExtra(extra)}
								addExtra={(extra) => this.addExtra(extra)}
								openPopupPriceExtra={(price, index, key) => this.openPopupPrice(price, index, key)}
								getStaffOfService={getStaffOfService}
								staffOfService={staffOfService}
							/>
						))}
					</tbody>
				</table>
			);
		}
	}

	/********************************* RENDER PRODUCTS *********************************/
	renderProducts() {
		const { products } = this.state;
		const { appointment } = this.props;
		const { status } = appointment;
		if (products.length > 0 || (appointment.giftCards && appointment.giftCards.length > 0)) {
			return (
				<table>
					<thead>
						<tr>
							<th
								style={{
									width: status !== 'PAID' && status !== 'VOID' && status !== 'REFUND' ? '63%' : '50%'
								}}
							>
								Selected Products
							</th>
							<th
								style={{
									width:
										status !== 'PAID' && status !== 'VOID' && status !== 'REFUND' ? '20%' : '25%',
									textAlign: 'center'
								}}
							>
								Quantity
							</th>
							<th style={{ textAlign: 'center' }}>Price ($)</th>
						</tr>
					</thead>
					<tbody>
						{products.map((p, i) => (
							<Product
								key={'prpduct' + i}
								product={p}
								index={i}
								appointment={appointment}
								addProduct={(index) => this.addProduct(index)}
								subtractProduct={(index) => this.subtractProduct(index)}
							/>
						))}
						{appointment.giftCards && appointment.giftCards.map((p, i) => this.renderGiftCard(p, i))}
					</tbody>
				</table>
			);
		}
	}

	renderCompanion() {
		const { appointment } = this.props;
		const { isVip } = appointment;
		return (
			<React.Fragment>
				<CompanionWrapperName>
					<CompanionWrapper.ColumnName>
						<span>Main Customer: </span>
						<span style={{ marginLeft: 35 }}>{`${appointment.firstName} ${appointment.lastName}`}</span>
					</CompanionWrapper.ColumnName>

					<CompanionWrapper.ColumnName>
						<span style={{ marginLeft: 20 }}>{formatPhone(appointment.phoneNumber)}</span>
						{isVip === 1 && (
							<LogoVip2 style={{ marginLeft: 15 }}>
								<img src={require('../../images/vip.png')} />
								<span>VIP</span>
							</LogoVip2>
						)}
					</CompanionWrapper.ColumnName>
				</CompanionWrapperName>

				<CompanionWrapper style={{ marginTop: 15, marginBottom: 15 }}>
					<CompanionWrapper.Column>
						<span>Companion: </span>
						<input
							onChange={(e) => this.onChangeCompanionName(e)}
							value={this.state.companionName}
							placeholder="Full Name"
						/>
					</CompanionWrapper.Column>

					<CompanionWrapper.Column>
						<select
							value={this.state.companionPhoneHeader}
							onChange={(e) => this.setState({ companionPhoneHeader: e.target.value })}
						>
							<option value="+1">+1</option>
							<option value="+84">+84</option>
							<option />
						</select>
						<NumberFormat
							format="###-###-####"
							mask="_"
							style={{
								borderTopLeftRadius: 0,
								borderBottomLeftRadius: 0,
								borderLeftWidth: 0,
								width: 250
							}}
							value={this.state.companionPhone}
							onChange={(e) => this.onChangeCompanionPhone(e)}
							placeholder="Phone Number"
							type="tel"
						/>
						<img onClick={() => this.updateCompanion()} src={require('../../images/buttonSave.png')} />
					</CompanionWrapper.Column>
				</CompanionWrapper>
			</React.Fragment>
		);
	}

	renderCustomerName() {
		const { appointment } = this.props;
		const { bookingGroupId, isMainBookingGroup, isVip, customerNote } = appointment;

		if (parseInt(bookingGroupId) > 0 && parseInt(isMainBookingGroup) === 0) {
			return this.renderCompanion();
		} else {
			return (
				<UserInformation>
					<div>
						<div>
							<span>{appointment.firstName.toString().charAt(0)}</span>
						</div>
						<div>
							<div>{`${appointment.firstName} ${appointment.lastName}`}</div>
							<div>{formatPhone(appointment.phoneNumber)}</div>
						</div>
						<div>
							<div>Note:</div>
							<div>{customerNote}</div>
						</div>
					</div>
					{isVip === 1 && (
						<LogoVip>
							<img src={require('../../images/vip.png')} />
							<span>VIP</span>
						</LogoVip>
					)}
				</UserInformation>
			);
		}
	}

	renderAddMore() {
		const { appointment } = this.props;
		const { status } = appointment;
		if (status !== 'PAID' && status !== 'VOID' && status !== 'REFUND' && status !== 'CANCEL' && status !== 'no show') {
			return (
				<ContainerAddMore onClick={this.addMore}>
					<img src={require('../../images/addIcon.png')} />
					<div>Add more service or product</div>
				</ContainerAddMore>
			)
		}
	}
	/********************************* RENDER BODY APPOINTMENT *********************************/
	renderBody() {
		const { appointment } = this.props;
		const { isPopupTimePicker } = this.state;
		return (
			<AppointmentWrapper.Body scroll={isPopupTimePicker ? false : true}>
				{this.renderCustomerName()}
				<RowAlert>
					{this.renderSelectDay()}
					{this.renderWrongAlert()}
				</RowAlert>
				{this.renderServices()}
				{this.renderProducts()}
				{this.renderAddMore()}
				{this.renderNotes()}

				<AppointmentInformation>
					<FooterAppointment appointment={appointment} />
				</AppointmentInformation>
				<TipPercent />
			</AppointmentWrapper.Body>
		);
	}

	render() {
		const { appointment, appointmentDetail } = this.props;
		const {
			isPoupPrice,
			isLoadingCompanion,
			isPopupTimePicker,
			indexFromTime,
			fromTimeService,
			services
		} = this.state;
		if (!appointment) return '';
		if (appointmentDetail === '') return '';

		let isCheckColor =
			appointment.status === 'ASSIGNED' ||
				appointment.status === 'CONFIRMED' ||
				appointment.status === 'ASSIGNED' ||
				appointment.status === 'WAITING' || 
				appointment.status === "no show"
				? true
				: false;
		const isDisabled = this.conditionRenderAlertService();
		return (
			<React.Fragment>
				<AppointmentPopup
					closeOnDocumentClick={false}
					open
					onOpen={() => this.openModal()}
					onClose={() => this.closeModal()}
				>
					<AppointmentWrapper>
						{isLoadingCompanion && (
							<LoadingCompanion>
								<ReactLoading type={'spin'} color={'#1B68AC'} height={50} width={50} />
							</LoadingCompanion>
						)}
						<BtnClose onClick={() => this.closeModal()}>
							{isCheckColor && <img src={closeBlack} />}
							{!isCheckColor && <img src={closeWhite} />}
						</BtnClose>

						<Header
							appointment={appointment}
						/>

						{this.renderBody()}

						<BottomButton
							appointment={appointment}
							openConfirmationModal={() => this.openConfirmationModal()}
							isEditPaidAppointment={this.state.isEditPaidAppointment}
							isChange={this.conditionButtonChange()}
							nextStatus={() => this.nextStatus()}
							updateStaffAppointmentPaid={() => this.updateStaffAppointmentPaid()}
							toggleEditPaidAppointment={() => this.toggleEditPaidAppointment()}
							changeAppointmentTime={() => this.ChangeAppointmentTime()}
							isDisabled={isDisabled}
						/>

					</AppointmentWrapper>
					{/* <LoadingDetail /> */}

				</AppointmentPopup>

				<PopupCancel
					onClose={() => this.closeConfirmationModal()}
					isOpen={this.state.confirmationModal}
					confirmCancelAppointment={() => this.confirmCancelAppointment()}
				/>
				<PopupPrice
					indexPrice={this.state.indexPrice}
					valuePriceIndex={this.state.valuePriceIndex}
					isPoupPrice={isPoupPrice}
					donePopupPrice={(price, index) => this.donePopupPrice(price, index)}
					closePopupPrice={() => this.closePopupPrice()}
					onChangePrice={(value, index) => this.onChangePrice(value, index)}
				/>

				<PopupTip
					indexPopupTip={this.state.indexPopupTip}
					valueTip={this.state.valueTip}
					isPopupTip={this.state.isPopupTip}
					donePopupPrice={(price, index) => this.donePopupTip(price, index)}
					closePopupPrice={() => this.closePopupTip()}
				/>
				{isPopupTimePicker && (
					<PopupTimePicker
						cancelTimePicker={() => this.cancelTimePicker()}
						doneTimePicker={(time, indexFromTime) => this.doneTimePicker(time, indexFromTime)}
						currentDay={this.props.currentDay}
						fromTime={appointment.fromTime}
						isPopupTimePicker={isPopupTimePicker}
						indexFromTime={indexFromTime}
						fromTimeService={fromTimeService}
						services={services}
					/>
				)}
			</React.Fragment>
		);
	}
}

export default Appointment;
