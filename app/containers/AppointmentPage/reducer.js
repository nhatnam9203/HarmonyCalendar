/*
 * AppointmentReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */
import moment from 'moment';
import { fromJS } from 'immutable';
import { statusConvertKey, appointmentAdapter } from './utilSaga';
import {
	SELECT_DAY,
	SELECT_WEEK,
	LOAD_MEMBERS,
	LOAD_MEMBERS_ERROR,
	LOAD_MEMBERS_SUCCESS,
	LOAD_APPOINTMENTS_BY_MEMBERS,
	LOAD_APPOINTMENTS_BY_MEMBERS_SUCCESS,
	LOAD_ALL_APPOINTMENTS,
	LOAD_APPOINTMENTS_BY_MEMBERS_ERROR,
	SET_DISPLAYED_MEMBERS,
	LOAD_WAITING_APPOINTMENT,
	LOAD_WAITING_APPOINTMENT_SUCCESS,
	LOAD_WAITING_APPOINTMENT_ERROR,
	ASSIGN_APPOINTMENT_SUCCESS,
	MOVE_APPOINTMENT_SUCCESS,
	PUT_BACK_APPOINTMENT_SUCCESS,
	SELECT_APPOINTMENT,
	DESELECT_APPOINTMENT,
	OPEN_ADDING_APPOINTMENT,
	CLOSE_ADDING_APPOINTMENT,
	CANCEL_APPOINTMENT_SUCCESS,
	UPDATE_STATUS_APPOINTMENT_SUCCESS,
	UPDATE_WAITING_APPOINTMENT,
	CHECK_PHONE_ADD_CUSTOMER_SUCCESS,
	CHECK_PHONE_ADD_CUSTOMER_ERROR,
	ADD_CUSTOMER_SUCCESS,
	DISABLE_CALENDAR,
	LOADING_WAITING,
	LOADING_CALENDAR,
	TIME_STAFFID,
	ADD_APPOINTMENT_TO_CALENDAR,
	REMOVE_APPOINTMENT_WAITING,
	DELETE_WAITING_APPPOINTMENT,
	CHANGE_APPOINTMENT_TIME_SUCCESS,
	ADD_APPOINTMENT_TO_WAITING,
	ADD_APPOINTMENT_RELOAD_CALENDAR,
	ADD_APPOINTMENT_REALTIME,
	INFO_CHECK_PHONE,
	UPDATE_APPOINTMENT_PAID,
	DELETE_APPOINTMENT_CALENDAR,
	UPDATE_STAFF,
	OPEN_PINCODE,
	UPDATE_NEXT_STAFF_SUCCESS,
	UPDATE_USER,
	UPDATE_APPOINTMENT_CALENDAR_FRONTEND,
	DELETE_EVENT_WAITINGLIST_SUCCESS,
	DELETE_BLOCKTIME_SUCCESSS,
	GET_BLOCKTIME_SUCCESS,
	GET_APP_BY_ID_SUCCESS,
	UPDATE_APPOINTMENT_PAID_OFFLINE,
	GET_TIME_STAFF_LOGIN_SUCCESS,
	SET_SLIDE_INDEX,
	SET_DETAIL_MERCHANT,
	IS_LOADING_POPUP,
	SET_TODAY,
	TOGGLE_SEARCH_BOX,
	SET_APPOINTMENT_SEARCH_BOX,
	SCROLL_TO_APPOINTMENT,
	START_SCROLL_TO_APPOINTMENT,
	TOGGLE_NOTIFICATION,
	SET_COUNT_NOTIFICATION_UNREAD,
	SET_NOTIFICATION,
	READ_NOTIFICATION,
	UPDATE_BLOCKTIME_FRONTEND,
	ADD_BLOCK_TEMP_FRONTEND,
} from './constants';
import { dataPutBackAppointment } from './utilSaga';
import { unionBy } from 'lodash';

const initialCurrentDay = moment();
const firstDayOfWeek = initialCurrentDay.clone().startOf('isoWeek');
const initialWeekDays = [
	firstDayOfWeek,
	firstDayOfWeek.clone().add(1, 'd'),
	firstDayOfWeek.clone().add(2, 'd'),
	firstDayOfWeek.clone().add(3, 'd'),
	firstDayOfWeek.clone().add(4, 'd'),
	firstDayOfWeek.clone().add(5, 'd'),
	firstDayOfWeek.clone().add(6, 'd')
];

// The initial state of the App
export const initialState = fromJS({
	loading: false,
	loadingNormal: false,
	error: false,
	currentDay: initialCurrentDay,
	today: moment(),
	currentWeekDays: initialWeekDays,
	merchantInfo: '',
	selectedAppointment: null,
	addingAppointment: null,
	selectedFCEvent: null,
	info_after_check_phone: '',
	members: {
		all: [],
		displayed: [],
		staffSort: [],
		blockTime: []
	},
	appointments: {
		calendar: [],
		waiting: [],
		allAppointment: [],
		appointmentDetail: ''
	},
	checkPhoneNumber_success: false,
	checkPhoneNumber_error: false,
	addCustomer_success: false,
	addCustomer_error: false,
	disable_Calendar: false,
	isLoadingWaiting: false,
	isLoadingCalendar: false,
	time_staffId: '',
	StatusDeleteWaiting: false,
	PopupPincode: false,
	PinStaff: '',
	slideIndex: 0,
	isLoadingPopup: false,
	isPopupSearchBox: false,
	appointmentSearchBox: [],
	appointmentScroll: '',
	isScrollToAppointment: false,
	isPopupNotification: false,
	notificationUnreadQuantity: 0,
	notifications: [],
});

function saveAppointmentOffLine(app) {
	if (navigator.onLine === false) {
		const appointments = JSON.parse(localStorage.getItem('AppointmentsOffline'));
		if (!appointments) {
			const newAppointsTemp = [];
			newAppointsTemp.push(app);
			localStorage.setItem('AppointmentsOffline', JSON.stringify(newAppointsTemp));
		} else {
			const apps_temp = [...appointments];
			apps_temp.push(app);
			localStorage.setItem('AppointmentsOffline', JSON.stringify(apps_temp));
		}
	}
}

function appointmentReducer(state = initialState, action) {
	let startOfWeek;
	switch (action.type) {
		case SELECT_DAY:
			return state.set('currentDay', moment(action.day, 'DDMMYYYY'));
		case SET_TODAY:
			return state.set('today', action.payload);

		case SELECT_WEEK:
			startOfWeek = moment(action.dayOfWeek, 'DDMMYYYY').startOf('isoWeek');
			return state.set(
				'currentWeekDays',
				fromJS([
					startOfWeek,
					startOfWeek.clone().add(1, 'd'),
					startOfWeek.clone().add(2, 'd'),
					startOfWeek.clone().add(3, 'd'),
					startOfWeek.clone().add(4, 'd'),
					startOfWeek.clone().add(5, 'd'),
					startOfWeek.clone().add(6, 'd')
				])
			);

		case READ_NOTIFICATION:
			let index = state.get('notifications').findIndex(app => app.merchantNotificationId === action.payload);
			let arrTemp = state.get('notifications');
			arrTemp[index].view = 1;

			return state.set('notifications', arrTemp);

		case SET_NOTIFICATION:
			if (action.page !== 1) {
				let tempArr = [
					...state.get('notifications'),
					...action.payload
				];
				return state.set('notifications', tempArr);
			} else {
				return state.set('notifications', action.payload);
			}

		case ADD_BLOCK_TEMP_FRONTEND:
			return state
				.updateIn(['members', 'all'], (arr) => {
					const staffIndex = arr.findIndex(s => s.id === action.payload.staffId);
					arr[staffIndex].blockTime.push(action.payload);
					localStorage.setItem('staffList', JSON.stringify(arr));
					return [...arr];
				})
				.updateIn(['members', 'blockTime'], (arr) => {
					arr.push(action.payload);
					return [...arr];
				});

		case UPDATE_BLOCKTIME_FRONTEND:
			return state;

		case SET_COUNT_NOTIFICATION_UNREAD:
			return state.set('notificationUnreadQuantity', action.payload);

		case TOGGLE_NOTIFICATION:
			return state.set('isPopupNotification', action.isPopupNotification);

		case TOGGLE_SEARCH_BOX:
			return state.set('isPopupSearchBox', action.isPopupSearchBox).set('appointmentSearchBox', []);

		case START_SCROLL_TO_APPOINTMENT:
			return state.set('isScrollToAppointment', action.isScrollToAppointment);

		case SET_APPOINTMENT_SEARCH_BOX:
			return state.set('appointmentSearchBox', action.data);

		case SCROLL_TO_APPOINTMENT:
			return state.set('appointmentScroll', action.appointment);

		case SELECT_APPOINTMENT:
			return state.set('selectedAppointment', action.appointment).set('selectedFCEvent', {
				...action.fcEvent
			});

		case IS_LOADING_POPUP:
			return state.set('isLoadingPopup', action.payload);

		case DESELECT_APPOINTMENT:
			return state
				.set('selectedAppointment', null)
				.set('selectedFCEvent', null)
				.updateIn(['appointments', 'appointmentDetail'], (app) => {
					app = '';
					return app;
				});

		case OPEN_ADDING_APPOINTMENT:
			return state.set('addingAppointment', action.appointment);

		case CLOSE_ADDING_APPOINTMENT:
			return state.set('addingAppointment', null);

		case LOAD_MEMBERS:
			return state.set('loading', true).set('error', false).setIn(['members', 'all'], []);

		case 'LOAD_STAFF_SORT':
			return state.setIn(['members', 'staffSort'], action.staff);

		case LOAD_MEMBERS_SUCCESS:
			return state.setIn(['members', 'all'], action.members).set('loading', false);

		case SET_DETAIL_MERCHANT:
			return state.set('merchantInfo', action.payload);

		case LOAD_MEMBERS_ERROR:
			return state.set('error', action.error).set('loading', false);
		case SET_SLIDE_INDEX:
			return state.set('slideIndex', action.slideIndex);

		case SET_DISPLAYED_MEMBERS:
			let resourceId = 0;
			for (let index = 0; index < action.members.length; index++) {
				action.members[index].resourceId = resourceId;
				resourceId = resourceId + 1;
				if (resourceId === 8) {
					resourceId = 0;
				}
			}

			return state.setIn(['members', 'displayed'], action.members);

		case LOAD_WAITING_APPOINTMENT:
			return state.setIn(['appointments', 'waiting'], []);

		case LOAD_WAITING_APPOINTMENT_SUCCESS:
			const waitingApointments = action.appointments.sort(function (a, b) {
				var c = new Date(a.id);
				var d = new Date(b.id);
				return d - c;
			});
			return state.setIn(['appointments', 'waiting'], waitingApointments);

		case LOAD_WAITING_APPOINTMENT_ERROR:
			return state.set('error', action.error);

		case LOAD_APPOINTMENTS_BY_MEMBERS:
			return state.setIn(['appointments', 'calendar'], []);

		case LOAD_APPOINTMENTS_BY_MEMBERS_SUCCESS:
			return state.setIn(['appointments', 'calendar'], action.appointments);
		case LOAD_ALL_APPOINTMENTS:
			return state.setIn(['appointments', 'allAppointment'], action.appointments);

		case LOAD_APPOINTMENTS_BY_MEMBERS_ERROR:
			return state.set('error', action.error);

		case ASSIGN_APPOINTMENT_SUCCESS:
			return state
				.updateIn(['appointments', 'calendar'], (arr) => {
					const assignedMember = arr.find((member) => member.memberId === action.appointment.memberId);
					if (assignedMember) {
						assignedMember.appointments.push(action.appointment);
					}
					return [...arr];
				})
				.updateIn(['appointments', 'waiting'], (arr) => {
					const movedAppointmentIndex = arr.findIndex(
						(appointment) => appointment.id === action.appointment.id
					);
					if (movedAppointmentIndex < 0) return [...arr];
					arr.splice(movedAppointmentIndex, 1);
					return [...arr];
				});

		case MOVE_APPOINTMENT_SUCCESS:
			return state.updateIn(['appointments', 'calendar'], (arr) => {
				const oldPosition = arr.find((member) =>
					member.appointments.find((appointment) => appointment.id === action.appointment.id)
				);
				if (!oldPosition) return [...arr];

				const movedAppointmentIndex = oldPosition.appointments.findIndex(
					(appointment) => appointment.id === action.appointment.id
				);
				if (movedAppointmentIndex < 0) return [...arr];

				oldPosition.appointments.splice(movedAppointmentIndex, 1);

				const newPositionIndex = arr.findIndex((member) => member.memberId === action.appointment.memberId);
				arr[newPositionIndex].appointments.push(action.appointment);

				return [...arr];
			});

		case PUT_BACK_APPOINTMENT_SUCCESS:
			return state
				.updateIn(['appointments', 'calendar'], (arr) => {
					const oldPosition = arr.find((member) =>
						member.appointments.find((appointment) => appointment.id === action.appointment.id)
					);
					if (!oldPosition) return [...arr];

					const movedAppointmentIndex = oldPosition.appointments.findIndex(
						(appointment) => appointment.id === action.appointment.id
					);
					if (movedAppointmentIndex < 0) return [...arr];

					oldPosition.appointments.splice(movedAppointmentIndex, 1);
					saveAppointmentOffLine(action.appointment);
					return [...arr];
				})
				.updateIn(['appointments', 'waiting'], (arr) => {
					arr = [
						{
							...action.appointment,
							status: 'WAITING',
							memberId: -1
						},
						...arr
					];
					localStorage.setItem('AppointmentWaiting', JSON.stringify(arr));
					return [...arr];
				})
				.updateIn(['appointments', 'allAppointment'], (arr) => {
					const pos = arr.findIndex((app) => app.id === action.appointment.id);
					const { memberId, start, end, options, products, extras, id } = action.appointment;
					if (pos === -1) return [...arr];
					arr.splice(pos, 1);
					// if (navigator.onLine === false) {
					const data = dataPutBackAppointment(memberId, start, end, options, products, extras);
					// window.postMessage({
					// 	data: { ...data, id },
					// 	action: 'updateAppointmemtOffline'
					// });
					// }
					localStorage.setItem('AppointmentCalendar', JSON.stringify(arr));
					return [...arr];
				});

		case CANCEL_APPOINTMENT_SUCCESS:
			return state.updateIn(['appointments', 'calendar'], (arr) => {
				const oldPosition = arr.find((member) =>
					member.appointments.find((appointment) => appointment.id === action.appointmentId)
				);
				if (!oldPosition) return [...arr];

				const movedAppointmentIndex = oldPosition.appointments.findIndex(
					(appointment) => appointment.id === action.appointmentId
				);
				if (movedAppointmentIndex < 0) return [...arr];

				oldPosition.appointments.splice(movedAppointmentIndex, 1);

				return [...arr];
			});

		case UPDATE_STATUS_APPOINTMENT_SUCCESS:
			const { appointmentID, status, newDate, notes } = action.appointment;
			return state.updateIn(['appointments', 'calendar'], (arr) => {
				const member = arr.find((mem) =>
					mem.appointments.find((app) => parseInt(app.id) === parseInt(appointmentID))
				);
				if (!member) return [...arr];
				const appointmentIndex = member.appointments.findIndex(
					(app) => parseInt(app.id) === parseInt(appointmentID)
				);
				if (appointmentIndex < 0) return [...arr];
				member.appointments[appointmentIndex].end = newDate.substr(0, 19);
				member.appointments[appointmentIndex].notes = [
					...notes,
					...member.appointments[appointmentIndex].notes
				];
				if (status === 'checkin') {
					member.appointments[appointmentIndex].status = 'CHECKED_IN';
				}
				if (status === 'confirm') {
					member.appointments[appointmentIndex].status = 'CONFIRMED';
				}
				if (status === 'unconfirm') {
					member.appointments[appointmentIndex].status = 'UNCONFIRMED';
				}
				if (status === 'paid') {
					member.appointments[appointmentIndex].status = 'PAID';
				}
				return [...arr];
			});

		case CHANGE_APPOINTMENT_TIME_SUCCESS:
			return state.updateIn(['appointments', 'calendar'], (arr) => {
				const member = arr.find((mem) => parseInt(mem.memberId) === parseInt(action.appointment.memberId));
				if (!member) return;
				const status_app = action.appointment.status;
				if (status_app === 'ASSIGNED') {
					action.appointment.status = 'ASSIGNED';
				}
				if (status_app === 'CONFIRMED') {
					action.appointment.status = 'ASSIGNED';
				}
				if (status_app === 'UNCONFIRM') {
					action.appointment.status = 'ASSIGNED';
				}
				if (status_app === 'CHECKED_IN') {
					action.appointment.status = 'CHECKED_IN';
				}
				member.appointments.push(action.appointment);

				return [...arr];
			});

		case UPDATE_WAITING_APPOINTMENT:
			return state.updateIn(['appointments', 'waiting'], (arr) => { });

		case ADD_APPOINTMENT_TO_WAITING:
			return state.updateIn(['appointments', 'waiting'], (arr) => {
				const pos_to_find = arr.findIndex((appointment) => appointment.id === action.data.id);

				if (pos_to_find === -1) {
					arr = [action.data, ...arr];
				}
				return [...arr];
			});

		case ADD_APPOINTMENT_RELOAD_CALENDAR:
			var pos_add = '';
			return state.updateIn(['appointments', 'calendar'], (arr) => {
				for (let i = 0; i < arr.length; i++) {
					if (parseInt(arr[i].memberId) === parseInt(action.data.memberId)) {
						pos_add = i;
					}
				}
				arr[pos_add].appointments.push(action.data);
				return [...arr];
			});

		case ADD_APPOINTMENT_REALTIME:
			var pos_add_r = '';
			return state
				.updateIn(['appointments', 'calendar'], (arr) => {
					if (action.data.status === 'ASSIGNED' || action.data.status === 'CHECKED_IN') {
						for (let i = 0; i < arr.length; i++) {
							if (parseInt(arr[i].memberId) === parseInt(action.data.memberId)) {
								pos_add_r = i;
							}
						}
						if (pos_add_r !== '') {
							arr[pos_add_r].appointments.push(action.data);
						}
					}
					return [...arr];
				})
				.updateIn(['appointments', 'allAppointment'], (arr) => {
					if (action.data.status === 'ASSIGNED' || action.data.status === 'CHECKED_IN') {
						let pos = arr.findIndex((app) => app.id === action.data.id);

						if (pos === -1) {
							arr.push(action.data);
						}
					}

					return [...arr];
				});

		case REMOVE_APPOINTMENT_WAITING:
			return state.updateIn(['appointments', 'waiting'], (arr) => {
				// if (navigator.onLine === false) {
				// window.postMessage({
				// 	data: { ...action.appointment },
				// 	action: 'updateAppointmemtOffline'
				// });
				// }

				for (let i = 0; i < arr.length; i++) {
					if (arr[i].id === action.appointment.id) {
						arr.splice(i, 1);
					}
				}
				localStorage.setItem('AppointmentWaiting', JSON.stringify(arr));
				return [...arr];
			});

		case UPDATE_APPOINTMENT_PAID_OFFLINE:
			return state
				.updateIn(['appointments', 'calendar'], (arr) => {
					for (let i = 0; i < arr.length; i++) {
						if (arr[i].id === action.idAppointment) {
							arr[i].status = 'PAID';
							//update paid offline
						}
					}
					return [...arr];
				})
				.updateIn(['appointments', 'allAppointment'], (arr) => {
					const pos = arr.findIndex((app) => app.id === action.idAppointment);
					if (pos === -1) return [...arr];
					arr[pos].status = 'PAID';
					localStorage.setItem('allAppointment', JSON.stringify(arr));
					return [...arr];
				});

		case UPDATE_APPOINTMENT_PAID:
			return state
				.updateIn(['appointments', 'calendar'], (arr) => {
					const member = arr.find((mem) =>
						mem.appointments.find((app) => parseInt(app.id) === parseInt(action.appointment.id))
					);

					if (!member) {
						const memb = arr.find(
							(mem) => parseInt(mem.memberId) === parseInt(action.appointment.memberId)
						);
						if (!memb) return [...arr];
						memb.appointments.push(action.appointment);
						return [...arr];
					}
					const appointmentIndex = member.appointments.findIndex(
						(app) => parseInt(app.id) === parseInt(action.appointment.id)
					);

					if (parseInt(member.memberId) !== action.appointment.memberId) {
						const newMember = arr.find(
							(mem) => parseInt(mem.memberId) === parseInt(action.appointment.memberId)
						);
						if (!newMember) return [...arr];
						newMember.appointments.push(action.appointment);
						member.appointments.splice(appointmentIndex, 1);
					} else if (action.appointment.status === 'CANCEL') {
						member.appointments.splice(appointmentIndex, 1);
					} else if (action.appointment.status === 'WAITING') {
						member.appointments.splice(appointmentIndex, 1);
					} else {
						member.appointments[appointmentIndex] = action.appointment;
					}
					return [...arr];
				})
				.updateIn(['appointments', 'allAppointment'], (arr) => {
					const pos = arr.findIndex((app) => app.id === action.appointment.id);
					if (pos === -1) return [...arr];
					arr[pos] = action.appointment;
					localStorage.setItem('allAppointment', JSON.stringify(arr));
					return [...arr];
				});

		case INFO_CHECK_PHONE:
			return state.set('info_after_check_phone', action.data);

		case DELETE_WAITING_APPPOINTMENT:
			return state.set('StatusDeleteWaiting', action.status);

		case CHECK_PHONE_ADD_CUSTOMER_SUCCESS:
			return state.set('checkPhoneNumber_success', action.phone);

		case CHECK_PHONE_ADD_CUSTOMER_ERROR:
			return state.set('checkPhoneNumber_error', action.error);

		case ADD_CUSTOMER_SUCCESS:
			return state.set('addCustomer_success', action.customer);

		case DISABLE_CALENDAR:
			return state.set('disable_Calendar', action.status);

		case LOADING_WAITING:
			return state.set('isLoadingWaiting', action.status);

		case LOADING_CALENDAR:
			return state.set('isLoadingCalendar', action.status);

		case TIME_STAFFID:
			return state.set('time_staffId', action.data);

		case OPEN_PINCODE:
			return state.set('PopupPincode', action.data).set('PinStaff', action.pincode);

		case UPDATE_STAFF:
			return state.setIn(['members', 'all'], (arr) => {
				return [...arr];
			});

		case UPDATE_NEXT_STAFF_SUCCESS:
			return state.setIn(['members', 'all'], action.data);

		case UPDATE_USER:
			let userInfo = JSON.parse(action.data);
			return state
				.updateIn(['appointments', 'calendar'], (arr) => {
					arr.forEach((element) => {
						element.appointments.forEach((app) => {
							if (app.phoneNumber === userInfo.Phone) {
								app.phoneNumber = userInfo.Phone;
								app.userFullName = userInfo.FirstName + ' ' + userInfo.LastName;
							}
						});
					});
					return [...arr];
				})
				.updateIn(['appointments', 'waiting'], (arr) => {
					arr.forEach((app) => {
						if (app.phoneNumber === userInfo.Phone) {
							app.phoneNumber = userInfo.Phone;
							app.userFullName = userInfo.FirstName + ' ' + userInfo.LastName;
						}
					});
					return [...arr];
				});

		case ADD_APPOINTMENT_TO_CALENDAR:
			var indexArr;
			return state
				.updateIn(['appointments', 'calendar'], (arr) => {
					for (let i = 0; i < arr.length; i++) {
						if (parseInt(arr[i].memberId) === parseInt(action.appointment.memberId)) {
							indexArr = i;
						}
					}
					action.appointment.appointment.end = action.appointment.new_end_time;
					arr[indexArr].appointments.push(action.appointment.appointment);
					return [...arr];
				})
				.updateIn(['appointments', 'allAppointment'], (arr) => {
					const pos = arr.findIndex((app) => app.id === action.appointment.appointment.id);
					action.appointment.appointment.end = action.appointment.new_end_time;
					if (pos === -1) {
						//add
						arr.push(action.appointment.appointment);
						arr = unionBy(arr, 'id');
					} else {
						//update
						arr[pos] = action.appointment.appointment;
					}
					saveAppointmentOffLine(action.appointment.appointment);
					localStorage.setItem('AppointmentCalendar', JSON.stringify(arr));
					return [...arr];
				});

		case DELETE_APPOINTMENT_CALENDAR:
			return state
				.updateIn(['appointments', 'calendar'], (arr) => {
					const oldPosition = arr.find((member) =>
						member.appointments.find((appointment) => appointment.id === action.appointment.id)
					);
					if (!oldPosition) return [...arr];

					const appointmentIndex = oldPosition.appointments.findIndex(
						(appointment) => appointment.id === action.appointment.id
					);
					if (appointmentIndex < 0) return [...arr];
					oldPosition.appointments.splice(appointmentIndex, 1);
					return [...arr];
				})
				.updateIn(['appointments', 'allAppointment'], (arr) => {
					const pos = arr.findIndex((app) => app.id === action.appointment.id);
					if (pos === -1) return [...arr];
					arr.splice(pos, 1);
					saveAppointmentOffLine(action.appointment);
					localStorage.setItem('AppointmentCalendar', JSON.stringify(arr));
					return [...arr];
				});

		case UPDATE_APPOINTMENT_CALENDAR_FRONTEND:
			return state.updateIn(['appointments', 'allAppointment'], (arr) => {
				let { appointment, id } = action.data;
				const { fromTime, toTime, extras, products, services, staffId, status } = appointment;
				const pos = arr.findIndex((app) => parseInt(app.id) === parseInt(id));
				if (pos === -1) return [...arr];
				arr[pos].start = fromTime;
				arr[pos].end = toTime;
				arr[pos].extras = extras;
				arr[pos].products = products;
				arr[pos].options = services;
				arr[pos].memberId = staffId;
				arr[pos].status = statusConvertKey[status];
				saveAppointmentOffLine(appointment);
				localStorage.setItem('AppointmentCalendar', JSON.stringify(arr));
				// if (navigator.onLine === false) {
				// window.postMessage({
				// 	data: { ...appointment, id },
				// 	action: 'updateAppointmemtOffline'
				// });
				// }
				return [...arr];
			});

		case DELETE_EVENT_WAITINGLIST_SUCCESS:
			return state.updateIn(['appointments', 'waiting'], (arr) => {
				let { appointment } = action;
				const pos = arr.find((app) => app.id === appointment.id);
				if (pos === -1) return [...arr];
				arr.splice(pos, 1);
				localStorage.setItem('AppointmentCalendar', JSON.stringify(arr));

				return [...arr];
			});

		case DELETE_BLOCKTIME_SUCCESSS:
			return state
				.updateIn(['members', 'all'], (arr) => {
					const { staff, block } = action.data;
					const pos = arr.findIndex((s) => s.id === staff.id);
					if (pos === -1) return [...arr];
					const vt = arr[pos].blockTime.findIndex((b) => b.blockTimeId === block.blockTimeId);
					if (vt === -1) return [...arr];
					arr[pos].blockTime[vt].isDisabled = 1;
					return [...arr];
				})
				.updateIn(['members', 'displayed'], (arr) => {
					const { staff, block } = action.data;
					const pos = arr.findIndex((s) => s.id === staff.id);
					if (pos === -1) return [...arr];
					const vt = arr[pos].blockTime.findIndex((b) => b.blockTimeId === block.blockTimeId);
					if (vt === -1) return [...arr];
					arr[pos].blockTime[vt].isDisabled = 1;
					return [...arr];
				});

		case GET_BLOCKTIME_SUCCESS:
			return state
				.updateIn(['members', 'all'], (arr) => {
					arr.forEach((staff) => {
						staff.blockTime = [];
					});
					arr.forEach((staff) => {
						let arr_ = [];
						action.data.forEach((blockTime) => {
							if (staff.id === blockTime.staffId) {
								arr_.push(blockTime);
							}
						});
						staff.blockTime = [...arr_];
					});

					if (moment(state.getIn(['currentDay'])).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
						// window.postMessage({
						// 	action: 'dataStaffList',
						// 	staffList: arr
						// });
					}

					localStorage.setItem('staffList', JSON.stringify(arr));
					return [...arr];
				})
				.updateIn(['members', 'blockTime'], (arr) => {
					arr = action.data;
					return [...arr];
				});

		case GET_APP_BY_ID_SUCCESS:
			return state.updateIn(['appointments', 'appointmentDetail'], (app) => {
				if (navigator.onLine) {
					const app = appointmentAdapter(action.data);
					return { ...app };
				} else {
					app = action.data;
					return { ...app };
				}
			});

		case GET_TIME_STAFF_LOGIN_SUCCESS:
			return state
				.updateIn(['members', 'all'], (arr) => {
					const pos = arr.findIndex((staff) => staff.id === action.data.staffId);
					if (pos === -1) return;
					arr[pos].timeLogin = action.data.timeLogin;
					return [...arr];
				})
				.updateIn(['members', 'displayed'], (arr) => {
					const pos = arr.findIndex((staff) => staff.id === action.data.staffId);
					if (pos === -1) return;
					arr[pos].timeLogin = action.data.timeLogin;
					return [...arr];
				});

		default:
			return state;
	}
}

export default appointmentReducer;
