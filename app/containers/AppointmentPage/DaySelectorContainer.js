import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';

import DaySelector from 'components/DaySelector';

import {
	selectDay,
	selectWeek,
	selectDayOnCalendar,
	loadingCalendar,
	openAddingAppointment,
	disableCalendar,
	toggleSearchBox,
	countAppointmentAnyStaff,
	toggleInformation
} from './actions';
import { makeCurrentDay, makeCurrentWeekDays, makeMerchantInfo } from './selectors';

export function mapDispatchToProps(dispatch) {
	return {
		onChangeDay: (day) => dispatch(selectDay(day)),
		onChangeWeek: (dayOfWeek) => dispatch(selectWeek(dayOfWeek)),
		loadingCalendar: (status) => dispatch(loadingCalendar(status)),
		onChangeDayOnCalendar: (dayOfWeek) => dispatch(selectDayOnCalendar(dayOfWeek)),
		openAddingAppointment: (app) => dispatch(openAddingAppointment(app)),
		disable_Calendar: (status) => dispatch(disableCalendar(status)),
		toggleSearchBox: (isPopupSearchBox) => dispatch(toggleSearchBox(isPopupSearchBox)),
		countAppointmentAnyStaff : (payload) =>dispatch(countAppointmentAnyStaff(payload)),
		toggleInformation : (payload) =>dispatch(toggleInformation(payload)),

	};
}

const mapStateToProps = createStructuredSelector({
	currentDay: makeCurrentDay(),
	weekDays: makeCurrentWeekDays(),
	merchantInfo: makeMerchantInfo()
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
	//
	withConnect
)(DaySelector);
