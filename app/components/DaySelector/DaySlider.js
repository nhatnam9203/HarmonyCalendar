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
    width : calc((100vw - 5.05rem)/9);
    padding-top : 0.6rem;
    font-size : 0.95rem;
    line-height : 1.5;
    letter-spacing : 0.3;
    font-weight : 500;
    /* &:last-child {
      border-right: none;
    } */

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
  width : calc(((100vw - 5.05rem)/9) * 7);

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
    const { days } = this.props;
    return (
      <DateSliderWrapper>
        <NormalDay>
        </NormalDay>
        <WrapSlider>
          <Carousel
            wrapAround
            innerRef={this.refCarousel}
            dragging={true}
            renderBottomCenterControls={() => ''}
            renderCenterLeftControls={({ previousSlide }) => (
              <ButtonSplash
                style={{
                  left: -85,
                }}
                isLeft onClick={ev => this.onPrevClick(ev, previousSlide)} />
            )}
            renderCenterRightControls={({ nextSlide }) => (
              <ButtonSplash
                style={{
                  right: -85,
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
        <NormalDay>

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
