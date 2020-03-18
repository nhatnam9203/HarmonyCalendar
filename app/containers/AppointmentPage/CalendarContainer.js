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
  loadAppointmentAgain,
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
  updateAppointmentPaidOffline
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
  makeSlideIndex
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
    loadAppointmentAgain: ()=>dispatch(loadAppointmentAgain()),
    addAppointmentRealTime: (app)=>dispatch(addAppointmentRealTime(app)),
    addAppointmentWaiting: (app)=>dispatch(addAppointmentWaiting(app)),
    updateAppointmentPaid: (app)=>dispatch(updateAppointmentPaid(app)),
    removeAppointmentWaiting: (app)=>dispatch(removeAppointmentWaiting(app)),
    deleteAppointmentCalendar: (app)=>dispatch(deleteAppointmentCalendar(app)),
    updateStaff: (staff)=>dispatch(updateStaff(staff)),
    loadMembers: ()=>dispatch(loadMembers()),
    loadAppointmentByMembers :()=>dispatch(loadAppointmentByMembers()),
    updateNextStaff:()=>dispatch(updateNextStaff()),
    updateConsumer:(data)=>dispatch(updateConsumer(data)),
    groupIdAppointment:(idAppointment)=>dispatch(groupAppointment(idAppointment)),
    membersLoaded:(members)=>dispatch(membersLoaded(members)),
    setDisplayedMembers:(members)=>dispatch(setDisplayedMembers(members)),
    updateAppointmentPaidOffline:(idAppointment)=>dispatch(updateAppointmentPaidOffline(idAppointment)),
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
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  //
  withConnect,
)(Calendar);
