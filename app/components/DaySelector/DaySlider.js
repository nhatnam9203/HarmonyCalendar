import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import OutsideClickHandler from 'react-outside-click-handler';
import leftButton from '../../images/leftButton.png'
import rightButton from '../../images/rightButton.png'

const DateSliderWrapper = styled.div`
    display : flex;
    flex-direction : row;
    flex : 6;
    position: relative;
    height : 4.4rem !important;
    justify-content : center;
    align-items: center;
    position : relative;
    @media (min-width: 1025px) {
      height : 5rem !important;
	  }
`;

const WrapDaySlider = styled.div`
    display: flex;
    justify-content : center;
    align-items: center;
`;

const Picker = styled.div`
    width : 18rem;
    height : 3rem !important;
    border : 1px solid #dddddd;
    border-right-width : 0px;
    border-left-width : 0px;
    display: flex;
    justify-content : center;
    align-items : center;
    color : #1B68AC;
    font-weight : 600;
    @media (min-width: 1025px) {
      height : 3.8rem !important;
	  }
`;
Picker.Button = styled.div`
      width : 4.6rem;
      height : 3rem !important;
      display: flex;
      justify-content : center;
      align-items : center;
      border : 1px solid #dddddd;
      @media (min-width: 1025px) {
        height : 3.8rem !important;
      }
      & > img {
        width : 30px;
        height : 30px;
      }
  `;

const CalendarPopup = styled.div`
    top: -6.3rem;
    left: calc(100%/2 - 11.5rem);
    position: absolute;
    transform: translate3d(0.5rem, calc(-18rem + 0.5rem), 0px);
    will-change: transform;
    z-index: 1;
    background: #fff;
    color: #000;
    line-height: 1;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
  `;

CalendarPopup.Heading = styled.div`
    background: #1366AE;
    color: #ffffff;
    height: 3.5rem;
    font-size: 1.7rem;
    padding-top: 3px;
    line-height: 2; 
    padding-left : 1rem;
  `;

CalendarPopup.Body = styled.div``;


const BtnClose = styled.div`
	position: absolute;
	right: 0.5rem;
	top: 0.7rem;
	line-height: 1;
	font-size: 2rem;
	color: #ffffff;
	cursor: pointer;
	& > img{
		width : 35px;
		height : 35px;
	}
`;

class DaySlider extends React.Component {

  constructor() {
    super();
    this.state = {
      isPopupOpen: false,
    }
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

  changeDay(type) {
    const { selectedDay } = this.props;
    let day = selectedDay;

    switch (type) {
      case 'plus':
        day = moment(selectedDay).add('days', 1).format('DDMMYYYY');
        break;

      case 'minus':
        day = moment(selectedDay).subtract('days', 1).format('DDMMYYYY');
        break;
      default:
        break;
    }
    this.props.loadingCalendar(true);
    this.props.countAppointmentAnyStaff({
      date: moment(day, ['DDMMYYYY']).format('YYYY-MM-DD'),
      isDayClick: true,
      isReloadCalendar: true,
    });
    this.props.onChangeDay(day);
  }

  onDaySelected(day) {
    this.props.loadingCalendar(true);
    this.props.countAppointmentAnyStaff({
      date: moment(day).format('YYYY-MM-DD'),
      isDayClick: true,
      isReloadCalendar: true,
    });
    this.onOutsideClickPopup();
    // this.props.countAppointmentAnyStaff({ date: moment(day).format('YYYY-MM-DD'), isDayClick: true, isReloadCalendar: true })
    // this.props.onChangeDay(moment(new Date(day)).format('DDMMYYYY'));
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
    const { selectedDay } = this.props;
    return (
      <DateSliderWrapper>
        <WrapDaySlider >
          <Picker.Button
            onClick={() => this.changeDay('minus')}
            style={{ borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}
          >
            <img src={leftButton} />
          </Picker.Button>
          <Picker onClick={() => this.onClickButton()}>
            {selectedDay ? moment(selectedDay).format('MMMM dddd DD, YYYY') : ''}
          </Picker>
          <Picker.Button
            onClick={() => this.changeDay('plus')}
            style={{ borderTopRightRadius: 8, borderBottomRightRadius: 8 }}
          >
            <img src={rightButton} />
          </Picker.Button>
        </WrapDaySlider>

        <OutsideClickHandler onOutsideClick={() => this.onOutsideClickPopup()}>
          {this.renderPopup()}
        </OutsideClickHandler>
      </DateSliderWrapper>
    );
  }
}

export default DaySlider;
