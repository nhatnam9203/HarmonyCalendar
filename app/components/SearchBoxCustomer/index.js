import moment from 'moment';
import layout from './layout'

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
}
