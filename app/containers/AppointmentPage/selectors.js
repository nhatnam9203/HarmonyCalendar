/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const currentAppointment = (state) => state.get('appointment', initialState);

const makeCurrentWeekDays = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('currentWeekDays'));

const makeCurrentDay = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('currentDay'));

const makeSelectLoading = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('loading'));

const makeSelectError = () => createSelector(currentAppointment, (appointmentState) => appointmentState.get('error'));

const makeSelectMembers = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.getIn([ 'members', 'all' ]));

const makeSelectDisplayedMembers = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.getIn([ 'members', 'displayed' ]));

const makeSelectWaitingAppointments = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.getIn([ 'appointments', 'waiting' ]));

const makeSelectAllAppointments = () =>
	createSelector(currentAppointment, (appointmentState) =>
		appointmentState.getIn([ 'appointments', 'allAppointment' ])
	);

const makeSelectWaitingIndexAppointments = () =>
	createSelector(currentAppointment, (appointmentState) =>
		appointmentState.getIn([ 'appointments', 'waitingIndex' ])
	);

const makeSelectCalendarAppointments = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.getIn([ 'appointments', 'calendar' ]));

const makeSelectAppointment = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('selectedAppointment'));

const makeAddingAppointment = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('addingAppointment'));

const makeSelectFCEvent = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('selectedFCEvent'));

const makeCheckPhoneSuccess = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('checkPhoneNumber_success'));

const makeCheckPhoneError = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('checkPhoneNumber_error'));
const makeAddCustomerSuccess = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('addCustomer_success'));

const makeDisableCalendar = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('disable_Calendar'));

const makeLoadWaiting = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('isLoadingWaiting'));

const makeLoadCalendar = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('isLoadingCalendar'));

const makeTimeStaffID = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('time_staffId'));

const makeStatusDeleteWaiting = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('StatusDeleteWaiting'));

const makeInfoCheckPhone = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('info_after_check_phone'));

const makeSelectPinCode = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('PopupPincode'));

const makeSelectPinStaff = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('PinStaff'));

const makeSelectAppointmentDetail = () =>
	createSelector(currentAppointment, (appointmentState) =>
		appointmentState.getIn([ 'appointments', 'appointmentDetail' ])
	);

const makeSelectGroupAppointment = () =>
	createSelector(currentAppointment, (appointmentState) =>
		appointmentState.getIn([ 'appointments', 'groupAppointment' ])
	);

export {
	currentAppointment,
	makeCurrentDay,
	makeCurrentWeekDays,
	makeSelectLoading,
	makeSelectError,
	makeSelectMembers,
	makeSelectDisplayedMembers,
	makeSelectWaitingAppointments,
	makeSelectWaitingIndexAppointments,
	makeSelectCalendarAppointments,
	makeSelectAppointment,
	makeSelectFCEvent,
	makeAddingAppointment,
	makeCheckPhoneSuccess,
	makeCheckPhoneError,
	makeAddCustomerSuccess,
	makeDisableCalendar,
	makeLoadWaiting,
	makeLoadCalendar,
	makeTimeStaffID,
	makeStatusDeleteWaiting,
	makeInfoCheckPhone,
	makeSelectPinCode,
	makeSelectPinStaff,
	makeSelectAllAppointments,
	makeSelectAppointmentDetail,
	makeSelectGroupAppointment
};
