import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import OutsideClickHandler from 'react-outside-click-handler';

const MiniCalendarWrapper = styled.div`
  width: calc(5.05rem - 1px);
  height: 100%;
  display : flex;
  text-align : center;
  justify-content : center;
  align-items: center;
  border-right: 1px solid #3883bb;
  position: relative;
  padding: 0.5rem;
`;

MiniCalendarWrapper.Button = styled.div`
  border-radius: 4px;
  background: #1366AE;
  color: #ffffff;
  width: 100%;
  font-size: 1.5rem;
  line-height: 1.5;
  /* height: 100%; */
  height : 3rem;
  cursor: pointer;
  display : flex;
  justify-content : center;
  align-items : center;
`;

const CalendarPopup = styled.div`
  top: 0;
  left: 0;
  position: absolute;
  transform: translate3d(0.5rem, calc(-18rem + 0.5rem), 0px);
  will-change: transform;
  z-index: 1;
  background: #fff;
  color: #000;
  height: 18rem;
  line-height: 1;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

CalendarPopup.Heading = styled.div`
  background: #1366AE;
  color: #ffffff;
  height: 3rem;
  font-size: 1.5rem;
  line-height: 2; 
`;

CalendarPopup.Body = styled.div``;

const BtnClose = styled.div`
	position: absolute;
	right: 0.5rem;
	top: 0.3rem;
	line-height: 1;
	font-size: 2rem;
	color: #ffffff;
	cursor: pointer;
	& > img{
		width : 27px;
		height : 27px;
	}
`;



class MiniCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPopupOpen: false,
    };
  }

  onClickButton() {
    const { isPopupOpen } = this.state;
    this.setState({
      isPopupOpen: !isPopupOpen,
    });
  }

  onOutsideClickPopup() {
    this.setState({
      isPopupOpen: false,
    });
  }

  onDaySelected(day) {
    const { onChangeDay } = this.props;
    onChangeDay(moment(new Date(day)).format('DDMMYYYY'));
  }

  renderPopup() {
    const { selectedDay } = this.props;
    const { isPopupOpen } = this.state;
    return isPopupOpen ? (
      <CalendarPopup>
        <CalendarPopup.Heading>
          Calendar
          <BtnClose onClick={() => this.onOutsideClickPopup()}>
            {<img src={require("../../images/close_white.png")} />}
          </BtnClose>
        </CalendarPopup.Heading>
        <CalendarPopup.Body>
          <DayPicker
            firstDayOfWeek={1}
            selectedDays={[selectedDay.toDate()]}
            onDayClick={day => this.onDaySelected(day)}
          />
        </CalendarPopup.Body>
      </CalendarPopup>
    ) : (
        ''
      );
  }

  render() {
    return (
      <OutsideClickHandler onOutsideClick={() => this.onOutsideClickPopup()}>
        <Helmet>
          <style>{`
            .DayPicker-Day--today {
              color: #00e260;
            }
          `}</style>
        </Helmet>
        <MiniCalendarWrapper>
          <MiniCalendarWrapper.Button onClick={() => this.onClickButton()}>
            {/* <FaCalendarAlt /> */}
            <img style={{ width: 25, height: 25 }} src={require('../../images/calendar.png')} />
          </MiniCalendarWrapper.Button>
          {this.renderPopup()}
        </MiniCalendarWrapper>
      </OutsideClickHandler>
    );
  }
}

MiniCalendar.propTypes = {
  selectedDay: PropTypes.object,
  onChangeDay: PropTypes.func,
};

export default MiniCalendar;
