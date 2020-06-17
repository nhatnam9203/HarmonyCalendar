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
  editBlockTime
} from './actions';

export function mapDispatchToProps(dispatch) {
  return {
    onChangeToday: day => dispatch(selectDayOnCalendar(day)),
    loadMembers: options => dispatch(loadMembers(options)),
    setDisplayedMembers: members => dispatch(setDisplayedMembers(members)),
    togglePopupPincode: (status,pincode) => dispatch(togglePopupPincode(status,pincode)),
    checkPinCode: pincode => dispatch(checkPinCode(pincode)),
    disableCalendar: status => dispatch(disableCalendar(status)),
    renderAppointment: () => dispatch(renderAppointment()),
    SubmitEditBlockTime:(data)=>dispatch(SubmitEditBlockTime(data)),
    deleteBlockTime:(data)=>dispatch(deleteBlockTime(data)),
    getTimeStaffLogin:(staffId)=>dispatch(getTimeStaffLogin(staffId)),
    setSlideIndex:(slideIndex)=>dispatch(setSlideIndex(slideIndex)),
    editBlockTime:(data)=>dispatch(editBlockTime(data)),
  };
}

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  resources: makeSelectMembers(),
  calendarMembers: makeSelectCalendarAppointments(),
  currentDay : makeCurrentDay(),
  popupPincode : makeSelectPinCode(),
  PinStaff : makeSelectPinStaff(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  //
  withConnect,
)(ResourceSelector);
