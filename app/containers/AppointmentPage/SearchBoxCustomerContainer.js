import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import SearchBoxCustomer from 'components/SearchBoxCustomer';

import {
    makeSearchBox,
    makeAppointmentSearchBox,
} from './selectors';
import {
    toggleSearchBox,
    searchCustomerBox,
    selectDay,
    scrollToAppointment,
} from './actions';

export function mapDispatchToProps(dispatch) {
  return {
    toggleSearchBox : (isPopupSearchBox) => dispatch(toggleSearchBox(isPopupSearchBox)),
    searchCustomerBox : (data) => dispatch(searchCustomerBox(data)),
    onChangeDay: (day) => dispatch(selectDay(day)),
    scrollToAppointment: (app) => dispatch(scrollToAppointment(app)),
  };
}

const mapStateToProps = createStructuredSelector({
    isPopupSearchBox : makeSearchBox(),
    appointmentSearchBox : makeAppointmentSearchBox(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  //
  withConnect,
)(SearchBoxCustomer);
