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
  makeSelectPinStaff
} from './selectors';
import {
  selectDayOnCalendar,
  loadMembers,
  setDisplayedMembers,
  togglePopupPincode,
  checkPinCode,
  disableCalendar
} from './actions';

export function mapDispatchToProps(dispatch) {
  return {
    onChangeToday: day => dispatch(selectDayOnCalendar(day)),
    loadMembers: options => dispatch(loadMembers(options)),
    setDisplayedMembers: members => dispatch(setDisplayedMembers(members)),
    togglePopupPincode: (status,pincode) => dispatch(togglePopupPincode(status,pincode)),
    checkPinCode: pincode => dispatch(checkPinCode(pincode)),
    disableCalendar: status => dispatch(disableCalendar(status)),
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
