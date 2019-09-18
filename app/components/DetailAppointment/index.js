import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import moment from 'moment';
import { FaTimesCircle } from 'react-icons/fa';
import Enter from '../../images/enter.png';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import 'rc-time-picker/assets/index.css';
import TimePicker from 'rc-time-picker';

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
  height: 400px;
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
  padding: 6px 20px;
  padding-bottom: 25px;
  margin-top: 5px;
  margin-left: 10px;
  width: 60%;
  float: right;
  cursor: pointer;
  border-radius: 4px;
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
  width: 33%;
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
      prices: [],
      pricesExtras: [],
      extras: [],
      old_total_duration: 0,
      dayChange: new Date(),
      fromTime: new Date(),
      toTime: new Date(),
      notes: [],
      newNotes: [],
    };
  }

  subtractService(index) {
    this.setState(state => {
      const { services, prices } = state;
      if (services[index].duration >= 15) {
        services[index].duration -= 15;
        // prices[index] = (services[index].price * (services[index].duration / 10))
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
    const { currentDay } = this.props;
    if (nextProps.appointment) {
      await this.resetState();
      const {
        options,
        userFullName,
        products,
        start,
        extras,
        notes,
      } = nextProps.appointment;
      await this.setState({
        services: options,
        userFullName: userFullName,
        products: products,
        dayChange: currentDay,
        fromTime: moment(start),
        extras: extras,
        notes: notes,
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
      this.updateChangeAppointment('confirm', servicesUpdate);
    } else if (appointment.status === 'CHECKED_IN') {
      this.updateChangeAppointment('confirm', servicesUpdate);
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
    const { products, fromTime, toTime, services, newNotes } = this.state;
    const productsUpdate = products.map(
      product => `${product.id}@${product.quantity}`,
    );
    const { appointment, changeAppointmentTime } = this.props;
    changeAppointmentTime({
      appointment,
      total: this.getTotalPrice(),
      duration: this.getTotalDuration(),
      BookingServices2: servicesUpdate,
      BookingProducts2: productsUpdate,
      servicesUpdate: services,
      productsUpdate: products,
      status,
      old_duration: this.state.old_total_duration,
      fromTime,
      toTime,
      notes: newNotes,
      dayPicker: this.state.dayChange,
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
    const { products, services, newNotes } = this.state;
    const { appointment, updateAppointment } = this.props;
    updateAppointment({
      appointment,
      servicesUpdate: services,
      productsUpdate: products,
      status,
      notes: newNotes,
      old_duration: this.state.old_total_duration,
    });
  }

  renderHeader() {
    const { appointment } = this.props;
    if (appointment.status === 'ASSIGNED') {
      return (
        <AppointmentWrapper.Header backgroundColor="#ffe400">
          #{appointment.id} Unconfirmed Appointment
        </AppointmentWrapper.Header>
      );
    }
    if (appointment.status === 'CONFIRMED') {
      return (
        <AppointmentWrapper.Header backgroundColor="#98e6f8">
          #{appointment.id} Confirmed Appointment
        </AppointmentWrapper.Header>
      );
    }
    if (appointment.status === 'CHECKED_IN') {
      return (
        <AppointmentWrapper.Header backgroundColor="#00b4f7">
          #{appointment.id} Checked-in Appointment
        </AppointmentWrapper.Header>
      );
    }
    if (appointment.status === 'PAID') {
      return (
        <AppointmentWrapper.Header backgroundColor="#00dc00">
          #{appointment.id} Paid Appointment
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
    this.setState({ fromTime });
  }
  onChangeToTime(toTime) {
    this.setState({ toTime });
  }
  renderChangeAppointTime() {
    const { currentDay, appointment } = this.props;
    return (
      <WrapperTimeChange>
        <SelectDateWrapper>
          <SelectDateWrapper.SelectDate>Date</SelectDateWrapper.SelectDate>
          <DayPickerInput
            onDayChange={date => {
              this.setState({ dayChange: date });
            }}
            selectedDay={this.state.dayChange}
            dayPickerProps={{
              modifiers: {
                disabled: [
                  {
                    before: new Date(),
                  },
                ],
              },
            }}
            placeholder={'YYYY-M-DD'}
            style={{ paddingLeft: 10, paddingTop: 5 }}
            placeholder={moment(currentDay).format('YYYY-MM-DD')}
          />
        </SelectDateWrapper>
        <SelectDateWrapper>
          <SelectDateWrapper.SelectDate>
            <div style={{ paddingLeft: '35%' }}>Time</div>
          </SelectDateWrapper.SelectDate>
          <div style={{ paddingLeft: '35%' }}>
            <TimePicker
              className="timePicker"
              value={this.state.fromTime}
              onChange={fromTime => this.onChangeFromTime(fromTime)}
              showSecond={false}
              minuteStep={15}
            />
          </div>
        </SelectDateWrapper>
        <SelectDateWrapper>
          <SelectDateWrapper.SelectDate>
            &nbsp;&nbsp;
          </SelectDateWrapper.SelectDate>
          <ButtonChangeTime
            disabled={appointment.status === 'CHECKED_IN'}
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
                  <div style={{fontWeight:'600'}}>Subtotal : </div>
                  <div>$ {parseFloat(appointment.subTotal).toFixed(2)}</div>
                </WrapperFooterPaid.ItemLeft>
                <WrapperFooterPaid.Item>
                <div style={{fontWeight:'600'}}>Discount : </div>
                  <div>$ {parseFloat(appointment.discount).toFixed(2)}</div>
                </WrapperFooterPaid.Item>
              </WrapperFooterPaid>
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <WrapperFooterPaid>
                <WrapperFooterPaid.ItemLeft>
                <div style={{fontWeight:'600'}}>Tip : </div>
                  <div>$ {parseFloat(appointment.tipAmount).toFixed(2)}</div>
                </WrapperFooterPaid.ItemLeft>
                <WrapperFooterPaid.Item>
                <div style={{fontWeight:'600'}}>Gift card : </div>
                  <div>$ {parseFloat(appointment.giftCard).toFixed(2)}</div>
                </WrapperFooterPaid.Item>
              </WrapperFooterPaid>
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <WrapperFooterPaid>
                <WrapperFooterPaid.ItemLeft>
                <div style={{fontWeight:'600'}}>Tax : </div>
                  <div style={{ paddingRight : 10}}>$ {parseFloat(appointment.tax).toFixed(2)}</div>
                </WrapperFooterPaid.ItemLeft>
              </WrapperFooterPaid>
            </div>
            <FooterTotal>
            <div style={{fontWeight:'600',fontSize:20}}>Total</div>
            <div style={{fontWeight:'600',fontSize:20,color:'#22DA26'}}>$ {parseFloat(appointment.total).toFixed(2)}</div>
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
            <strong>$ {parseFloat(appointment.total).toFixed(2)}</strong>
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
          moment(currentDay).format('YYYY-MM-DD') >=
          moment(new Date()).format('YYYY-MM-DD') &&
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

  onChangePrice = (index, e) => {
    const { prices, services } = this.state;
    // if (e.target.value === '') {
    //   prices[index] = 0;
    //   services[index].price = 0;
    // } else {
    //   let newPrice = e.target.value;
    //   if (e.target.value.charAt(0) === '0') {
    //     newPrice = e.target.value.substr(1);
    //   }
    //   prices[index] = newPrice;
    //   services[index].price = parseInt(newPrice);
    // }
    // this.setState({ prices, services });
    const val = e.target.value;
    if (e.target.validity.valid)
    {
      prices[index] = e.target.value.replace(/^0+/, "");
      services[index].price = parseInt(e.target.value.replace(/^0+/, ""));
    }
    else if (val === '' || val === '-') {
      prices[index] = val;
      services[index].price = parseInt(val);
    }
    this.setState({ prices, services });
    // this.setState({phoneNumber: val});
    // this.setState({phoneNumber: e.target.value.replace(/^0+/, "")});
  };

  renderService(service, index) {
    const { appointment } = this.props;
    return (
      <tr key={index}>
        <td>{service.serviceName}</td>
        <td style={{ textAlign: 'center' }}>
          <AdjustButton
            active={
              appointment.status !== 'PAID' &&
              service.duration > 15 &&
              appointment.status !== 'CHECKED_IN'
            }
            disabled={
              appointment.status === 'PAID' ||
              service.duration <= 15 ||
              appointment.status === 'CHECKED_IN'
            }
            onClick={() => this.subtractService(index)}
          >
            -15&#39;
          </AdjustButton>
          {service.duration}
          <AdjustButton
            active={
              appointment.status !== 'PAID' &&
              service.duration < 90 &&
              appointment.status !== 'CHECKED_IN'
            }
            disabled={
              appointment.status === 'PAID' ||
              service.duration >= 90 ||
              appointment.status === 'CHECKED_IN'
            }
            onClick={() => this.addService(index)}
          >
            +15&#39;
          </AdjustButton>
        </td>
        <td style={{ textAlign: 'center' }}>
          {/* {service.price * (service.duration / 10)} */}
          <input
            value={parseFloat(Math.round(this.state.prices[index] * 100) / 100).toFixed(2) || 0}
            style={{ textAlign: 'center' }}
            pattern="^-?[0-9]\d*\.?\d*$"
            disabled={
              appointment.status === 'PAID' ||
              appointment.status === 'CHECKED_IN'
            }
            onChange={e => this.onChangePrice(index, e)}
          />
        </td>
      </tr>
    );
  }

  renderServices() {
    const { services } = this.state;
    if (services.length > 0) {
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
              product.quantity > 1 &&
              appointment.status !== 'CHECKED_IN'
            }
            disabled={
              appointment.status === 'PAID' ||
              product.quantity <= 1 ||
              appointment.status === 'CHECKED_IN'
            }
            onClick={() => this.subtractProduct(index)}
          >
            -
          </ButtonProduct>
          {product.quantity}
          <ButtonProduct
            active={
              appointment.status !== 'PAID' &&
              appointment.status !== 'CHECKED_IN'
            }
            disabled={
              appointment.status === 'PAID' ||
              appointment.status === 'CHECKED_IN'
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
    if (products.length > 0) {
      return (
        <table>
          <thead>
            <tr>
              <th style={{ width: '44.8%' }}>Selected Products</th>
              <th style={{ width: '27.65%', textAlign: 'center' }}>Amount</th>
              <th style={{ width: '32.35%', textAlign: 'center' }}>Price ($)</th>
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
      if (services[index].duration >= 15) {
        services[index].duration -= 15;
        // prices[index] = (services[index].price * (services[index].duration / 10))
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
      if (extras[index].duration >= 15) {
        extras[index].duration -= 15;
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
  onChangePriceExtra(index, e) {
    const { pricesExtras, extras } = this.state;
    // if (e.target.value === '') {
    //   pricesExtras[index] = 0;
    //   extras[index].price = 0;
    // } else {
    //   let newPrice = e.target.value;
    //   if (e.target.value.charAt(0) === '0') {
    //     newPrice = e.target.value.substr(1);
    //   }
    //   pricesExtras[index] = newPrice;
    //   extras[index].price = parseInt(newPrice);
    // }
    // this.setState({ pricesExtras });
    const val = e.target.value;
    if (e.target.validity.valid)
    {
      pricesExtras[index] = e.target.value.replace(/^0+/, "");
      extras[index].price = parseInt(e.target.value.replace(/^0+/, ""));
    }
    else if (val === '' || val === '-') {
      pricesExtras[index] = val;
      extras[index].price = parseInt(val);
    }
    this.setState({ pricesExtras, extras });
  }

  renderExtra(extra, index) {
    const { appointment } = this.props;
    return (
      <tr key={index}>
        <td>{extra.extraName}</td>
        <td style={{ textAlign: 'center' }}>
          <AdjustButton
            active={
              appointment.status !== 'CHECKED_IN' &&
              extra.duration > 15 &&
              appointment.status !== 'PAID'
            }
            disabled={
              appointment.status === 'CHECKED_IN' ||
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
              appointment.status !== 'CHECKED_IN' &&
              extra.duration < 90 &&
              appointment.status !== 'PAID'
            }
            disabled={
              appointment.status === 'CHECKED_IN' ||
              extra.duration >= 90 ||
              appointment.status === 'PAID'
            }
            onClick={() => this.addExtra(index)}
          >
            +15&#39;
          </AdjustButton>
        </td>
        <td style={{ textAlign: 'center' }}>
          {/* {extra.price * (extra.duration / 10)} */}
          <input
            value={parseFloat(Math.round(this.state.pricesExtras[index] * 100) / 100).toFixed(2) || 0}
            style={{ textAlign: 'center' }}
            pattern="^-?[0-9]\d*\.?\d*$"
            disabled={
              appointment.status === 'PAID' ||
              appointment.status === 'CHECKED_IN'
            }
            onChange={e => this.onChangePriceExtra(index, e)}
          />
        </td>
      </tr>
    );
  }
  renderExtras() {
    const { extras } = this.state;
    if (extras.length > 0) {
      return (
        <table>
          <thead>
            <tr>
              <th style={{ width: '47%' }}>Selected Extras</th>
              <th style={{ width: '28.8%', textAlign: 'center' }}>
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
        <strong>{moment(note.createDate).format('YYYY-MM-DD')}</strong>
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
