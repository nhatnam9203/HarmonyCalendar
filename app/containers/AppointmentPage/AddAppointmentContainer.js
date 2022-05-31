import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';

import AddAppointment from 'components/AddAppointment';

import {
  makeAddingAppointment, makeCheckPhoneSuccess, makeCheckPhoneError,
  makeAddCustomerSuccess, makeTimeStaffID,
  makeInfoCheckPhone
} from './selectors';
import {
  closeAddingAppointment, checkPhoneNumberCustomer,
  addCustomer, checkPhoneNumberCustomerSuccess,
  checkPhoneNumberCustomerError, addCustomerSuccess,
  TimeAndStaffID,
  disableCalendar,
  infoCheckPhone,
} from './actions';



export function mapDispatchToProps(dispatch) {
  return {
    closeAddingAppointment: () => dispatch(closeAddingAppointment()),
    checkPhoneNumberCustomer: (phone) => dispatch(checkPhoneNumberCustomer(phone)),
    checkPhoneNumberCustomerSuccess: (phone) => dispatch(checkPhoneNumberCustomerSuccess(phone)),
    checkPhoneNumberCustomerError: (error) => dispatch(checkPhoneNumberCustomerError(error)),
    addCustomer: (customer) => dispatch(addCustomer(customer)),
    addCustomerSuccess: (status) => dispatch(addCustomerSuccess(status)),
    closeTimeAndStaffID: (data) => dispatch(TimeAndStaffID(data)),
    disableCalendar: (status) => dispatch(disableCalendar(status)),
    infoCheckPhone: (data) => dispatch(infoCheckPhone(data)),
  };
}

const mapStateToProps = createStructuredSelector({
  appointment: makeAddingAppointment(),
  checkPhoneSuccess: makeCheckPhoneSuccess(),
  checkPhoneError: makeCheckPhoneError(),
  StateAddCustomerSuccess: makeAddCustomerSuccess(),
  TimeAndStaffID: makeTimeStaffID(),
  InfoAfterCheckPhone: makeInfoCheckPhone(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  //
  withConnect,
)(AddAppointment);
