import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import AppointmentCancel from 'components/AppointmentCancel';

import {
    makeIsPopupAppointmentCancel,
    makeAppointmentsCancelled,
    makeIsLoadingAppointmentCanel,
} from './selectors';
import {
    togglePopupAppointmentCancel,
    loadWaitingAppointments,
    getBlockTime,
} from './actions';

export function mapDispatchToProps(dispatch) {
  return {
    togglePopupAppointmentCancel : (status) => dispatch(togglePopupAppointmentCancel(status)),
    loadWaitingAppointments: () => dispatch(loadWaitingAppointments()),
    getBlockTime: () => dispatch(getBlockTime()),
  };
}

const mapStateToProps = createStructuredSelector({
	isPopupAppointmentCancel : makeIsPopupAppointmentCancel(),
  appointmentsCancelled : makeAppointmentsCancelled(),
  isLoadingAppointmentCanel : makeIsLoadingAppointmentCanel(),
  
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  //
  withConnect,
)(AppointmentCancel);
