import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Carousel from 'nuka-carousel';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import SplashButton from '../ResourceSelector/SplashButton'

const DateSliderWrapper = styled.div`
    width: calc(100% - 5.05rem);
    position: relative;
    height : 4rem !important;
`;

const CarouselItem = styled.div`
    display: flex;
    flex : 1;
`;

const NormalDay = styled.div`
    flex: 1;
    border-right: 1px solid #3883bb;
    text-align: center;
    padding: 0.5rem;
    overflow: hidden;
    height : 4rem ;
    padding-top : 0.6rem;
    font-size : 0.9rem;
    line-height : 1.5;
    &:last-child {
      border-right: none;
    }

    & div {
      white-space: normal;
      text-overflow: ellipsis;
      overflow: hidden;
    }
`;

const ActiveDay = styled(NormalDay)`
    background: #0071c5;
    color: #ffffff;
`;

const TodayDay = styled(NormalDay)`
    background: #00e260;
    color: #ffffff;
`;

class DaySlider extends React.Component {

  constructor() {
    super();
    this.state = {
      currentSlide: 0
    }
  }

  onPrevClick(event, previousSlide) {
    previousSlide(event);
  }

  onNextClick(event, nextSlide) {
    nextSlide(event);
  }

  onDayClick(day) {

    const { onChangeDay , loadingCalendar} = this.props;
    onChangeDay(day.format('DDMMYYYY'));
    loadingCalendar(true);
  }

  renderDay(day) {
    return (
      <>
        <div>{day.format('dddd')}</div>
        <div>{day.format('MM/DD/YYYY')}</div>
      </>
    );
  }

  afterSlide(index) {
    const { days, onChangeWeek } = this.props;
    const { currentSlide } = this.state;
    if (
      (currentSlide === 0 && index === 1)
      || (currentSlide === 1 && index === 2)
      ||
      (currentSlide === 2 && index === 0)
    ) {
      onChangeWeek(days[0].add(1, 'w').format('DDMMYYYY'));
    }
    if (
      (currentSlide === 1 && index === 0)
      || (currentSlide === 0 && index === 2)
      ||
      (currentSlide === 2 && index === 1)
    ) {
      onChangeWeek(days[0].subtract(1, 'w').format('DDMMYYYY'));
    }
    this.setState({ currentSlide: index })
  }

  renderItems(day, index) {
    const { selectedDay } = this.props;
    if (day.format('DDMMYYYY') === selectedDay.format('DDMMYYYY')) {
      return (
        <ActiveDay key={index} onClick={() => this.onDayClick(day)}>
          {this.renderDay(day)}
        </ActiveDay>
      );
    }
    if (day.format('DDMMYYYY') === moment().format('DDMMYYYY')) {
      return (
        <TodayDay key={index} onClick={() => this.onDayClick(day)}>
          {this.renderDay(day)}
        </TodayDay>
      );
    }
    return (
      <NormalDay key={index} onClick={() => this.onDayClick(day)}>
        {this.renderDay(day)}
      </NormalDay>
    );
  }

  render() {
    const { days } = this.props;
    return (
      <DateSliderWrapper>
        <Carousel
          wrapAround
          dragging={true}
          renderBottomCenterControls={() => ''}
          renderCenterLeftControls={({ previousSlide }) => (
            <SplashButton onClick={ev => this.onPrevClick(ev, previousSlide)}>
              <FaCaretLeft />
            </SplashButton>
          )}
          renderCenterRightControls={({ nextSlide }) => (
            <SplashButton onClick={ev => this.onNextClick(ev, nextSlide)}>
              <FaCaretRight />
            </SplashButton>
          )}
          afterSlide={slideIndex => this.afterSlide(slideIndex)}
        >
          <CarouselItem>
            {days.map((day, index) => this.renderItems(day, index))}
          </CarouselItem>
          <CarouselItem>
            {days.map((day, index) => this.renderItems(day, index))}
          </CarouselItem>
          <CarouselItem>
            {days.map((day, index) => this.renderItems(day, index))}
          </CarouselItem>
        </Carousel>
      </DateSliderWrapper>
    );
  }
}

DaySlider.propTypes = {
  selectedDay: PropTypes.object,
  days: PropTypes.array,
  onChangeDay: PropTypes.func,
  onChangeWeek: PropTypes.func,
};

export default DaySlider;
