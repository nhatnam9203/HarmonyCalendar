import React from 'react';
import styled from 'styled-components';
import Popup from 'reactjs-popup';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { convertMinsToHrsMins } from '../../utils/helper';

const Container = styled(Popup)`
  border-radius: 2rem;
  padding: 0 !important;
  border: none !important;
  overflow: hidden;
  width: 50rem !important;
`;

const Header = styled.div`
	width: 100%;
	height: 3.5rem;
	background-color: #0764b0;
	padding-top: 0.6rem;
	border-top-left-radius: 2rem;
	border-top-right-radius: 2rem;
	text-align: center;
	font-size: 1.5rem;
	font-weight: 600;
	color: white;
	position: relative;
`;

const Body = styled.div`
	background-color: white;
	border-bottom-left-radius: 1.5rem;
	border-bottom-left-radius: 1.5rem;
	padding: 1.5rem;
`;

const RowInfo = styled.div`
	display: flex;
	flex-direction: row;
	padding-bottom: 1rem;
	border-bottom: 1px solid #eeeeee;
	& > div:nth-child(2) {
		margin-left: 0.6rem;
		& > div:nth-child(1) {
			font-size: 1.1rem;
			font-weight: 600;
			color: #0764b0;
		}
		& > div:nth-child(2) {
			font-size: 0.9rem;
			font-weight: 400;
			color: #585858;
		}
	}
	& > div:nth-child(3) {
		margin-left: 5rem;
		& > div:nth-child(1) {
			font-size: 1.1rem;
			font-weight: 600;
			color: #585858;
		}
		& > div:nth-child(2) {
			font-size: 0.9rem;
			font-weight: 400;
			color: #585858;
		}
	}
`;

const Avatar = styled.div`
	width: 3rem;
	height: 3rem;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #e5e5e5;
	border-radius: 300px;
	font-size: 1.7rem;
	font-weight: 600;
	color: #585858;
`;

const Title = styled.div`
	font-size: 1.1rem;
	font-weight: 600;
	color: #585858;
	margin-top: 1rem;
`;

const DateTime = styled.div`
	font-size: 1.2rem;
	font-weight: 600;
	color: #585858;
`;

const Row = styled.div`
	display: flex;
	flex-direction: row;
	margin-top: 0.5rem;
`;

Row.ServiceName = styled.div`
	width: 25%;
	color: #666666;
	font-size: 1.1rem;
`;

Row.ExtraName = styled(Row.ServiceName)`
    display : flex;
    flex-direction : row;
    align-items : center;
    padding-left : 1rem;
`;

Row.StartTime = styled(Row.ServiceName)`
    width: 17%;
`;

Row.Staff = styled(Row.ServiceName)`
    width: 25%;
`;

Row.Duration = styled(Row.ServiceName)`
    width: 16%;
    text-align : left;
`;

Row.Price = styled(Row.ServiceName)`
    width: 17%;
    font-weight : 600;
    text-align : right;
`;

const RowBetween = styled.div`
	display: flex;
	justify-content: space-between;
	margin-top: 1.5rem;
`;

const Status = styled.div`
	font-size: 1.1rem;
	font-weight: 500;
	color: #0764b0;
	color: ${(props) => (props.color ? props.color : '#0764B0')};
`;

const Total = styled.div`
	width: 100%;
	text-align: right;
	margin-top: 1rem;
	color: #0764b0;
	font-size: 1.5rem;
	font-weight: 600;
`;

const LineBottom = styled.div`
	width: 100%;
	margin-top: 1rem;
	border-bottom: 1px solid #eeeeee;
	margin-bottom: 1rem;
`;

const Bottom = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
`;

const ButtonNext = styled.div`
	border-radius: 5px;
	width: 10rem;
	height: 3.1rem;
	display: flex;
	justify-content: center;
	align-items: center;
	color: white;
	font-size: 1.3rem;
	font-weight: 600;
	background-color: #0764b0;
`;

const TextSendLink = styled.div`
	font-size: 1rem;
	color: #585858;
`;

const TextNoAppointment = styled.div`
	color: #6a6a6a;
	margin-top: 0.5rem;
	margin-bottom: 1.5rem;
`;

const ImageSendLink = styled.img`
	width: 20px;
	height: 20px;
	object-fit: cover;
	margin-right: 10px;
`;

const BtnClose = styled.div`
	position: absolute;
	right: 0.8rem;
	top: 0.85rem;
	line-height: 1;
	font-size: 2rem;
	color: #ffffff;
	cursor: pointer;
	& > img {
		width: 33px;
		height: 33px;
	}
`;

const ContainerServices = styled.div`
	width: 100%;
	max-height: 8rem;
	overflow-y: scroll;
`;

const ImgExtra = styled.img`
	width: 14px;
	height: 14px;
	margin-right: 10px;
`;

const switchStatus = {
	unconfirm: '#ffe559',
	confirm: '#c2f4ff',
	checkin: '#28AAE9',
	paid: '#50CF25',
	refund: '#FD594F',
	void: '#FD594F'
};

const convertStatus = {
	unconfirm: 'Unconfirm',
	confirm: 'Confirm',
	checkin: 'Check-In',
	paid: 'Paid',
	refund: 'Refund',
	void: 'Void'
};

class PopupCustomer extends React.Component {
	renderProducts(products) {
		return products.map((pro) => {
			return (
				<Row key={'product' + pro.bookingProductId + Math.random()}>
					<Row.ServiceName>{pro.productName}</Row.ServiceName>
					<Row.StartTime />
					<Row.Staff />
					<Row.Duration>{`${pro.quantity} items`}</Row.Duration>
					<Row.Price>{`$ ${pro.price}`}</Row.Price>
				</Row>
			)
		})
	}

	renderExtras(extrasServices) {
		return extrasServices.map((ex) => (
			<Row key={'extra' + ex.bookingExtraId + Math.random()}>
				<Row.ExtraName>
					<ImgExtra src={require('../../images/iconExtra.png')} />
					{ex.extraName}
				</Row.ExtraName>
				<Row.StartTime />
				<Row.Staff />
				<Row.Duration>{`${convertMinsToHrsMins(ex.duration)}`}</Row.Duration>
				<Row.Price>{`$ ${ex.price}`}</Row.Price>
			</Row>
		));
	}

	renderServices(services, extras) {
		return services.map((sv) => {
			const extrasServices = extras.filter((ex) => ex.bookingServiceId === sv.bookingServiceId);
			return (
				<React.Fragment>
					<Row key={'service' + sv.bookingServiceId + Math.random()}>
						<Row.ServiceName>{sv.serviceName}</Row.ServiceName>
						<Row.StartTime>{moment(sv.fromTime).format('hh:mm A')}</Row.StartTime>
						<Row.Staff>{sv.staff.displayName}</Row.Staff>
						<Row.Duration>{`${convertMinsToHrsMins(sv.duration)}`}</Row.Duration>
						<Row.Price>{`$ ${sv.price}`}</Row.Price>
					</Row>
					{this.renderExtras(extrasServices)}
				</React.Fragment>
			);
		});
	}

	render() {
		const {
			isPopupCustomer,
			isSendLink,
			close,
			InfoAfterCheckPhone,
			toggleSendLink,
			condition,
			onSubmit
		} = this.props;

		if (!isEmpty(InfoAfterCheckPhone)) {
			const { InfoAfterCheckPhone } = this.props;
			const { firstName, lastName, note, phone, lastAppointment } = InfoAfterCheckPhone;
			const fromTime = (lastAppointment && lastAppointment.fromTime) || null;
			const services = (lastAppointment && lastAppointment.services) || [];
			const extras = (lastAppointment && lastAppointment.extras) || [];
			const products = (lastAppointment && lastAppointment.products) || [];
			const status = (lastAppointment && lastAppointment.status) || '';
			const total = (lastAppointment && lastAppointment.total) || '';

			return (
				<Container open={isPopupCustomer} closeOnDocumentClick={false} lockScroll={true}>
					<Header>
						Customer details
						<BtnClose onClick={close}>
							<img src={require('../../images/close_white.png')} />
						</BtnClose>
					</Header>
					<Body>
						<RowInfo>
							<Avatar>{firstName.toString().charAt(0)}</Avatar>
							<div>
								<div>{`${firstName} ${lastName}`}</div>
								<div>{phone}</div>
							</div>
							<div>
								<div>Customer Note:</div>
								<div>{note}</div>
							</div>
						</RowInfo>
						<React.Fragment>
							<Title>Last appointment</Title>
							{!lastAppointment && (
								<TextNoAppointment>This client ƒdoes not have appointment.</TextNoAppointment>
							)}
							{lastAppointment && (
								<React.Fragment>
									<RowBetween>
										<DateTime>
											{fromTime ? moment(fromTime).format('dddd, MMM DD YYYY') : ''}
										</DateTime>
										<Status color={switchStatus[status]}>{convertStatus[status]}</Status>
									</RowBetween>
									<ContainerServices>
										{this.renderServices(services, extras)}
										{this.renderProducts(products)}
									</ContainerServices>
									<Total>{`$ ${total}`}</Total>
								</React.Fragment>
							)}
						</React.Fragment>

						{condition && (
							<Row onClick={toggleSendLink} style={{ marginTop: 20, alignItems: 'center' }}>
								{isSendLink ? (
									<ImageSendLink src={require('../../images/check-box@3x.png')} />
								) : (
										<ImageSendLink src={require('../../images/check-box-empty@3x.png')} />
									)}
								<TextSendLink>Send application download link</TextSendLink>
							</Row>
						)}

						<LineBottom />
						<Bottom>
							<ButtonNext onClick={() => onSubmit(true)}>Next</ButtonNext>
						</Bottom>
					</Body>
				</Container>
			);
		}
		return null;
	}
}

export default PopupCustomer;
