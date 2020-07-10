import React, { Component } from 'react';
import Popup from 'reactjs-popup';
import styled from 'styled-components';
import { FaClock } from 'react-icons/fa';
import { MdAccessAlarms } from 'react-icons/md';
import { FaTrash, FaCaretDown } from 'react-icons/fa';
import { IoIosCloseCircle } from 'react-icons/io';
import { PopupTimePicker } from '../DetailAppointment/widget';
import ConfirmDelete from './ConfirmDelete';
import moment from 'moment';

const Container = styled(Popup)`
    padding : 0 !important;
    padding-bottom : 1rem !important;
    width : 26rem !important;	
    max-height : 30rem;
    border : none !important;
    border-radius : 0.8rem;    
    position : relative;
	box-shadow:  ${(props) => (props.active ? 'none' : '0 1px #fff inset, 0 0.6px 10px #1FB5F4')};
`;

const OverLay = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	border-radius: 0.8rem;
	background-color: rgba(0, 0, 0, 0.3);
`;

Container.Header = styled.div`
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

const BodyPopup = styled.div`
	max-height: 30rem;
	padding: 1rem;
	text-align: center;
	display: flex;
	flex-direction: column;
	overflow-y: scroll;
`;

BodyPopup.Input = styled.input`
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

BodyPopup.Button = styled.button`
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
	width: 55%;
	font-weight: 600;
	/* collor: #333; */
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
	noteSubmit: '',
	isAddBlock: false,
	isStart: false,
	isEnd: false,
	start: '02:00 PM',
	end: '02:00 PM',
	isPopupSelectTime: false,
	blockTimeEdit: null,
	isPopupDelete: false,
	blockDelete: null
};

class PopupBlockTime extends Component {
	constructor() {
		super();
		this.state = initialState;
	}

	resetState() {
		this.setState(initialState);
	}

	closeModal() {
		const { togglePopupPincode, disableCalendar } = this.props;
		togglePopupPincode(false, '');
		this.resetState();
		this.setState({ isAddBlock: false });
		disableCalendar(false);
	}

	closePopupSelectTime(time) {
		this.setState({ isPopupSelectTime: false, isStart: false, isEnd: false });
	}

	countAppointment() {
		const { calendarMembers, staff } = this.props;
		let count = 0;
		const memApp = calendarMembers.find((mem) => parseInt(mem.memberId) === parseInt(staff.id));
		if (!memApp) return 0;
		count = memApp.appointments.filter((app) => app.status !== 'BLOCK' && app.status !== 'BLOCK_TEMP').length;
		return count.toString();
	}

	editBlockTime() {
		const { blockTimeEdit, start, end, note } = this.state;
		if (blockTimeEdit) {
			const noteSubmit = note.replace(/(\r\n|\n|\r)/gm, '<br>');
			const data = { start, end, note: noteSubmit, id: blockTimeEdit.blockTimeId };
			this.props.editBlockTime(data);
			this.closeModal();
		}
	}

	async handleNoteChange(e) {
		await this.setState({ note: e.target.value });
	}

	openBlockTime(blockTime) {
		if (blockTime.editable) {
			this.setState({
				isAddBlock: true,
				blockTimeEdit: blockTime,
				note: blockTime.note.replace(/<br>/gm, '\n'),
				start: blockTime.blockTimeStart,
				end: blockTime.blockTimeEnd
			});
		}
	}

	doneTimePicker(time) {
		const { isStart, isEnd } = this.state;

		if (isStart) {
			this.setState({ isPopupSelectTime: false, start: time.substring(11), isStart: false, isEnd: false });
		} else if (isEnd) {
			this.setState({ isPopupSelectTime: false, end: time.substring(11), isStart: false, isEnd: false });
		}
	}

	submitEditBlock() {
		const { staff } = this.props;
		const { start, end, note, blockTimeEdit } = this.state;
		const noteSubmit = note.replace(/(\r\n|\n|\r)/gm, '<br>');
		const beginningTime = moment(start, 'h:mma');
		const endTime = moment(end, 'h:mma');

		if (endTime.isSameOrBefore(beginningTime)) {
			alert('End time must be after Start time');
		} else {
			if (!blockTimeEdit) {
				const data = { staff, start, end, note: noteSubmit };
				this.props.SubmitEditBlockTime(data);
				this.closeModal();
			} else {
				this.editBlockTime();
			}
		}
	}

	deleteBlockTime() {
		const { blockDelete } = this.state;
		const { staff, deleteBlockTime } = this.props;
		deleteBlockTime({ block: blockDelete, staff });
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
					<div style={{ display: 'flex', flexDirection: 'row' }}>{this.renderTimeLogin(staff.timeLogin)}</div>
					<div style={styles.appointmentQuantity}>
						<div>Appointments : </div>
						<div style={{ fontWeight: 600 }}>&nbsp;{`${this.countAppointment()}`}</div>
					</div>
				</div>
			</StaffHeader.Right>
		);
	}

	renderBlockTimeList() {
		const { blockTime } = this.props.staff;
		return blockTime.filter((b) => b.isDisabled === 0).map((obj) => {
			const notes_array = obj.note.split('<br>');
			return (
				<div
					onClick={() => this.openBlockTime(obj)}
					key={'blockTime' + obj.blockTimeId + Math.random()}
					style={styles.blockTime}
				>
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

						{notes_array.map((_note, index) => {
							return (
								<div key={'note' + index} style={styles.note}>
									{_note}
								</div>
							);
						})}
					</div>

					{obj.editable && (
						<div
							onClick={() => {
								this.setState({ isPopupDelete: true, blockDelete: obj }, () => {
									this.setState({ isAddBlock: false });
								});
							}}
							style={styles.trashButton}
						>
							<FaTrash color={'#6A6A6A'} size={20} style={styles.trash} />
						</div>
					)}
				</div>
			);
		});
	}

	renderStaffBody() {
		const { isAddBlock, start, end, blockTimeEdit } = this.state;
		if (!isAddBlock) {
			return (
				<React.Fragment>
					<ButtonAddBlock onClick={() => this.setState({ isAddBlock: true })}>
						<MdAccessAlarms size={20} color={'#4B4B4B'} />
						<div style={{ marginLeft: 8, color: '#4B4B4B' }}>Add Blocked Time</div>
					</ButtonAddBlock>
					<BlockList>{this.renderBlockTimeList()}</BlockList>
				</React.Fragment>
			);
		}

		return (
			<StaffBody>
				<StaffBody.Title>Add Blocked Time</StaffBody.Title>
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
							onChange={(e) => this.handleNoteChange(e)}
							style={styles.notes}
						/>
					</div>
				</Row>
				{!blockTimeEdit && (
					<div onClick={() => this.submitEditBlock()} style={styles.bottom}>
						<div style={styles.btnSubmit}>Submit</div>
					</div>
				)}
				{blockTimeEdit && (
					<div onClick={() => this.submitEditBlock()} style={styles.bottom}>
						<div style={styles.btnSubmit}>Save</div>
					</div>
				)}
			</StaffBody>
		);
	}

	renderPopupSelectTime() {
		const { isPopupSelectTime, isStart, isEnd } = this.state;
		if (isPopupSelectTime) {
			return (
				<PopupTimePicker
					cancelTimePicker={() => this.closePopupSelectTime()}
					doneTimePicker={(time) => this.doneTimePicker(time)}
					currentDay={this.props.currentDay}
					fromTime={moment()}
					style={{
						left: 35,
						top: 100
					}}
				/>
			);
		}
		return null;
	}

	renderPopupDelete() {
		const { isPopupDelete } = this.state;
		if (isPopupDelete) {
			return (
				<ConfirmDelete
					onPressNo={() => this.setState({ isPopupDelete: false })}
					onPressYes={() => this.deleteBlockTime()}
				/>
			);
		}
		return null;
	}

	render() {
		const { popupPincode, staff } = this.props;
		const { isPopupSelectTime, isAddBlock } = this.state;

		if (popupPincode === false) return '';
		return (
			<Container active={isPopupSelectTime} open closeOnDocumentClick={false}>
				<React.Fragment>
					<IoIosCloseCircle
						onClick={isPopupSelectTime ? () => {} : () => this.closeModal()}
						color="#6A6A6A"
						size={35}
						style={styles.closeModal}
					/>
					<BodyPopup>
						<StaffHeader>
							<StaffHeader.Left>
								<img style={styles.imgStaff} src={staff.imageUrl} atl="" />
							</StaffHeader.Left>
							{this.renderHeaderRight()}
						</StaffHeader>
						{this.renderStaffBody()}
					</BodyPopup>
					{isPopupSelectTime && <OverLay />}
					{this.renderPopupSelectTime()}
					{this.renderPopupDelete()}
				</React.Fragment>
			</Container>
		);
	}
}

export default PopupBlockTime;

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
