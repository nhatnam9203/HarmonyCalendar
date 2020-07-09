import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import FCAgenda from './FCAgenda';
import FCDragZone from './FCDragZone';
import { updateEventToCalendar } from './constants';
import { MAIN_CALENDAR_OPTIONS } from './constants';
import { merchantId, deviceId } from '../../../app-constants';
import WaitingLoading from './WaitingLoading';
import CalendarLoading from './CalendarLoading';
const signalR = require('@microsoft/signalr');
import { store } from 'app';
import { addEventsToCalendar } from './constants';
import { PROD_API_BASE_URL } from '../../../app-constants';
import { returnAppointment } from './util';

const CalendarWrapper = styled.div`
	display: flex;
	border-left: 2px solid #3883bb;
	border-right: 2px solid #3883bb;
	border-bottom: 2px solid #3883bb;
	height: calc(100% - 4rem - 4rem);
	overflow: hidden;
`;

const MainCalendar = styled.div`
	flex: 1 0;
	border-right: 1px solid #3883bb;
`;

const RightSideBar = styled.div`
	width: calc((100vw - 5.05rem) / 7);
	border-top: 2px solid #3883bb;
	position: relative;
`;

const SignInWrapper = styled.div`
	position: absolute;
	bottom: 0;
	width: calc((100vw - 5.05rem) / 7);
	background: #fafafa;
	height: 4rem;
	text-align: center;
	padding: 0.5rem;
`;

SignInWrapper.Button = styled.div`
	border-radius: 4px;
	background: #0071c5;
	color: #ffffff;
	width: 100%;
	font-size: 1.05rem;
	font-weight: bold;
	line-height: 2.8;
	height: 100%;
	cursor: pointer;
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
	}

	receiveMessage = async (message) => {
		if (IsJson(message.data)) {
			const data = JSON.parse(message.data);
			const { idAppointment, action } = data;

			if (action === 'PaidOffline') {
				this.props.updateAppointmentPaidOffline(idAppointment);
				const displayMember = store.getState().getIn([ 'appointment', 'appointments', 'calendar' ]);
				const selectDay = store.getState().getIn([ 'appointment', 'currentDay' ]);
				addEventsToCalendar(selectDay, displayMember);
			}

			if (action === 'reloadWed') {
				localStorage.removeItem('staffList');
				localStorage.removeItem('AppointmentCalendar');
				localStorage.removeItem('AppointmentWaiting');
				setTimeout(() => {
					window.location.reload();
				}, 300);
			}
		}
	};

	componentDidMount() {
		window.addEventListener('message', this.receiveMessage);
		this.runSignalR();
		const x = document.getElementsByClassName('fc-now-indicator fc-now-indicator-arrow');
		for (let i = 0; i < x.length; i++) {
			x[i].scrollIntoView();
		}
	}

	runSignalR() {
		this.runSignalR_Appointment();
	}

	addAppointmentFromSignalr(appointment_R) {
		if (appointment_R.options.length > 0) {
			// if (appointment_R.status === 'CHECKED_IN' && parseInt(appointment_R.memberId) === 0) {
			// 	return;
			// }
			if (appointment_R.status === 'ASSIGNED' || appointment_R.status === 'CHECKED_IN') {
				const displayMember = store.getState().getIn([ 'appointment', 'appointments', 'calendar' ]);

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
	}

	runSignalR_Appointment() {
		const url = `${PROD_API_BASE_URL}/notification/?merchantId=${merchantId}&Title=Merchant&kind=calendar&deviceId=${deviceId}`;
		let connection = new signalR.HubConnectionBuilder().withUrl(url).withAutomaticReconnect().build();
		connection.serverTimeoutInMilliseconds = 6000000;

		connection.on('ListWaNotification', async (data) => {
			let app = JSON.parse(data);
			if (app.data) {
				console.log('signal R update');
				let type = app.data.Type;
				switch (type) {
					case 'user_update':
						console.log('user update');
						this.props.updateConsumer(app.data.user);
						const displayMember = store.getState().getIn([ 'appointment', 'appointments', 'calendar' ]);
						const selectDay = store.getState().getIn([ 'appointment', 'currentDay' ]);
						addEventsToCalendar(selectDay, displayMember);
						break;

					case 'appointment_add':
						console.log('appointmemt add');
						const appointment = app.data.Appointment;
						if (appointment) {
							let appointment_R = returnAppointment(appointment);
							this.addAppointmentFromSignalr(appointment_R);
						}
						break;

					case 'appointment_update':
						let app_update = app.data.appointment;
						if (app_update) {
							let appointment = JSON.parse(app_update);
							console.log({ appointment });
							let appointment_R = returnAppointment(appointment);
							console.log('update appointment');

							this.props.deselectAppointment();
							this.props.disable_Calendar(false);

							const displayMember = store.getState().getIn([ 'appointment', 'appointments', 'calendar' ]);
							const selectDay = store.getState().getIn([ 'appointment', 'currentDay' ]);

							switch (appointment_R.status) {
								case 'WAITING':
									this.props.addAppointmentWaiting(appointment_R);
									this.props.deleteAppointmentCalendar(appointment_R);
									addEventsToCalendar(selectDay, displayMember);
									break;

								case 'CANCEL':
									// const member = displayMember.find((mem) =>
									// 	mem.appointments.find((app) => parseInt(app.id) === parseInt(appointment_R.id))
									// );
									// if (member) {
									// 	deleteAppointmentCalendar(appointment_R);
									// 	const selectDay = store.getState().getIn(['appointment', 'currentDay']);
									// 	addEventsToCalendar(selectDay, displayMember);
									// }
									// removeAppointmentWaiting(appointment_R);
									this.props.loadWaitingAppointments();
									this.props.reloadCalendar();
									break;

								default:
									const allAppointment = store
										.getState()
										.getIn([ 'appointment', 'appointments', 'allAppointment' ]);

									const pos = allAppointment.findIndex((app) => app.id === appointment_R.id);
									
									if (pos === -1){
										this.addAppointmentFromSignalr(appointment_R)
									}else{
										this.props.updateAppointmentPaid(appointment_R);
										this.props.renderAppointment();
									}
									this.props.removeAppointmentWaiting(appointment_R);

									break;
							}
						}
						break;
					case 'appointment_checkout':
						console.log('appointmemt checkout');
						this.props.reloadCalendar();
						break;

					case 'change_item':
						console.log('change item');
						setTimeout(() => {
							this.props.loadWaitingAppointments();
							this.props.reloadCalendar();
						}, 500);
						break;
					default:
						break;
				}
			}

			if (app.type) {
				let type = app.type;
				if (type === 'staff_update') {
					console.log('staff update');
					this.props.deselectAppointment();
					this.props.disable_Calendar(false);
					this.props.loadMembers();
				}

				if (type === 'update_blocktime') {
					console.log('update blocktime');
					this.props.deselectAppointment();
					this.props.disable_Calendar(false);
					this.props.updateNextStaff();
				}
			}
		});
		connection.start().catch((error) => {
			console.log({ error });
		});
		connection.onclose(function() {});
	}

	render() {
		const {
			waitingAppointments,
			waitingIndex,
			openAddingAppointment,
			calendarMembers,
			disableCalendar,
			isLoadWaiting,
			isLoadCalendar,
			disable_Calendar,
			deleteEventWaitingList,
			StatusDeleteWaiting,
			deleteWaitingAppointment,
			updateAppointmentPaid
		} = this.props;
		return (
			<CalendarWrapper>
				<MainCalendar>
					{isLoadCalendar === true && <CalendarLoading />}
					<FCAgenda
						disableCalendar={disableCalendar}
						updateAppointmentPaid={updateAppointmentPaid}
						options={MAIN_CALENDAR_OPTIONS}
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
					<SignInWrapper>
						<SignInWrapper.Button
							onClick={() => {
								openAddingAppointment({});
								disable_Calendar(true);
							}}
						>
							Check-In
						</SignInWrapper.Button>
					</SignInWrapper>
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
