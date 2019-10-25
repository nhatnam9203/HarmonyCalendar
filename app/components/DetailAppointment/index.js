import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import moment from 'moment';
import { FaTimesCircle, FaBoxes } from 'react-icons/fa';
import Enter from '../../images/enter.png';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import 'rc-time-picker/assets/index.css';
import NumberFormat from 'react-number-format';
import { DatePicker } from 'antd-mobile';
import enUs from 'antd-mobile/lib/date-picker/locale/en_US';
import 'antd-mobile/dist/antd-mobile.css';
import { formatDate, parseDate } from "react-day-picker/moment";
import OutsideClickHandler from 'react-outside-click-handler';


const AppPopup = styled(Popup)`
  border-radius: 1.5rem;
  padding: 0 !important;
  border: none !important;
`;

const AppPopupWrapper = styled.div`
  position: relative;
`;

AppPopupWrapper.Header = styled.div`
  height: 3rem;
  font-size: 26px;
  font-weight: bold;
  background: ${props => props.backgroundColor};
  color: #ffffff;
  width: 100%;
  padding: 0.5rem 1rem;
  line-height: 1.5;
  text-align: center;
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
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
  height: 450px;
  overflow-y: scroll;
`;

AppPopupWrapper.Footer = styled.div`
  display: flex;
  padding: 0.5rem 1rem 1rem 1rem;
  & > div {
    width: 50%;
    text-align: center;
  }
`;

// ************************************************* //
// ************************************************* //
// ************************************************* //

const AppointmentPopup = styled(AppPopup)`
  width: 50rem !important;
`;

const AppointmentWrapper = styled(AppPopupWrapper)`
  //
`;

AppointmentWrapper.Header = styled(AppPopupWrapper.Header)`
  //
`;

AppointmentWrapper.Close = styled(AppPopupWrapper.Close)`
  //
`;

AppointmentWrapper.Body = styled(AppPopupWrapper.Body)`
  //
`;

AppointmentWrapper.Footer = styled(AppPopupWrapper.Footer)`
  //
`;

const UserInformation = styled.div`
  display: flex;
  padding: 0.5rem;
  & > div {
    width: 50%;
    display: flex;
    justify-content: space-between;
  }
  & > div:nth-child(1) {
    margin-right: 1.5rem;
  }
`;

const WrapperCancelAppointment = styled.div`
  display: flex;
  width: 100%;
  justify-content: row;
  margin-top: 20px;
`;

const AdjustButton = styled.button`
  background: ${props => (props.active ? '#0071c5' : '#dddddd')};
  color: #ffffff;
  padding: 2px 15px;
  margin: 0 10px;
  border-radius: 6px;
  cursor: ${props => (props.active ? 'pointer' : 'initial')};
`;

const ButtonProduct = styled.button`
  background: ${props => (props.active ? '#0071c5' : '#dddddd')};
  color: #ffffff;
  padding: 2px 15px;
  margin: 0 10px;
  border-radius: 6px;
  cursor: ${props => (props.active ? 'pointer' : 'initial')};
`;

const NoteWrapper = styled.div`
  border: 1px solid #dddddd;
  background: #eeeeee;
  padding: 0.5rem;
  overflow-x: scroll;
  height: 10rem;
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
  & > div:nth-child(1),
  & > div:nth-child(2) {
    width: 20%;
  }
  & > div:last-child {
    width: 60%;
  }
`;

const AppointmentInformation = styled.div`
  display: flex;
  padding: 0.5rem;
  justify-content: space-between;
  & > div {
  }
`;

const TipPercent = styled.div`
  display: flex;
  padding: 0.5rem;
  & > div {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
`;

const Button = styled.button`
  border-radius: 4px;
  background: ${props => (props.primary ? '#0071c5' : '#eeeeee')};
  color: ${props => (props.primary ? '#ffffff' : '#333333')};
  border: 1px solid #dddddd;
  font-size: 1rem;
  line-height: 2.8;
  height: 100%;
  cursor: pointer;
  text-align: center;
  padding: 0 2rem;
`;

const ButtonChangeTime = styled.button`
  background: ${props => (props.disabled ? '#eeeeee' : '#0071c5')};
  color: ${props => (props.primary ? '#333333' : '#ffffff')};
  height: 40%;
  justify-content : center;
  align-items : center;
  margin-top: 5px;
  margin-left: 10px;
  width: 60%;
  float: right;
  cursor: pointer;
  border-radius: 4px;
  font-size : 1rem;
`;

const Img = styled.img`
  filter: invert(100%);
`;

const WrapperTimeChange = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-top: 1rem;
`;

const SelectDateWrapper = styled.div`
  width: 25%;
  float: left;
`;
SelectDateWrapper.SelectDate = styled.div`
  background: ${props => (props.NoneBackground ? '#ffffff' : '#585858')};
  color: #fff;
  font-size: 0.95rem;
  font-weight: 400;
  padding-left: 10px;
  line-height: 2;
`;
SelectDateWrapper.SelectStaff = styled(SelectDateWrapper.SelectDate)`
  padding-left : 50%;
`;
// ************************************************* //
// ************************************************* //
// ************************************************* //

const ConfirmationPopup = styled(AppPopup)`
  width: 30rem !important;
  height: 10rem !important;
`;

const ConfirmationWrapper = styled(AppPopupWrapper)`
  //
`;

ConfirmationWrapper.Header = styled(AppPopupWrapper.Header)`
  //
`;

ConfirmationWrapper.Body = styled(AppPopupWrapper.Body)`
  text-align: center;
  height: 200px;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
`;

ConfirmationWrapper.Close = styled(AppPopupWrapper.Close)`
  //
`;

ConfirmationWrapper.Footer = styled(AppPopupWrapper.Footer)`
  //
`;

const WrapperFooterPaid = styled.div`
  padding : 10px;
  display : flex;
  flex-direction : row;
`;
WrapperFooterPaid.Item = styled.div`
  display : flex;
  flex-direction : row;
  justify-content : space-between;
  width :50%;
  margin-left : 10px;
  color : #0B0B0B;
`;
WrapperFooterPaid.ItemLeft = styled(WrapperFooterPaid.Item)`
  padding-right : 4rem;
`;

const FooterTotal = styled(WrapperFooterPaid)`
  justify-content : space-between;
  border-top: 1px solid #ebebeb;
  margin-top : 0.3rem;
  padding-left : 20px;
`;

class Appointment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noteValue: '',
      confirmationModal: false,
      userFullName: '',
      services: [],
      products: [],
      extras: [],
      prices: [],
      pricesExtras: [],
      old_total_duration: 0,
      dayChange: new Date(),
      fromTime: moment(),
      toTime: new Date(),
      notes: [],
      newNotes: [],
      time: new Date(),
      selectedStaff: '',
      isOpenStaffList: false,
      cloneAppointment : '',
    };
  }

  addService(index) {
    this.setState(state => {
      const { services, } = state;
      services[index].duration += 15;
      return {
        services,
      };
    });
  }

  subtractProduct(index) {
    this.setState(state => {
      const { products } = state;
      if (products[index].quantity >= 1) {
        products[index].quantity -= 1;
      }
      return {
        products,
      };
    });
  }

  addProduct(index) {
    this.setState(state => {
      const { products } = state;
      products[index].quantity += 1;
      return {
        products,
      };
    });
  }

  handleSubmit(e) {
    const { notes, noteValue, userFullName } = this.state;
    e.preventDefault();
    this.setState({
      noteValue: '',
      notes: [
        {
          name: userFullName,
          date: moment().format('DD/MM/YYYY'),
          content: noteValue,
        },
        ...notes,
      ],
    });
  }

  handleChange(e) {
    const note = {
      note: e.target.value,
    };
    this.setState({
      noteValue: note.note,
    });
  }

  getTotalPrice() {
    const { products, pricesExtras, prices } = this.state;
    let total = 0;
    prices.forEach(price => {
      total += parseInt(price);
    });
    products.forEach(product => {
      total += product.price * product.quantity;
    });
    pricesExtras.forEach(price => {
      total += parseInt(price);
    });
    return total;
  }

  getTotalDuration() {
    const { services } = this.state;
    let total = 0;
    services.forEach(service => {
      total += service.duration;
    });
    return total;
  }

  closeModal() {
    const { deselectAppointment, disableCalendar } = this.props;
    deselectAppointment();
    disableCalendar(false);
  }

  async componentWillReceiveProps(nextProps) {
    const { currentDay, staffList } = this.props;
    const { appointment } = nextProps;
    const selectedStaff = appointment ? staffList.find((staff) => staff.id === appointment.memberId) : '';
    if (nextProps.appointment) {
      await this.resetState();
      const app_ =JSON.parse(JSON.stringify(nextProps.appointment))
      const {
        options,
        userFullName,
        products,
        start,
        extras,
        notes,
      } = app_;
      await this.setState({
        services: options,
        userFullName: userFullName,
        products: products,
        dayChange: currentDay,
        fromTime: moment(start),
        extras: extras,
        notes: notes,
        selectedStaff: selectedStaff,
        cloneAppointment : JSON.parse(JSON.stringify(nextProps.appointment))
      });
      var old_duration = 0;
      await nextProps.appointment.options.forEach(el => {
        old_duration += parseInt(el.duration);
      });
      await nextProps.appointment.extras.forEach(el => {
        old_duration += parseInt(el.duration);
      });
      this.setState({
        old_total_duration: old_duration,
      });

      await this.setState({ prices: [], pricesExtras: [] });
      for (let i = 0; i < nextProps.appointment.options.length; i++) {
        const price = nextProps.appointment.options[i].price;
        this.setState({
          prices: [...this.state.prices, price],
        });
      }
      for (let i = 0; i < nextProps.appointment.extras.length; i++) {
        const price = nextProps.appointment.extras[i].price;
        this.setState({
          pricesExtras: [...this.state.pricesExtras, price],
        });
      }
    }
  }

  resetState() {
    this.setState({
      products: [],
      extras: [],
      fromTime: moment(),
      toTime: moment(),
      notes: [],
      newNotes: [],
      noteValue: '',
    });
  }

  openConfirmationModal() {
    this.setState({
      confirmationModal: true,
    });
  }

  closeConfirmationModal() {
    this.setState({
      confirmationModal: false,
    });
  }

  confirmCancelAppointment() {
    this.closeConfirmationModal();
    const { appointment, cancelAppointment, disableCalendar } = this.props;
    const { services } = this.state;
    cancelAppointment(appointment.id);
    const servicesUpdate = services.map(
      service => `${service.id}@${service.duration}@${appointment.memberId}`,
    );
    this.updateStatus('cancel', servicesUpdate);
    disableCalendar(false);
  }

  ChangeAppointmentTime() {
    const { services } = this.state;
    const { appointment } = this.props;
    const servicesUpdate = services.map(
      service => `${service.id}@${service.duration}@${appointment.memberId}`,
    );
    if (appointment.status === 'ASSIGNED') {
      this.updateChangeAppointment('unconfirm', servicesUpdate);
    } else if (appointment.status === 'CONFIRMED') {
      this.updateChangeAppointment('unconfirm', servicesUpdate);
    } else if (appointment.status === 'CHECKED_IN') {
      this.updateChangeAppointment('checkin', servicesUpdate);
    } else {
      alert(
        `status appointment ${appointment.status}- id appointment ${
        appointment.id
        }`,
      );
    }
    this.closeModal();
  }

  updateChangeAppointment(status, servicesUpdate) {
    const { products, fromTime, toTime, services, newNotes, selectedStaff,extras } = this.state;
    const { appointment, changeAppointmentTime } = this.props;
    changeAppointmentTime({
      appointment,
      total: this.getTotalPrice(),
      duration: this.getTotalDuration(),
      servicesUpdate: services,
      productsUpdate: products,
      extrasUpdate : extras,
      status,
      old_duration: this.state.old_total_duration,
      fromTime,
      toTime,
      notes: newNotes,
      dayPicker: this.state.dayChange,
      selectedStaff: selectedStaff
    });
  }

  nextStatus() {
    const { appointment } = this.props;
    const { services } = this.state;
    const servicesUpdate = services.map(
      service => `${service.id}@${service.duration}@${appointment.memberId}`,
    );
    if (appointment.status === 'ASSIGNED') {
      this.updateStatus('confirm', servicesUpdate);
    } else if (appointment.status === 'CONFIRMED') {
      this.updateStatus('checkin', servicesUpdate);
    } else if (appointment.status === 'CHECKED_IN') {
      this.updateStatusPaid(appointment.id);
    } else {
      alert(
        `status appointment ${appointment.status} id appointment ${
        appointment.id
        }`,
      );
    }
    this.closeModal();
  }

  updateStatusPaid = idAppointment => {
    const data = JSON.stringify({
      appointmentId: idAppointment,
      action: 'checkout',
    });
    window.postMessage(data);
  };

  updateStatus(status, servicesUpdate) {
    const { products, services,extras ,newNotes,cloneAppointment} = this.state;
    const { appointment, updateAppointment } = this.props;
    updateAppointment({
      appointment,
      servicesUpdate: services,
      productsUpdate: products,
      extrasUpdate: extras,
      status,
      notes: newNotes,
      old_duration: this.state.old_total_duration,
      old_status: appointment.status,
      old_appointment : cloneAppointment
    });
  }

  renderHeader() {
    const { appointment } = this.props;
    if (appointment.status === 'ASSIGNED') {
      return (
        <AppointmentWrapper.Header backgroundColor="#ffe400">
          {appointment.code} Unconfirmed Appointment
        </AppointmentWrapper.Header>
      );
    }
    if (appointment.status === 'CONFIRMED') {
      return (
        <AppointmentWrapper.Header backgroundColor="#98e6f8">
          {appointment.code} Confirmed Appointment
        </AppointmentWrapper.Header>
      );
    }
    if (appointment.status === 'CHECKED_IN') {
      return (
        <AppointmentWrapper.Header backgroundColor="#00b4f7">
          {appointment.code} Checked-in Appointment
        </AppointmentWrapper.Header>
      );
    }
    if (appointment.status === 'PAID') {
      return (
        <AppointmentWrapper.Header backgroundColor="#00dc00">
          {appointment.code} Paid Appointment
        </AppointmentWrapper.Header>
      );
    }
    return (
      <AppointmentWrapper.Header backgroundColor="#00dc00">
        Appointment
      </AppointmentWrapper.Header>
    );
  }

  onChangeFromTime(fromTime) {
    this.setState({ fromTime: fromTime });
  }
  onChangeToTime(toTime) {
    this.setState({ toTime });
  }

  onChangeSelectedStaff(staff, index) {
    this.setState({
      selectedStaff: staff,
    });
  }

  renderStaffList() {
    const { staffList } = this.props;
    const { selectedStaff } = this.state;
    return staffList.map((staff, index) => {
      return (
        <div
          onClick={() => this.onChangeSelectedStaff(staff, index)}
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'row',
            paddingLeft: 10,
            paddingTop: 10,
            cursor: 'pointer',
            fontWeight: selectedStaff.id === staff.id ? '600' : '400',
            color: selectedStaff.id === staff.id ? '#ffffff' : '#333',
            backgroundColor: selectedStaff.id === staff.id ? '#1073C2' : '#ffffff'
          }}>
          <img
            style={{
              width: 40,
              height: 40,
              objectFit: 'cover',
              borderRadius: 30
            }}
            src={staff.imageUrl} />
          <p style={{
            marginLeft: 10
          }}>{staff.title}</p>
        </div>
      );
    })
  }

  renderChangeAppointTime() {
    const { currentDay, appointment, } = this.props;
    const { selectedStaff, isOpenStaffList } = this.state;
    return (
      <WrapperTimeChange>
        <SelectDateWrapper>
          <SelectDateWrapper.SelectDate>Date</SelectDateWrapper.SelectDate>
          <DayPickerInput
            inputProps={{ readOnly: true }}
            onDayChange={date => {
              this.setState({ dayChange: date });
            }}
            selectedDay={formatDate(this.state.dayChange)}
            formatDate={formatDate}
            parseDate={parseDate}
            style={{ paddingLeft: 10, paddingTop: 5 }}
            placeholder={moment(currentDay).format('MM/DD/YYYY')}
          />
        </SelectDateWrapper>
        <SelectDateWrapper>
          <SelectDateWrapper.SelectDate>
            <div style={{ paddingLeft: '35%' }}>Time</div>
          </SelectDateWrapper.SelectDate>
          <div style={{ paddingLeft: '35%' }}>
            <DatePicker
              mode="time"
              minuteStep={15}
              use12Hours
              title="Select Time"
              // value={new Date(Date.now())}
              onChange={time => this.onChangeFromTime(time)}
              locale={enUs}
            >
              <p className="txtTimeChange">{moment(this.state.fromTime).format('hh:mm A').toString()}</p>
            </DatePicker>
          </div>
        </SelectDateWrapper>
        <SelectDateWrapper>
          <SelectDateWrapper.SelectStaff>
            Staff
          </SelectDateWrapper.SelectStaff>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
          }}>
            <div style={{ position: 'relative', paddingTop: 3, color: '#333', paddingLeft: 60 }}>
              <div
                onClick={() => this.setState({ isOpenStaffList: !this.state.isOpenStaffList })}
                style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }}>
                <img
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: 'cover',
                    borderRadius: 30
                  }}
                  src={selectedStaff.imageUrl} />
                <p style={{
                  marginLeft: 10,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>{selectedStaff.title}</p>
              </div>
              {isOpenStaffList &&
                <OutsideClickHandler onOutsideClick={() => this.setState({ isOpenStaffList: false, indexSelectedStaff: '' })}>
                  <div style={{
                    height: 200,
                    width: 170,
                    overflowY: 'scroll',
                    background: '#ffffff',
                    zIndex: 9999,
                    position: 'absolute',
                    top: '110%',
                    borderRadius: 5,
                    boxShadow: '0 3px 9px rgba(0,0,0,.175)'
                  }}>
                    {this.renderStaffList()}
                  </div>
                </OutsideClickHandler>}
            </div>
          </div>
        </SelectDateWrapper>
        <SelectDateWrapper>
          <SelectDateWrapper.SelectDate>
            &nbsp;&nbsp;
          </SelectDateWrapper.SelectDate>
          <ButtonChangeTime
            disabled={appointment.status === 'PAID'}
            onClick={() => this.ChangeAppointmentTime()}
          >
            Change
          </ButtonChangeTime>
        </SelectDateWrapper>
      </WrapperTimeChange>
    );
  }

  renderFooterAppointment(appointment) {
    if (appointment.status === 'PAID') {
      return (
        <React.Fragment>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <WrapperFooterPaid>
                <WrapperFooterPaid.ItemLeft>
                  <div style={{ fontWeight: '600' }}>Subtotal : </div>
                  <div>$ {parseFloat(appointment.subTotal).toFixed(2)}</div>
                </WrapperFooterPaid.ItemLeft>
                <WrapperFooterPaid.Item>
                  <div style={{ fontWeight: '600' }}>Discount : </div>
                  <div>$ {parseFloat(appointment.discount).toFixed(2)}</div>
                </WrapperFooterPaid.Item>
              </WrapperFooterPaid>
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <WrapperFooterPaid>
                <WrapperFooterPaid.ItemLeft>
                  <div style={{ fontWeight: '600' }}>Tip : </div>
                  <div>$ {parseFloat(appointment.tipAmount).toFixed(2)}</div>
                </WrapperFooterPaid.ItemLeft>
                <WrapperFooterPaid.Item>
                  <div style={{ fontWeight: '600' }}>Gift card : </div>
                  <div>$ {parseFloat(appointment.giftCard).toFixed(2)}</div>
                </WrapperFooterPaid.Item>
              </WrapperFooterPaid>
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <WrapperFooterPaid>
                <WrapperFooterPaid.ItemLeft>
                  <div style={{ fontWeight: '600' }}>Tax : </div>
                  <div style={{ paddingRight: 10 }}>$ {parseFloat(appointment.tax).toFixed(2)}</div>
                </WrapperFooterPaid.ItemLeft>
              </WrapperFooterPaid>
            </div>
            <FooterTotal>
              <div style={{ fontWeight: '900', fontSize: 20 }}>Total</div>
              <div style={{ fontWeight: '600', fontSize: 20, color: '#22DA26' }}>$ {parseFloat(appointment.total).toFixed(2)}</div>
            </FooterTotal>
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div>
            <span>Arriving : </span>
            <strong>{moment(appointment.start).fromNow()}</strong>
          </div>
          <div>
            <span>Tip : </span>
            <strong>{parseFloat(appointment.tipPercent).toFixed(2)}</strong>
          </div>
          <div>
            <span>Total : </span>
            <strong>$ {parseFloat(appointment.subTotal).toFixed(2)}</strong>
          </div>
        </React.Fragment>
      );
    }
  }

  renderBody() {
    const { appointment, currentDay } = this.props;

    return (
      <AppointmentWrapper.Body>
        <UserInformation>
          <div>
            <span>Customer name: </span>
            <strong>{appointment.userFullName}</strong>
          </div>
          <div>
            <span>Phone number: </span>
            <strong>{appointment.phoneNumber}</strong>
          </div>
        </UserInformation>

        {appointment.status !== 'PAID' &&
          this.renderChangeAppointTime()}
        {this.renderServices()}
        {this.renderProducts()}
        {this.renderExtras()}
        {this.renderNotes()}
        <AppointmentInformation>
          {this.renderFooterAppointment(appointment)}
        </AppointmentInformation>
        <TipPercent />
      </AppointmentWrapper.Body>
    );
  }

  onChangePrice = (value, index) => {
    const { prices, services } = this.state;
    const { floatValue } = value;
    if (floatValue) {
      prices[index] = floatValue;
      services[index].price = floatValue;
      this.setState({ prices, services });
    }
  };

  renderService(service, index) {
    const { appointment } = this.props;
    if (appointment.status !== 'PAID') {
      return (
        <tr key={index}>
          <td>{service.serviceName}</td>
          {appointment.status !== 'PAID' && <td style={{ textAlign: 'center' }}>
            <AdjustButton
              active={
                appointment.status !== 'PAID' &&
                service.duration > 15
              }
              disabled={
                appointment.status === 'PAID' ||
                service.duration <= 15
              }
              onClick={() => this.subtractService(index)}
            >
              -15&#39;
            </AdjustButton>
            {service.duration}
            <AdjustButton
              active={
                appointment.status !== 'PAID' &&
                service.duration < 90
              }
              disabled={
                appointment.status === 'PAID' ||
                service.duration >= 90
              }
              onClick={() => this.addService(index)}
            >
              +15&#39;
            </AdjustButton>
          </td>}
          <td style={{ textAlign: 'center' }}>
            <NumberFormat
              value={parseFloat(this.state.prices[index]).toFixed(2)}
              onValueChange={(value) => this.onChangePrice(value, index)}
              thousandSeparator={false}
              disabled={appointment.status === 'PAID'}
              style={{ textAlign: 'center' }}
            />
          </td>
        </tr>
      );
    } else {
      if(service.staff){
        return (
          <tr key={index}>
            <td>{service.serviceName}</td>
            <td>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <img src={service.staff.imageUrl}
                  style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 25 }} />
                <p style={{ marginLeft: 8 }}>{service.staff.displayName}</p>
              </div>
            </td>
            <td style={{ textAlign: 'center' }}>
              {service.staff.tip}
            </td>
            <td style={{ textAlign: 'center' }}>
              <NumberFormat
                value={parseFloat(this.state.prices[index]).toFixed(2)}
                onValueChange={(value) => this.onChangePrice(value, index)}
                thousandSeparator={false}
                disabled={appointment.status === 'PAID'}
                style={{ textAlign: 'center' }}
              />
            </td>
          </tr>
        );
      }
    }
  }

  renderServices() {
    const { services } = this.state;
    const { appointment } = this.props;
    if (services.length > 0) {
      if (appointment.status !== 'PAID')
        return (
          <table>
            <thead>
              <tr>
                <th width="50%">Selected Services</th>
                <th width="30%" style={{ textAlign: 'center' }}>
                  Duration (min)
              </th>
                <th width="20%" style={{ textAlign: 'center' }}>
                  Price ($)
              </th>
              </tr>
            </thead>
            <tbody>{services.map((s, i) => this.renderService(s, i))}</tbody>
          </table>
        );
      return (
        <table>
          <thead>
            <tr>
              <th width="25%">Selected Services</th>
              <th width="25%" style={{ textAlign: 'center' }}>
                Staff
              </th>
              <th width="25%" style={{ textAlign: 'center' }}>
                Tip ($)
              </th>
              <th width="25%" style={{ textAlign: 'center' }}>
                Service amount ($)
              </th>
            </tr>
          </thead>
          <tbody>{services.map((s, i) => this.renderService(s, i))}</tbody>
        </table>
      );
    }
  }

  renderProduct(product, index) {
    const { appointment } = this.props;
    return (
      <tr key={index}>
        <td>{product.productName}</td>
        <td style={{ textAlign: 'center' }}>
          <ButtonProduct
            active={
              appointment.status !== 'PAID' &&
              product.quantity > 1
              // appointment.status !== 'CHECKED_IN'
            }
            disabled={
              appointment.status === 'PAID' ||
              product.quantity <= 1
              // appointment.status === 'CHECKED_IN'
            }
            onClick={() => this.subtractProduct(index)}
          >
            -
          </ButtonProduct>
          {product.quantity}
          <ButtonProduct
            active={
              appointment.status !== 'PAID'
              // appointment.status !== 'CHECKED_IN'
            }
            disabled={
              appointment.status === 'PAID'
              // appointment.status === 'CHECKED_IN'
            }
            onClick={() => this.addProduct(index)}
          >
            +
          </ButtonProduct>
        </td>
        <td style={{ textAlign: 'center' }}>
          {parseFloat(product.price * product.quantity).toFixed(2)}
        </td>
      </tr>
    );
  }

  renderProducts() {
    const { products } = this.state;
    const { appointment } = this.props;
    if (products.length > 0) {
      return (
        <table>
          <thead>
            <tr>
              <th style={{ width: '50%' }}>Selected Products</th>
              <th style={{ width: appointment.status === 'PAID' ? '25%' : '30%', textAlign: 'center' }}>Amount</th>
              <th style={{ textAlign: 'center' }}>Price ($)</th>
            </tr>
          </thead>
          <tbody>{products.map((p, i) => this.renderProduct(p, i))}</tbody>
        </table>
      );
    }
  }

  subtractService(index) {
    this.setState(state => {
      const { services, prices } = state;
      if (services[index].duration >= 30) {
        services[index].duration -= 15;
      }
      if (services[index].duration < 30) {
        services[index].duration = 15;
      }
      return {
        services,
        //  prices
      };
    });
  }

  addService(index) {
    this.setState(state => {
      const { services, prices } = state;
      services[index].duration += 15;
      // prices[index] = (services[index].price * (services[index].duration / 10))
      return {
        services,
        // prices
      };
    });
  }

  subtractExtra(index) {
    this.setState(state => {
      const { extras } = state;
      if (extras[index].duration >= 30) {
        extras[index].duration -= 15;
      }
      if (extras[index].duration < 30) {
        extras[index].duration = 15;
      }
      return {
        extras,
      };
    });
  }
  addExtra(index) {
    this.setState(state => {
      const { extras } = state;
      extras[index].duration += 15;
      return {
        extras,
      };
    });
  }
  onChangePriceExtra(value, index) {
    const { pricesExtras, extras } = this.state;
    const { floatValue } = value;
    if (floatValue) {
      pricesExtras[index] = floatValue;
      extras[index].price = floatValue;
      this.setState({
        pricesExtras, extras
      });
    }
  }

  renderExtra(extra, index) {
    const { appointment } = this.props;
    return (
      <tr key={index}>
        <td>{extra.extraName}</td>
        <td style={{ textAlign: 'center' }}>
          <AdjustButton
            active={
              // appointment.status !== 'CHECKED_IN' &&
              extra.duration > 15 &&
              appointment.status !== 'PAID'
            }
            disabled={
              // appointment.status === 'CHECKED_IN' ||
              appointment.status === 'PAID' ||
              extra.duration <= 15
            }
            onClick={() => this.subtractExtra(index)}
          >
            -15&#39;
          </AdjustButton>
          {extra.duration}
          <AdjustButton
            active={
              // appointment.status !== 'CHECKED_IN' &&
              extra.duration < 90 &&
              appointment.status !== 'PAID'
            }
            disabled={
              // appointment.status === 'CHECKED_IN' ||
              extra.duration >= 90 ||
              appointment.status === 'PAID'
            }
            onClick={() => this.addExtra(index)}
          >
            +15&#39;
          </AdjustButton>
        </td>
        <td style={{ textAlign: 'center' }}>
          <NumberFormat
            value={parseFloat(this.state.pricesExtras[index]).toFixed(2)}
            onValueChange={(value) => this.onChangePriceExtra(value, index)}
            thousandSeparator={false}
            disabled={appointment.status === 'PAID'}
            style={{ textAlign: 'center' }}
          />
        </td>
      </tr>
    );
  }
  renderExtras() {
    const { extras } = this.state;
    const { appointment } = this.props;
    if (extras.length > 0) {
      return (
        <table>
          <thead>
            <tr>
              <th style={{ width: '50%' }}>Selected Extras</th>
              <th style={{ width: appointment.status === 'PAID' ? '25%' : '30%', textAlign: 'center' }}>
                Duration (min)
              </th>
              <th style={{ textAlign: 'center' }}>Price ($)</th>
            </tr>
          </thead>
          <tbody>{extras.map((p, i) => this.renderExtra(p, i))}</tbody>
        </table>
      );
    }
  }

  renderNote = (note, index) => (
    <NoteInformation key={index}>
      <div>
        <strong>{moment(note.createDate).format('MM/DD/YYYY')}</strong>
      </div>
      <div>
        <i>{note.note}</i>
      </div>
    </NoteInformation>
  );

  addNote() {
    const { newNotes, notes, noteValue } = this.state;
    const note = {
      createDate: new Date(),
      note: noteValue,
    };
    if (noteValue.trim() !== '') {
      this.setState({
        notes: [note, ...notes],
        newNotes: [note, ...newNotes],
        noteValue: '',
      });
    }
  }

  renderNotes() {
    const { notes } = this.state;
    return (
      <NoteWrapper>
        <NoteWrapper.Form onSubmit={e => this.handleSubmit(e)}>
          <input
            value={this.state.noteValue}
            onChange={e => this.handleChange(e)}
          />
          <button onClick={() => this.addNote()} type="button">
            <Img src={Enter} alt="icon" />
          </button>
        </NoteWrapper.Form>
        {notes.map(this.renderNote)}
      </NoteWrapper>
    );
  }

  renderNextStatusButton() {
    const { appointment } = this.props;
    if (appointment.status === 'ASSIGNED')
      return (
        <Button onClick={() => this.nextStatus()} primary="true">
          Confirm
        </Button>
      );
    if (appointment.status === 'CONFIRMED')
      return (
        <Button onClick={() => this.nextStatus()} primary="true">
          Check In
        </Button>
      );
    if (appointment.status === 'CHECKED_IN')
      return (
        <Button onClick={() => this.nextStatus()} primary="true">
          Check out
        </Button>
      );
    return '';
  }

  render() {
    const { appointment } = this.props;
    if (!appointment) return '';
    return (
      <div>
        <AppointmentPopup
          closeOnDocumentClick
          open
          onOpen={() => this.openModal()}
          onClose={() => this.closeModal()}
        >
          <AppointmentWrapper>
            <AppointmentWrapper.Close onClick={() => this.closeModal()}>
              <FaTimesCircle />
            </AppointmentWrapper.Close>
            {this.renderHeader()}
            {this.renderBody()}
            <AppointmentWrapper.Footer>
              {appointment.status !== 'PAID' && (
                <div>
                  <Button onClick={() => this.openConfirmationModal()}>
                    Cancel
                  </Button>
                </div>
              )}
              <div>{this.renderNextStatusButton()}</div>
            </AppointmentWrapper.Footer>
          </AppointmentWrapper>
        </AppointmentPopup>
        <ConfirmationPopup open={this.state.confirmationModal}>
          <ConfirmationWrapper>
            <ConfirmationWrapper.Close
              onClick={() => this.closeConfirmationModal()}
            >
              <FaTimesCircle />
            </ConfirmationWrapper.Close>
            <ConfirmationWrapper.Header backgroundColor="#00b4f7">
              Confirmation
            </ConfirmationWrapper.Header>
            <ConfirmationWrapper.Body>
              Do you want to Cancel this Appointment?
              <WrapperCancelAppointment>
                <div style={{ width: '50%', textAlign: 'center' }}>
                  <Button onClick={() => this.confirmCancelAppointment()}>
                    Yes
                  </Button>
                </div>
                <div style={{ width: '50%', textAlign: 'center' }}>
                  <Button primary onClick={() => this.closeConfirmationModal()}>
                    No
                  </Button>
                </div>
              </WrapperCancelAppointment>
            </ConfirmationWrapper.Body>
          </ConfirmationWrapper>
        </ConfirmationPopup>
      </div>
    );
  }
}

Appointment.propTypes = {
  appointment: PropTypes.any,
  deselectAppointment: PropTypes.func,
  cancelAppointment: PropTypes.func,
  nextStatus: PropTypes.func,
  // services: PropTypes.any,
  // products: PropTypes.any,
};

export default Appointment;
