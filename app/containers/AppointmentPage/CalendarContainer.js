import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Calendar from 'components/Calendar';

import {
  loadWaitingAppointments,
  openAddingAppointment,
  updateCalendarInterval,
  updateWaitingAppointment,
  loadingCalendar,
  loadingWaiting,
  disableCalendar,
  deleteEventWaitingList,
  deleteWaitingAppointment,
  updateAppointmentOffline,
  addAppointmentRealTime,
  addAppointmentWaiting,
  updateAppointmentPaid,
  removeAppointmentWaiting,
  deleteAppointmentCalendar,
  updateStaff,
  loadMembers,
  loadAppointmentByMembers,
  updateNextStaff,
  updateConsumer,
  getApppointmentById,
  groupAppointment,
  membersLoaded,
  setDisplayedMembers,
  updateAppointmentPaidOffline,
  reloadStaff,
  reloadCalendar,
  deselectAppointment,
  selectAppointment,
  renderAppointment,
  getDetailMerchant,
  loadingPopup,
  getBlockTime,
  countNotificationUnread,
  scrollToAppointment,
  selectDay,
  countAppointmentAnyStaff,
} from './actions';
import {
  makeSelectWaitingAppointments,
  makeSelectWaitingIndexAppointments,
  makeCurrentDay,
  makeSelectCalendarAppointments,
  makeDisableCalendar,
  makeLoadCalendar,
  makeLoadWaiting,
  makeStatusDeleteWaiting,
  makeSlideIndex,
  makeLoadingPopup,
  makeMerchantInfo,
  makeToday
} from './selectors';

export function mapDispatchToProps(dispatch) {
  return {
    loadWaitingAppointments: day => dispatch(loadWaitingAppointments(day)),
    openAddingAppointment: app => dispatch(openAddingAppointment(app)),
    updateCalendarInterval: app => dispatch(updateCalendarInterval(app)),
    updateWaitingAppointment : appointment => dispatch(updateWaitingAppointment(appointment)),
    loadingCalendar: status=>dispatch(loadingCalendar(status)),
    loadingWaiting: status=>dispatch(loadingWaiting(status)),
    disable_Calendar: status=>dispatch(disableCalendar(status)),
    deleteEventWaitingList: appointment=>dispatch(deleteEventWaitingList(appointment)),
    deleteWaitingAppointment: status=>dispatch(deleteWaitingAppointment(status)),
    updateAppointmentOffline: data=>dispatch(updateAppointmentOffline(data)),
    addAppointmentRealTime: (app)=>dispatch(addAppointmentRealTime(app)),
    addAppointmentWaiting: (app)=>dispatch(addAppointmentWaiting(app)),
    updateAppointmentPaid: (app)=>dispatch(updateAppointmentPaid(app)),
    removeAppointmentWaiting: (app)=>dispatch(removeAppointmentWaiting(app)),
    deleteAppointmentCalendar: (app)=>dispatch(deleteAppointmentCalendar(app)),
    updateStaff: (staff)=>dispatch(updateStaff(staff)),
    loadMembers: ()=>dispatch(loadMembers()),
    reloadStaff: ()=>dispatch(reloadStaff()),
    reloadCalendar: (payload)=>dispatch(reloadCalendar(payload)),
    loadAppointmentByMembers :()=>dispatch(loadAppointmentByMembers()),
    updateNextStaff:(data)=>dispatch(updateNextStaff(data)),
    updateConsumer:(data)=>dispatch(updateConsumer(data)),
    groupIdAppointment:(idAppointment)=>dispatch(groupAppointment(idAppointment)),
    membersLoaded:(members)=>dispatch(membersLoaded(members)),
    setDisplayedMembers:(members)=>dispatch(setDisplayedMembers(members)),
    updateAppointmentPaidOffline:(idAppointment)=>dispatch(updateAppointmentPaidOffline(idAppointment)),
    deselectAppointment: () => dispatch(deselectAppointment()),
    selectAppointment : (appointment,fcEvent) => dispatch(selectAppointment(appointment,fcEvent)),
    renderAppointment: () => dispatch(renderAppointment()),
    getApppointmentById: (id) => dispatch(getApppointmentById(id)),
    getDetailMerchant : (data)=>dispatch(getDetailMerchant(data)),
    loadingPopup : (data)=>dispatch(loadingPopup(data)),
    getBlockTime : ()=>dispatch(getBlockTime()),
    countNotificationUnread: () => dispatch(countNotificationUnread()),
    scrollToAppointment: (appointmentId) => dispatch(scrollToAppointment(appointmentId)),
    onChangeDay: (day) => dispatch(selectDay(day)),
    countAppointmentAnyStaff : (payload) =>dispatch(countAppointmentAnyStaff(payload)),
  };
}

const mapStateToProps = createStructuredSelector({
  waitingAppointments: makeSelectWaitingAppointments(),
  currentDay: makeCurrentDay(),
  waitingIndex: makeSelectWaitingIndexAppointments(),
  calendarMembers: makeSelectCalendarAppointments(),
  disableCalendar : makeDisableCalendar(),
  isLoadWaiting : makeLoadWaiting(),
  isLoadCalendar : makeLoadCalendar(),
  StatusDeleteWaiting : makeStatusDeleteWaiting(),
  slideIndex : makeSlideIndex(),
  isLoadingPopup : makeLoadingPopup(),
  merchantInfo : makeMerchantInfo(),
  today : makeToday()
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  //
  withConnect,
)(Calendar);
