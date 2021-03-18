import React, { Component } from 'react';
import styled from 'styled-components';
import schedule_checkinAppointment from '../../images/schedule_checkinAppointment.png';
import schedule_confirmAppointment from '../../images/schedule_confirmAppointment.png';
import schedule_deleteAppointment from '../../images/schedule_deleteAppointment.png';
import schedule_newAppointment from '../../images/schedule_newAppointment.png';
import schedule_updateAppointment from '../../images/schedule_updateAppointment.png';

import schedule_checkinAppointment_read from '../../images/schedule_checkinAppointment_read.png';
import schedule_confirmAppointment_read from '../../images/schedule_confirmAppointment_read.png';
import schedule_deleteAppointment_read from '../../images/schedule_deleteAppointment_read.png';
import schedule_newAppointment_read from '../../images/schedule_newAppointment_read.png';
import schedule_updateAppointment_read from '../../images/schedule_updateAppointment_read.png';
import closeIcon from '../../images/closeIcon.png';
import InfiniteScroll from 'react-infinite-scroll-component';
import ItemNotification from './ItemNotification';
import ReactLoading from 'react-loading';
import moment from 'moment';
import { isEmpty } from 'lodash';

const Wrapper = styled.div`
	background: rgba(0, 0, 0, 0.6);
	width: 10rem;
	height: 60rem;
	border-radius: 8px;
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	z-index: 9999;
	display: flex;
	flex-direction: row;
`;

const Container = styled.div`
	width: 30rem;
	height: 100vh;
	background: white;
	padding: 1rem;
	z-index: 9999999;
	overflow-y: hidden;
`;

const Body = styled.div`
	height: 100vh;
	overflow: auto;
	display: flex;
	flex-direction: column;
`;

const ClosePart = styled.div`
	width: 100vw;
	height: 100vh;
	background: transparent;
	padding: 1rem;
	overflow-y: scroll;
	z-index: 9999999;
`;

const Title = styled.div`
	color: #585858;
	font-size: 1.2rem;
	font-weight: 600;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	height: 2rem;
	& > div {
		& > img {
			width: 20px;
			height: 20px;
			margin-bottom: 1rem;
		}
	}
`;

const ContainerLoading = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export default class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			isLoading: false,
			isRefresh: false
		};
	}

	componentDidMount() {
		// this.props.getNotification({ page: 1 });
	}

	getMoreData = () => {
		const { page } = this.state;
		this.setState({ isLoading: true });
		this.props.getNotification({ page: page + 1, cb: this.stopLoadMore });
	};

	fetchMoreData = () => {
		this.getMoreData();
	};

	stopLoadMore = (status) => {
		if (status) {
			const { page } = this.state;
			this.setState({ page: page + 1 });
		}
		this.setState({ isLoading: false });
	};

	readNotification = (item) => {
		const { view, merchantNotificationId } = item;
		if (view === 0) {
			this.props.readNotification(merchantNotificationId);
			setTimeout(() => {
				this.refresh();
			}, 300);
		}
		this.props.onChangeDay(moment(item.appointmentDate).format('DDMMYYYY'));
		this.props.scrollToAppointment(item.appointmentId);
		this.closePopup();
	};

	refresh = () => {
		const { isRefresh } = this.state;
		this.setState({ isRefresh: !isRefresh });
	};

	checkIcon = (type, view) => {
		let icon = schedule_updateAppointment;
		switch (type) {
			case 'appointment_checkin':
				icon = view == 0 ? schedule_checkinAppointment : schedule_checkinAppointment_read;
				break;
			case 'appointment_add':
				icon = view === 0 ? schedule_newAppointment : schedule_newAppointment_read;
				break;
			case 'appointment_schedule_changes':
				icon = view === 0 ? schedule_updateAppointment : schedule_updateAppointment_read;
				break;
			case 'appointment_confirm':
				icon = view === 0 ? schedule_confirmAppointment : schedule_confirmAppointment_read;
				break;
			case 'appointment_cancel':
				icon = view === 0 ? schedule_deleteAppointment : schedule_deleteAppointment_read;
				break;

			default:
				icon = view === 0 ? schedule_updateAppointment : schedule_updateAppointment_read;
				break;
		}
		return icon;
	};

	closePopup = () => {
		this.setState({
			page: 1,
			isLoading: false,
			isRefresh: false
		});
		this.props.toggleNotification(false);
	};

	render() {
		const { isPopupNotification, notifications } = this.props;
		if (!isPopupNotification) return null;

		return (
			<Wrapper>
				<Container>
					<Title>
						Notifications
						<div onClick={this.closePopup}>
							<img src={closeIcon} />
						</div>
					</Title>
					<Body id="scrollableDiv">
						{!isEmpty(notifications) && (
							<InfiniteScroll
								dataLength={notifications.length ? notifications.length : 0}
								next={this.fetchMoreData}
								style={{ display: 'flex', flexDirection: 'column' }}
								hasMore={true}
								loader={
									this.state.isLoading ? 
									<ContainerLoading>
										<ReactLoading type={'bars'} color={'#136AB7'} height={50} width={50} />
									</ContainerLoading>
									: null
								}
								scrollableTarget="scrollableDiv"
							>
								{!isEmpty(notifications) &&
									notifications.map((item) => (
										<ItemNotification
											key={item.merchantNotificationId + 'notify'}
											item={item}
											icon={this.checkIcon(item.type, item.view)}
											onClick={() => this.readNotification(item)}
										/>
									))}
							</InfiniteScroll>
						)}
					</Body>
				</Container>
				<ClosePart onClick={this.closePopup} />
			</Wrapper>
		);
	}
}
