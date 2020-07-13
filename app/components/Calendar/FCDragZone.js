import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import $ from 'jquery';
import 'jquery-ui';
import moment from 'moment';
import ConfirmDeleteWaiting from './ConfirmDeleteWaiting'
import { formatPhone } from '../../utils/helper'
import call from '../../images/call.png'
import ButtonSplash from "./ButtonSplash"

const DragZoneWrapper = styled.div`
  height: calc(100vh - 4rem - 4rem - 4rem);
  position: relative;
`;

const EventWrapper = styled.div`
  background: #f4f4f5;
  border: 1px solid #ffffff;
  color: #333333;
  height : 110px;
  overflow : hidden;
  position : relative;
`;

const BtnClose = styled.div`
	position: absolute;
	right: 0.5rem;
	top: 0.25rem;
	line-height: 1;
	font-size: 2rem;
	color: #ffffff;
	cursor: pointer;
	& > img{
		width : 18px;
		height : 18px;
	}
`;


const PrevButton = styled.div`
  color: #3883bb;
  font-size: 2rem;
  line-height: 2rem;
  cursor: pointer;
  text-align: center;
  width: 100%;
  & > img{
    width: 19px;
    height: 19px;
    transform: rotate(180deg)
  }
`;

const NextButton = styled(PrevButton)`
  position: absolute;
  left: 0;
  bottom: 0;
  & > img{
    width: 19px;
    height: 19px;
    transform: rotate(360deg)
  }
`;



function handleDrag() {
  const eventInformation = $(this).data('event-information');
  var totalDuration = 0;
  eventInformation.options.forEach(el => {
    totalDuration += parseInt(el.duration);
  });
  eventInformation.extras.forEach(el => {
    totalDuration += parseInt(el.duration);
  });
  $(this).data('event', {
    data: eventInformation,
    color: '#00b4f7',
    stick: true,
    duration: totalDuration > 0 ? moment.utc().startOf('day').add({ minutes: totalDuration }).format('HH:mm') : moment.utc().startOf('day').add({ minutes: 15 }).format('HH:mm')
  });

  $(this).draggable({
    containment: 'document',
    helper: 'clone',
    appendTo: 'body',
    zIndex: 999,
    revert: true,
    revertDuration: 0,
  });
}

class FCDragZone extends React.PureComponent {
  state = {
    slideIndex: 0,
    slidesToShow: 4,
    event: ''
  };

  updateDimensions() {
    this.setState({
      slidesToShow:
        Math.round(($(window).height() - 64 * 3 - 36) / 127) || 1
    });
    setInterval(() => {
      $('#waiting-events > div').each(handleDrag);
    }, 500);
  }

  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    window.addEventListener('resize', () => this.updateDimensions());
  }

  componentWillUnmount() {
    // window.removeEventListener('resize', () => this.updateDimensions());
  }

  prevSlide() {
    const { slideIndex } = this.state;
    if (slideIndex > 0) {
      this.setState({
        slideIndex: slideIndex - 1,
      });
    }
  }

  nextSlide() {
    const { events } = this.props;
    const { slideIndex, slidesToShow } = this.state;
    if (slideIndex < Math.floor(events.length / slidesToShow)) {
      this.setState({
        slideIndex: slideIndex + 1,
      });
    }
  }

  deleteEventWaiting(event) {
    this.setState({ event });
    const { deleteWaitingAppointment } = this.props;
    deleteWaitingAppointment(true);
  }

  getActiveArrow() {

    let isActiveLeft = false, isActiveRight = false;
    let { slideIndex } = this.state;
    const { events } = this.props;
    const totalSlide = (events.length) / 4;

    if ((totalSlide) <= 1) {
      isActiveLeft = false;
      isActiveRight = false;
    }

    if (totalSlide > 1) {
      if (slideIndex > 0) {
        if (slideIndex < totalSlide) {
          if (totalSlide - slideIndex <= 1) {
            isActiveRight = false;
            isActiveLeft = true;
          } else {
            isActiveRight = true;
            isActiveLeft = true
          }
        }
      } else {
        isActiveLeft = false;
        isActiveRight = true;
      }
    }

    return {
      isActiveLeft, isActiveRight
    }
  }

  render() {
    const { events, StatusDeleteWaiting, deleteWaitingAppointment, deleteEventWaitingList } = this.props;
    const { slideIndex, slidesToShow } = this.state;
    const displayedEvents = events.sort(function (a, b) {
      var c = new Date(a.id);
      var d = new Date(b.id);
      return c - d;
    }).slice(
      slideIndex * slidesToShow,
      slideIndex * slidesToShow + slidesToShow,
    );

    const isActiveLeft = this.getActiveArrow().isActiveLeft;
    const isActiveRight = this.getActiveArrow().isActiveRight;

    return (
      <React.Fragment>
        <DragZoneWrapper>
          {/* Prev Button  */}
          {isActiveLeft &&
            <ButtonSplash isTop onClick={() => this.prevSlide()} />
          }
          {!isActiveLeft &&
            <PrevButton onClick={() => { }}>
              <img src={require('../../images/down-arrow-2.png')} />
            </PrevButton>
          }

          {/* Next Button */}
          {isActiveRight &&
            <ButtonSplash onClick={() => this.nextSlide()} />
          }
          {!isActiveRight &&
            <NextButton onClick={() => { }}>
              <img src={require('../../images/down-arrow-2.png')} />
            </NextButton>
          }

          <div id="waiting-events">
            {displayedEvents.map((event) => (
              <EventWrapper
                className="app-event"
                key={event.id}
                data-event-information={JSON.stringify(event)}
              >
                <BtnClose onClick={() => this.deleteEventWaiting(event)}>
                  <img src={require("../../images/close_black.png")} />
                </BtnClose>

                <div className="app-event__id-number2">{event.code}</div>
                <div className="app-event__full-name">{event.firstName}</div>
                <div className="app-event__phone-number4">
                  <img className='icon-phone3' src={call} width='15' height='15' />
                  {` ${formatPhone(event.phoneNumber)}`}</div>
                {event.options.map((option, index) => (
                  <div className="app-event__option" key={index}>
                    - {option.serviceName}
                  </div>
                ))}
              </EventWrapper>
            ))}
          </div>
        </DragZoneWrapper>
        <ConfirmDeleteWaiting StatusDeleteWaiting={StatusDeleteWaiting} event={this.state.event} deleteEventWaitingList={deleteEventWaitingList} deleteWaitingAppointment={deleteWaitingAppointment} />
      </React.Fragment>
    );
  }
}

FCDragZone.propTypes = {
  events: PropTypes.any,
};

export default FCDragZone;
