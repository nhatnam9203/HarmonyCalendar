import PropTypes from 'prop-types';
import { formatUsPhone, checkStringNumber2 } from '../../utils/helper';
import Layout from './layout';
import { validateEmail } from "../../utils/helper";

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
	isSendLink: true,
	isPopupCustomer: false,
};

class AddAppointment extends Layout {
	constructor(props) {
		super(props);
		this.state = initialState;
	}

	openPopupCustomer() {
		this.setState({
			isPopupCustomer: true,
			isOpenSearchingPopup: false
		});
	}

	closePopupCustomer() {
		this.setState({ isPopupCustomer: false });
	}

	onClickNumber = (number) => {
		if (number === ".") return;
		let { phoneNumber } = this.state;
		if (number === "x") {
			phoneNumber = phoneNumber.substring(0, phoneNumber.length - 1);
		} else {
			if (phoneNumber.toString().length < 10) {
				phoneNumber += number;
			}
		}
		this.setState({ phoneNumber })
	}

	async componentWillReceiveProps(nextProps) {
		if (nextProps.StateAddCustomerSuccess === true) {
			this.showInsertCustomerSuccess();
		}
		if (nextProps.checkPhoneError === true) {
			// phone exist
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
			this.openPopupCustomer();
		}
		if (nextProps.checkPhoneError === false) {
			// phone is not exist
			if (nextProps.checkPhoneSuccess === true) {
				this.openFormInsertAfterCheckPhone();
			}
		}
	}

	closeAllModal = () => {
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
		this.closePopupCustomer();
	}

	handleSubmitVerifyPhone = async () => {
		let phoneNumber = this.refPopupPhone.current.refPhone.current.value;
		const phone = checkStringNumber2(phoneNumber.toString()); // lấy ra số phone , ex : 123-456-7890
		if (phone.trim() !== "") {
			const kt_phone = phone.toString().replace(/-/g, '');
			if (parseInt(this.state.phoneCheck) === 84) {
				if (kt_phone.toString().length < 9) {
					alert("Phone number must have at least 9 digits");
					return;
				}
			}
			if (parseInt(this.state.phoneCheck) === 1) {
				if (kt_phone.toString().length < 10) {
					alert("Phone number must have at least 10 digits");
					return;
				}
			}

			await this.setState({ phoneNumber: phone });
			const payload = {
				phone: `${this.state.phoneCheck}${phone}`,
			}
			this.props.checkPhoneNumberCustomer(payload);
		}
	}

	handleSubmitAppointment = (isPopupCustomer) => {
		const { time, staffID, dataAnyStaff } = this.props.TimeAndStaffID;
		const { first_name, last_name, phoneNumber, phone, notes, email, phoneCheck, refPhoneHeader, referedBy, isSendLink } = this.state;
		const refFone = phone ? phone : '';

		if (email && email !== "" && !validateEmail(email)) {
			alert("Invalid email");
			return;
		}


		if (refFone && refFone !== "") {
			let checkRefPhone = checkStringNumber2(refFone.toString());
			checkRefPhone = checkRefPhone.toString().replace(/-/g, '');
			if (parseInt(refPhoneHeader) === 84) {
				if (checkRefPhone.toString().length < 9) {
					alert("Referral phone number must have at least 9 digits");
					return;
				}
			}
			if (parseInt(refPhoneHeader) === 1) {
				if (checkRefPhone.toString().length < 10) {
					alert("Referral phone number must have at least 10 digits");
					return;
				}
			}
		}


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
		if (isPopupCustomer == true) {
			this.props.addCustomer(data);
			this.props.infoCheckPhone('');
			this.closeAllModal();
		} else
			if (first_name.trim() !== '' && last_name.trim() !== '') {
				this.props.addCustomer(data);
				this.props.infoCheckPhone('');
				this.closeAllModal();
			}
	};

	addAppointmentExistCustomer = (isPopupCustomer) => {
		const { time, staffID, dataAnyStaff } = this.props.TimeAndStaffID;
		const { first_name, last_name, phoneNumber, phone, notes, email, phoneCheck, refPhoneHeader, referedBy, isSendLink } = this.state;
		const refFone = phone ? phone : '';

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
		if (isPopupCustomer == true) {
			this.props.addCustomer(data);
			this.props.infoCheckPhone('');
			this.closeAllModal();
		} else
			if (first_name.trim() !== '' && last_name.trim() !== '') {
				this.props.addCustomer(data);
				this.props.infoCheckPhone('');
				this.closeAllModal();
			}
	};

	handleChangeNumber = async (e) => {
		console.log({ value: e.target.value });
		this.setState({ phoneNumber: e.target.value });
	}

	onChangePhoneCheck = (value) => {
		this.setState({ phoneCheck: value });
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
