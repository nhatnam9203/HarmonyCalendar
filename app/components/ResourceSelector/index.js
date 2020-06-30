import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Carousel from 'nuka-carousel';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { staffId } from '../../../app-constants';
import PopupBlockTime from './PopupBlockTime';
import SplashButton from './SplashButton'

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
	width: calc(100% - 5.05rem - (calc((100vw - 5.05rem) / 7)) - (calc((100vw - 5.05rem) / 7)) + 1px);
	position: relative;
`;

const ResourceWrapper = styled.div`
	height: calc(4rem - 2px);
	position: relative;
	/* border-left: 1px solid #3883bb; */
	display: flex;
`;

const Resource = styled.div`
	cursor: pointer;
	width: calc(100% / 5);
	padding: 0.25rem;
	position: relative;
	border-right: 1px solid #ddd;
	text-align: center;
	background-color: ${(props) => (props.active ? '#1EB5F4' : '#ffffff')};
`;

const AnyStaff = styled(Resource)`
	width : calc(100% - 5.05rem - ((calc((100vw - 5.05rem) / 7)) * 6) + 4px);
	height : 4.4rem;
	border-left: 1px solid #1173C3;
	background-color : #F5F5F5;
`;

AnyStaff.Image = styled.div`
	border-radius: 4px;
	width: 100%;
	font-size: 1rem;
	line-height: 2.8;
	height: 100%;
	cursor: pointer;
	& > img {
		width : 30px;
		height : 26px;
	}
`;

AnyStaff.Title = styled.div`
	margin-top: -0.25rem !important;
	width: 100%;
	opacity: 0.75;
	text-align: center;
	padding-bottom: 4px;
	font-size: 0.8rem;
	line-height: 1.3;
	font-weight: 500;
`;

Resource.Avatar = styled.div`
	padding: 2px;
	cursor: pointer;
	& img {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		object-fit: cover;
	}
`;

Resource.OrderNumber = styled.div`
	position: absolute;
	top: 2px;
	right: 2px;
	background: ${(props) => (props.next ? '#DD4124' : '#1073C2')};
	width: 18px;
	height: 18px;
	font-weight : 600;
	border-radius: 50%;
	color: #ffffff;
	padding: 2px;
	font-size: 11px;
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
	padding-left: 5px;
	font-size: 7px;
	line-height: 1.3;
	font-weight: 500;
	color: ${(props) => (props.notWork ? '#ffffff' : '')};
	background: ${(props) => (props.notWork ? 'red' : '#ffffff')};
`;

Resource.Title = styled.div`
	position: absolute;
	bottom: 0px;
	left: 0;
	background: rgba(255,255,255,1);
	border-top : 2px solid white;
	width: 100%;
	opacity: 0.75;
	text-align: center;
	padding-bottom: 4px;
	font-size: 0.8rem;
	line-height: 1.3;
	font-weight: 400;
`;

const PrevButton = styled.div`
	color: #3883bb;
	font-size: 2rem;
	line-height: 2rem;
	cursor: pointer;
	padding-left : 0.5rem;
`;

const NextButton = styled.div`
	color: #3883bb;
	font-size: 2rem;
	line-height: 2rem;
	cursor: pointer;
	padding-right: 0.5rem;
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

		const { resources } = this.props;
		this.props.setDisplayedMembers(resources.slice(index * 5, index * 5 + 5));
		this.props.renderAppointment();
		this.props.setSlideIndex(index);
	}

	onTodayClick() {
		this.props.onChangeToday(moment().format('DDMMYYYY'));
	}

	openPincode(staff) {
		if (navigator.onLine) {
			this.props.togglePopupPincode(true, staff);
			this.props.disableCalendar(true);
			this.props.getTimeStaffLogin(staff.id);
		} else {
			alert('You must have an internet connection to perform this !');
		}
	}

	getActiveArrow() {
		const { slideIndex, resources } = this.props;
		let isActiveLeft = false, isActiveRight = false;
		const totalSlide = (resources.length - 1) / 5;

		if ((totalSlide) <= 1) {
			isActiveLeft = false;
			isActiveRight = false;
		} else
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

	renderResource(resource, index) {
		if (parseInt(resource.id) !== 0)
			return (
				<Resource
					onClick={() => this.openPincode(resource)}
					active={parseInt(resource.id) === parseInt(staffId) ? true : false}
					key={index}
				>
					<Resource.Avatar>
						<img src={resource.imageUrl} alt={resource.orderNumber} />
					</Resource.Avatar>

					<Resource.OrderNumber next={resource.isNextAvailableStaff === 1 ? true : false}>
						{resource.orderNumber}
					</Resource.OrderNumber>
					<Resource.Title>{resource.title}</Resource.Title>
				</Resource>
			);
	}

	renderResources(resources, index) {
		return (
			<ResourceWrapper key={index}>
				{resources.map((resource, indexS) => this.renderResource(resource, indexS))}
			</ResourceWrapper>
		);
	}

	renderLoadingResources(index) {
		return (
			<ResourceWrapper key={index}>
				<Resource>
					{/* <LoadingIndicator /> */}
				</Resource>
			</ResourceWrapper>
		);
	}

	renderCarouselSlide() {
		const { loading, resources } = this.props;
		if (loading) {
			return [1].map((index) => this.renderLoadingResources(index));
		}
		if (resources) {
			return chunk(resources, 5).map((resource, index) => this.renderResources(resource, index));
		}
		return null;
	}

	render() {
		const {
			checkPinCode,
			popupPincode,
			togglePopupPincode,
			disableCalendar,
			PinStaff,
			calendarMembers,
			SubmitEditBlockTime,
			deleteBlockTime,
			currentDay,
			editBlockTime,
		} = this.props;

		const isActiveLett = this.getActiveArrow().isActiveLeft;
		const isActiveRight = this.getActiveArrow().isActiveRight;

		return (
			<React.Fragment>
				<ResourceSelectorWrapper>
					<TodayWrapper>
						<TodayWrapper.Button onClick={() => this.onTodayClick()}>Today</TodayWrapper.Button>
					</TodayWrapper>

					<AnyStaff>
						<AnyStaff.Image>
							<img src={require('../../images/anystaff.png')}/>
							<AnyStaff.Title>Any staff</AnyStaff.Title>
						</AnyStaff.Image>
					</AnyStaff>

					<ResourceSliderWrapper>
						<Carousel
							dragging={true}
							renderBottomCenterControls={() => ''}
							renderCenterLeftControls={({ previousSlide }) => {
								if (!isActiveLett) {
									return (
										<PrevButton onClick={() => { }}>
											<FaCaretLeft />
										</PrevButton>
									)
								} else
									return (
										<SplashButton isLeft onClick={(ev) => this.onPrevClick(ev, previousSlide)}>
											<FaCaretLeft />
										</SplashButton>
									)
							}}
							renderCenterRightControls={({ nextSlide }) => {
								if (!isActiveRight) {
									return (
										<NextButton onClick={() => { }}>
											<FaCaretRight />
										</NextButton>
									)
								} else
									return (
										<SplashButton isRight onClick={(ev) => this.onNextClick(ev, nextSlide)}>
											<FaCaretRight />
										</SplashButton>
									)
							}}
							afterSlide={(slideIndex) => this.afterSlide(slideIndex)}
						>
							{this.renderCarouselSlide()}
						</Carousel>
					</ResourceSliderWrapper>
					<WaitingHeader>Waiting</WaitingHeader>
				</ResourceSelectorWrapper>

				<PopupBlockTime
					checkPinCode={checkPinCode}
					popupPincode={popupPincode}
					togglePopupPincode={togglePopupPincode}
					disableCalendar={disableCalendar}
					staff={PinStaff}
					calendarMembers={calendarMembers}
					SubmitEditBlockTime={SubmitEditBlockTime}
					deleteBlockTime={deleteBlockTime}
					currentDay={currentDay}
					editBlockTime={editBlockTime}
				/>
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
	loading: PropTypes.bool
};

export default ResourceSelector;

