import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import FCAgenda from './FCAgenda';
import FCDragZone from './FCDragZone';

import { updateEventToCalendar } from './constants';
import { MAIN_CALENDAR_OPTIONS } from './constants';
import { merchantId } from '../../../app-constants';
import WaitingLoading from './WaitingLoading';
import CalendarLoading from './CalendarLoading';
const signalR = require('@aspnet/signalr');
import {
  statusConvertKey,
  memberAdapter_update,
} from '../../containers/AppointmentPage/saga';
import { store } from 'app';
import { addEventsToCalendar } from './constants';
import { PROD_API_BASE_URL } from '../../../app-constants';
const CalendarWrapper = styled.div`
  display: flex;
  border-left: 2px solid #3883bb;
  border-right: 2px solid #3883bb;
  border-bottom: 2px solid #3883bb;
  height: calc(100% - 4rem - 4rem);
  overflow: hidden;
`;

const MainCalendar = styled.div`
  flex: 1 0;
  border-right: 1px solid #3883bb;
`;

const RightSideBar = styled.div`
  width: calc((100vw - 5.05rem) / 7);
  border-top: 2px solid #3883bb;
  position: relative;
`;

const SignInWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: calc((100vw - 5.05rem) / 7);
  background: #fafafa;
  height: 4rem;
  text-align: center;
  padding: 0.5rem;
`;

SignInWrapper.Button = styled.div`
  border-radius: 4px;
  background: #0071c5;
  color: #ffffff;
  width: 100%;
  font-size: 1rem;
  line-height: 2.8;
  height: 100%;
  cursor: pointer;
`;

const servicesAdapter = service => {
  return {
    appointmentId: service.AppointmentId,
    bookingServiceId: service.BookingServiceId,
    duration: service.Duration,
    price: service.Price,
    serviceId: service.ServiceId,
    serviceName: service.ServiceName,
    staffId: service.StaffId,
  };
};
const productsAdapter = product => {
  return {
    appointmentId: product.AppointmentId,
    bookingProductId: product.BookingProductId,
    productId: product.ProductId,
    productName: product.ProductName,
    quantity: product.Quantity,
    price: product.Price,
  };
};
const extrasAdapter = extra => {
  return {
    appointmentId: extra.AppointmentId,
    bookingExtraId: extra.BookingExtraId,
    duration: extra.Duration,
    extraId: extra.ExtraId,
    extraName: extra.ExtraName,
    price: extra.Price,
  };
};

class Calendar extends React.Component {
  constructor() {
    super();
    window.Calendar = this;
  }
  componentWillMount() {
    const { loadWaitingAppointments, loadingCalendar } = this.props;
    loadWaitingAppointments();
    // loadingCalendar(true)
  }

  componentDidMount() {
    this.runSignalR();
    setInterval(() => {
      console.log(
        '***********************RECONNECT SignalR***********************',
      );
      this.runSignalR();
    }, 120000);
  }

  runSignalR() {
    this.runSignalR_Appointment();
  }

  runSignalR_Appointment() {
    const {
      addAppointmentRealTime,
      addAppointmentWaiting,
      updateAppointmentPaid,
      removeAppointmentWaiting,
      deleteAppointmentCalendar,
      updateStaff,
      loadWaitingAppointments,
      loadAppointmentByMembers,
      loadMembers
    } = this.props;
    const url = `${PROD_API_BASE_URL}/notification/?merchantId=${merchantId}&Title=Merchant&kind=calendar`;
    let connection = new signalR.HubConnectionBuilder().withUrl(url).build();

    connection.on('ListWaNotification', async data => {
      let app = JSON.parse(data);
      if (app.data) {
        let type = app.data.Type;
        switch (type) {
          case 'appointment_add':
            const appointment = app.data.Appointment;
            if (appointment) {
              let appointment_R = this.returnAppointment(appointment);

              if (
                appointment_R.status === 'ASSIGNED' ||
                appointment_R.status === 'CHECKED_IN'
              ) {
                const displayMember = store
                  .getState()
                  .getIn(['appointment', 'appointments', 'calendar']);

                const member = displayMember.find(mem =>
                  mem.appointments.find(
                    app => parseInt(app.id) === parseInt(appointment_R.id),
                  ),
                );
                if (!member) {
                  updateEventToCalendar(appointment_R);
                  addAppointmentRealTime(appointment_R);
                }
              } else if (appointment_R.status === 'WAITING') {
                addAppointmentWaiting(appointment_R);
              }
            }
            break;

          case 'appointment_update':
            let app_update = app.data.appointment;
            if (app_update) {
              let appointment = JSON.parse(app_update);
              let appointment_R = this.returnAppointment(appointment);
              const displayMember = store
                .getState()
                .getIn(['appointment', 'appointments', 'calendar']);
              const selectDay = store
                .getState()
                .getIn(['appointment', 'currentDay']);

              switch (appointment_R.status) {
                case 'WAITING':
                  addAppointmentWaiting(appointment_R);
                  deleteAppointmentCalendar(appointment_R);
                  addEventsToCalendar(selectDay, displayMember);
                  break;

                case 'CANCEL':
                  const member = displayMember.find(mem =>
                    mem.appointments.find(
                      app => parseInt(app.id) === parseInt(appointment_R.id),
                    ),
                  );
                  if (member) {
                    deleteAppointmentCalendar(appointment_R);
                    const selectDay = store
                      .getState()
                      .getIn(['appointment', 'currentDay']);
                    addEventsToCalendar(selectDay, displayMember);
                  }
                  removeAppointmentWaiting(appointment_R);
                  break;

                default:
                  updateAppointmentPaid(appointment_R);
                  addEventsToCalendar(selectDay, displayMember);
                  if (appointment_R.status === 'CHECKED_IN') {
                    removeAppointmentWaiting(appointment_R);
                  }
                  break;
              }
            }
            break;
          case 'appointment_checkout':
            let app_checkout = app.data.appointment;
            if (app_checkout) {
              let appointment = JSON.parse(app_checkout);
              let appointment_R = this.returnAppointment(appointment);

              await updateAppointmentPaid(appointment_R);
              const displayMember = store
                .getState()
                .getIn(['appointment', 'appointments', 'calendar']);

              const selectDay = store
                .getState()
                .getIn(['appointment', 'currentDay']);

              addEventsToCalendar(selectDay, displayMember);
            }
            break;

          case 'change_item':
            loadWaitingAppointments();
            loadAppointmentByMembers();
            break;
          default:
            break;
        }
      }
      if (app.type) {

        let type = app.type;
        if (type === 'staff_update') {
          loadMembers();
          loadAppointmentByMembers();
          // let staff = memberAdapter_update(JSON.parse(app.staff));
          // // updateStaff(staff);
        }
      }
    });

    connection.start();
  }

  returnAppointment(appointment) {
    return {
      id: appointment.AppointmentId,
      userFullName: appointment.FirstName + ' ' + appointment.LastName,
      phoneNumber: appointment.PhoneNumber,
      options: appointment.Services.map(sv => servicesAdapter(sv)),
      products: appointment.Products.map(product => productsAdapter(product)),
      extras: appointment.Extras.map(extra => extrasAdapter(extra)),
      status: statusConvertKey[appointment.Status],
      memberId: appointment.StaffId,
      start: appointment.FromTime,
      end: appointment.ToTime,
      user_id: appointment.UserId,
      createDate: appointment.CreatedDate,
      tipPercent: appointment.TipPercent,
      tipAmount : appointment.TipAmount,
      subTotal : appointment.SubTotal,
      tax : appointment.Tax,
      giftCard : appointment.GiftCard,
      discount : appointment.Discount,
      total : appointment.Total,
      notes: appointment.Notes,
    };
  }

  reloadComponent = section => {
    switch (section) {
      case 'calendar':
        this.props.updateCalendarInterval();
        break;
      case 'waitinglist':
        this.props.loadWaitingAppointments();
        break;
      default:
        break;
    }
  };

  render() {
    const {
      waitingAppointments,
      waitingIndex,
      openAddingAppointment,
      calendarMembers,
      disableCalendar,
      isLoadWaiting,
      isLoadCalendar,
      disable_Calendar,
      deleteEventWaitingList,
      StatusDeleteWaiting,
      deleteWaitingAppointment,
      updateAppointmentPaid,
    } = this.props;
    return (
      <CalendarWrapper>
        <MainCalendar>
          {isLoadCalendar === true && <CalendarLoading />}
          <FCAgenda
            disableCalendar={disableCalendar}
            updateAppointmentPaid={updateAppointmentPaid}
            options={MAIN_CALENDAR_OPTIONS}
          />
        </MainCalendar>
        <RightSideBar id="drag-zone">
          {isLoadWaiting === true && <WaitingLoading />}
          {!!waitingAppointments && !!waitingAppointments.length ? (
            <FCDragZone
              events={waitingAppointments}
              index={waitingIndex}
              deleteEventWaitingList={deleteEventWaitingList}
              StatusDeleteWaiting={StatusDeleteWaiting}
              deleteWaitingAppointment={deleteWaitingAppointment}
            />
          ) : (
            ''
          )}
          <SignInWrapper>
            <SignInWrapper.Button
              onClick={() => {
                openAddingAppointment({});
                disable_Calendar(true);
              }}
            >
              Sign in
            </SignInWrapper.Button>
          </SignInWrapper>
        </RightSideBar>
      </CalendarWrapper>
    );
  }
}

Calendar.propTypes = {
  waitingAppointments: PropTypes.any,
  loadWaitingAppointments: PropTypes.func,
  waitingIndex: PropTypes.number,
  openAddingAppointment: PropTypes.func,
  updateCalendarInterval: PropTypes.func,
  deleteEventWaitingList: PropTypes.func,
};

export default Calendar;
