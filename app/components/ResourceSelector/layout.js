import React from 'react';
import styled from 'styled-components';
import Carousel from 'nuka-carousel';
import { staffId } from '../../../app-constants';
import PopupBlockTime from './PopupBlockTime';
import ButtonSplash from './ButtonSplash';

const ResourceSelectorWrapper = styled.div`
	width: 100%;
	height: 4.4rem;
	border-left: 2px solid #3883bb;
	border-right: 2px solid #3883bb;
	border-top: 2px solid #3883bb;
	display: flex;
	@media (min-width: 1025px) {
		height: 5rem;
	}
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	-o-user-select: none;
	user-select: none;
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
		height: 30px;
	}
	position: relative;
`;

BellButton.Icon = styled.div`
	background: red;
	width: 1.5rem;
	height: 1.5rem;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	top: 0.8rem;
	right: 1.2rem;
	color: white;
	font-size: 0.6rem;
	font-weight: 600;
	border-radius: 300rem;
`;

const ResourceWrapper = styled.div`
	height: calc(4.4rem - 2px);
	/* width : ${(props) => (props.width ? props.width : 'calc(100vw - 4rem - (100vw/7) * 2)')}; */
	position: relative;
	display: flex;
	margin : 0px !important;
	padding : 0px !important;
	width : 100% !important;
	@media (min-width: 1025px) {
		height: calc(5rem - 2px);
	}
`;

const Resource = styled.div`
	cursor: pointer;
	/* width : ${(props) => (props.width ? props.width : 'calc(100%/8)')}; */
	padding: 0.25rem;
	position: relative;
	border-right: 1px solid #ddd;
	text-align: center;
	/* width: ${(props) => (props.width ? props.width : 'calc(100% / 5)')}; */
	background-color: ${(props) => (props.active ? '#1EB5F4' : '#ffffff')};
`;

const AnyStaff = styled(Resource)`
	flex : ${(props) => (props.flex ? props.flex : '0.95')};
	height : 4.2rem;
	border-left: 1px solid #1173C3;
	background-color : #F5F5F5;
	display : flex;
	justify-content : center;
	align-items : center;
	@media (min-width: 1025px) {
		height: 4.9rem;
  	}
`;

const ResourceSliderWrapper = styled.div`
	flex: ${(props) => (props.flex ? props.flex : '8')};
	position: relative;
	background-color: white;
`;

const WaitingHeader = styled.div`
	width: calc((100vw - 5.05rem) / 10 + 1px);
	text-align: center;
	display: flex;
	justify-content: center;
	font-weight: 500;
	align-items: center;
	line-height: 64px;
	font-size: 18px;
	color: #333333;
	background: #f4f4f5;
	border-left: 1px solid #3883bb;
	touch-action: manipulation;
	@media (min-width: 1024px) {
		font-size: 1.3rem;
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

const WrapButtonToday = styled.div`
	width: calc(5.05rem - 2px);
	height: 100%;
	text-align: center;
	padding: 0.2rem;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
`;

const ButtonToday = styled.div`
	width: 4.4rem;
	height: 3.2rem;
	border-radius: 5px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	background: #136ab7;
	cursor: pointer;
`;

ButtonToday.Text = styled.div`
	font-size: 0.94rem;
	font-weight: 600;
	color: white;
`;

const ButtonArrow = styled.div`
	opacity: ${(props) => props.opacity};
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

class layout extends React.Component {
	renderResource(resource, index) {
		const { qtyResources, isFirstReloadCalendar } = this.props;
		const { isLoadingStaff } = this.state;

		if (parseInt(resource.id) !== 0 && !isLoadingStaff && !isFirstReloadCalendar)
			return (
				<Resource
					onClick={() => this.openPincode(resource)}
					style={{ width: `calc(100% / ${qtyResources.toString()})` }}
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
		const { qtyResources } = this.props;
		if (loading) {
			return [1].map((index) => this.renderLoadingResources(index));
		}
		if (resources) {
			return chunk(resources, parseInt(qtyResources)).map((resource, index) =>
				this.renderResources(resource, index)
			);
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
			resources
		} = this.props;

		const isActiveLett = this.getActiveArrow().isActiveLeft;
		const isActiveRight = this.getActiveArrow().isActiveRight;

		const { resourceWidth, qtyResources } = this.props;
		const { isLoadingStaff } = this.state;

		const flexAnyStaff = resourceWidth % 8 + 0.95;

		return (
			<React.Fragment>
				<ResourceSelectorWrapper>
					<WrapButtonToday>
						<ButtonToday onClick={() => this.onTodayClick()}>
							<ButtonToday.Text>Today</ButtonToday.Text>
						</ButtonToday>
					</WrapButtonToday>

					<AnyStaff id="headerAnyStaff" flex={flexAnyStaff}>
						<AnyStaff.Image>
							<img src={require('../../images/anystaff.png')} />
							<AnyStaff.Title>Any staff</AnyStaff.Title>
						</AnyStaff.Image>
					</AnyStaff>

					<ResourceSliderWrapper flex={qtyResources}>
						{resources.length > 0 && (
							<Carousel
								width={`calc(((100vw - 5.05rem - 2px - ((100vw - 5.05rem) / 10))/${(resourceWidth +
									1).toString()}) * 8`}
								dragging={true}
								renderBottomCenterControls={() => ''}
								renderCenterLeftControls={({ previousSlide }) => {
									if (!isActiveLett) {
										return (
											<ButtonArrow opacity={isLoadingStaff ? 0 : 1} isLeft>
												<img src={require('../../images/arrow-right-grey.png')} />
											</ButtonArrow>
										);
									} else
										return (
											<ButtonSplash
												refButton={this.refPrevButton}
												isLeft
												onClick={(ev) => this.onPrevClick(ev, previousSlide)}
												isLoadingStaff={isLoadingStaff}
											/>
										);
								}}
								renderCenterRightControls={({ nextSlide }) => {
									if (!isActiveRight) {
										return (
											<ButtonArrow opacity={isLoadingStaff ? 0 : 1}>
												<img src={require('../../images/arrow-right-grey.png')} />
											</ButtonArrow>
										);
									} else
										return (
											<ButtonSplash
												refButton={this.refNextButton}
												onClick={(ev) => this.onNextClick(ev, nextSlide)}
												isLoadingStaff={isLoadingStaff}
											/>
										);
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

export default layout;
