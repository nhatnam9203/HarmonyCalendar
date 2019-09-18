import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import $ from 'jquery';


class FCAgenda extends React.Component {
  componentDidMount() {
    const { options } = this.props;
    $('#full-calendar').fullCalendar(options);
    setInterval(() => {
      $('.fc-now-indicator-arrow').html(moment().format('HH:mm'));
    }, 500);
  }

  componentWillReceiveProps(nextProps){
    const {disableCalendar} = nextProps;
    if(disableCalendar === true){
      $('.fc-scroller').css('height','auto');
    }else{
      $('.fc-scroller').css('height','1000px');
    }
  }




  render() {
    const { disableCalendar } = this.props;
    return <div id="full-calendar" />;
  }
}

FCAgenda.propTypes = {
  options: PropTypes.object,
};

export default FCAgenda;
