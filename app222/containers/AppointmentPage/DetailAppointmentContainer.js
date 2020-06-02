import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';

import DetailAppointment from 'components/DetailAppointment';

import {
	makeSelectAppointment,
	makeCurrentDay,
	makeSelectMembers,
	makeSelectAppointmentDetail,
	makeSelectGroupAppointment
} from './selectors';
import {
	cancelAppointment,
	deselectAppointment,
	updateStatusAppointment,
	updateAppointment,
	disableCalendar,
	changeAppointmentTime,
	getApppointmentById,
	groupAppointment,
	checkOut,
} from './actions';

export function mapDispatchToProps(dispatch) {
	return {
		deselectAppointment: () => dispatch(deselectAppointment()),
		cancelAppointment: (id) => dispatch(cancelAppointment(id)),
		nextStatus: (id, services) => dispatch(updateStatusAppointment(id, services)),
		updateAppointment: (appointment) => {
			dispatch(updateAppointment(appointment));
		},
		disableCalendar: (status) => dispatch(disableCalendar(status)),
		changeAppointmentTime: (appointment) => dispatch(changeAppointmentTime(appointment)),
		groupIdAppointment: (idAppointment) => dispatch(groupAppointment(idAppointment)),
		checkOut: (data) => dispatch(checkOut(data)),
	};
}

const mapStateToProps = createStructuredSelector({
	appointment: makeSelectAppointment(),
	currentDay: makeCurrentDay(),
	staffList: makeSelectMembers(),
	appointmentDetail: makeSelectAppointmentDetail(),
	groupAppointment: makeSelectGroupAppointment(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
	//
	withConnect
)(DetailAppointment);
