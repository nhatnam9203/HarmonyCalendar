import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Carousel from 'nuka-carousel';
import { staffId } from '../../../app-constants';
import PopupBlockTime from './PopupBlockTime';
import ButtonSplash from './ButtonSplash';
import moment_tz from "moment-timezone"

const ResourceSelectorWrapper = styled.div`
	width: 100%;
	height: 4.4rem;
	border-left: 2px solid #3883bb;
	border-right: 2px solid #3883bb;
	border-top: 2px solid #3883bb;
	display: flex;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	@media (min-width: 1025px) {
		height: 5rem;
	}
`;

const BellButton = styled.div`
	width: calc(5.05rem - 2px);
	height: 100%;
	text-align: center;
	padding: 0.5rem;
	display: flex;
	justify-content: center;
	align-items: center;
	& > img {
		width: 30px;
		height : 30px;
	}
	position : relative;
`;

BellButton.Icon = styled.div`
	background : red;
	width : 1.5rem;
	height : 1.5rem;
	display: flex;
	justify-content : center;
	align-items : center;
	position : absolute;
	top : 0.8rem;
	right : 1.2rem;
	color : white;
	font-size : 0.6rem;
	font-weight : 600;
	border-radius : 300rem;
`;


const ResourceSliderWrapper = styled.div`
	width: calc(100% - 5.05rem - (calc((100vw - 5.05rem) / 10)) - (calc((100vw - 5.05rem) / 10)) + 1px);
	position: relative;
`;

const ResourceWrapper = styled.div`
	height: calc(4.4rem - 2px);
	position: relative;
	display: flex;
	@media (min-width: 1025px) {
		height: calc(5rem - 2px);
	}
`;

const Resource = styled.div`
	cursor: pointer;
	width: calc(100% / 8);
	padding: 0.25rem;
	position: relative;
	border-right: 1px solid #ddd;
	text-align: center;
	background-color: ${(props) => (props.active ? '#1EB5F4' : '#ffffff')};
`;

const AnyStaff = styled(Resource)`
	width : calc(100% - 5.05rem - ((calc((100vw - 5.05rem) / 10)) * 9) + 4px);
	height : 4.2rem;
	border-left: 1px solid #1173C3;
	background-color : #F5F5F5;
	display : flex;
	justify-content : center;
	align-items : center;
	@media (min-width: 1025px) {
		height: 4.85rem;
  	}
`;

AnyStaff.Image = styled.div`
	border-radius: 4px;
	width: 100%;
	font-size: 1rem;
	line-height: 2.8;
	margin-top: 0.6rem;
	height: 100%;
	cursor: pointer;
	& > img {
		width: 33px;
		height: 29px;
	}
	@media (min-width: 1025px) {
		& > img {
			width: 37px;
			height: 33px;
			margin-top: 0.8rem;
		}
	}
`;

AnyStaff.Title = styled.div`
	margin-top: -0.2rem !important;
	width: 100%;
	opacity: 0.75;
	text-align: center;
	padding-bottom: 4px;
	font-size: 0.85rem;
	line-height: 1.3;
	font-weight: 500;
	@media (min-width: 1025px) {
		font-size: 0.95rem;
		margin-top: 0rem !important;
	}
`;

Resource.Avatar = styled.div`
	padding: 2px;
	cursor: pointer;
	& img {
		width: 3.7rem;
		height: 3.7rem;
		border-radius: 50%;
		object-fit: cover;
	}
	@media (min-width: 1025px) {
		& img {
			width: 4rem;
			height: 4rem;
			border-radius: 50%;
			object-fit: cover;
		}
	}
`;

Resource.OrderNumber = styled.div`
	position: absolute;
	top: 2px;
	right: 2px;
	background: ${(props) => (props.next ? '#DD4124' : '#1073C2')};
	width: 20px;
	height: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: 600;
	border-radius: 50%;
	color: #ffffff;
	padding: 2px;
	font-size: 12px;
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
	background: rgba(255, 255, 255, 1);
	border-top: 2px solid white;
	width: 100%;
	opacity: 0.75;
	text-align: center;
	padding-bottom: 4px;
	font-size: 0.8rem;
	line-height: 1.3;
	font-weight: 400;
	@media (min-width: 1024px) {
		font-size: 0.93rem;
	}
`;

const WaitingHeader = styled.div`
	width: calc((100vw - 5.05rem) / 10);
	text-align: center;
	display: flex;
	justify-content: center;
	font-weight: 500;
	align-items: center;
	line-height: 64px;
	font-size: 16px;
	color: #333333;
	background: #f4f4f5;
	border-left: 1px solid #3883bb;
	@media (min-width: 1024px) {
		font-size: 1.3rem;
	}
`;

const ButtonArrow = styled.div`
	& > img {
		width: 19px;
		height: 19px;
		margin-left: ${(props) => (props.isLeft ? '-3px' : '0px')};
		margin-right: ${(props) => (props.isLeft ? '0px' : '-3px')};
		transform: ${(props) => (props.isLeft ? 'rotate(180deg)' : 'rotate(0deg)')};
	}
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

const qtyStaff = 8;

class ResourceSelector extends React.Component {
	constructor(props) {
		super(props);
		this.refPrevButton = React.createRef();
		this.refNextButton = React.createRef();
	}

	toggleNotification = () => {
		this.props.toggleNotification(true);
		this.props.getNotification({ page: 1 });
	}

	async componentWillReceiveProps(nextProps) {
		const { appointmentScroll, isScrollToAppointment } = nextProps;
		if (isScrollToAppointment === true && isScrollToAppointment !== this.props.isScrollToAppointment) {
			await this.findSlideScroll(appointmentScroll);
			await this.verticalScrollToAppointment(appointmentScroll);
			this.resetScrollAppointment();
		}
	}

	resetScrollAppointment = () => {
		this.props.scrollToAppointment('');
		this.props.startScrollToAppointment(false);
	}

	findSlideScroll = (appointmentId) => {
		const { allAppointment, resources, slideIndex } = this.props;
		let app = allAppointment.find(app => app.id === appointmentId);
		const { memberId } = app;
		let indexStaff = resources.findIndex(s => parseInt(s.id) === parseInt(memberId));
		let slideIndexAppointment = parseInt((indexStaff + 1) / qtyStaff);
		let slideNeedToScroll = slideIndexAppointment - slideIndex;
		this.scrollToAppointment(slideNeedToScroll);
	}

	verticalScrollToAppointment(appointmentId) {
		var els = document.getElementsByClassName("apppointment-calendar");
		Array.prototype.forEach.call(els, function (el) {
			let text = el.outerText;
			if (text.toString().includes(appointmentId.toString())) {
				el.scrollIntoView();
			}
		});
	}

	scrollToAppointment(slideNeedToScroll) {
		if (slideNeedToScroll > 0) {
			for (let i = 1; i <= Math.abs(slideNeedToScroll); i++) {
				this.refNextButton.current.click();
			}
		}
		if (slideNeedToScroll < 0) {
			for (let i = 1; i <= Math.abs(slideNeedToScroll); i++) {
				this.refPrevButton.current.click();
			}
		}
	}

	componentWillMount() {
		this.props.getDetailMerchant({ isFirstLoad: true });
		this.props.countNotificationUnread();
	}


	onPrevClick(event, previousSlide) {
		previousSlide(event);
	}

	onNextClick(event, nextSlide) {
		nextSlide(event);
	}

	afterSlide(index) {
		const { resources } = this.props;
		this.props.setDisplayedMembers(resources.slice(index * 8, index * 8 + 8));
		this.props.renderAppointment();
		this.props.setSlideIndex(index);
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
		let isActiveLeft = false,
			isActiveRight = false;
		const totalSlide = (resources.length - 1) / 8;

		if (totalSlide <= 1) {
			isActiveLeft = false;
			isActiveRight = false;
		} else if (totalSlide > 1) {
			if (slideIndex > 0) {
				if (slideIndex < totalSlide) {
					if (totalSlide - slideIndex <= 1) {
						isActiveRight = false;
						isActiveLeft = true;
					} else {
						isActiveRight = true;
						isActiveLeft = true;
					}
				}
				if (slideIndex === totalSlide) {
					isActiveRight = false;
					isActiveLeft = true;
				}
			} else {
				isActiveLeft = false;
				isActiveRight = true;
			}
		}

		return {
			isActiveLeft,
			isActiveRight
		};
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
				<Resource>{/* <LoadingIndicator /> */}</Resource>
			</ResourceWrapper>
		);
	}

	renderCarouselSlide() {
		const { loading, resources } = this.props;
		if (loading) {
			return [1].map((index) => this.renderLoadingResources(index));
		}
		if (resources) {
			return chunk(resources, 8).map((resource, index) => this.renderResources(resource, index));
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
			resources,
			notificationUnreadQuantity
		} = this.props;

		const isActiveLett = this.getActiveArrow().isActiveLeft;
		const isActiveRight = this.getActiveArrow().isActiveRight;

		return (
			<React.Fragment>
				<ResourceSelectorWrapper>
					<BellButton onClick={this.toggleNotification}>
						<img src={require('../../images/bell.png')} />
						{
							parseInt(notificationUnreadQuantity) > 0 &&
							<BellButton.Icon>
								{parseInt(notificationUnreadQuantity) > 99 ? '99+' : notificationUnreadQuantity}
							</BellButton.Icon>
						}
					</BellButton>


					<AnyStaff>
						<AnyStaff.Image>
							<img src={require('../../images/anystaff.png')} />
							<AnyStaff.Title>Any staff</AnyStaff.Title>
						</AnyStaff.Image>
					</AnyStaff>

					<ResourceSliderWrapper>
						{resources.length > 0 && (
							<Carousel
								dragging={true}
								renderBottomCenterControls={() => ''}
								renderCenterLeftControls={({ previousSlide }) => {
									if (!isActiveLett) {
										return (
											<ButtonArrow isLeft>
												<img src={require('../../images/arrow-right-grey.png')} />
											</ButtonArrow>
										);
									} else
										return (
											<ButtonSplash
												refButton={this.refPrevButton}
												isLeft
												onClick={(ev) => this.onPrevClick(ev, previousSlide)}
											/>
										);
								}}
								renderCenterRightControls={({ nextSlide }) => {
									if (!isActiveRight) {
										return (
											<ButtonArrow>
												<img src={require('../../images/arrow-right-grey.png')} />
											</ButtonArrow>
										);
									} else return <ButtonSplash
										refButton={this.refNextButton}
										onClick={(ev) => this.onNextClick(ev, nextSlide)}
									/>;
								}}
								afterSlide={(slideIndex) => this.afterSlide(slideIndex)}
							>
								{this.renderCarouselSlide()}
							</Carousel>
						)}
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
