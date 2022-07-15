import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { updateEventToCalendar } from './constants';
import { MAIN_CALENDAR_OPTIONS } from './constants';
import { merchantId, deviceId, GET_APPOINTMENT_ID, token } from '../../../app-constants';
import { store } from 'app';
import { addEventsToCalendar } from './constants';
import { SIGNALR } from '../../../app-constants';
import { returnAppointment } from './util';
import { appointmentAdapter } from '../../containers/AppointmentPage/utilSaga';
import axios from 'axios';
import moment from 'moment';
import WaitingLoading from './WaitingLoading';
import CalendarLoading from './CalendarLoading';
import FCAgenda from './FCAgenda';
import FCDragZone from './FCDragZone';

const signalR = require('@microsoft/signalr');
const CalendarWrapper = styled.div`
	display: flex;
	border: 2px solid #3883bb;
	/* margin-top : 50px; */
	height: calc(100% - 8.8rem);
	@media (min-width: 1025px) {
		height: calc(100% - 10rem);
	}
	overflow: hidden;
	-webkit-user-select: none; 
	-moz-user-select: none; 
	-ms-user-select: none;
	-o-user-select: none;
	user-select: none;
`;

const MainCalendar = styled.div`
	flex: 1 0;
	/* overflow: hidden; */
	border-right: 1px solid #3883bb;
	-webkit-user-select: none; 
	-moz-user-select: none; 
	-ms-user-select: none;
	-o-user-select: none;
	user-select: none;
`;

const RightSideBar = styled.div`
	width: calc((100vw - 5.05rem - 2px) / 10 );
	position: relative;
	overflow : hidden;
	-webkit-user-select: none; 
	-moz-user-select: none; 
	-ms-user-select: none;
	-o-user-select: none;
	user-select: none;
`;

function IsJson(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

class Calendar extends React.Component {
	constructor() {
		super();
	}

	componentWillMount() {
		this.props.loadWaitingAppointments();
		localStorage.removeItem("isDragFromWaiting");
	}

	receiveMessage = async (message) => {
		const { today } = this.props;
		if (IsJson(message.data)) {
			const data = JSON.parse(message.data);
			const { idAppointment, action } = data;

			if (action === 'PaidOffline') {
				if (navigator.onLine === false) {
					this.props.updateAppointmentPaidOffline(idAppointment);
					const displayMember = store.getState().getIn(['appointment', 'appointments', 'calendar']);
					const selectDay = store.getState().getIn(['appointment', 'currentDay']);
					addEventsToCalendar(selectDay, displayMember);
					this.props.renderAppointment();
				}
			}

			if (action === 'reloadWed') {
				localStorage.removeItem('staffList');
				localStorage.removeItem('AppointmentCalendar');
				localStorage.removeItem('AppointmentWaiting');
				localStorage.removeItem("isDragFromWaiting");
				setTimeout(() => {
					window.location.reload();
				}, 300);
			}
			if (action === 'resetWeb') {
				if (today.toString() !== moment().format('DDMMYYYY').toString()) {
					setTimeout(() => {
						window.location.reload();
					}, 300);
				}
			}

			if (action === 'appointmentNotification') {
				if (data.data.appointmentId !== 0) {
					this.props.onChangeDay(moment(data.data.appointmentDate).format('DDMMYYYY'));
					this.props.scrollToAppointment(data.data.appointmentId);
					let app = {
						...data.data,
						id: data.data.appointmentId,
						end: data.data.createdDate,
					}
					this.props.getApppointmentById({ appointment: app });
				}
			}
		}
	};

	getDataAppointment = async (app) => {
		const res = await axios.get(`${GET_APPOINTMENT_ID}/${app.id}`, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		if (res.status === 200) {
			if (res.data.codeNumber === 200) {

				let appointment = appointmentAdapter(res.data.data);

				let flag = this.conditionPopupDetail(appointment.options);
				const isDragFromWaiting = JSON.parse(localStorage.getItem("isDragFromWaiting"));
				if (flag && isDragFromWaiting) {
					this.props.getApppointmentById({ appointment, event: null });
					localStorage.removeItem("isDragFromWaiting");
				}

				let newEndTime =
					appointment.start === appointment.end
						? `${moment(app.start).add('minutes', 15).format('YYYY-MM-DD')}T${moment(app.start)
							.add('minutes', 15)
							.format('HH:mm:ss')}`
						: `${moment(app.end).format('YYYY-MM-DD')}T${moment(app.end).format('HH:mm:ss')}`;
				appointment.end = newEndTime;
				return appointment;
			} else {
				// alert(res.data.message);
			}
		}
		return 0;
	};

	conditionPopupDetail(services) {
		let flag = false;
		for (let i = 0; i < services.length; i++) {
			if (services[i].isWarning) {
				flag = true;
				break;
			}
		}
		return flag;
	}

	componentDidMount() {
		window.addEventListener('message', this.receiveMessage);
		this.runSignalR();
	}

	runSignalR() {
		this.runSignalR_Appointment();
	}

	addAppointmentFromSignalr(appointment_R) {
		if (appointment_R.status === 'ASSIGNED' || appointment_R.status === 'CHECKED_IN') {
			const displayMember = store.getState().getIn(['appointment', 'appointments', 'calendar']);
			const member = displayMember.find((mem) =>
				mem.appointments.find((app) => parseInt(app.id) === parseInt(appointment_R.id))
			);
			if (!member) {
				updateEventToCalendar(appointment_R);
				this.props.addAppointmentRealTime(appointment_R);
			}
		} else if (appointment_R.status === 'WAITING') {
			this.props.addAppointmentWaiting(appointment_R);
		}
	}

	async pushNotification(isNotification, appointment) {
		if (appointment.Status !== 'waiting') {
			const data = await JSON.stringify({
				action: 'push_notification',
				isNotification,
				appointment
			});
			window.postMessage(data);
		}
	}

	updateNotification() {
		const message = JSON.stringify({
			action: 'update_notification',
		});
		window.postMessage(message);
	}

	runSignalR_Appointment() {
		const url = `${SIGNALR}/notification/?merchantId=${merchantId}&Title=Merchant&kind=calendar&deviceId=${deviceId}`;
		let connection = new signalR.HubConnectionBuilder().withUrl(url).withAutomaticReconnect().build();
		connection.serverTimeoutInMilliseconds = 6000000;

		connection.on('ListWaNotification', async (data) => {

			console.log('response signalr R: ',{ data });

			let app = JSON.parse(data);
			if (app.data) {
				let type = app.data.Type;
				switch (type) {
					case 'user_update':
						this.props.updateConsumer(app.data.user);
						const displayMember = store.getState().getIn(['appointment', 'appointments', 'calendar']);
						const selectDay = store.getState().getIn(['appointment', 'currentDay']);
						addEventsToCalendar(selectDay, displayMember);
						break;

					case 'appointment_add':
						const appointment = app.data.Appointment;
						if (appointment.StaffId == 0) {
							const date = moment(appointment.FromTime).format('YYYY-MM-DD');
							this.props.countAppointmentAnyStaff({ date, appointment, fromTime: appointment.FromTime });
						}
						if (appointment) {
							let appointment_R = returnAppointment(appointment);
							this.pushNotification(app.data.IsNotification, appointment);
							if (appointment_R.status === 'WAITING') {
								this.props.loadWaitingAppointments();
							} else {
								this.props.getBlockTime();
							}
							// this.addAppointmentFromSignalr(appointment_R);
						}
						break;

					case 'appointment_update':
						this.updateNotification();
						let app_update = app.data.appointment;

						const { isLoadingPopup } = this.props;
						if (app_update) {
							let appointment = JSON.parse(app_update);
							const date = moment(appointment.FromTime).format('YYYY-MM-DD');

							if (parseInt(appointment.StaffId) === 0 && appointment.Status !== 'waiting' && appointment.Status !== 'checkin') {
								this.props.countAppointmentAnyStaff({
									date,
									appointment,
									fromTime: appointment.FromTime,
									isReloadCalendar: true
								});
								// return;
							} else {
								this.props.countAppointmentAnyStaff({
									date,
									appointment,
									fromTime: appointment.FromTime,
								});
							}

							let _appointment = returnAppointment(appointment);
							let appointment_R = await this.getDataAppointment(_appointment);
							appointment_R = appointment_R !== 0 ? appointment_R : _appointment;

							if (!isLoadingPopup) {
								this.props.deselectAppointment();
								this.props.disable_Calendar(false);

								switch (appointment_R.status) {
									case 'WAITING':
										this.props.addAppointmentWaiting(appointment_R);

										break;

									case 'CANCEL':
										const app = this.props.waitingAppointments.find(
											(obj) => parseInt(obj.id) === parseInt(appointment_R.id)
										);
										if (app) {
											this.props.loadWaitingAppointments();
										} else {
											// this.props.getBlockTime();
										}
										break;

									case 'VOID':
										this.props.getBlockTime()
										break;
									case 'REFUND':
										this.props.getBlockTime()
										break;

									default:

										this.props.removeAppointmentWaiting(appointment_R);

										break;
								}
							} else {
								this.props.loadingPopup(false);
							}
						}
						break;
					case 'appointment_checkout':
						setTimeout(() => {
							this.props.getBlockTime();
						}, 1000);
						break;

					case 'change_item':
						this.updateNotification();
						setTimeout(() => {
							this.props.loadWaitingAppointments();
							this.props.getBlockTime();
						}, 500);
						break;

					case 'update_merchant':
						setTimeout(() => {
							window.location.reload();
						}, 300);
						break;
					default:
						break;
				}
			}

			if (app.type) {
				let type = app.type;
				if (type === 'staff_update') {
					this.props.deselectAppointment();
					this.props.disable_Calendar(false);
					this.props.updateNextStaff({});
				}

				if (type === 'update_blocktime') {
					this.props.deselectAppointment();
					this.props.disable_Calendar(false);
					this.props.updateNextStaff({ isReloadCalendar: false });
				}
			}
		});
		connection.start().catch((error) => {
		});
		connection.onclose(function () { });
	}

	render() {
		const {
			waitingAppointments,
			waitingIndex,
			disableCalendar,
			isLoadWaiting,
			isLoadCalendar,
			deleteEventWaitingList,
			StatusDeleteWaiting,
			deleteWaitingAppointment,
			merchantInfo,

		} = this.props;
		return (
			<CalendarWrapper>
				<MainCalendar>
					{isLoadCalendar === true && <CalendarLoading />}
					<FCAgenda
						disableCalendar={disableCalendar}
						options={MAIN_CALENDAR_OPTIONS}
						merchantInfo={merchantInfo}
					/>
				</MainCalendar>
				<RightSideBar id="drag-zone">
					{isLoadWaiting === true && <WaitingLoading />}
					{!!waitingAppointments && !!waitingAppointments.length ? (
						<FCDragZone
							events={waitingAppointments}
							index={waitingIndex}
							deleteEventWaitingList={deleteEventWaitingList}
							StatusDeleteWaiting={StatusDeleteWaiting}
							deleteWaitingAppointment={deleteWaitingAppointment}
						/>
					) : (
							''
						)}
				</RightSideBar>
			</CalendarWrapper>
		);
	}
}

Calendar.propTypes = {
	waitingAppointments: PropTypes.any,
	loadWaitingAppointments: PropTypes.func,
	waitingIndex: PropTypes.number,
	openAddingAppointment: PropTypes.func,
	updateCalendarInterval: PropTypes.func,
	deleteEventWaitingList: PropTypes.func
};

export default Calendar;
