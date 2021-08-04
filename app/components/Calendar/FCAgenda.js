import React from 'react';
import moment from 'moment';
import $ from 'jquery';
import moment_tz from 'moment-timezone'

class FCAgenda extends React.Component {

  componentDidMount() {
    const { options } = this.props;
    $('#full-calendar').fullCalendar(options());
  }

  componentWillReceiveProps(nextProps) {
    const { disableCalendar, merchantInfo } = nextProps;

    if (this.props.merchantInfo !== merchantInfo) {
      const { timezone } = merchantInfo;

      let tz = timezone ? timezone.toString().substring(12) : null;
      let calendarOptions = $('#full-calendar').fullCalendar('getView').options;
      calendarOptions.now = tz ? moment_tz.tz(tz) : moment().local();

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

export default FCAgenda;
