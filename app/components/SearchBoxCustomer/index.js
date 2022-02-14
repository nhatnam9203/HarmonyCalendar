import moment from 'moment';
import layout from './layout';
import { GET_APPOINTMENT_ID, token } from '../../../app-constants';
import axios from "axios";

export default class SearchBoxCustomer extends layout {

    constructor(props) {
        super(props);
        this.state = {
            valueInput: '',
            indexActive: '',
            isLoading: '',
        }
    }

    onChangeInput = (e) => {
        this.setState({ valueInput: e.target.value });
    }

    onClickSearch = () => {
        const { valueInput } = this.state;
        const data = encodeURIComponent(valueInput);
        if (valueInput.length > 0) {
            this.setState({ isLoading: true })
            this.props.searchCustomerBox({ data, cb: this.stopLoading });
        }
    }

    stopLoading = () => {
        this.setState({ isLoading: false })
    }

    closeSearchBox = () => {
        this.props.toggleSearchBox(false);
        this.setState({ valueInput: '', indexActive: '', isLoading: '' });
    }

    selectItem = (date, appointment) => {
        this.setState({ indexActive: appointment.appointmentId });
        this.props.onChangeDay(moment(date).format('DDMMYYYY'));
        this.props.scrollToAppointment(appointment.appointmentId);
        let app = {
            ...appointment,
            id: appointment.appointmentId
        }
        this.props.getApppointmentById({ appointment: app });
        setTimeout(() => {
            this.closeSearchBox();
        }, 500);
    }

    jumpToCustomerHistory = async (e, item) => {
        e.stopPropagation();
        this.setState({ isLoading: true });
        const { status } = item;
        if (status !== "cancel" && status !== "waiting" && status !== "confirm" && status !== "unconfirm") {
            const response = await axios.get(`${GET_APPOINTMENT_ID}/${item.appointmentId}`, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                if (response.data.codeNumber === 200) {
                    const data = await JSON.stringify({
                        appointment: response.data.data,
                        action: 'jumpToCustomerHistory'
                    });
                    console.log({ data })

                    window.postMessage(data);
                }
            }
            this.setState({ isLoading : false })
        }
    }
}
