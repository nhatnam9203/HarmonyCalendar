import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import $ from 'jquery';
import moment_tz from 'moment-timezone'

class FCAgenda extends React.Component {

  // componentWillMount(){
  //   moment_tz.tz.setDefault()
  // }

  componentDidMount() {
    const { options, merchantInfo } = this.props;
    $('#full-calendar').fullCalendar(options());
    $('.fc-now-indicator-arrow').html(moment().format('hh:mm A'));
  }

  componentWillReceiveProps(nextProps) {
    const { disableCalendar, merchantInfo } = nextProps;
    if (this.props.merchantInfo !== merchantInfo) {
      const { timezone } = merchantInfo;
      let tz = timezone ? timezone.toString().substring(12) : null;
      let calendarOptions = $('#full-calendar').fullCalendar('getView').options;
      calendarOptions.now = moment_tz.tz(tz);
      $('#full-calendar').fullCalendar('destroy');
      $('#full-calendar').fullCalendar(calendarOptions);
      $('#full-calendar').fullCalendar('render');
    }
    if (disableCalendar === true) {
      $('.fc-scroller').css('-webkit-overflow-scrolling', 'auto');
    } else {
      $('.fc-scroller').css('-webkit-overflow-scrolling:', 'touch');
    }
  }

  render() {
    return <div id="full-calendar" />;
  }
}

FCAgenda.propTypes = {
  // options: PropTypes.object,
};

export default FCAgenda;
