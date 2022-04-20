/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const currentAppointment = (state) => state.get('appointment', initialState);

const makeCurrentWeekDays = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('currentWeekDays'));

const makeMerchantInfo = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('merchantInfo'));

const makeCurrentDay = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('currentDay'));

const makeSelectLoading = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('loading'));

const makeSelectError = () => createSelector(currentAppointment, (appointmentState) => appointmentState.get('error'));

const makeSelectMembers = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.getIn(['members', 'all']));

const makeSelectDisplayedMembers = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.getIn(['members', 'displayed']));

const makeSelectStaffSort = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.getIn(['members', 'staffSort']));

const makeSelectWaitingAppointments = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.getIn(['appointments', 'waiting']));

const makeSelectAllAppointments = () =>
	createSelector(currentAppointment, (appointmentState) =>
		appointmentState.getIn(['appointments', 'allAppointment'])
	);

const makeSelectWaitingIndexAppointments = () =>
	createSelector(currentAppointment, (appointmentState) =>
		appointmentState.getIn(['appointments', 'waitingIndex'])
	);

const makeSelectCalendarAppointments = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.getIn(['appointments', 'calendar']));

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
		appointmentState.getIn(['appointments', 'appointmentDetail'])
	);

const makeSelectGroupAppointment = () =>
	createSelector(currentAppointment, (appointmentState) =>
		appointmentState.getIn(['appointments', 'groupAppointment'])
	);

const makeSlideIndex = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('slideIndex'));

const makeLoadingPopup = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('isLoadingPopup'));

const makeToday = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('today'));

const makeSearchBox = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('isPopupSearchBox'));

const makeAppointmentSearchBox = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('appointmentSearchBox'));

const makeAppointmentScroll = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('appointmentScroll'));

const makeIsScrollToAppointment = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('isScrollToAppointment'));

const makeIsPopupNotification = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('isPopupNotification'));

const makeCountNotificationUnread = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('notificationUnreadQuantity'));

createSelector(currentAppointment, (appointmentState) => appointmentState.get('isPopupNotification'));

const makeNotifications = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('notifications'));

const makeQtyResource = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('qtyResource'));

const makeResourceWidth = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('resourceWidth'));

const makeAppointmentAnyStaff = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('appointmentAnyStaff'));

const makeAssignAnyStaffToStaff = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('isAssignAnyStaffToStaff'));

const makeFirstReload = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('isFirstLoadCalendar'));

const makeBlockTime = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.getIn(['members', 'blockTime']));

const makeVisibleCarousel = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('isVisibleCarousel'));

const makePopupInformation = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('isPopupInformation'));

const makeInvoiceDetail = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('invoiceDetail'));

	const makeLoadingInvoice = () =>
	createSelector(currentAppointment, (appointmentState) => appointmentState.get('isLoadingInvoice'));

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
	makeSelectGroupAppointment,
	makeSelectStaffSort,
	makeSlideIndex,
	makeMerchantInfo,
	makeLoadingPopup,
	makeToday,
	makeSearchBox,
	makeAppointmentSearchBox,
	makeAppointmentScroll,
	makeIsScrollToAppointment,
	makeIsPopupNotification,
	makeCountNotificationUnread,
	makeNotifications,
	makeQtyResource,
	makeAppointmentAnyStaff,
	makeResourceWidth,
	makeAssignAnyStaffToStaff,
	makeFirstReload,
	makeBlockTime,
	makeVisibleCarousel,
	makePopupInformation,
	makeInvoiceDetail,
	makeLoadingInvoice
};
