import React from 'react';
import moment from 'moment';
import moment_tz from 'moment'
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Carousel from 'nuka-carousel';
import ButtonSplash from "./ButtonPlash";

const DateSliderWrapper = styled.div`
    width: calc(100% - 5.05rem);
    position: relative;
    height : 4.4rem !important;
    display : flex;
    flex-direction : row;
    @media (min-width: 1025px) {
      height : 5rem !important;
	  }
`;

const CarouselItem = styled.div`
    display: flex;
    flex : 1;
`;

const NormalDay = styled.div`
    border-right: 1px solid #3883bb;
    padding: 0.5rem;
    display : flex;
    flex-direction : column;
    align-items : center;
    justify-content : center;
    overflow: hidden;
    height : 4.4rem ;
    width : calc((100vw - 5.05rem)/10);
    padding-top : 0.6rem;
    font-size : 0.8rem;
    line-height : 1.5;
    letter-spacing : 0.3;
    font-weight : 500;
    &:last-child {
      border-right: none;
    }

    & div {
      white-space: normal;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    @media (min-width: 1025px) {
      height : 5rem;
      font-size : 1.02rem;
	  }
`;

const ActiveDay = styled(NormalDay)`
    background: #1366AE;
    color: #ffffff;
    font-weight : 600;
`;

const TodayDay = styled(NormalDay)`
    background: #00e260;
    color: #ffffff;
`;

const WrapSlider = styled.div`
  width : calc(((100vw - 5.05rem)/10) * 7);
`;

const SignInWrapper = styled.div`
	position: absolute;
	bottom: 0.25rem;
	width: calc((100vw - 5.05rem) / 10);
	/* background: #fafafa; */
	height: 4rem;
	text-align: center;
	padding: 0.5rem;
`;

SignInWrapper.Button = styled.div`
	border-radius: 4px;
	background: #1366ae;
	color: #ffffff;
	width: 100%;
	font-size: 0.95rem;
  display : flex;
  justify-content : center;
  align-items: center;
	font-weight: bold;
	line-height: 2.8;
	height: 100%;
	cursor: pointer;
`;

class DaySlider extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 0
    }
    this.refCarousel = React.createRef();
  }

  componentDidMount() {

  }

  onPrevClick(event, previousSlide) {
    previousSlide(event);
  }

  onNextClick(event, nextSlide) {
    nextSlide(event);
  }

  onDayClick(day) {
    const { onChangeDay, loadingCalendar } = this.props;
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
    const { selectedDay, merchantInfo } = this.props;
    const { timezone } = merchantInfo;

    let timeNow = timezone ? moment_tz.tz(timezone.substring(12)) : moment();
    let tz = `${moment(timeNow).format("YYYY-MM-DD")}T${moment(timeNow).format('HH:mm:ss')}`;

    if (moment(day).format('DDMMYYYY') === moment(selectedDay).format('DDMMYYYY')) {
      return (
        <ActiveDay key={index} onClick={() => this.onDayClick(day)}>
          {this.renderDay(day)}
        </ActiveDay>
      );
    }
    if (moment(day).format('DDMMYYYY') === moment(tz).format('DDMMYYYY')) {
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
    const { days, disable_Calendar, openAddingAppointment } = this.props;
    return (
      <DateSliderWrapper>
        <NormalDay />
        <WrapSlider>
          <Carousel
            wrapAround
            innerRef={this.refCarousel}
            dragging={true}
            renderBottomCenterControls={() => ''}
            renderCenterLeftControls={({ previousSlide }) => (
              <ButtonSplash
                style={{
                  right : "calc((100vw - 5.05rem) / 24)"
                }}
                isLeft onClick={ev => this.onPrevClick(ev, previousSlide)} />
            )}
            renderCenterRightControls={({ nextSlide }) => (
              <ButtonSplash
                style={{
                  left : "calc((100vw - 5.05rem) / 24)"
                }}
                onClick={ev => this.onNextClick(ev, nextSlide)} />
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
        </WrapSlider>
        <NormalDay style={{
          borderLeft : "1px solid #3883bb"
        }} />
        <NormalDay>
          <SignInWrapper>
            <SignInWrapper.Button
              onClick={() => {
                openAddingAppointment({});
                disable_Calendar(true);
              }}
            >
              Check-In
						</SignInWrapper.Button>
          </SignInWrapper>
        </NormalDay>

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
