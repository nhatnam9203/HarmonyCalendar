import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import ResourceSelector from 'components/ResourceSelector';

import {
  makeSelectLoading,
  makeSelectError,
  makeSelectMembers,
  makeSelectCalendarAppointments,
  makeCurrentDay,
  makeSelectPinCode,
  makeSelectPinStaff,
  makeSlideIndex,
  makeMerchantInfo,
  makeSelectAllAppointments,
  makeAppointmentScroll,
  makeIsScrollToAppointment,
  makeCountNotificationUnread,
  makeResourceWidth,
  makeQtyResource,
  makeAssignAnyStaffToStaff,
  makeFirstReload,
  makeBlockTime,
  makeVisibleCarousel,
} from './selectors';

import {
  selectDayOnCalendar,
  loadMembers,
  setDisplayedMembers,
  togglePopupPincode,
  checkPinCode,
  disableCalendar,
  renderAppointment,
  SubmitEditBlockTime,
  deleteBlockTime,
  getTimeStaffLogin,
  setSlideIndex,
  editBlockTime,
  getDetailMerchant,
  scrollToAppointment,
  startScrollToAppointment,
  toggleNotification,
  countNotificationUnread,
  getNotification,
  getApppointmentById,
  countAppointmentAnyStaff,
  getAppointmentAnyStaff,
  anystaffAssignStaff,
  loadingCalendar
} from './actions';

export function mapDispatchToProps(dispatch) {
  return {
    onChangeToday: day => dispatch(selectDayOnCalendar(day)),
    loadMembers: options => dispatch(loadMembers(options)),
    setDisplayedMembers: members => dispatch(setDisplayedMembers(members)),
    togglePopupPincode: (status, pincode) => dispatch(togglePopupPincode(status, pincode)),
    checkPinCode: pincode => dispatch(checkPinCode(pincode)),
    disableCalendar: status => dispatch(disableCalendar(status)),
    renderAppointment: () => dispatch(renderAppointment()),
    SubmitEditBlockTime: (data) => dispatch(SubmitEditBlockTime(data)),
    deleteBlockTime: (data) => dispatch(deleteBlockTime(data)),
    getTimeStaffLogin: (staffId) => dispatch(getTimeStaffLogin(staffId)),
    setSlideIndex: (slideIndex) => dispatch(setSlideIndex(slideIndex)),
    editBlockTime: (data) => dispatch(editBlockTime(data)),
    getDetailMerchant: (data) => dispatch(getDetailMerchant(data)),
    scrollToAppointment: (app) => dispatch(scrollToAppointment(app)),
    startScrollToAppointment: (status) => dispatch(startScrollToAppointment(status)),
    toggleNotification: (status) => dispatch(toggleNotification(status)),
    countNotificationUnread: () => dispatch(countNotificationUnread()),
    getNotification: (page) => dispatch(getNotification(page)),
    getApppointmentById : (appointment) =>dispatch(getApppointmentById(appointment)),
    countAppointmentAnyStaff : (payload) =>dispatch(countAppointmentAnyStaff(payload)),
    getAppointmentAnyStaff : (payload) =>dispatch(getAppointmentAnyStaff(payload)),
    anystaffAssignStaff : (payload) =>dispatch(anystaffAssignStaff(payload)),
    loadingCalendar : (payload) =>dispatch(loadingCalendar(payload)),
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  resources: makeSelectMembers(),
  calendarMembers: makeSelectCalendarAppointments(),
  currentDay: makeCurrentDay(),
  popupPincode: makeSelectPinCode(),
  PinStaff: makeSelectPinStaff(),
  slideIndex: makeSlideIndex(),
  merchantInfo: makeMerchantInfo(),
  allAppointment: makeSelectAllAppointments(),
  appointmentScroll: makeAppointmentScroll(),
  isScrollToAppointment: makeIsScrollToAppointment(),
  notificationUnreadQuantity : makeCountNotificationUnread(),
  resourceWidth : makeResourceWidth(),
  qtyResources : makeQtyResource(),
  isAssignAnyStaffToStaff : makeAssignAnyStaffToStaff(),
  isFirstReloadCalendar : makeFirstReload(),
  blockTimes: makeBlockTime(),
  isCarousel : makeVisibleCarousel(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  //
  withConnect,
)(ResourceSelector);
