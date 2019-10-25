import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Carousel from 'nuka-carousel';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { staffId } from '../../../app-constants'
import LoadingIndicator from 'components/LoadingIndicator';
import Pincode from './Pincode'

const ResourceSelectorWrapper = styled.div`
  width: 100%;
  height: 4rem;
  border-left: 2px solid #3883bb;
  border-right: 2px solid #3883bb;
  border-top: 2px solid #3883bb;
  display: flex;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const TodayWrapper = styled.div`
  width: calc(5.05rem - 2px);
  height: 100%;
  text-align: center;
  padding: 0.5rem;
`;

TodayWrapper.Button = styled.div`
  border-radius: 4px;
  background: #0071c5;
  color: #ffffff;
  width: 100%;
  font-size: 1rem;
  line-height: 2.8;
  height: 100%;
  cursor: pointer;
`;

const ResourceSliderWrapper = styled.div`
  width: calc(100% - 5.05rem - (calc((100vw - 5.05rem) / 7)) + 1px);
  position: relative;
`;

const ResourceWrapper = styled.div`
  height: calc(4rem - 2px);
  position: relative;
  border-left: 1px solid #3883bb;
  display: flex;
`;

const Resource = styled.div`
  cursor : pointer;
  width: calc(100% / 6);
  padding: 0.25rem;
  position: relative;
  border-right: 1px solid #ddd;
  text-align: center;
  background-color : ${props => (props.active ? '#1EB5F4' : '#ffffff')};
`;

Resource.Avatar = styled.div`
  padding: 2px;
  cursor : pointer;
  & img {
    width: 3rem;
    height : 3rem;
    border-radius: 50%;
    object-fit : cover;
  }
`;

Resource.OrderNumber = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  background: ${props => (props.next ? 'red' : '#1073C2')};
  width: 16px;
  height: 16px;
  border-radius: 50%;
  color: #ffffff;
  padding: 2px;
  font-size: 9px;
  line-height: 1.3;
`;

Resource.WorkingTime = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  opacity: 0.75;
  text-align: center;
  padding-bottom: 4px;
  padding-left : 5px;
  font-size: 7px;
  line-height: 1.3;
  font-weight : 500;
  color : ${props => (props.notWork ? '#ffffff' : '')};
  background: ${props => (props.notWork ? 'red' : '#ffffff')};
`;

Resource.Title = styled.div`
  position: absolute;
  bottom: 13px;
  left: 0;
  background: #ffffff;
  width: 100%;
  opacity: 0.75;
  text-align: center;
  padding-bottom: 4px;
  font-size: 12px;
  line-height: 1.3;
  font-weight : 500;
`;

const PrevButton = styled.div`
  color: #3883bb;
  font-size: 2rem;
  line-height: 2rem;
  cursor: pointer;
`;

const NextButton = styled.div`
  color: #3883bb;
  font-size: 2rem;
  line-height: 2rem;
  cursor: pointer;
`;

const WaitingHeader = styled.div`
  width: calc((100vw - 5.05rem) / 7);
  text-align: center;
  line-height: 64px;
  font-size: 18px;
  color: #333333;
  background: #f4f4f5;
  border-left: 1px solid #3883bb;
`;

function chunk(array, size) {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += 1) {
    const last = chunkedArr[chunkedArr.length - 1];
    if (!last || last.length === size) {
      chunkedArr.push([array[i]]);
    } else {
      last.push(array[i]);
    }
  }
  return chunkedArr;
}

class ResourceSelector extends React.Component {
  componentWillMount() {
    const { loadMembers } = this.props;
    loadMembers();
  }

  onPrevClick(event, previousSlide) {
    previousSlide(event);
  }

  onNextClick(event, nextSlide) {
    nextSlide(event);
  }

  afterSlide(index) {
    const { resources, setDisplayedMembers } = this.props;
    setDisplayedMembers(resources.slice(index * 6, index * 6 + 6));
  }

  onTodayClick() {
    const { onChangeToday } = this.props;
    onChangeToday(moment().format('DDMMYYYY'));
  }

  getWorrkingTime(staff, currentDay) {
    switch (moment(currentDay).format('dddd')) {
      case 'Monday':
        if (staff.workingTimes.Monday.isCheck) {
          return (
            <Resource.WorkingTime>
              {staff.workingTimes.Monday.timeStart} - {staff.workingTimes.Monday.timeEnd}
            </Resource.WorkingTime>
          )
        } else {
          return (
            <Resource.WorkingTime notWork>
              {staff.workingTimes.Monday.timeStart} - {staff.workingTimes.Monday.timeEnd} (Off)
            </Resource.WorkingTime>
          )
        }
        break;

      case 'Tuesday':
        if (staff.workingTimes.Tuesday.isCheck) {
          return (
            <Resource.WorkingTime>
              {staff.workingTimes.Tuesday.timeStart} - {staff.workingTimes.Tuesday.timeEnd}
            </Resource.WorkingTime>
          )
        } else {
          return (
            <Resource.WorkingTime notWork>
              {staff.workingTimes.Tuesday.timeStart} - {staff.workingTimes.Tuesday.timeEnd} (Off)
            </Resource.WorkingTime>
          )
        }
        break;

      case 'Wednesday':
        if (staff.workingTimes.Wednesday.isCheck) {
          return (
            <Resource.WorkingTime>
              {staff.workingTimes.Wednesday.timeStart} - {staff.workingTimes.Wednesday.timeEnd}
            </Resource.WorkingTime>
          )
        } else {
          return (
            <Resource.WorkingTime notWork>
              {staff.workingTimes.Wednesday.timeStart} - {staff.workingTimes.Wednesday.timeEnd} (Off)
            </Resource.WorkingTime>
          )
        }
        break;

      case 'Thursday':
        if (staff.workingTimes.Thursday.isCheck) {
          return (
            <Resource.WorkingTime>
              {staff.workingTimes.Thursday.timeStart} - {staff.workingTimes.Thursday.timeEnd}
            </Resource.WorkingTime>
          )
        } else {
          return (
            <Resource.WorkingTime notWork>
              {staff.workingTimes.Thursday.timeStart} - {staff.workingTimes.Thursday.timeEnd} (Off)
            </Resource.WorkingTime>
          )
        }
        break;

      case 'Friday':
        if (staff.workingTimes.Friday.isCheck) {
          return (
            <Resource.WorkingTime>
              {staff.workingTimes.Friday.timeStart} - {staff.workingTimes.Friday.timeEnd}
            </Resource.WorkingTime>
          )
        } else {
          return (
            <Resource.WorkingTime notWork>
              {staff.workingTimes.Friday.timeStart} - {staff.workingTimes.Friday.timeEnd} (Off)
            </Resource.WorkingTime>
          )
        }
        break;

      case 'Saturday':
        if (staff.workingTimes.Saturday.isCheck) {
          return (
            <Resource.WorkingTime>
              {staff.workingTimes.Saturday.timeStart} - {staff.workingTimes.Saturday.timeEnd}
            </Resource.WorkingTime>
          )
        } else {
          return (
            <Resource.WorkingTime notWork>
              {staff.workingTimes.Saturday.timeStart} - {staff.workingTimes.Saturday.timeEnd} (Off)
            </Resource.WorkingTime>
          )
        }
        break;

      case 'Monday':
        if (staff.workingTimes.Monday.isCheck) {
          return (
            <Resource.WorkingTime>
              {staff.workingTimes.Monday.timeStart} - {staff.workingTimes.Monday.timeEnd}
            </Resource.WorkingTime>
          )
        } else {
          return (
            <Resource.WorkingTime notWork>
              {staff.workingTimes.Monday.timeStart} - {staff.workingTimes.Monday.timeEnd} (Off)
            </Resource.WorkingTime>
          )
        }
        break;

      default:
        break;
    }
  }

  openPincode(pincode){
    const {disableCalendar,togglePopupPincode} = this.props;
    togglePopupPincode(true,pincode);
    disableCalendar(true);
  }

  renderResource(resource, index) {
    const { calendarMembers, currentDay, togglePopupPincode } = this.props;
    const member = calendarMembers ? calendarMembers.find(mem => mem.memberId === resource.id) : '';
    const numberOfAppointments = member ? member.appointments.filter(app => app.status !== "BLOCK").length : 0;
    return (
      <Resource 
      // onClick={() => this.openPincode(resource.pincode)}
      active={parseInt(resource.id) === parseInt(staffId) ? true : false} key={index}>
        <Resource.Avatar>
          <img src={resource.imageUrl} alt={resource.orderNumber} />
        </Resource.Avatar>

       <Resource.OrderNumber next={resource.isNextAvailableStaff === 1 ? true : false}>
          {resource.orderNumber}
        </Resource.OrderNumber>
        <Resource.WorkingTime>
          {this.getWorrkingTime(resource, currentDay)}
        </Resource.WorkingTime>
        <Resource.Title>{resource.title}</Resource.Title>
      </Resource>
    );
  }

  renderResources(resources, index) {
    return (
      <ResourceWrapper key={index}>
        {resources.map((resource, indexS) =>
          this.renderResource(resource, indexS),
        )}
      </ResourceWrapper>
    );
  }

  renderLoadingResources(index) {
    return (
      <ResourceWrapper key={index}>
        <Resource>
          <LoadingIndicator />
        </Resource>
      </ResourceWrapper>
    );
  }

  renderCarouselSlide() {
    const { loading, resources } = this.props;
    if (loading) {
      return [1].map(index => this.renderLoadingResources(index));
    }
    if (resources) {
      return chunk(resources, 6).map((resource, index) =>
        this.renderResources(resource, index),
      );
    }
    return null;
  }

  render() {
    const { checkPinCode, popupPincode,togglePopupPincode,disableCalendar,PinStaff } = this.props;

    return (
      <React.Fragment>
        <ResourceSelectorWrapper>
          <TodayWrapper>
            <TodayWrapper.Button onClick={() => this.onTodayClick()}>
              Today
          </TodayWrapper.Button>
          </TodayWrapper>
          <ResourceSliderWrapper>
            <Carousel
              // slideIndex={1}
              dragging={true}
              renderBottomCenterControls={() => ''}
              renderCenterLeftControls={({ previousSlide }) => (
                <PrevButton onClick={ev => this.onPrevClick(ev, previousSlide)}>
                  <FaCaretLeft />
                </PrevButton>
              )}
              renderCenterRightControls={({ nextSlide }) => (
                <NextButton onClick={ev => this.onNextClick(ev, nextSlide)}>
                  <FaCaretRight />
                </NextButton>
              )}
              afterSlide={slideIndex => this.afterSlide(slideIndex)}
            >
              {this.renderCarouselSlide()}
            </Carousel>
          </ResourceSliderWrapper>
          <WaitingHeader>Waiting</WaitingHeader>
        </ResourceSelectorWrapper>
        {/* <Pincode
          checkPinCode={checkPinCode}
          popupPincode={popupPincode}
          togglePopupPincode={togglePopupPincode}
          disableCalendar={disableCalendar}
          PinStaff={PinStaff}

        /> */}
      </React.Fragment>
    );
  }
}

ResourceSelector.propTypes = {
  resources: PropTypes.any,
  calendarMembers: PropTypes.any,
  onChangeToday: PropTypes.func,
  loadMembers: PropTypes.func,
  setDisplayedMembers: PropTypes.func,
  loading: PropTypes.bool,
};

export default ResourceSelector;


