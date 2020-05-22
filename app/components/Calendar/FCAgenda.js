import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import $ from 'jquery';


class FCAgenda extends React.Component {
  componentDidMount() {
    const { options } = this.props;
    $('#full-calendar').fullCalendar(options);
    $('.fc-now-indicator-arrow').html(moment().format('hh:mm A'));
    // setInterval(() => {
   
    // }, );
  }

  componentWillReceiveProps(nextProps){
    const {disableCalendar} = nextProps;
    if(disableCalendar === true){
      $('.fc-scroller').css('-webkit-overflow-scrolling','auto');
    }else{
      $('.fc-scroller').css('-webkit-overflow-scrolling:','touch');
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
