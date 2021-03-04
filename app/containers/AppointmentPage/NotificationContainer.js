import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import Notification from 'components/Notification';

import {
    makeIsPopupNotification,
    makeNotifications,
} from './selectors';
import {
    toggleNotification,
    getNotification,
    readNotification,
    scrollToAppointment,
    selectDay,
} from './actions';

export function mapDispatchToProps(dispatch) {
    return {
        toggleNotification: (status) => dispatch(toggleNotification(status)),
        getNotification: (page) => dispatch(getNotification(page)),
        readNotification: (item) => dispatch(readNotification(item)),
        scrollToAppointment: (appointmentId) => dispatch(scrollToAppointment(appointmentId)),
        onChangeDay: (day) => dispatch(selectDay(day)),
    };
}

const mapStateToProps = createStructuredSelector({
    isPopupNotification : makeIsPopupNotification(),
    notifications : makeNotifications(),
});

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

export default compose(
    //
    withConnect,
)(Notification);
