import { delay } from 'redux-saga';
import { fork, put, takeLatest, all, select } from 'redux-saga/effects';
import moment from 'moment';
import axios from 'axios';
import { differenceBy } from 'lodash'

import {
  SELECT_DAY,
  SELECT_DAY_CALENDAR,
  LOAD_MEMBERS,
  SET_DISPLAYED_MEMBERS,
  LOAD_APPOINTMENTS_BY_MEMBERS,
  LOAD_WAITING_APPOINTMENT,
  ASSIGN_APPOINTMENT,
  MOVE_APPOINTMENT,
  PUT_BACK_APPOINTMENT,
  CANCEL_APPOINTMENT,
  UPDATE_CALENDAR_INTERVAL,
  UPDATE_APPOINTMENT_STATUS,
  ADD_CUSTOMER,
  CHECK_PHONE_ADD_CUSTOMER,
  DELETE_EVENT_WAITINGLIST,
  CHANGE_APPOINTMENT_TIME,
  UPDATE_APPOINTMENT_OFFLINE,
  LOAD_APPOINTMENT_AGAIN,
} from './constants';
import {
  selectDay,
  selectWeek,
  membersLoaded,
  memberLoadingError,
  setDisplayedMembers,
  waitingAppointmentsLoaded,
  waitingAppointmentLoadingError,
  loadAppointmentByMembers,
  appointmentByMembersLoaded,
  appointmentByMemberLoadingError,
  appointmentAssigningError,
  appointmentMoved,
  appointmentMovingError,
  appointmentPutBack,
  appointmentPuttingBackError,
  deselectAppointment,
  appointmentCanceled,
  appointmentCancellingError,
  appointmentUpdatedStatus,
  appointmentUpdatingStatusError,
  updateAppointmentError,
  updateAppointmentSuccess,
  addCustomerSuccess,
  addCustomerError,
  checkPhoneNumberCustomerSuccess,
  checkPhoneNumberCustomerError,
  loadingWaiting,
  loadingCalendar,
  TimeAndStaffID,
  addAppointmentToCalendar,
  removeAppointmentWaiting,
  deleteEventWaitingList_Success,
  changeAppointmentTime_Success,
  updateAppointmentOfflineSuccess,
  updateAppointmentOfflineError,
  addAppointmentWaiting,
  addAppointmentReloadCalendar,
  infoCheckPhone,
  addAppointmentRealTime,
  loadMembers,
  loadWaitingAppointments,


} from './actions';
import {
  makeCurrentDay,
  makeSelectCalendarAppointments,
  makeSelectDisplayedMembers,
  makeSelectFCEvent,
  makeInfoCheckPhone,
} from './selectors';

import {
  GET_MEMBERS_API,
  POST_ADD_CUSTOMER,
  BASE_URL,
  token,
  VAR_DEFAULT_AVATAR_PATH,
  GET_APPOINTMENT_BY_DATE,
  PUT_STATUS_APPOINTMENT_API,
  GET_BY_PHONE,
  POST_ADD_APPOINTMENT,
  merchantId,
  GET_APPOINTMENT_BY_ID,
  GET_APPOINTMENT_STATUS
} from '../../../app-constants';

import { assignAppointment as mockedPostAppointment } from '../../assets/mocks/assignAppointment';
import {
  addEventsToCalendar,
  deleteEventFromCalendar,
  updateEventToCalendar,

} from '../../components/Calendar/constants';


const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
};

export const statusConvertKey = {
  unconfirm: 'ASSIGNED',
  confirm: 'CONFIRMED',
  checkin: 'CHECKED_IN',
  paid: 'PAID',
  waiting: 'WAITING',
  cancel: 'CANCEL',
  pending: 'PENDING'
};

const appointmentAdapter = appointment => {

  const options = [];
  const products = [];
  if (appointment.options && appointment.options.service) {
    appointment.options.service.forEach(service => {
      options.push({
        id: service.id,
        name: service.name,
        duration: service.duration,
        price: service.price,
      });
    });
  }

  if (appointment.options && appointment.options.product.length > 0) {
    appointment.options.product.forEach(product => {
      products.push(product);
    });
  }

  return {
    id: appointment.appointmentId,
    userFullName: appointment.firstName + ' ' + appointment.lastName,
    phoneNumber: appointment.phoneNumber,
    options: appointment.services,
    products: appointment.products,
    extras: appointment.extras,
    status: statusConvertKey[appointment.status],
    memberId: appointment.staffId,
    start: appointment.fromTime,
    end: appointment.toTime,
    user_id: appointment.userId,
    createDate: appointment.createdDate,
    tipPercent: appointment.tipPercent,
    tipAmount: appointment.tipAmount,
    subTotal: appointment.subTotal,
    total: appointment.total,
    tax: appointment.tax,
    discount: appointment.discount,
    giftCard: appointment.giftCard,
    notes: appointment.notes === null ? [] : appointment.notes
  };
};

const memberAdapter = member => {
  return {
    id: member.staffId,
    title: `${member.displayName}`,
    imageUrl:
      (member.imageUrl && `${member.imageUrl}`) ||
      `${BASE_URL}/${VAR_DEFAULT_AVATAR_PATH}`,
    orderNumber: member.orderNumber,
    workingTimes: member.workingTimes,
    isDisabled : member.isDisabled
  }
};

export const memberAdapter_update = member => {
  return {
    id: member.StaffId,
    title: `${member.DisplayName}`,
    imageUrl:
      (member.ImageUrl && `${member.ImageUrl}`) ||
      `${BASE_URL}/${VAR_DEFAULT_AVATAR_PATH}`,
    orderNumber: member.OrderNumber,
    workingTimes: JSON.parse(member.WorkingTime)
  }
};


const statusConvertData = {
  ASSIGNED: 'unconfirm',
  CONFIRMED: 'confirm',
  CHECKED_IN: 'checkin',
  PAID: 'paid',
  WAITING: 'waiting',
  CANCEL: 'cancel',
};

const statusAdapter = status => statusConvertData[status]


export function* getMembers() {
  try {
    const requestURL = new URL(`${GET_MEMBERS_API}/${merchantId}`);
    const response = yield axios.get(requestURL.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((result) => {
      return result;
    }).catch((err) => {
      console.log(err)
    });
    if (response.status === 200 && response.data.codeStatus === 1) {
      const members = response.status === 200 ? response.data.data.map(member => memberAdapter(member)).filter(mem=>mem.isDisabled === 0) : '';
      yield put(membersLoaded(members));
      yield put(setDisplayedMembers(members.slice(0, 6)));
    }
  } catch (err) {
    alert(err)
    yield put(memberLoadingError(err));
  }
}

function* checkResponse(response) {
  alert(response.data.message);
  yield put(loadMembers());
  yield put(loadWaitingAppointments());
  yield put(loadAppointmentByMembers());
  return;
}

export function* getWaitingAppointments() {
  try {
    yield put(loadingWaiting(true))
    const requestURL = new URL(GET_APPOINTMENT_STATUS);
    const url = `${requestURL.toString()}`;
    const response = yield axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((result) => {
        if (result.status === 200) {

          return result;
        }
      }).catch((err) => {

      });

    const appointments =
      response &&
      response.status === 200 &&
      response.data.data.map(appointment => appointmentAdapter(appointment));


    if (response) {
      yield put(loadingWaiting(false))
    }

    yield put(waitingAppointmentsLoaded(appointments));
  } catch (err) {
    yield put(waitingAppointmentLoadingError(err));
  }
}

export function* getAppointmentsByMembersAndDate() {
  try {
    yield put(loadingCalendar(true))
    const displayedMembers = yield select(makeSelectDisplayedMembers());
    const currentDate = yield select(makeCurrentDay());
    let apiDateQuery =
      currentDate.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');

    const requestURL = new URL(GET_APPOINTMENT_BY_DATE);
    const url = `${requestURL.toString()}/${apiDateQuery}`;
    const response = yield axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((result) => {
        if (result.status === 200) {
          return result;
        }
      }).catch((err) => {
        alert(err)
      });

    const appointments =
      response &&
      response.status === 200 &&
      response.data.data.map(appointment => appointmentAdapter(appointment));

    const appointmentsMembers = displayedMembers.map(member => ({
      memberId: member.id,
      appointments: appointments.filter(
        appointment => appointment.memberId === member.id
          && appointment.status !== 'CANCEL'
          && appointment.status !== 'WAITING'
          && appointment.status !== 'PENDING'
          && appointment.status !== undefined
        ,
      )
    }));

    switch (moment(currentDate).format('dddd')) {
      case 'Monday':
        appointmentsMembers.forEach(mem => {
          const memFind = displayedMembers.find(member => member.id === mem.memberId);
          mem.appointments.push({
            status: 'BLOCK',
            memberId: mem.memberId,
            start: `${moment(currentDate).day('Monday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Monday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
            end: `${moment(currentDate).day('Monday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
            id: '',
            userFullName: '',
            phoneNumber: '',
            options: [],
            products: [],
            extras: [],
            notes: [],
          }, {
              status: 'BLOCK',
              memberId: mem.memberId,
              start: `${moment(currentDate).day('Monday').format('YYYY-MM-DD')}T${moment().startOf('days').add(6, 'hours').format("HH:mm:ss")}`,
              end: `${moment(currentDate).day('Monday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Monday.timeStart, ["h:mm A"]).format("HH:mm:ss")}`,
              id: '',
              userFullName: '',
              phoneNumber: '',
              options: [],
              products: [],
              extras: [],
              notes: [],
            })
        });
        break;
      case 'Tuesday':
        appointmentsMembers.forEach(mem => {
          const memFind = displayedMembers.find(member => member.id === mem.memberId);
          mem.appointments.push({
            status: 'BLOCK',
            memberId: mem.memberId,
            start: `${moment(currentDate).day('Tuesday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Tuesday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
            end: `${moment(currentDate).day('Tuesday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
            id: '',
            userFullName: '',
            phoneNumber: '',
            options: [],
            products: [],
            extras: [],
            notes: [],
          }, {
              status: 'BLOCK',
              memberId: mem.memberId,
              start: `${moment(currentDate).day('Tuesday').format('YYYY-MM-DD')}T${moment().startOf('days').add(6, 'hours').format("HH:mm:ss")}`,
              end: `${moment(currentDate).day('Tuesday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Tuesday.timeStart, ["h:mm A"]).format("HH:mm:ss")}`,
              id: '',
              userFullName: '',
              phoneNumber: '',
              options: [],
              products: [],
              extras: [],
              notes: [],
            })
        });
        break;
      case 'Wednesday':
        appointmentsMembers.forEach(mem => {
          const memFind = displayedMembers.find(member => member.id === mem.memberId);
          mem.appointments.push({
            status: 'BLOCK',
            memberId: mem.memberId,
            start: `${moment(currentDate).day('Wednesday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Wednesday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
            end: `${moment(currentDate).day('Wednesday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
            id: '',
            userFullName: '',
            phoneNumber: '',
            options: [],
            products: [],
            extras: [],
            notes: [],
          }, {
              status: 'BLOCK',
              memberId: mem.memberId,
              start: `${moment(currentDate).day('Wednesday').format('YYYY-MM-DD')}T${moment().startOf('days').add(6, 'hours').format("HH:mm:ss")}`,
              end: `${moment(currentDate).day('Wednesday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Wednesday.timeStart, ["h:mm A"]).format("HH:mm:ss")}`,
              id: '',
              userFullName: '',
              phoneNumber: '',
              options: [],
              products: [],
              extras: [],
              notes: [],
            })
        });
        break;

      case 'Thursday':
        appointmentsMembers.forEach(mem => {
          const memFind = displayedMembers.find(member => member.id === mem.memberId);
          mem.appointments.push({
            status: 'BLOCK',
            memberId: mem.memberId,
            start: `${moment(currentDate).day('Thursday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Thursday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
            end: `${moment(currentDate).day('Thursday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
            id: '',
            userFullName: '',
            phoneNumber: '',
            options: [],
            products: [],
            extras: [],
            notes: [],
          }, {
              status: 'BLOCK',
              memberId: mem.memberId,
              start: `${moment(currentDate).day('Thursday').format('YYYY-MM-DD')}T${moment().startOf('days').add(6, 'hours').format("HH:mm:ss")}`,
              end: `${moment(currentDate).day('Thursday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Thursday.timeStart, ["h:mm A"]).format("HH:mm:ss")}`,
              id: '',
              userFullName: '',
              phoneNumber: '',
              options: [],
              products: [],
              extras: [],
              notes: [],
            })
        });
        break;

      case 'Friday':
        appointmentsMembers.forEach(mem => {
          const memFind = displayedMembers.find(member => member.id === mem.memberId);
          mem.appointments.push({
            status: 'BLOCK',
            memberId: mem.memberId,
            start: `${moment(currentDate).day('Friday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Friday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
            end: `${moment(currentDate).day('Friday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
            id: '',
            userFullName: '',
            phoneNumber: '',
            options: [],
            products: [],
            extras: [],
            notes: [],
          }, {
              status: 'BLOCK',
              memberId: mem.memberId,
              start: `${moment(currentDate).day('Friday').format('YYYY-MM-DD')}T${moment().startOf('days').add(6, 'hours').format("HH:mm:ss")}`,
              end: `${moment(currentDate).day('Friday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Friday.timeStart, ["h:mm A"]).format("HH:mm:ss")}`,
              id: '',
              userFullName: '',
              phoneNumber: '',
              options: [],
              products: [],
              extras: [],
              notes: [],
            })
        });
        break;

      case 'Saturday':
        appointmentsMembers.forEach(mem => {
          const memFind = displayedMembers.find(member => member.id === mem.memberId);
          mem.appointments.push({
            status: 'BLOCK',
            memberId: mem.memberId,
            start: `${moment(currentDate).day('Saturday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Saturday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
            end: `${moment(currentDate).day('Saturday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
            id: '',
            userFullName: '',
            phoneNumber: '',
            options: [],
            products: [],
            extras: [],
            notes: [],
          }, {
              status: 'BLOCK',
              memberId: mem.memberId,
              start: `${moment(currentDate).day('Saturday').format('YYYY-MM-DD')}T${moment().startOf('days').add(6, 'hours').format("HH:mm:ss")}`,
              end: `${moment(currentDate).day('Saturday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Saturday.timeStart, ["h:mm A"]).format("HH:mm:ss")}`,
              id: '',
              userFullName: '',
              phoneNumber: '',
              options: [],
              products: [],
              extras: [],
              notes: [],
            })
        });
        break;

      case 'Sunday':
        appointmentsMembers.forEach(mem => {
          const memFind = displayedMembers.find(member => member.id === mem.memberId);
          mem.appointments.push({
            status: 'BLOCK',
            memberId: mem.memberId,
            start: `${moment(currentDate).day(0).format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Sunday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
            end: `${moment(currentDate).day(0).endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
            id: '',
            userFullName: '',
            phoneNumber: '',
            options: [],
            products: [],
            extras: [],
            notes: [],
          }, {
              status: 'BLOCK',
              memberId: mem.memberId,
              start: `${moment(currentDate).day(0).format('YYYY-MM-DD')}T${moment().startOf('days').add(6, 'hours').format("HH:mm:ss")}`,
              end: `${moment(currentDate).day(0).format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Sunday.timeStart, ["h:mm A"]).format("HH:mm:ss")}`,
              id: '',
              userFullName: '',
              phoneNumber: '',
              options: [],
              products: [],
              extras: [],
              notes: [],
            })
        });
        break;

      default:
        break;
    }

    if (response.status === 200) {
      yield put(loadingCalendar(false));
      yield put(appointmentByMembersLoaded(appointmentsMembers));
      addEventsToCalendar(currentDate, appointmentsMembers);
    }

  } catch (err) {
    yield put(appointmentByMemberLoadingError(err));
  }
}

export function* moveAppointment(action) {
  const displayedMembers = yield select(makeSelectDisplayedMembers());
  const calendarMembers = yield select(makeSelectCalendarAppointments());
  const assignedMember = displayedMembers[action.newPositionIndex];

  const oldMemberPosition = calendarMembers.find(member =>
    member.appointments.find(
      appointment => appointment.id === action.appointmentId,
    ),
  );
  if (!oldMemberPosition) {
    yield put(appointmentMovingError('Cannot find previous position.'));
  }

  const movedAppointment = oldMemberPosition.appointments.find(
    appointment => appointment.id === action.appointmentId,
  );
  if (!movedAppointment) {
    yield put(appointmentMovingError('Cannot find moved appointment.'));
  }

  let appointment = {
    ...movedAppointment,
    start: action.newTime,
    end: action.newEndTime,
    memberId: assignedMember.id,
  };

  if (parseInt(appointment.memberId) !== parseInt(movedAppointment.memberId)) {
    if (appointment.status === "CHECKED_IN") {
      appointment.status = "CONFIRMED";
    }
  }
  const { memberId, start, end, status, options, products, extras } = appointment;

  const data = {
    staffId: memberId,
    fromTime: start,
    toTime: end,
    status: statusConvertData[status],
    services: options,
    products,
    extras
  }
  console.log(data);

  const requestURL = new URL(PUT_STATUS_APPOINTMENT_API);
  const kq = yield axios.put(`${requestURL.toString()}/${appointment.id}`, data, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", }
  }).then((result) => {
    return result
  }).catch((err) => {

  });
  if (kq.status === 200 && kq.data.codeStatus !== 1) {
    return yield* checkResponse(kq);
  }

  if (kq.status === 200) {
    yield put(appointmentMoved(appointment));
  } else {
    yield put(appointmentMovingError(result));
  }
}

export function* putBackAppointment(action) {
  try {
    const { appointment } = action;
    let { memberId, start, end, options, products, extras } = appointment;
    const requestURL = new URL(PUT_STATUS_APPOINTMENT_API);
    yield put(appointmentPutBack(action.appointment));
    const data = {
      staffId: memberId,
      fromTime: start,
      toTime: end,
      status: 'waiting',
      services: options,
      products,
      extras
    }
    const kq = yield axios.put(`${requestURL.toString()}/${appointment.id}`, data, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", }
    }).then((result) => {
      return result
    }).catch((err) => {
      const data_offline = JSON.parse(localStorage.getItem('updateAppointment')) ? JSON.parse(localStorage.getItem('updateAppointment')) : [];
      data_offline.push(data);
      localStorage.setItem('updateAppointment', JSON.stringify(data_offline));
      return { error: err }
    });

    if (kq.status === 200 && kq.data.codeStatus !== 1) {
      return yield* checkResponse(kq);
    }

    if (kq.status === 200) {
    } else {
      yield put(appointmentPuttingBackError(result));
    }
  } catch (err) {
    yield put(appointmentPuttingBackError(err));
  }
}

export function* cancelAppointment(action) {
  const fcEvent = yield select(makeSelectFCEvent());
  if (!fcEvent) {
    yield put(appointmentCancellingError('Cannot find selected fcEvent'));
  }
  try {
    yield delay(200);
    const result = mockedPostAppointment;
    if (result) {
      yield put(appointmentCanceled(action.appointmentId));
      deleteEventFromCalendar(fcEvent._id);
      yield put(deselectAppointment());
    } else {
      yield put(appointmentCancellingError(result));
    }
  } catch (err) {
    yield put(appointmentCancellingError(err));
  }
}


export function* assignAppointment(action) {
  const displayedMembers = yield select(makeSelectDisplayedMembers());
  const assignedMember = displayedMembers[action.resourceId];
  const appointment = {
    ...action.eventData,
    memberId: assignedMember.id,
  };
  try {
    yield put(removeAppointmentWaiting(appointment));

    const { memberId, start, status, options, products, extras } = appointment;
    let duration_total = 0;
    appointment.options.forEach(el => {
      duration_total += parseInt(el.duration);
    });
    extras.forEach(ext => {
      duration_total += parseInt(ext.duration);
    });

    yield put(addAppointmentToCalendar({
      appointment: appointment,
      new_end_time: duration_total > 0 ? moment(start).add(duration_total, 'minutes').format().substr(0, 19) : moment(start).add(15, 'minutes').format().substr(0, 19),
      memberId: appointment.memberId
    }));

    const displayedMember_app = yield select(makeSelectCalendarAppointments());

    const currentDate = yield select(makeCurrentDay());
    addEventsToCalendar(currentDate, displayedMember_app);
    const data = {
      staffId: memberId,
      fromTime: start,
      toTime: duration_total > 0 ? moment(start).add(duration_total, 'minutes').format().substr(0, 19) : moment(start).add(15, 'minutes').format().substr(0, 19),
      status: statusConvertData[status],
      services: options,
      products,
      extras
    }

    const requestURL = new URL(PUT_STATUS_APPOINTMENT_API);
    const kq = yield axios.put(`${requestURL.toString()}/${appointment.id}`, data, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", }
    }).then((result) => {
      return result
    }).catch((err) => {
      const data_offline = JSON.parse(localStorage.getItem('updateAppointment')) ? JSON.parse(localStorage.getItem('updateAppointment')) : [];
      data_offline.push(data);
      localStorage.setItem('updateAppointment', JSON.stringify(data_offline));
      return { error: err }
    });

    if (kq.status === 200 && kq.data.codeStatus !== 1) {
      return yield* checkResponse(kq);
    }

    if (kq.status === 200) {

    } else {
      yield put(appointmentAssigningError(result));
    }
  } catch (err) {
    yield put(appointmentAssigningError(err));
  }
}

export function* upddateAppointment(action) {
  try {
    const fcEvent = yield select(makeSelectFCEvent());
    if (!fcEvent) {
      yield put(appointmentUpdatingStatusError('Cannot find selected fcEvent'));
    }
    let { appointment, status, old_duration, servicesUpdate, productsUpdate, notes } = action.appointment;
    let { end, start, extras, memberId } = appointment;

    let new_total_duration = 0;
    servicesUpdate.forEach(sv => {
      new_total_duration += parseInt(sv.duration);
    });
    extras.forEach(ext => {
      new_total_duration += parseInt(ext.duration);
    });

    let newDate;
    if (status === 'checkin' || status === 'confirm') {
      if (parseInt(old_duration) > parseInt(new_total_duration)) {
        const newDuration = parseInt(old_duration) - parseInt(new_total_duration);
        newDate = moment(end).subtract(newDuration, 'minutes').format();
      } else {
        const newDuration = parseInt(new_total_duration) - parseInt(old_duration);
        newDate = moment(end).add(newDuration, 'minutes').format();
      }
    } else {
      newDate = moment(end).add(new_total_duration, 'minutes').format();
    }

    if (status === 'cancel') {
      yield put(appointmentCanceled(appointment.id));
      deleteEventFromCalendar(fcEvent._id);
      yield put(deselectAppointment());
    } else {
      yield put(appointmentUpdatedStatus({ appointmentID: appointment.id, status, BookingServices2: servicesUpdate, newDate, productsUpdate, notes }));
      const displayedMember_app = yield select(makeSelectCalendarAppointments());
      const currentDate = yield select(makeCurrentDay());
      addEventsToCalendar(currentDate, displayedMember_app);
    }
    let notesUpdate = []
    notes.forEach(note => {
      notesUpdate.push({
        note: note.note
      })
    });

    let data = {
      staffId: memberId,
      fromTime: start,
      toTime: newDate,
      status,
      services: servicesUpdate,
      products: productsUpdate,
      extras,
      notes: notesUpdate
    }

    const requestURL = new URL(PUT_STATUS_APPOINTMENT_API);
    const kq = yield axios.put(`${requestURL.toString()}/${appointment.id}`, data, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", }
    }).then((result) => {
      return result
    }).catch((err) => {
      const data_offline = JSON.parse(localStorage.getItem('updateAppointment')) ? JSON.parse(localStorage.getItem('updateAppointment')) : [];
      data_offline.push(data);
      localStorage.setItem('updateAppointment', JSON.stringify(data_offline));
      return { error: err }
    });

    if (response.status === 200 && response.data.codeStatus !== 1) {
      return yield* checkResponse(response);
    }

    if (kq.status === 200) {
      yield put(updateAppointmentSuccess(result.data.data))
    } else {
      yield put(updateAppointmentError(error))
    }
  }
  catch (error) {
    yield put(updateAppointmentError(error))
  }
}

export function* changeTimeAppointment(action) {
  try {
    let check = true;
    const fcEvent = yield select(makeSelectFCEvent());
    if (!fcEvent) {
      yield put(appointmentUpdatingStatusError('Cannot find selected fcEvent'));
    }

    let { appointment, dayPicker, fromTime, notes } = action.appointment;
    let { memberId, options, products, extras, id } = appointment;

    let totalDuration = 0;
    appointment.options.forEach(app => {
      totalDuration += app.duration;
    });
    extras.forEach(ext => {
      totalDuration += ext.duration;
    });

    const start_time = `${moment(dayPicker).format('YYYY-MM-DD')}T${moment(fromTime).format('HH:mm')}`;
    const end_time = totalDuration > 0 ? moment((start_time)).add(totalDuration, 'minutes').format('YYYY-MM-DD HH:mm') :
      moment((start_time)).add(15, 'minutes').format('YYYY-MM-DD HH:mm');

    let displayedMember_app = yield select(makeSelectCalendarAppointments());
    const member = displayedMember_app.find(mem =>
      mem.appointments.find(app => parseInt(app.id) === parseInt(id)),
    );

    member.appointments.forEach(app => {
      if (parseInt(app.id) !== parseInt(id)) {
        if ((moment(start_time).isBetween(app.start, app.end)) || (moment(end_time).isBetween(app.start, app.end))) {
          if (app.status === 'CHECKED_IN' || app.status === 'CONFIRMED' || app.status === "BLOCK") {
            check = false;
          }
        }
      }
    });

    if (check === false) {
      window.alert('You can not override this appointment to another checkin or confirm appointment, or Working Time of this staff is over !!!')
    }
    else {
      if (moment(dayPicker).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD')) {
        if (moment(start_time).isBefore(moment().add(1, 'hours'))) {
          window.alert('Your time change must be bigger than your current time at least 1 hour !!!')
        } else {
          yield* changeTime(appointment, fcEvent, start_time, end_time, memberId, options, products, extras, notes);
        }
      } else {
        yield* changeTime(appointment, fcEvent, start_time, end_time, memberId, options, products, extras, notes);
      }
    }
  }
  catch (error) {
    yield put(updateAppointmentError(error))
  }

  function* changeTime(appointment, fcEvent, start_time, end_time, memberId, options, products, extras, notes) {

    yield put(appointmentCanceled(appointment.id));
    deleteEventFromCalendar(fcEvent._id);
    yield put(deselectAppointment());
    yield put(changeAppointmentTime_Success({
      ...appointment,
      start: start_time,
      end: end_time,
      notes
    }));
    const displayedMember_app = yield select(makeSelectCalendarAppointments());
    const currentDate = yield select(makeCurrentDay());
    addEventsToCalendar(currentDate, displayedMember_app);

    let notesUpdate = []

    notes.forEach(note => {
      notesUpdate.push({
        note: note.note
      })
    });

    let data = {
      staffId: memberId,
      fromTime: start_time,
      toTime: end_time,
      status: 'unconfirm',
      services: options,
      products: products,
      extras,
      notes: notesUpdate
    };
    const requestURL = new URL(PUT_STATUS_APPOINTMENT_API);
    const kq = yield axios.put(`${requestURL.toString()}/${appointment.id}`, data, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", }
    }).then((result) => {
      return result;
    }).catch((err) => {
      const data_offline = JSON.parse(localStorage.getItem('updateAppointment')) ? JSON.parse(localStorage.getItem('updateAppointment')) : [];
      data_offline.push(data);
      localStorage.setItem('updateAppointment', JSON.stringify(data_offline));
      return { error: err };
    });

    if (response.status === 200 && response.data.codeStatus !== 1) {
      return yield* checkResponse(response);
    }

    if (kq.status === 200) {
      yield put(updateAppointmentSuccess(result));
    }
    else {
      yield put(updateAppointmentError(error));
    }
  }
}

function checkTimeToAddAppointmdent() {
  let time = moment();
  let time_15 = moment().startOf('hours').add(15, 'minutes');
  let time_30 = moment().startOf('hours').add(30, 'minutes');
  let time_45 = moment().startOf('hours').add(45, 'minutes');
  let time_60 = moment().startOf('hours').add(60, 'minutes');
  if (time.isBefore(time_15)) {
    time = time_15;
  }
  if (time.isBetween(time_15, time_30)) {
    time = time_30;
  }
  if (time.isBetween(time_30, time_45)) {
    time = time_45;
  }
  if (time.isBetween(time_45, time_60)) {
    time = time_60;
  }
  return time.format('YYYY-MM-DD HH:mm');
}

export function* addNewCustomer(action) {
  try {
    const { first_name, last_name, phone, staffID, time, refPhone, note, email } = action.customer;

    const Info_CheckPhone = yield select(makeInfoCheckPhone());
    let customerId;
    let user_Id;

    if (Info_CheckPhone === '') {
      const requestURL = new URL(POST_ADD_CUSTOMER);
      const data = {
        FirstName: first_name,
        LastName: last_name,
        Email: email,
        Phone: phone,
        referrerPhone: refPhone,
        favourite: note
      }

      const result = yield axios.post(requestURL.toString(), data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      }
      ).then((kq) => {
        return kq.data
      }).catch((err) => {
        console.log(err);
      });
      customerId = result.data.customerId;
      user_Id = result.data.userId;
    }
    else {
      customerId = Info_CheckPhone.customerId;
      user_Id = Info_CheckPhone.userId;
    }

    const data = {
      staffId: time ? staffID : 0,
      customerId,
      merchantId: merchantId,
      userId: user_Id,
      status: time ? "checkin" : "waiting",
      services: [
      ],
      products: [],
      extras: [],
      fromTime: time ? moment(new Date(time)).format('YYYY-MM-DD HH:mm') : checkTimeToAddAppointmdent(),
      toTime: time ? moment(new Date(time)).add(15, 'minutes').format('YYYY-MM-DD HH:mm') : moment(checkTimeToAddAppointmdent()).add(15, 'minutes').format('YYYY-MM-DD HH:mm'),
    }

    /* Add Appointment  */
    const requestURL_AddAppointment = new URL(POST_ADD_APPOINTMENT);
    const resultAddAppointment = yield axios.post(requestURL_AddAppointment.toString(), data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    }).then((kq) => {
      return kq;
    }).catch((err) => {
      console.log(err)
    });
    let id_appointment = '';
    if (resultAddAppointment.status === 200) {
      id_appointment = resultAddAppointment.data.data;
    }


    /* get appointment by id after add, add appointment to  waiting list */
    const requestURL_DeailAppointment = new URL(GET_APPOINTMENT_BY_ID).toString();
    const response_DetailAppointment = yield axios.get(`${requestURL_DeailAppointment}/${id_appointment}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((res) => {
        return res;
      }).catch((err) => {
        console.log(err);
      });

    yield put(addCustomerSuccess(true));

    const { appointmentId, createdDate, fromTime, toTime, staffId, phoneNumber, services, products, userId, firstName, lastName, extras } = response_DetailAppointment.data.data;
    let waitingAppointment = {
      id: appointmentId,
      createDate: createdDate,
      end: moment(toTime),
      start: moment(fromTime),
      memberId: time ? staffID : staffId,
      phoneNumber: phoneNumber,
      options: services,
      products: products,
      extras: extras,
      status: time ? 'CHECKED_IN' : 'WAITING',
      tipPercent: 0,
      user_id: userId,
      userFullName: firstName + ' ' + lastName,
      notes: [],
    }

    if (time) {
    } else {
      yield put(addAppointmentWaiting(waitingAppointment));
    }

    if (staffID) {
      window.postMessage(JSON.stringify({
        customerId, userId, appointmentId,
        action: 'newAppointment'
      }));
      window.postMessage(JSON.stringify({
        customerId, userId, appointmentId,
        action: 'signinAppointment'
      }));
    } else {
      window.postMessage(JSON.stringify({
        customerId, userId, appointmentId,
        action: 'newAppointment'
      }));
      window.postMessage(JSON.stringify({
        customerId, userId, appointmentId,
        action: 'signinAppointment'
      }));
    }
  } catch (error) {
    yield put(addCustomerError(error))
  }
}

export function* checkPhoneCustomer(action) {
  try {
    const { phone, staffID, time } = action.phone;
    const requestURL = new URL(GET_BY_PHONE);
    const result = yield axios.get(`${requestURL.toString()}/${phone}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((kq) => {
      return kq.data
    }).catch((err) => {

    });

    if (result.codeStatus === 2) {
      yield put(checkPhoneNumberCustomerSuccess(true));//phone is not exist
    } else {
      yield put(checkPhoneNumberCustomerError(true));
      yield put(infoCheckPhone(result.data));
      if (staffID) {
        window.postMessage(JSON.stringify({
          consumerId: result.data.customerId,
          staffid: staffID,
          from_time: time,
          action: 'newAppointment'
        }));
      } else {
        window.postMessage(JSON.stringify({
          consumerId: result.data.customerId,
          action: 'newAppointment'
        }));
        yield put(TimeAndStaffID(''));
      }
    }
  } catch (error) {
    yield put(checkPhoneNumberCustomerError(error))
  }
}

export function* deleteEventInWaitingList(action) {
  try {
    const { appointment } = action;

    const { memberId, start, end, options, products, extras } = appointment;
    yield put(removeAppointmentWaiting(appointment));

    let data = {
      staffId: memberId,
      fromTime: start,
      toTime: end,
      status: 'cancel',
      services: options,
      products: products,
      extras
    }

    const requestURL = new URL(PUT_STATUS_APPOINTMENT_API);
    const kq = yield axios.put(`${requestURL.toString()}/${appointment.id}`, data, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", }
    }).then((result) => {
      return result
    }).catch((err) => {

    });

    if (response.status === 200 && response.data.codeStatus !== 1) {
      return yield* checkResponse(response);
    }

    if (kq.status === 200) {
      yield put(deleteEventWaitingList_Success(appointment));
    }
  } catch (error) {

  }
}

export function* updateAppointment_Offline(action) {
  try {
    const appointment = action.data;
    const requestURL = new URL(UPPOST_STATUS_APPOINTMENT_APIDATE);
    const result = yield axios.post(requestURL.toString(), appointment, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    }).then((kq) => {
      return kq;
    }).catch((err) => {

    });
    if (result) {
      yield put(updateAppointmentOfflineSuccess(result));
    }
  } catch (error) {

  }
}

export function* getAppointmentAgain() {
  yield takeLatest(LOAD_APPOINTMENT_AGAIN, function* () {
    try {
      const displayedMembers = yield select(makeSelectDisplayedMembers());
      const currentDate = yield select(makeCurrentDay());
      let apiDateQuery =
        currentDate.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');

      const requestURL = new URL(GET_APPOINTMENT_BY_DATE);
      const url = `${requestURL.toString()}/${apiDateQuery}`;
      const response = yield axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
        .then((result) => {
          if (result.status === 200) {
            return result;
          }
        }).catch((err) => {

        });

      const appointments =
        response &&
        response.status === 200 &&
        response.data.data.map(appointment => appointmentAdapter(appointment));

      const app_calendar = yield select(makeSelectCalendarAppointments());
      let arr_appointment = [];
      app_calendar.forEach(mem =>
        mem.appointments.forEach(app => arr_appointment = [...arr_appointment, app])
      );

      let diff = differenceBy(appointments, arr_appointment, 'id');
      diff = diff.filter(app => app.status === "ASSIGNED");

      for (let index = 0; index < diff.length; index++) {
        const app = diff[index];
        yield put(addAppointmentReloadCalendar(app));
        updateEventToCalendar(app);
      }
    } catch (err) {
      yield put(appointmentByMemberLoadingError(err));
    }
  })
}




/* **************************** Subroutines ******************************** */

export function* selectDayAndWeek(action) {
  yield put(selectDay(action.day));
  yield put(selectWeek(action.day));
}

export function* getDisplayedMembers() {
  yield put(loadAppointmentByMembers());
}

/* ************************************************************************* */
/* ****************************** WATCHERS ********************************* */
/* ************************************************************************* */

export function* selectDayOnCalendar() {
  yield takeLatest(SELECT_DAY_CALENDAR, selectDayAndWeek);
}


export function* membersData() {
  yield takeLatest(LOAD_MEMBERS, getMembers);
}

export function* waitingAppointmentsData() {
  yield takeLatest(LOAD_WAITING_APPOINTMENT, getWaitingAppointments);
}

export function* appointmentsByMembersData() {
  yield takeLatest(
    LOAD_APPOINTMENTS_BY_MEMBERS,
    getAppointmentsByMembersAndDate,
  );

  yield takeLatest(SELECT_DAY, getAppointmentsByMembersAndDate);


  yield takeLatest(UPDATE_CALENDAR_INTERVAL, getAppointmentsByMembersAndDate);
}

export function* displayedMembersData() {
  yield takeLatest(SET_DISPLAYED_MEMBERS, getDisplayedMembers);
}

export function* assignAppointmentData() {
  yield takeLatest(ASSIGN_APPOINTMENT, assignAppointment);
}

export function* moveAppointmentData() {
  yield takeLatest(MOVE_APPOINTMENT, moveAppointment);
}

export function* putBackAppointmentData() {
  yield takeLatest(PUT_BACK_APPOINTMENT, putBackAppointment);
}


export function* cancelAppointmentData() {
  yield takeLatest(CANCEL_APPOINTMENT, cancelAppointment);
}

export function* updateAppointmentStatus() {
  yield takeLatest(UPDATE_APPOINTMENT_STATUS, upddateAppointment)
}
export function* add_Customer() {
  yield takeLatest(ADD_CUSTOMER, addNewCustomer)
}
export function* check_Phone() {
  yield takeLatest(CHECK_PHONE_ADD_CUSTOMER, checkPhoneCustomer)
}
export function* deleteEvent_WaitingList() {
  yield takeLatest(DELETE_EVENT_WAITINGLIST, deleteEventInWaitingList)
}
export function* change_time_appointment() {
  yield takeLatest(CHANGE_APPOINTMENT_TIME, changeTimeAppointment)
}
export function* update_App_Offline() {
  yield takeLatest(UPDATE_APPOINTMENT_OFFLINE, updateAppointment_Offline)
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* root() {
  yield all([
    fork(selectDayOnCalendar),
    fork(membersData),
    fork(waitingAppointmentsData),
    fork(displayedMembersData),
    fork(appointmentsByMembersData),
    fork(assignAppointmentData),
    fork(moveAppointmentData),
    fork(putBackAppointmentData),
    fork(cancelAppointmentData),
    fork(updateAppointmentStatus),
    fork(add_Customer),
    fork(check_Phone),
    fork(deleteEvent_WaitingList),
    fork(change_time_appointment),
    fork(update_App_Offline),
    fork(getAppointmentAgain)
  ]);
}




