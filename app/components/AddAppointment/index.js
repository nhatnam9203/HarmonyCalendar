import React from 'react';
import PropTypes from 'prop-types';
import { formatUsPhone, checkStringNumber2 } from '../../utils/helper';
import Layout from './layout'


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
	error_addApointment: '',
	referedBy: '',
	isSendLink: true
};

class AddAppointment extends Layout {
	constructor(props) {
		super(props);
		this.state = initialState;
	}


	async componentWillReceiveProps(nextProps) {
		if (nextProps.StateAddCustomerSuccess === true) {
			this.showInsertCustomerSuccess();
		}
		if (nextProps.checkPhoneError === true) {
			// phone is not exist
			const { firstName, lastName, email, phone, referrerPhone, favourite, referrerBy } = nextProps.InfoAfterCheckPhone;
			this.setState({
				first_name: firstName,
				last_name: lastName,
				email: email,
				phoneNumber: phone === undefined ? ' ' : phone.includes("+84") ? phone.slice(3) : phone.slice(2),
				phone: referrerPhone,
				notes: favourite ? favourite.split(',') : [],
				referedBy: referrerBy
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
		const { time, staffID, dataAnyStaff } = this.props.TimeAndStaffID;
		const phone = checkStringNumber2(phoneNumber.toString()); // lấy ra số phone , ex : 123-456-7890
		await this.setState({ phoneNumber: phone });
		if(phone.trim() !== ""){
			const payload = {
				phone: `${this.state.phoneCheck}${phone}`,
				time,
				staffID
			}
			this.props.checkPhoneNumberCustomer(payload);
		}
	}

	handleSubmitAppointment = () => {
		const { time, staffID, dataAnyStaff } = this.props.TimeAndStaffID;
		const { first_name, last_name, phoneNumber, phone, notes, email, phoneCheck, refPhoneHeader, referedBy, isSendLink } = this.state;
		const refFone = phone ? phone : '';
		if (first_name.trim() !== '' && last_name.trim() !== '') {
			const data = {
				first_name,
				last_name,
				phone: `+${phoneCheck}${phoneNumber}`,
				refPhone: refFone ? refPhoneHeader + checkStringNumber2(refFone.toString()) : "",
				note: notes.toString(),
				time,
				staffID,
				email,
				referedBy,
				isSendLink,
				dataAnyStaff: dataAnyStaff ? dataAnyStaff : '',
			}
			this.props.addCustomer(data);
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

	handleChangeReferedBy(e) {
		this.setState({ referedBy: e.target.value })
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

	addNotes() {
		const { notes, noteValue } = this.state;
		if (noteValue !== '') {
			this.setState({ notes: [...notes, noteValue], noteValue: '' });
		}
	}

	toggleSendLink() {
		const { isSendLink } = this.state;
		this.setState({ isSendLink: !isSendLink })
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
				refPhone = '(+84) ' + formatUsPhone(phone.substring(3));
			} else if (phone.charAt(0) === '8' && phone.charAt(1) === '4') {
				refPhone = '(+84) ' + formatUsPhone(phone.substring(2));
			} else {
				refPhone = '(+1) ' + formatUsPhone(phone.substring(2));
			}
		}
		return refPhone;
	}
}

AddAppointment.propTypes = {
	appointment: PropTypes.any,
	closeAddingAppointment: PropTypes.func
};

export default AddAppointment;
