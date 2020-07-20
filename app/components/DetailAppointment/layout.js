import React from 'react';
import 'react-day-picker/lib/style.css';
import styled from 'styled-components';
import Popup from 'reactjs-popup';
import moment from 'moment';
import DayPicker from 'react-day-picker';
import OutsideClickHandler from 'react-outside-click-handler';
import { formatPhone } from '../../utils/helper';
import { PopupTimePicker } from './widget';

import { FooterAppointment, PopupPrice, Product, Extra, Service } from './widget'

const AppPopup = styled(Popup)`
	border-radius: 1.5rem;
	padding: 0 !important;
	border: none !important;
	box-shadow : ${(props) => props.BoxShadow};
`;

const AppPopupWrapper = styled.div`position: relative;`;

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
	& > img{
		width : 32px;
		height : 32px;
	}
`;

const BtnCloseSelectDay = styled(BtnClose)`
	& > img{
		width : 27px;
		height : 27px;
	}
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
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 0.5rem;
	margin-bottom : 0.5rem;
	& > div {
		width: 50%;
		display: flex;
		justify-content: space-between;
	}
	& > div:nth-child(1) {
		width: 40%;
	}
	& > div:nth-child(2) {
		width: 50%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	& > div > span:nth-child(1){
		color: #333;
		font-weight: 600;
	}
`;

const WrapperCancelAppointment = styled.div`
	display: flex;
	width: 100%;
	justify-content: row;
	margin-top: 50px;
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
		-webkit-appearance: none;
	}
	& > button {
		width: 5rem;
		border-top-right-radius: 4px;
		border-bottom-right-radius: 4px;
		background: #1366AE;
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
	font-size : 1rem;
	@media (max-width: 1024px) {
    	font-size : 1.1rem;
  	}
	`;

ConfirmationWrapper.Close = styled(AppPopupWrapper.Close)`
	//
	`;

ConfirmationWrapper.Footer = styled(AppPopupWrapper.Footer)`
	//
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
	position : relative
`;

const LogoVip = styled.div`
	border-radius: 100px;
	padding: 6.7px 15px;
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

const ButtonDayChange = styled.div`
	background-color: #eeeeee;
	border-radius: 5px;
	padding: 10px;
	width: 130px;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const ButtonTime = styled.div`
	background-color: #eeeeee;
	border-radius: 5px;
	padding: 10px;
	text-align: center;
	width: 120px;
	position: relative;
`;

const ImageEnter = styled.img`
    width : 1.3rem;
    height : 1.3rem;
`;

const ImgButton = styled.img`
	width : 12px;
	height : 6px; 
	margin-left : 8px; 
`;

CalendarPopup.Body = styled.div``;

class Appointment extends React.Component {

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

	renderNotes() {
		const { notes } = this.state;
		return (
			<NoteWrapper>
				<NoteWrapper.Form onSubmit={(e) => this.addNote(e)}>
					<input value={this.state.noteValue} onChange={(e) => this.handleChange(e)} />
					<button onClick={() => this.addNote()} type="button">
						{/* <MdSubdirectoryArrowLeft style={{ width: 33, height: 33 }} /> */}
						<ImageEnter src={require('../../images/enter@3x.png')} />
					</button>
				</NoteWrapper.Form>
				{notes.map(this.renderNote)}
			</NoteWrapper>
		);
	}

	/********************************* RENDER BUTTON BELONG TO STATUS *********************************/
	renderNextStatusButton() {
		const { appointment } = this.props;
		if (this.conditionButtonChange()) {
			if (appointment.status === 'ASSIGNED')
				return (
					<Button onClick={() => this.nextStatus()} primary="true">
						Confirm
					</Button>
				);
			if (appointment.status === 'CONFIRMED' && appointment.memberId !== 0)
				return (
					<Button onClick={() => this.nextStatus()} primary="true">
						Check-In
					</Button>
				);
			if (appointment.status === 'CHECKED_IN' && appointment.memberId !== 0)
				return (
					<Button onClick={() => this.nextStatus()} primary="true">
						Check-Out
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

	/********************************* RENDER ROW CHANGE TIME *********************************/
	renderChangeAppointTime() {
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
					{this.renderTimeSelect()}
				</SelectDateWrapper>
			</WrapperTimeChange>
		);
	}

	/********************************* RENDER GIFT CARD *********************************/
	renderGiftCard(giftCard, index) {
		if (giftCard) {
			const quantity =
				giftCard.quantity.toString().length === 1 ? '0' + giftCard.quantity.toString() : giftCard.quantity;
			let price = giftCard.price ? parseFloat(giftCard.price.toString().replace(/,/g, '')).toFixed(2) : "0.00";
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
		return (
			<div style={{ position: 'relative', paddingTop: 3 }}>

				<ButtonDayChange onClick={() => this.setState({ isPopupDay: !isPopupDay })}>
					{moment(dayChange).format('MM/DD/YYYY')}
					<ImgButton src={require('../../images/top_arrow@3x.png')} />
				</ButtonDayChange>

				{isPopupDay && (
					<OutsideClickHandler onOutsideClick={() => this.setState({ isPopupDay: !isPopupDay })}>
						<CalendarPopup>
							<CalendarPopup.Heading>
								Select Day
							<BtnCloseSelectDay onClick={() => this.setState({ isPopupDay: !isPopupDay })}>
									{<img src={require("../../images/close_white.png")} />}
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

	/********************************* RENDER SELECT TIME *********************************/
	renderTimeSelect() {
		const { fromTime, isPopupTimePicker } = this.state;
		return (
			<div style={{ paddingTop: 3, height: 42 }}>
				<div style={{ position: 'relative' }}>

					<ButtonTime onClick={() => this.openPopupTimePicker()}>
						{moment(fromTime).format('hh:mm A').toString()}
						<ImgButton src={require('../../images/top_arrow@3x.png')} />
					</ButtonTime>

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
		);
	}

	/********************************* RENDER SERVICES *********************************/
	renderServices() {
		const { services } = this.state;
		const { prices, isPopupStaff, indexPopupStaff } = this.state;
		const { appointment, staffList } = this.props;
		if (services.length > 0) {
			return (
				<table>
					<thead>
						<tr>
							<th width="25%" style={{ borderRight: 0 }}>
								{' '}
									Staff
								</th>
							<th width="25%" style={{ borderLeft: 0 }}>
								Services
								</th>
							{appointment.status !== 'PAID' && <th width="25%" style={{ textAlign: 'center' }}>
								Duration (min)
								</th>}
							{appointment.status === 'PAID' && <th width="25%" style={{ textAlign: 'center' }}>
								Tip ($)
								</th>}
							<th style={{ textAlign: 'center' }}>Price ($)</th>
						</tr>
					</thead>
					<tbody>{services.map((s, i) =>
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
						/>
					)}</tbody>
				</table>
			);
		}
	}

	/********************************* RENDER PRODUCTS *********************************/
	renderProducts() {
		const { products } = this.state;
		const { appointment } = this.props;
		if (products.length > 0 || (appointment.giftCards && appointment.giftCards.length > 0)) {
			return (
				<table>
					<thead>
						<tr>
							<th style={{ width: '50%' }}>Selected Products</th>
							<th style={{ width: '25%', textAlign: 'center' }}>
								Amount
							</th>
							<th style={{ textAlign: 'center' }}>Price ($)</th>
						</tr>
					</thead>
					<tbody>
						{products.map((p, i) =>
							<Product
								key={'prpduct' + i}
								product={p}
								index={i}
								appointment={appointment}
								addProduct={(index) => this.addProduct(index)}
								subtractProduct={(index) => this.subtractProduct(index)}
							/>)
						}
						{appointment.giftCards && appointment.giftCards.map((p, i) => this.renderGiftCard(p, i))}
					</tbody>
				</table>
			);
		}
	}

	/********************************* RENDER EXTRAS *********************************/
	renderExtras() {
		const { extras } = this.state;
		const { appointment } = this.props;
		if (extras.length > 0) {
			return (
				<table>
					<thead>
						<tr>
							<th style={{ width: '50%' }}>Selected Extras</th>
							<th style={{ width: '25%', textAlign: 'center' }}>
								Duration (min)
							</th>
							<th style={{ textAlign: 'center' }}>Price ($)</th>
						</tr>
					</thead>

					<tbody>
						{extras.map((ex, i) =>
							<Extra
								key={'extra' + i}
								extra={ex}
								index={i}
								appointment={appointment}
								pricesExtras={this.state.pricesExtras}
								subtractExtra={(index) => this.subtractExtra(index)}
								addExtra={(index) => this.addExtra(index)}
								openPopupPrice={(price, index, key) => this.openPopupPrice(price, index, key)}
							/>)}
					</tbody>
				</table>
			);
		}
	}

	/********************************* RENDER HEADER APPOINTMENT *********************************/
	renderHeader() {
		const { appointment } = this.props;
		switch (appointment.status) {
			case 'ASSIGNED':
				return (
					<AppointmentWrapper.Header color="#585858" backgroundColor={'#ffe559'}>
						{appointment.code} Unconfirmed Appointment
					</AppointmentWrapper.Header>
				);
			case 'CONFIRMED':
				return (
					<AppointmentWrapper.Header color="#585858" backgroundColor={'#c2f4ff'}>
						{appointment.code} Confirmed Appointment
					</AppointmentWrapper.Header>
				);

			case 'CHECKED_IN':
				return (
					<AppointmentWrapper.Header color={'white'} backgroundColor={'#28AAE9'}>
						{appointment.code} Check-In Appointment
					</AppointmentWrapper.Header>
				);

			case 'PAID':
				return (
					<AppointmentWrapper.Header color={'white'} backgroundColor={'#50CF25'}>
						{appointment.code} Paid Appointment
					</AppointmentWrapper.Header>
				);

			case 'VOID':
				return (
					<AppointmentWrapper.Header color={'white'} backgroundColor={'#FD594F'}>
						{appointment.code} Void Appointment
					</AppointmentWrapper.Header>
				);

			case 'REFUND':
				return (
					<AppointmentWrapper.Header color={'white'} backgroundColor={'#FD594F'}>
						{appointment.code} Refund Appointment
					</AppointmentWrapper.Header>
				);

			default:
				return (
					<AppointmentWrapper.Header backgroundColor="red">
						{appointment.code} Appointment
					</AppointmentWrapper.Header>
				);
		}
	}

	/********************************* RENDER BODY APPOINTMENT *********************************/
	renderBody() {
		const { appointment, currentDay } = this.props;
		const { isVip } = appointment;
		const { isPopupTimePicker } = this.state;
		return (
			<AppointmentWrapper.Body scroll={isPopupTimePicker ? false : true}>
				<UserInformation>
					<div>
						<span>Customer Name: </span>
						<span>{`${appointment.firstName} ${appointment.lastName}`}</span>
					</div>
					<div>
						<span>Phone Number: </span>
						<span>{formatPhone(appointment.phoneNumber)}</span>
						{isVip === 1 && (
							<LogoVip>
								<img src={require('../../images/vip.png')} />
								<span>VIP</span>
							</LogoVip>
						)}
					</div>
				</UserInformation>

				{appointment.status !== 'PAID' && appointment.status !== 'VOID' && appointment.status !== 'REFUND' && this.renderChangeAppointTime()}
				{this.renderServices()}
				{this.renderProducts()}
				{this.renderExtras()}
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
		const { isPoupPrice } = this.state;
		if (!appointment) return '';
		if (appointmentDetail === '') return '';
		let isCheckColor = appointment.status === 'ASSIGNED' || appointment.status === 'CONFIRMED' ? true : false;

		return (
			<div>
				{/********************************** POPUP DETAIL APPOINTMENT *********************************/}
				<AppointmentPopup
					closeOnDocumentClick
					open
					onOpen={() => this.openModal()}
					onClose={() => this.closeModal()}
				>
					<AppointmentWrapper>
						<BtnClose onClick={() => this.closeModal()}>
							{isCheckColor && <img src={require("../../images/close_black.png")} />}
							{!isCheckColor && <img src={require("../../images/close_white.png")} />}
						</BtnClose>
						{this.renderHeader()}
						{this.renderBody()}

						<AppointmentWrapper.Footer>
							{(appointment.status !== 'PAID' && appointment.status !== 'VOID' && appointment.status !== 'REFUND') && (
								<div>
									<Button onClick={() => this.openConfirmationModal()}>Cancel</Button>
								</div>
							)}
							<div>{this.renderNextStatusButton()}</div>
						</AppointmentWrapper.Footer>
					</AppointmentWrapper>
				</AppointmentPopup>

				{/********************************** POPUP CONFIRM CANCEL APPOINTMENT *********************************/}
				<ConfirmationPopup
					onClose={() => this.closeConfirmationModal()}
					open={this.state.confirmationModal}
				>
					<ConfirmationWrapper>

						<BtnClose onClick={() => this.closeConfirmationModal()}>
							<img src={require("../../images/close_white.png")} />
						</BtnClose>

						<ConfirmationWrapper.Header backgroundColor="#1173C3">Confirmation</ConfirmationWrapper.Header>
						<ConfirmationWrapper.Body>
							Do you want to Cancel this Appointment?
							<WrapperCancelAppointment>
								<div style={{ width: '50%', textAlign: 'center' }}>
									<Button onClick={() => this.closeConfirmationModal()}>No</Button>
								</div>
								<div style={{ width: '50%', textAlign: 'center' }}>
									<Button primary onClick={() => this.confirmCancelAppointment()}>
										Yes
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


export default Appointment;
