/*
 * Appointment Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
	ASSIGN_APPOINTMENT,
	ASSIGN_APPOINTMENT_ERROR,
	ASSIGN_APPOINTMENT_SUCCESS,
	CANCEL_APPOINTMENT,
	CANCEL_APPOINTMENT_ERROR,
	CANCEL_APPOINTMENT_SUCCESS,
	CLOSE_ADDING_APPOINTMENT,
	DESELECT_APPOINTMENT,
	LOAD_APPOINTMENTS_BY_MEMBERS,
	LOAD_APPOINTMENTS_BY_MEMBERS_ERROR,
	LOAD_APPOINTMENTS_BY_MEMBERS_SUCCESS,
	LOAD_ALL_APPOINTMENTS,
	LOAD_MEMBERS,
	LOAD_MEMBERS_ERROR,
	LOAD_MEMBERS_SUCCESS,
	LOAD_WAITING_APPOINTMENT,
	LOAD_WAITING_APPOINTMENT_ERROR,
	LOAD_WAITING_APPOINTMENT_SUCCESS,
	MOVE_APPOINTMENT,
	MOVE_APPOINTMENT_ERROR,
	MOVE_APPOINTMENT_SUCCESS,
	OPEN_ADDING_APPOINTMENT,
	PUT_BACK_APPOINTMENT,
	PUT_BACK_APPOINTMENT_ERROR,
	PUT_BACK_APPOINTMENT_SUCCESS,
	SELECT_APPOINTMENT,
	SELECT_DAY,
	SELECT_DAY_CALENDAR,
	SELECT_WEEK,
	SET_DISPLAYED_MEMBERS,
	UPDATE_STATUS_APPOINTMENT,
	UPDATE_STATUS_APPOINTMENT_SUCCESS,
	UPDATE_STATUS_APPOINTMENT_ERROR,
	UPDATE_CALENDAR_INTERVAL,
	CHECK_PHONE_ADD_CUSTOMER,
	CHECK_PHONE_ADD_CUSTOMER_SUCCESS,
	CHECK_PHONE_ADD_CUSTOMER_ERROR,
	ADD_CUSTOMER,
	ADD_CUSTOMER_SUCCESS,
	ADD_CUSTOMER_ERROR,
	UPDATE_WAITING_APPOINTMENT,
	UPDATE_APPOINTMENT_STATUS,
	UPDATE_APPOINTMENT_STATUS_SUCCESS,
	UPDATE_APPOINTMENT_STATUS_ERROR,
	DISABLE_CALENDAR,
	LOADING_CALENDAR,
	LOADING_WAITING,
	TIME_STAFFID,
	ADD_APPOINTMENT_TO_CALENDAR,
	DELETE_EVENT_WAITINGLIST,
	DELETE_EVENT_WAITINGLIST_SUCCESS,
	DELETE_EVENT_WAITINGLIST_ERROR,
	REMOVE_APPOINTMENT_WAITING,
	DELETE_WAITING_APPPOINTMENT,
	CHANGE_APPOINTMENT_TIME,
	CHANGE_APPOINTMENT_TIME_SUCCESS,
	CHANGE_APPOINTMENT_TIME_ERROR,
	UPDATE_APPOINTMENT_OFFLINE,
	UPDATE_APPOINTMENT_OFFLINE_SUCCESS,
	UPDATE_APPOINTMENT_OFFLINE_ERROR,
	LOAD_APPOINTMENT_AGAIN,
	ADD_APPOINTMENT_TO_WAITING,
	ADD_APPOINTMENT_RELOAD_CALENDAR,
	ADD_APPOINTMENT_REALTIME,
	INFO_CHECK_PHONE,
	UPDATE_APPOINTMENT_PAID,
	DELETE_APPOINTMENT_CALENDAR,
	UPDATE_STAFF,
	CHECKPINCODE,
	OPEN_PINCODE,
	UPDATE_NEXT_STAFF,
	UPDATE_NEXT_STAFF_SUCCESS,
	UPDATE_USER,
	RENDER_APPOINTMEMT,
	UPDATE_APPOINTMENT_CALENDAR_FRONTEND,
	ADD_BLOCKTIME,
	DELETE_BLOCKTIME,
	DELETE_BLOCKTIME_SUCCESSS,
	GET_BLOCKTIME,
	GET_BLOCKTIME_SUCCESS,
	GET_APPOINTMENT_OFFLINE,
	GET_WAITINGLIST_OFFLINE,
	GET_STAFF_OFFLINE,
	GET_APP_BY_ID,
	GET_APP_BY_ID_SUCCESS,
	GROUP_APPOINTMENT,
	UPDATE_APPOINTMENT_PAID_OFFLINE,
	GET_TIME_STAFF_LOGIN,
	GET_TIME_STAFF_LOGIN_SUCCESS,
	LOAD_STAFF_SORT,
	SET_SLIDE_INDEX,
	RELOAD_CALENDAR,
	RELOAD_STAFF,
	EDIT_BLOCKTIME,
	UPDATE_NOTE,
	SUBMIT_ADD_APPOINTMENT,
	GET_DETAIL_APP_AFTER_ADD,
	CHANGE_APPOINTMENT,
	SENDLINK_CUSTOMER,
	GET_DETAIL_MERCHANT,
	SET_DETAIL_MERCHANT,
	UPDATE_COMPANION,
	IS_LOADING_POPUP,
	SEARCH_PHONE_COMPANION,
	SET_TODAY
} from './constants';

/**
 * Select day on mini calendar or day slider
 * @param  {string} day The string with format DDMMYYYY
 * @return {object}   An action object with a type of SELECT_DAY
 */
export function selectDay(day) {
	return {
		type: SELECT_DAY,
		day
	};
}

/**
 * Select week on day slider
 * @param  {string} dayOfWeek The string with format DDMMYYYY
 * @return {object}   An action object with a type of SELECT_DAY
 */
export function selectWeek(dayOfWeek) {
	return {
		type: SELECT_WEEK,
		dayOfWeek
	};
}

/**
 * Select day on mini calendar
 * @param  {string} day The string with format DDMMYYYY
 * @return {object}   An action object with a type of SELECT_DAY
 */
export function selectDayOnCalendar(day) {
	return {
		type: SELECT_DAY_CALENDAR,
		day
	};
}

/**
 * Select an appointment
 * @param  {object} appointment The appointment was selected
 * @param  {object} fcEvent The fcEvent was selected
 * @return {object}   An action object with a type of SELECT_APPOINTMENT
 */
export function selectAppointment(appointment, fcEvent) {
	return {
		type: SELECT_APPOINTMENT,
		appointment,
		fcEvent
	};
}

/**
 * Deselect the appointment
 * @return {object}   An action object with a type of DESELECT_APPOINTMENT
 */
export function deselectAppointment() {
	return {
		type: DESELECT_APPOINTMENT
	};
}

/**
 * Open adding appointment popup
 * @param  {object} appointment The selected appointment
 * @return {object}   An action object with a type of OPEN_ADDING_APPOINTMENT
 */
export function openAddingAppointment(appointment) {
	return {
		type: OPEN_ADDING_APPOINTMENT,
		appointment
	};
}

/**
 * Close adding appointment popup
 * @return {object}   An action object with a type of CLOSE_ADDING_APPOINTMENT
 */
export function closeAddingAppointment() {
	return {
		type: CLOSE_ADDING_APPOINTMENT
	};
}

/**
 * Load the members, this action starts the request saga
 * @return {object} An action object with a type of LOAD_MEMBERS
 */
export function loadMembers() {
	return {
		type: LOAD_MEMBERS
	};
}

/**
 * Dispatched when the members are loaded by the request saga
 * @param  {array} members The members data
 * @return {object} An action object with a type of LOAD_MEMBERS_SUCCESS passing the members
 */
export function membersLoaded(members) {
	return {
		type: LOAD_MEMBERS_SUCCESS,
		members
	};
}

/**
 * Dispatched when loading the members fails
 * @param  {object} error The error
 * @return {object} An action object with a type of LOAD_MEMBERS_ERROR passing the error
 */
export function memberLoadingError(error) {
	return {
		type: LOAD_MEMBERS_ERROR,
		error
	};
}

/**
 * Load the members, this action starts the request saga
 * @param  {object} members The url options
 * @return {object} An action object with a type of LOAD_MEMBERS
 */
export function setDisplayedMembers(members) {
	return {
		type: SET_DISPLAYED_MEMBERS,
		members
	};
}

/**
 * Load the waiting appointments, this action starts the request saga
 * @param  {object} options The url options
 * @return {object} An action object with a type of LOAD_WAITING_APPOINTMENT
 */
export function loadWaitingAppointments(options) {
	return {
		type: LOAD_WAITING_APPOINTMENT,
		...options
	};
}

/**
 * Dispatched when the waiting appointments are loaded by the request saga
 * @param  {array} appointments The appointments data
 * @return {object} An action object with a type of LOAD_WAITING_APPOINTMENT_SUCCESS passing the appointments
 */
export function waitingAppointmentsLoaded(appointments) {
	return {
		type: LOAD_WAITING_APPOINTMENT_SUCCESS,
		appointments
	};
}

/**
 * Dispatched when loading the waiting appointments fails
 * @param  {object} error The error
 * @return {object} An action object with a type of LOAD_WAITING_APPOINTMENT_ERROR passing the error
 */
export function waitingAppointmentLoadingError(error) {
	return {
		type: LOAD_WAITING_APPOINTMENT_ERROR,
		error
	};
}

/**
 * Load the appointment by members, this action starts the request saga
 // * @param  {object} options The url options
 * @return {object} An action object with a type of LOAD_APPOINTMENTS_BY_MEMBERS
 */
export function loadAppointmentByMembers() {
	return {
		type: LOAD_APPOINTMENTS_BY_MEMBERS
	};
}

/**
 * Dispatched when the appointment by members are loaded by the request saga
 * @param  {array} appointments The appointments data
 * @return {object} An action object with a type of LOAD_APPOINTMENTS_BY_MEMBERS_SUCCESS passing the members
 */
export function appointmentByMembersLoaded(appointments) {
	return {
		type: LOAD_APPOINTMENTS_BY_MEMBERS_SUCCESS,
		appointments
	};
}

export function loadedAllAppointments(appointments) {
	return {
		type: LOAD_ALL_APPOINTMENTS,
		appointments
	};
}

/**
 * Dispatched when loading the appointment by members fails
 * @param  {object} error The error
 * @return {object} An action object with a type of LOAD_APPOINTMENTS_BY_MEMBERS_ERROR passing the error
 */
export function appointmentByMemberLoadingError(error) {
	return {
		type: LOAD_APPOINTMENTS_BY_MEMBERS_ERROR,
		error
	};
}

/**
 * Assign appointment to member, this action starts the request saga
 * @param  {object} options The url options
 * @return {object} An action object with a type of ASSIGN_APPOINTMENT
 */
export function assignAppointment(options) {
	return {
		type: ASSIGN_APPOINTMENT,
		...options
	};
}

/**
 * Dispatched when assign appointment to member by the request saga
 * @param  {object} appointment
 * @return {object} An action object with a type of ASSIGN_APPOINTMENT_SUCCESS passing the members
 */
export function appointmentAssigned(appointment) {
	return {
		type: ASSIGN_APPOINTMENT_SUCCESS,
		appointment
	};
}

/**
 * Dispatched when assigning appointment to member fails
 * @param  {object} error The error
 * @return {object} An action object with a type of ASSIGN_APPOINTMENT_ERROR passing the error
 */
export function appointmentAssigningError(error) {
	return {
		type: ASSIGN_APPOINTMENT_ERROR,
		error
	};
}

/**
 * Move to another member, this action starts the request saga
 * @param  {number} appointmentId The url options
 * @param  {number} newPositionIndex The url options
 * @param  {object} newTime The url options
 * @param  {object} newEndTime The url options
 * @return {object} An action object with a type of MOVE_APPOINTMENT
 */
export function moveAppointment(appointmentId, newPositionIndex, newTime, newEndTime) {
	return {
		type: MOVE_APPOINTMENT,
		appointmentId,
		newPositionIndex,
		newTime,
		newEndTime
	};
}

/**
 * Dispatched when move appointment to member by the request saga
 * @param  {object} appointment
 * @return {object} An action object with a type of MOVE_APPOINTMENT_SUCCESS passing the members
 */
export function appointmentMoved(appointment) {
	return {
		type: MOVE_APPOINTMENT_SUCCESS,
		appointment
	};
}

/**
 * Dispatched when moving appointment to member fails
 * @param  {object} error The error
 * @return {object} An action object with a type of MOVE_APPOINTMENT_ERROR passing the error
 */
export function appointmentMovingError(error) {
	return {
		type: MOVE_APPOINTMENT_ERROR,
		error
	};
}

/**
 * Put back to waiting list, this action starts the request saga
 * @param  {object} appointment The url options
 * @return {object} An action object with a type of PUT_BACK_APPOINTMENT
 */
export function putBackAppointment(appointment) {
	return {
		type: PUT_BACK_APPOINTMENT,
		appointment
	};
}

/**
 * Dispatched when put back appointment to waiting list by the request saga
 * @param  {object} appointment
 * @return {object} An action object with a type of PUT_BACK_APPOINTMENT_SUCCESS passing the members
 */
export function appointmentPutBack(appointment) {
	return {
		type: PUT_BACK_APPOINTMENT_SUCCESS,
		appointment
	};
}

/**
 * Dispatched when putting back appointment to waiting fails
 * @param  {object} error The error
 * @return {object} An action object with a type of PUT_BACK_APPOINTMENT_ERROR passing the error
 */
export function appointmentPuttingBackError(error) {
	return {
		type: PUT_BACK_APPOINTMENT_ERROR,
		error
	};
}

/**
 * Cancel appointment, this action starts the request saga
 * @param  {number} appointmentId The url options
 * @return {object} An action object with a type of CANCEL_APPOINTMENT
 */
export function cancelAppointment(appointmentId) {
	return {
		type: CANCEL_APPOINTMENT,
		appointmentId
	};
}

/**
 * Dispatched when cancel appointment to waiting list by the request saga
 * @param  {number} appointmentId
 * @return {object} An action object with a type of CANCEL_APPOINTMENT_SUCCESS passing the members
 */
export function appointmentCanceled(appointmentId) {
	return {
		type: CANCEL_APPOINTMENT_SUCCESS,
		appointmentId
	};
}

/**
 * Dispatched when cancelling appointment to waiting fails
 * @param  {object} error The error
 * @return {object} An action object with a type of CANCEL_APPOINTMENT_ERROR passing the error
 */
export function appointmentCancellingError(error) {
	return {
		type: CANCEL_APPOINTMENT_ERROR,
		error
	};
}

/**
 * Update status of appointment, this action starts the request saga
 * @param  {number} appointmentId The error
 * @param  {object} bookingServices The error
 * @return {object} An action object with a type of UPDATE_STATUS_APPOINTMENT
 */
export function updateStatusAppointment(appointmentId, bookingServices) {
	return {
		type: UPDATE_STATUS_APPOINTMENT,
		appointmentId,
		bookingServices
	};
}

/**
 * Dispatched when update status of appointment to waiting list by the request saga
 * @param  {number} appointmentId
 * @return {object} An action object with a type of UPDATE_STATUS_APPOINTMENT_SUCCESS passing the members
 */
export function appointmentUpdatedStatus(appointment) {
	return {
		type: UPDATE_STATUS_APPOINTMENT_SUCCESS,
		appointment
	};
}

/**
 * Dispatched when updating status of appointment to waiting fails
 * @param  {object} error The error
 * @return {object} An action object with a type of UPDATE_STATUS_APPOINTMENT_ERROR passing the error
 */
export function appointmentUpdatingStatusError(error) {
	return {
		type: UPDATE_STATUS_APPOINTMENT_ERROR,
		error
	};
}

// FIXME: This is hard code for real-time calendar
export function updateCalendarInterval() {
	return {
		type: UPDATE_CALENDAR_INTERVAL
	};
}

/* Check phone number to add customer */
export function checkPhoneNumberCustomer(phone) {
	return {
		type: CHECK_PHONE_ADD_CUSTOMER,
		phone
	};
}
export function checkPhoneNumberCustomerSuccess(phone) {
	return {
		type: CHECK_PHONE_ADD_CUSTOMER_SUCCESS,
		phone
	};
}
export function checkPhoneNumberCustomerError(error) {
	return {
		type: CHECK_PHONE_ADD_CUSTOMER_ERROR,
		error
	};
}

/* Add Customer */
export function addCustomer(customer) {
	return {
		type: ADD_CUSTOMER,
		customer
	};
}
export function addCustomerSuccess(customer) {
	return {
		type: ADD_CUSTOMER_SUCCESS,
		customer
	};
}
export function addCustomerError(error) {
	return {
		type: ADD_CUSTOMER_ERROR,
		error
	};
}

export const updateWaitingAppointment = (appointment) => ({
	type: UPDATE_WAITING_APPOINTMENT,
	appointment
});

export const updateAppointment = (appointment) => ({
	type: UPDATE_APPOINTMENT_STATUS,
	appointment
});
export const updateAppointmentSuccess = (appointment) => ({
	type: UPDATE_APPOINTMENT_STATUS_SUCCESS,
	appointment
});
export const updateAppointmentError = (error) => ({
	type: UPDATE_APPOINTMENT_STATUS_ERROR,
	error
});

export const disableCalendar = (status) => ({
	type: DISABLE_CALENDAR,
	status
});
export const loadingWaiting = (status) => ({
	type: LOADING_WAITING,
	status
});
export const loadingCalendar = (status) => ({
	type: LOADING_CALENDAR,
	status
});

export const TimeAndStaffID = (data) => ({
	type: TIME_STAFFID,
	data
});

export const addAppointmentToCalendar = (appointment) => ({
	type: ADD_APPOINTMENT_TO_CALENDAR,
	appointment
});

export const deleteEventWaitingList = (appointment) => ({
	type: DELETE_EVENT_WAITINGLIST,
	appointment
});
export const deleteEventWaitingList_Success = (appointment) => ({
	type: DELETE_EVENT_WAITINGLIST_SUCCESS,
	appointment
});
export const deleteEventWaitingList_Error = (appointment) => ({
	type: DELETE_EVENT_WAITINGLIST_ERROR,
	appointment
});

export const removeAppointmentWaiting = (appointment) => ({
	type: REMOVE_APPOINTMENT_WAITING,
	appointment
});

export const deleteWaitingAppointment = (status) => ({
	type: DELETE_WAITING_APPPOINTMENT,
	status
});

export const changeAppointmentTime = (appointment) => ({
	type: CHANGE_APPOINTMENT_TIME,
	appointment
});

export const changeAppointmentTime_Success = (appointment) => ({
	type: CHANGE_APPOINTMENT_TIME_SUCCESS,
	appointment
});
export const changeAppointmentTime_Error = (appointment) => ({
	type: CHANGE_APPOINTMENT_TIME_ERROR,
	appointment
});

export const updateAppointmentOffline = (data) => ({
	type: UPDATE_APPOINTMENT_OFFLINE,
	data
});
export const updateAppointmentOfflineSuccess = (data) => ({
	type: UPDATE_APPOINTMENT_OFFLINE_SUCCESS,
	data
});
export const updateAppointmentOfflineError = (data) => ({
	type: UPDATE_APPOINTMENT_OFFLINE_ERROR,
	data
});

export const addAppointmentWaiting = (data) => ({
	type: ADD_APPOINTMENT_TO_WAITING,
	data
});

export const addAppointmentReloadCalendar = (data) => ({
	type: ADD_APPOINTMENT_RELOAD_CALENDAR,
	data
});

export const addAppointmentRealTime = (data) => ({
	type: ADD_APPOINTMENT_REALTIME,
	data
});
export const infoCheckPhone = (data) => ({
	type: INFO_CHECK_PHONE,
	data
});

export const updateAppointmentPaid = (appointment) => ({
	type: UPDATE_APPOINTMENT_PAID,
	appointment
});
  
export const deleteAppointmentCalendar = (appointment) => ({
	type: DELETE_APPOINTMENT_CALENDAR,
	appointment
});

export const updateStaff = (staff) => ({
	type: UPDATE_STAFF,
	staff
});
export const checkPinCode = (pincode) => ({
	type: CHECKPINCODE,
	pincode
});
export const togglePopupPincode = (data, pincode) => ({
	type: OPEN_PINCODE,
	data,
	pincode
});

export const updateNextStaff = (payload) => ({
	type: UPDATE_NEXT_STAFF,
	payload
});
export const renderAppointment = () => ({
	type: RENDER_APPOINTMEMT
});
export const updateNextStaffSuccess = (data) => ({
	type: UPDATE_NEXT_STAFF_SUCCESS,
	data
});

export const updateConsumer = (data) => ({
	type: UPDATE_USER,
	data
});
export const updateAppointmentFrontend = (data) => ({
	type: UPDATE_APPOINTMENT_CALENDAR_FRONTEND,
	data
});

export const SubmitEditBlockTime = (data) => ({
	type: ADD_BLOCKTIME,
	data
});

export const deleteBlockTime = (data) => ({
	type: DELETE_BLOCKTIME,
	data
});
export const deleteBlockTimeSuccess = (data) => ({
	type: DELETE_BLOCKTIME_SUCCESSS,
	data
});
export const getBlockTime = (data) => ({
	type: GET_BLOCKTIME,
	data
});

export const getBlockTime_Success = (data) => ({
	type: GET_BLOCKTIME_SUCCESS,
	data
});

export const getAppointmentOffline = (data) => ({
	type: GET_APPOINTMENT_OFFLINE,
	data
});

export const getWaitingListOffline = (data) => ({
	type: GET_WAITINGLIST_OFFLINE,
	data
});
export const getStaffOffline = (data) => ({
	type: GET_STAFF_OFFLINE,
	data
});

export const getApppointmentById = (data) => ({
	type: GET_APP_BY_ID,
	data
});

export const getApppointmentByIdSuccess = (data) => ({
	type: GET_APP_BY_ID_SUCCESS,
	data
});

export const groupAppointment = (data) => ({
	type: GROUP_APPOINTMENT,
	data
});

export const updateAppointmentPaidOffline = (idAppointment) => ({
	type: UPDATE_APPOINTMENT_PAID_OFFLINE,
	idAppointment
});

export const getTimeStaffLogin = (staffId) => ({
	type: GET_TIME_STAFF_LOGIN,
	staffId
});

export const getTimeStaffLoginSuccess = (data) => ({
	type: GET_TIME_STAFF_LOGIN_SUCCESS,
	data
});

export const loadStaffSort = (staffSort) => ({
	type: LOAD_STAFF_SORT,
	staffSort
});

export const setSlideIndex = (slideIndex) => ({
	type: SET_SLIDE_INDEX,
	slideIndex
});

export function reloadStaff(payload) {
	return {
		type: RELOAD_STAFF,
		payload
	};
}
export function reloadCalendar(payload) {
	return {
		type: RELOAD_CALENDAR,
		payload
	};
}

export function editBlockTime(payload) {
	return {
		type: EDIT_BLOCKTIME,
		payload
	};
}

export function updateNote(payload) {
	return {
		type: UPDATE_NOTE,
		payload
	};
}

export function submitAddAppointment(payload) {
	return {
		type: SUBMIT_ADD_APPOINTMENT,
		payload
	};
}

export function changeAppointment(payload) {
	return {
		type: CHANGE_APPOINTMENT,
		payload
	};
}

export function sendLinkCustomer(payload) {
	return {
		type: SENDLINK_CUSTOMER,
		payload
	};
}


export function getDetailMerchant(payload) {
	return {
		type: GET_DETAIL_MERCHANT,
		payload
	};
}

export function setDetailMerchant(payload) {
	return {
		type: SET_DETAIL_MERCHANT,
		payload
	};
}

export function updateCompanion(payload) {
	return {
		type: UPDATE_COMPANION,
		payload
	};
}

export function loadingPopup(payload) {
	return {
		type: IS_LOADING_POPUP,
		payload
	};
}

export function searchPhoneCompanion(payload) {
	return {
		type: SEARCH_PHONE_COMPANION,
		payload
	};
}

export function setToday(payload) {
	return {
		type: SET_TODAY,
		payload
	};
}

export function updateStaffAppointmentPaid(payload) {
	return {
		type: 'UPDATE_STAFF_APPOINTMENT_PAID',
		payload
	};
}