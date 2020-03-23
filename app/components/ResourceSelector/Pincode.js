import React, { Component } from 'react';
import Popup from 'reactjs-popup';
import styled from 'styled-components';
import { FaClock } from 'react-icons/fa';
import { GiAlarmClock } from 'react-icons/gi';
import { FaTrash, FaCaretDown } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';
import PopupSelectTime from './PopupSelectTime';
import moment from 'moment';

const FormPincode = styled(Popup)`
    padding : 0 !important;
    padding-bottom : 1rem !important;
    background : #ffffff;
    width : 26rem !important;
    max-height : 30rem;
    border : none !important;
    border-radius : 0.8rem;    
    position : relative;
    box-shadow: 0 1px #fff inset, 0 0.6px 10px #1FB5F4;
`;

FormPincode.Header = styled.div`
	height: 3.2rem;
	width: 100%;
	background: #1073c2;
	display: flex;
	justify-content: center;
	align-items: center;
	border-top-left-radius: 3px;
	border-top-right-radius: 3px;
	position: relative;
`;
const HeaderText = styled.div`
	color: #ffffff;
	font-size: 1.2rem;
	font-weight: 600;
	lettter-spacing: 0.6;
`;

const PincodeBody = styled.div`
	max-height: 30rem;
	padding: 1rem;
	text-align: center;
	display: flex;
	flex-direction: column;
	overflow-y: scroll;
`;
PincodeBody.Input = styled.input`
	width: 100%;
	height: 2.5rem !important;
	text-align: left;
	background: #ffffff;
	border: 1px solid #dddddd;
	padding-left: 1.3rem;
	font-size: 1.4rem;
	border-radius: 5px;
	-moz-appearance: none;
	-webkit-appearance: none;
`;
PincodeBody.Button = styled.button`
	display: flex;
	justify-content: center;
	align-items: center;
	color: #ffffff;
	text-align: center;
	width: 7.5rem;
	align-self: center;
	background: #1073c2;
	padding: 0.6rem;
	margin-top: 0.6rem;
	border-radius: 3px;
	cursor: pointer;
`;

const StaffHeader = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 5rem;
`;

StaffHeader.Left = styled.div`
	width: 5rem;
	height: 5rem;
`;
StaffHeader.Right = styled.div`
	justify-content: space-between;
	align-items: flex-start;
	display: flex;
	flex-direction: column;
	height: 50px;
	width: 100%;
	margin-left: 15px;
`;
const StaffBody = styled.div`position: relative;`;
StaffBody.Title = styled.div`
	color: #1b75c0;
	font-weight: 600;
	font-size: 1rem;
	text-align: left;
`;
StaffHeader.Right.Bottom = styled.div``;

const Row = styled.div`
	display: flex;
	flex-direction: row;
	margin-top: 1rem;
`;

const ButtonAddBlock = styled.div`
	display: flex;
	flex-direction: row;
	padding: 0.2rem;
	background-color: #f2f2f2;
	width: 48%;
	font-weight: 600;
	collor: #333;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	border-radius: 3px;
	padding: 0.9rem;
`;

const BlockList = styled.div`
	width: 100%;
	height: 100% !important;
`;


const initialState = {
	pincode: '',
	note: '',
	isAddBlock: false,
	isStart: false,
	isEnd: false,
	start: '02:00 PM',
	end: '02:00 PM',
	isPopupSelectTime: false
};

class Pincode extends Component {
	constructor() {
		super();
		this.state = initialState;
	}

	resetState() {
		this.setState(initialState);
	}

	async checkPincode() {
		const { pincode } = this.state;
		const { checkPinCode } = this.props;
		await checkPinCode(pincode);
		this.closeModal();
		this.setState({ pincode: '' });
	}

	async onChangePincode(e) {
		const val = e.target.value;
		if (e.target.validity.valid) this.setState({ pincode: e.target.value.replace(/^0+/, '') });
		else if (val === '' || val === '-') this.setState({ pincode: val });
	}

	closeModal() {
		const { togglePopupPincode, disableCalendar } = this.props;
		togglePopupPincode(false, '');
		this.resetState();
		disableCalendar(false);
	}

	getTimeLogin() {
		const { staff, currentDay } = this.props;
		let timeLogin = 0;
		switch (moment(currentDay).format('dddd')) {
			case 'Monday':
				timeLogin = staff.workingTimes.Monday.timeStart;
				break;

			case 'Tuesday':
				timeLogin = staff.workingTimes.Tuesday.timeStart;
				break;

			case 'Wednesday':
				timeLogin = staff.workingTimes.Wednesday.timeStart;
				break;

			case 'Thursday':
				timeLogin = staff.workingTimes.Thursday.timeStart;
				break;

			case 'Friday':
				timeLogin = staff.workingTimes.Friday.timeStart;
				break;

			case 'Saturday':
				timeLogin = staff.workingTimes.Saturday.timeStart;
				break;

			default:
				break;
		}
		return timeLogin;
	}

	closePopupSelectTime(time) {
		if (time.isStart) {
			this.setState({
				start: time.data,
				isPopupSelectTime: false,
				isStart: false,
				isEnd: false
			});
		} else if (time.isEnd) {
			const { start } = this.state;
			const beginningTime = moment(start, 'h:mma');
			const endTime = moment(time.data, 'h:mma');
			if (endTime.isSameOrBefore(beginningTime)) {
				alert('End time must be after Start time');
			} else {
				this.setState({
					end: time.data,
					isPopupSelectTime: false,
					isStart: false,
					isEnd: false
				});
			}
		} else {
			this.setState({
				isPopupSelectTime: false,
				isStart: false,
				isEnd: false
			});
		}
	}

	findAppointment() {
		const { calendarMembers, staff } = this.props;
		let count = 0;
		const memApp = calendarMembers.find((mem) => parseInt(mem.memberId) === parseInt(staff.id));
		if (!memApp) return 0;
		count = memApp.appointments.filter((app) => app.status !== 'BLOCK' && app.status !== 'BLOCK_TEMP').length;
		return count.toString();
	}

	submitEditBlock() {
		const { SubmitEditBlockTime, staff } = this.props;
		const { start, end, note } = this.state;
		const beginningTime = moment(start, 'h:mma');
		const endTime = moment(end, 'h:mma');
		if (endTime.isSameOrBefore(beginningTime)) {
			alert('End time must be after Start time');
		} else {
			SubmitEditBlockTime({
				staff,
				start,
				end,
				note
			});
			this.closeModal();
		}
	}

	deleteBlockTime(block) {
		const { staff, deleteBlockTime } = this.props;
		deleteBlockTime({ block, staff });
		this.closeModal();
	}

	renderTimeLogin(timeLogin) {
		if (timeLogin) {
			return (
				<React.Fragment>
					<div>Login : </div>
					<div style={styles.timeLogin}>{timeLogin}</div>
				</React.Fragment>
			);
		}
		return <div>Still not login</div>;
	}

	renderHeaderRight() {
		const { staff } = this.props;
		return (
			<StaffHeader.Right>
				<div style={styles.title}>{staff.title}</div>
				<div style={styles.headerRight}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row'
						}}
					>
						{this.renderTimeLogin(staff.timeLogin)}
					</div>
					<div style={styles.appointmentQuantity}>
						<div>Appointments :</div>
						<div
							style={{
								fontWeight: 600
							}}
						>
							{this.findAppointment()}
						</div>
					</div>
				</div>
			</StaffHeader.Right>
		);
	}

	renderBlockTimeList() {
		const { blockTime } = this.props.staff;
		return blockTime.filter((b) => b.isDisabled === 0).map((obj) => {
			return (
				<div key={obj.blockTimeId} style={styles.blockTime}>
					<div style={{ width: '10%' }}>
						<FaClock color={'#1266AE'} size={18} />
					</div>

					<div style={styles.test}>
						<div style={styles.blockHeader}>
							<div style={styles.workingDate}>{moment(obj.workingDate).format('MM/DD/YYYY')}</div>
							<div style={styles.timeBlock}>
								{obj.blockTimeStart} - {obj.blockTimeEnd}
							</div>
						</div>
						<div style={styles.note}>{obj.note}</div>
					</div>

					<div onClick={() => this.deleteBlockTime(obj)} style={styles.trashButton}>
						<FaTrash color={'#6A6A6A'} size={20} style={styles.trash} />
					</div>
				</div>
			);
		});
	}

	renderStaffBody() {
		const { isAddBlock, start, end } = this.state;
		if (!isAddBlock) {
			return (
				<React.Fragment>
					<ButtonAddBlock onClick={() => this.setState({ isAddBlock: true })}>
						<GiAlarmClock size={20} color={'#4B4B4B'} />
						<div style={{ marginLeft: 8, color: '#4B4B4B' }}>Add block time</div>
					</ButtonAddBlock>
					<BlockList>{this.renderBlockTimeList()}</BlockList>
				</React.Fragment>
			);
		}

		return (
			<StaffBody>
				<StaffBody.Title>Add block time</StaffBody.Title>
				<Row>
					<div style={styles.titleBody}>Time</div>
					<div onClick={() => this.setState({ isPopupSelectTime: true, isStart: true })}>
						<div style={styles.select}>
							{start.toString().substring(0, 5)}
							<span> {start.toString().substring(6, 8)}</span>
							<FaCaretDown style={styles.faCaretDown} />
						</div>
					</div>
					<p style={{ marginLeft: 8, marginTop: 7, fontWeight: '500', fontSize: 16 }}> - </p>
					<div onClick={() => this.setState({ isPopupSelectTime: true, isEnd: true })}>
						<div style={styles.select}>
							{end}
							<FaCaretDown style={styles.faCaretDown} />
						</div>
					</div>
				</Row>
				<Row>
					<div style={styles.titleBody}>Reason</div>
					<div>
						<textarea
							value={this.state.note}
							onChange={(e) => this.setState({ note: e.target.value })}
							style={styles.notes}
						/>
					</div>
				</Row>
				<div onClick={() => this.submitEditBlock()} style={styles.bottom}>
					<div style={styles.btnSubmit}>Submit</div>
				</div>
			</StaffBody>
		);
	}

	renderPopupSelectTime() {
		const { isPopupSelectTime, isStart, isEnd } = this.state;
		if (isPopupSelectTime) {
			return (
				<PopupSelectTime
					closePopupSelectTime={(time) => this.closePopupSelectTime(time)}
					isStart={isStart}
					isEnd={isEnd}
				/>
			);
		}
		return null;
	}

	render() {
		const { popupPincode, staff } = this.props;
		const { isPopupSelectTime } = this.state;

		if (popupPincode === false) return '';
		return (
			<FormPincode open closeOnDocumentClick={false}>
				<TiDelete
					onClick={isPopupSelectTime ? () => {} : () => this.closeModal()}
					color="#6A6A6A"
					size={38}
					style={styles.closeModal}
				/>

				<PincodeBody>
					<StaffHeader>
						<StaffHeader.Left>
							<img style={styles.imgStaff} src={staff.imageUrl} atl="" />
						</StaffHeader.Left>
						{this.renderHeaderRight()}
					</StaffHeader>
					{this.renderStaffBody()}
				</PincodeBody>

				{this.renderPopupSelectTime()}
			</FormPincode>
		);
	}
}

export default Pincode;

const styles = {
	test: {
		width: '80%',
		textAlign: 'left',
		wordBreak: 'break-all',
		marginLeft: 10
	},
	imgStaff: {
		width: 50,
		height: 50,
		borderRadius: 40
	},
	faCaretDown: {
		position: 'absolute',
		right: 5,
		top: 9,
		width: 17,
		height: 17,
		color: '#333'
	},
	select: {
		width: 123,
		height: 40,
		borderWidth: 1,
		borderColor: '#dddddd',
		borderStyle: 'solid',
		marginLeft: 10,
		fontWeight: 300,
		paddingTop: 12,
		position: 'relative'
	},
	titleBody: {
		width: 100,
		textAlign: 'left',
		marginTop: 8,
		fontSize: 16
	},
	notes: {
		width: 270,
		height: 120,
		borderWidth: 1,
		borderColor: '#dddddd',
		borderStyle: 'solid',
		marginLeft: 10,
		backgroundColor: '#FAFAFA',
		padding: 10,
		reSize: 'none'
	},
	btnSubmit: {
		textAlign: 'center',
		padding: 12,
		width: 100,
		color: '#ffffff',
		backgroundColor: '#1B75C0',
		fontSize: 16,
		fontWeight: '500',
		letterSpacing: 0.3,
		cursor: 'pointer',
		borderRadius: 3
	},
	bottom: {
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		marginTop: 15
	},
	blockTime: {
		padding: 10,
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: '#dddddd',
		marginTop: 10
	},
	blockHeader: {
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 10
	},
	workingDate: {
		fontWeight: 300,
		color: '#6A6A6A'
	},
	timeBlock: {
		marginLeft: 15,
		fontWeight: '600',
		color: '#333'
	},
	trash: {
		// position: 'absolute',
		// top: '10%',
		// right: 8
	},
	trashButton: {
		width: '10%',
		position: 'relative',
		cursor: 'pointer',
		justifyContent: 'center',
		alignItems: 'center',
		display: 'flex'
	},
	closeModal: {
		position: 'absolute',
		right: 5,
		top: 5,
		cursor: 'pointer'
	},
	headerRight: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between',
		alignItems: 'stretch'
	},
	title: {
		fontSize: 18,
		fontWeight: '700',
		color: '#1266AE'
	},
	timeLogin: {
		fontWeight: '600',
		marginLeft: 15
	},
	appointmentQuantity: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'stretch',
		flexDirection: 'row'
	},
	note: {
		letterSpacing: 0.3
	}
};

