import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import SearchButton from './SearchButton';
import ButtonCheckIn from './ButtonCheckIn';
import DaySlider from './DaySlider';

const DaySelectorWrapper = styled.div`
  width: 100%;
  height: 4.4rem;
  border-left: 2px solid #3883bb;
  border-right: 2px solid #3883bb;
  border-bottom: 2px solid #3883bb;
  display: flex;
  @media (min-width: 1025px) {
      height : 5rem;
	  }
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

  openPopupAddAppointment = () =>{
    this.props.openAddingAppointment({});
    this.props.disable_Calendar(true);  }

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
    } = this.props;
    return (
      <DaySelectorWrapper>
        <SearchButton
          selectedDay={currentDay}
          onChangeDay={onChangeDayOnCalendar}
          onPress={()=>toggleSearchBox(true)}
        />
        <DaySlider
          days={weekDays.valueSeq().toArray()}
          selectedDay={currentDay}
          onChangeDay={onChangeDay}
          onChangeWeek={onChangeWeek}
          loadingCalendar={loadingCalendar}
          merchantInfo={merchantInfo}
        /> 
        <ButtonCheckIn onPress={()=>this.openPopupAddAppointment()} />
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
