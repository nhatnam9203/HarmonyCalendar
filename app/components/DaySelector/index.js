import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import SearchButton from './SearchButton';
import ButtonCheckIn from './ButtonCheckIn';
import DaySlider from './DaySlider';
import InformationButton from "./InformationButton";

const DaySelectorWrapper = styled.div`
  width: 100%;
  height: 4.4rem;
  border-left: 2px solid #3883bb;
  border-right: 2px solid #3883bb;
  border-bottom: 2px solid #3883bb;
  display: flex;
  -webkit-user-select: none; 
  -moz-user-select: none; 
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
  touch-action: manipulation;
  @media (min-width: 1025px) {
      height : 5rem;
	  }
`;

const Text = styled.div`
    font-size : 1.3rem;
    color : #3168B1;
    font-weight : 600;
    cursor : pointer;
    margin-left : 1rem;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items : center;
`;

class DaySelector extends React.Component {
  constructor(props) {
    super(props);
    const startOfWeek = moment().startOf('isoWeek');
    const endOfWeek = moment().endOf('isoWeek');

    this.days = [];
    let day = startOfWeek;

    while (day <= endOfWeek) {
      this.days.push(day);
      day = day.clone().add(1, 'd');
    }
  }

  openPopupAddAppointment = () => {
    this.props.openAddingAppointment({});
    this.props.disable_Calendar(true);
  }

  openPopupAppointmentCancels = () => {
    this.props.togglePopupAppointmentCancel(true);
    this.props.loadAppointmentsCancelled();
  };


  render() {
    const {
      currentDay,
      weekDays,
      onChangeDay,
      onChangeWeek,
      onChangeDayOnCalendar,
      loadingCalendar,
      merchantInfo,
      toggleSearchBox,
      countAppointmentAnyStaff,
      toggleInformation
    } = this.props;
    return (
      <DaySelectorWrapper>
        <LeftContainer>
          <SearchButton
            selectedDay={currentDay}
            onChangeDay={onChangeDayOnCalendar}
            onPress={() => toggleSearchBox(true)}
          />
          <InformationButton onPress={() => toggleInformation(true)} />
          <Text onClick={this.openPopupAppointmentCancels}>
            Show all
          </Text>
        </LeftContainer>
        <DaySlider
          days={weekDays.valueSeq().toArray()}
          selectedDay={currentDay}
          onChangeDay={onChangeDay}
          onChangeWeek={onChangeWeek}
          loadingCalendar={loadingCalendar}
          merchantInfo={merchantInfo}
          countAppointmentAnyStaff={countAppointmentAnyStaff}
        />
        <ButtonCheckIn onPress={() => this.openPopupAddAppointment()} />
      </DaySelectorWrapper>
    );
  }
}

DaySelector.propTypes = {
  currentDay: PropTypes.object,
  weekDays: PropTypes.object,
  onChangeDay: PropTypes.func,
  onChangeWeek: PropTypes.func,
  onChangeDayOnCalendar: PropTypes.func,
};

export default DaySelector;
