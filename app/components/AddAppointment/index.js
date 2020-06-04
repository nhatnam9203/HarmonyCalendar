import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import { FaTimesCircle } from 'react-icons/fa';
import Enter from '../../images/enter.png';
import moment from 'moment';
import { formatUsPhone, checkStringNumber2 } from '../../utils/helper';
import NumberFormat from 'react-number-format';
import { MdSubdirectoryArrowLeft } from 'react-icons/md';

const AppPopup = styled(Popup)`
  border-radius: 1.5rem;
  padding: 0 !important;
  border: none !important;
  overflow: hidden;
`;

const AppPopupWrapper = styled.div`position: relative;`;

AppPopupWrapper.Header = styled.div`
	height: 3rem;
	font-size: 20px;
	font-weight: bold;
	background: ${(props) => props.backgroundColor};
	color: #ffffff;
	width: 100%;
	padding: 0.5rem 1rem;
	line-height: 1.5;
	text-align: center;
`;

AppPopupWrapper.Close = styled.div`
	position: absolute;
	right: 0.5rem;
	top: 0.25rem;
	line-height: 1;
	font-size: 2rem;
	color: #ffffff;
	cursor: pointer;
`;

AppPopupWrapper.Body = styled.div`
	background: #ffffff;
	width: 100%;
	padding: 1rem 1rem 0 1rem;
`;

AppPopupWrapper.Footer = styled.div`
	display: flex;
	flex-direction: row;
	padding: 0.5rem 1rem 1rem 1rem;

	& > div {
		flex: 1;
		text-align: center;
	}
	& > select {
		width: 5rem;
		height: 3rem;
	}
`;

// ************************************************* //
// ************************************************* //
// ************************************************* //

const SearchingPopup = styled(AppPopup)`
  width: 30rem !important;
  
`;

const SearchingWrapper = styled(AppPopupWrapper)`
  //
`;

SearchingWrapper.Header = styled(AppPopupWrapper.Header)`
  //
`;

SearchingWrapper.Body = styled(AppPopupWrapper.Body)`
  text-align: center;
`;

SearchingWrapper.Close = styled(AppPopupWrapper.Close)`
  //
`;

SearchingWrapper.Footer = styled.div`
	display: flex;
	padding: 0.5rem 1rem 1rem 1rem;
`;

// ************************************************* //
// ************************************************* //
// ************************************************* //

const AddingPopup = styled(AppPopup)`
  width: 30rem !important;
`;

const AddingWrapper = styled(AppPopupWrapper)`

`;

AddingWrapper.Header = styled(AppPopupWrapper.Header)`
  //
`;

AddingWrapper.Body = styled(AppPopupWrapper.Body)`
  text-align: center;
  height : 26rem;
  overflow-y : scroll;
`;

AddingWrapper.Close = styled(AppPopupWrapper.Close)`
  //
`;

AddingWrapper.Footer = styled(AppPopupWrapper.Footer)`
  //
`;

// ************************************************* //
// ************************************************* //
// ************************************************* //

const Img = styled.img`filter: invert(100%);`;

const Label = styled.div`
	margin-bottom: 0.3rem;
	text-align: left;
`;

const FooterChekPhone = styled.div`
	width: 100%;
	padding: 1rem;
	text-align: center;
`;

const FormCheckPhone = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 2.5rem;
	margin-bottom: 1rem;
	& > input {
		flex: 1;
		text-align: left;
		background: #ffffff;
		border: 1px solid #dddddd;
		border-radius: 4px;
		padding-left: 1.3rem;
		-moz-appearance: none;
		/* for Chrome */
		-webkit-appearance: none;
	}
	& > select {
		width: 4rem;
		background: #ffffff;
		border: 1px solid #dddddd;
		border-radius: 4px;
		margin-right: 0.5rem;
		padding-left: 1.2rem;
		-moz-appearance: none;
		/* for Chrome */
		-webkit-appearance: none;
	}
`;

const Form = styled.form`
  flex : 1;
  text-align: center;
  };

  input {
    width: 100%;
    background: #ffffff;
    border: 1px solid #dddddd;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    padding: 0.5rem 1rem;
    margin-bottom: 1rem;
    text-align: left;
    -moz-appearance: none;
  /* for Chrome */
  -webkit-appearance: none;

    &.w-50 {
      width: 48%;
    }
  }
`;

const Button = styled.button`
	border-radius: 4px;
	background: ${(props) => (props.primary ? '#0071c5' : '#eeeeee')};
	color: ${(props) => (props.primary ? '#ffffff' : '#333333')};
	border: 1px solid #dddddd;
	font-size: 1rem;
	line-height: 2.8;
	height: 100%;
	cursor: pointer;
	text-align: center;
	padding: 0 2rem;
`;

const NoteWrapper = styled.div`
	border: 1px solid #dddddd;
	background: #eeeeee;
	padding: 0.5rem;
	height: 10rem;
	text-align: left;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	word-wrap: break-word;
`;

NoteWrapper.Form = styled.form`
	display: flex;

	& > input {
		flex: 1;
		background: #ffffff;
		border: 1px solid #dddddd;
		border-right: none;
		border-top-left-radius: 4px;
		border-bottom-left-radius: 4px;
		padding: 0 1rem;
		-moz-appearance: none;
		/* for Chrome */
		-webkit-appearance: none;
	}
	& > button {
		width: 5rem;
		border-top-right-radius: 4px;
		border-bottom-right-radius: 4px;
		background: #0071c5;
		color: #ffffff;
		line-height: 2.8;
		cursor: pointer;
		text-align: center;
	}
`;

const NoteInformation = styled.div`
	display: flex;
	padding: 0.5rem;
	width: 10rem;
	background: red;
`;

const initialState = {
	isOpenSearchingPopup: true,
	isOpenAddingPopup: false,
	first_name: '',
	last_name: '',
	phone: '',
	phoneNumber: '',
	phoneCheck: '1',
	refPhoneHeader: '1',
	noteValue: '',
	notes: [],
	email: '',
	error_phone: '',
	success_addApointment: '',
	error_addApointment: ''
};

class AddAppointment extends React.Component {
	constructor(props) {
		super(props);
		this.state = initialState;
	}

	closeAllModal() {
		this.setState({
			isOpenSearchingPopup: true,
			isOpenAddingPopup: false,
			phoneNumber: ''
		});
		this.resetState();
		this.props.checkPhoneNumberCustomerError(false);
		this.props.checkPhoneNumberCustomerSuccess(false);
		this.props.disableCalendar(false);
		this.props.closeAddingAppointment();
		this.props.closeTimeAndStaffID('');
		this.props.infoCheckPhone('');
		this.props.addCustomerSuccess(false);
	}

	async handleSubmitVerifyPhone() {
		const { phoneNumber } = this.state;
		const { time, staffID } = this.props.TimeAndStaffID;
		const phone = checkStringNumber2(phoneNumber.toString()); // lấy ra số phone , ex : 123-456-7890
		await this.setState({ phoneNumber: phone });
		this.props.checkPhoneNumberCustomer({
			phone: `${this.state.phoneCheck}${phone}`,
			time,
			staffID
		});
	}

	handleSubmitAppointment = () => {
		const { time, staffID } = this.props.TimeAndStaffID;
		const { first_name, last_name, phoneNumber, phone, notes, email, phoneCheck, refPhoneHeader } = this.state;
		const refFone = phone ? phone : '';
		// return;
		if (first_name.trim() !== '' && last_name.trim() !== '') {
			this.props.addCustomer({
				first_name,
				last_name,
				phone: `+${phoneCheck}${phoneNumber}`,
				refPhone: refPhoneHeader + checkStringNumber2(refFone.toString()),
				note: notes.toString(),
				time,
				staffID,
				email
			});
			this.props.infoCheckPhone('');
			this.closeAllModal();
		}
	};

	async handleChange(e) {
		const val = e.target.value;
		if (e.target.validity.valid) this.setState({ phoneNumber: e.target.value.replace(/^0+/, '') });
		else if (val === '' || val === '-') this.setState({ phoneNumber: val });
	}

	handleChangeNote(e) {
		this.setState({ noteValue: e.target.value });
	}

	renderNote = (note, index) => (
		<NoteInformation key={index}>
			<div>{note}</div>
		</NoteInformation>
	);

	renderNotes() {
		return (
			<div
				style={{
					height: 60,
					overflowY: 'scroll'
				}}
			>
				{this.state.notes.toString()}
			</div>
		);
	}

	phoneNumberError = () => {
		const { checkPhoneNumberCustomerError } = this.props;
		this.setState({ error_phone: 'This phone number already exist !!!' });
		setTimeout(() => {
			this.setState({ error_phone: '' });
			checkPhoneNumberCustomerError(false);
		}, 3000);
	};

	showInsertCustomerSuccess = () => {
		setTimeout(() => {
			this.setState({
				first_name: '',
				last_name: '',
				countryCode: '+1',
				phone: '',
				phoneNumber: '',
				success_addApointment: 'Add appointment succesful !!!'
			});
			this.closeAllModal();
		}, 300);
	};

	openFormInsertAfterCheckPhone = () => {
		if (this.state.phoneNumber.trim() !== '') {
			this.setState({
				isOpenSearchingPopup: false,
				isOpenAddingPopup: true
			});
		}
	};

	resetState() {
		this.setState(initialState);
	}

	async componentWillReceiveProps(nextProps) {
		if (nextProps.StateAddCustomerSuccess === true) {
			this.showInsertCustomerSuccess();
		}
		if (nextProps.checkPhoneError === true) {
			// phone is not exist
			const { firstName, lastName, email, phone, referrerPhone, favourite } = nextProps.InfoAfterCheckPhone;
			this.setState({
				first_name: firstName,
				last_name: lastName,
				email: email,
				phoneNumber: phone === undefined ? ' ' : phone.slice(2),
				phone: referrerPhone,
				notes: favourite ? favourite : ''
			});
			this.openFormInsertAfterCheckPhone();
		}
		if (nextProps.checkPhoneError === false) {
			// phone exist
			if (nextProps.checkPhoneSuccess === true) {
				this.openFormInsertAfterCheckPhone();
			}
		}
	}

	addNotes() {
		const { notes, noteValue } = this.state;
		if (noteValue !== '') {
			this.setState({ notes: [ ...notes, noteValue ], noteValue: '' });
		}
	}

	RefPhoneExist() {
		const { phone } = this.state;
		let refPhone = '';
		if (phone) {
			if (phone.charAt(1) === '1') {
				refPhone = '(+1) ' + formatUsPhone(phone.substring(2));
			} else if (phone.charAt(0) === '1') {
				refPhone = '(+1) ' + formatUsPhone(phone.substring(1));
			} else if (phone.charAt(1) === '8' && phone.charAt(2) === '4') {
				refPhone = '(+84) ' + formatUsPhone(phone.substring(2));
			} else if (phone.charAt(0) === '8' && phone.charAt(1) === '4') {
				refPhone = '(+84) ' + formatUsPhone(phone.substring(2));
			} else {
				refPhone = '(+1) ' + formatUsPhone(phone.substring(2));
			}
		}
		return refPhone;
	}

	render() {
		const {
			isOpenSearchingPopup,
			isOpenAddingPopup,
			notes,
			error_phone,
			success_addApointment,
			phone
		} = this.state;
		const { appointment, InfoAfterCheckPhone, StateAddCustomerSuccess, checkPhoneError } = this.props;
		const PhoneShow = `+(${this.state.phoneCheck}) ${formatUsPhone(this.state.phoneNumber)}`;

		if (!appointment) return '';
		return (
			<div>
				<SearchingPopup open={isOpenSearchingPopup} closeOnDocumentClick={false} lockScroll={true}>
					<SearchingWrapper>
						<SearchingWrapper.Close onClick={() => this.closeAllModal()}>
							<FaTimesCircle />
						</SearchingWrapper.Close>
						<SearchingWrapper.Header backgroundColor="#0071C5">Add Appointment</SearchingWrapper.Header>
						<SearchingWrapper.Body>Enter phone number</SearchingWrapper.Body>
						<FooterChekPhone>
							<FormCheckPhone>
								<select
									value={this.state.phoneCheck}
									onChange={(e) => this.setState({ phoneCheck: e.target.value })}
									className=""
									name=""
									id=""
								>
									<option value="1">+1</option>
									<option value="84">+84</option>
									<option />
								</select>
								<NumberFormat
									format="###-###-####"
									mask="_"
									value={this.state.phoneNumber}
									onChange={(e) => this.handleChange(e)}
									placeholder="Enter phone number"
									type="tel"
								/>
							</FormCheckPhone>
							<Button
								onClick={() => this.handleSubmitVerifyPhone()}
								id="submit-create-appointment"
								primary
							>
								Next
							</Button>
							{error_phone && <p style={{ color: 'red' }}>{error_phone}</p>}
						</FooterChekPhone>
					</SearchingWrapper>
				</SearchingPopup>
				<AddingPopup
					open={isOpenAddingPopup}
					onClose={() => this.closeAllModal()}
					closeOnDocumentClick={false}
					modal={true}
					position={'left center'}
					// lockScroll={true}
				>
					<AddingWrapper>
						<AddingWrapper.Close onClick={() => this.closeAllModal()}>
							<FaTimesCircle />
						</AddingWrapper.Close>
						<AddingWrapper.Header backgroundColor="#00b4f7">Add Appointment</AddingWrapper.Header>
						<AddingWrapper.Body>
							<Form onSubmit={(e) => e.preventDefault()}>
								{success_addApointment && <p style={{ color: '#8D9440' }}>{success_addApointment}</p>}
								{!checkPhoneError && (
									<Label style={{ textAlign: 'center' }}>
										Phone number is not exist ! Get information !
									</Label>
								)}
								{checkPhoneError && <Label style={{ textAlign: 'center' }}>Phone number</Label>}
								<input style={{ textAlign: 'center' }} value={PhoneShow} type="text" disabled />
							</Form>
							<Form className="left" onSubmit={(e) => e.preventDefault()}>
								<Label>Customer Name *</Label>
								<div style={{ display: 'flex', justifyContent: 'space-between' }}>
									<input
										disabled={InfoAfterCheckPhone !== ''}
										value={this.state.first_name}
										onChange={(e) => this.setState({ first_name: e.target.value })}
										placeholder="First Name"
										className="w-50"
									/>
									<input
										disabled={InfoAfterCheckPhone !== ''}
										value={this.state.last_name}
										onChange={(e) => this.setState({ last_name: e.target.value })}
										placeholder="Last Name"
										className="w-50"
									/>
								</div>
							</Form>
							<Form className="left" onSubmit={(e) => e.preventDefault()}>
								<Label>Email</Label>
								<div style={{ display: 'flex', justifyContent: 'space-between' }}>
									<input
										disabled={InfoAfterCheckPhone !== ''}
										type="email"
										value={this.state.email}
										onChange={(e) => this.setState({ email: e.target.value })}
										placeholder="Email"
									/>
								</div>
							</Form>
							<Form className="left" onSubmit={(e) => e.preventDefault()}>
								<Label>Referrer Phone Number</Label>
								{InfoAfterCheckPhone === '' && (
									<div style={{ display: 'flex', flexDirection: 'row' }}>
										<select
											value={this.state.refPhoneHeader}
											onChange={(e) => this.setState({ refPhoneHeader: e.target.value })}
											className="headerRefPhone"
											name=""
											id=""
										>
											<option value="1">+1</option>
											<option value="84">+84</option>
											<option />
										</select>
										<NumberFormat
											format="###-###-####"
											mask="_"
											value={this.state.phone}
											onChange={(e) => this.setState({ phone: e.target.value })}
											type="tel"
										/>
									</div>
								)}
								{InfoAfterCheckPhone !== '' && (
									<input
										disabled={InfoAfterCheckPhone !== ''}
										value={this.RefPhoneExist()}
										onChange={(e) => this.setState({ phone: e.target.value })}
										placeholder="Phone number"
										type="tel"
									/>
								)}
							</Form>
							<NoteWrapper>
								<Label>Note:</Label>
								<NoteWrapper.Form onSubmit={(e) => e.preventDefault()}>
									<input
										value={this.state.noteValue}
										disabled={InfoAfterCheckPhone !== ''}
										onChange={(e) => this.handleChangeNote(e)}
									/>
									<button type="submit" onClick={() => this.addNotes()}>
										{/* <Img src={Enter} alt="icon" /> */}
										<MdSubdirectoryArrowLeft
											style={{
												width: 28,
												height: 28
											}}
										/>
									</button>
								</NoteWrapper.Form>
								{/* {notes.map((note, index) => this.renderNote(note, index))} */}
								{this.renderNotes()}
							</NoteWrapper>
							<div style={{ height: 70 }} />
						</AddingWrapper.Body>
						<AddingWrapper.Footer>
							<div>
								<Button
									onClick={this.handleSubmitAppointment}
									disabled={StateAddCustomerSuccess}
									type="button"
									primary
								>
									Next
								</Button>
							</div>
						</AddingWrapper.Footer>
					</AddingWrapper>
				</AddingPopup>
			</div>
		);
	}
}

AddAppointment.propTypes = {
	appointment: PropTypes.any,
	closeAddingAppointment: PropTypes.func
};

export default AddAppointment;
