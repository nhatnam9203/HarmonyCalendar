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
  CHECKPINCODE,
  UPDATE_NEXT_STAFF,
  RENDER_APPOINTMEMT,
  SUBMIT_EDIT_BLOCKTIME,
  DELETE_BLOCKTIME,
  GET_BLOCKTIME,
  GET_APPOINTMENT_OFFLINE,
  GET_WAITINGLIST_OFFLINE,
  GET_STAFF_OFFLINE
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
  checkPinCode,
  updateNextStaffSuccess,
  loadedAllAppointments,
  renderAppointment,
  updateAppointmentFrontend,
  deleteBlockTimeSuccess,
  getBlockTime_Success,
  getBlockTime,
  loadAppointmentAgain,
  deleteAppointmentCalendar
} from './actions';
import {
  makeCurrentDay,
  makeSelectCalendarAppointments,
  makeSelectDisplayedMembers,
  makeSelectFCEvent,
  makeInfoCheckPhone,
  makeSelectAllAppointments
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
  GET_APPOINTMENT_STATUS,
  GET_CHECKPINCODE,
  PUT_UPDATE_STATUS_APPOINTMENT,
  POST_ADD_BLOCK_TIME,
  DELETE_BLOCKTIME_API,
  GET_WORKINGTIME_MERCHANT
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

export const appointmentAdapter = appointment => {
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
    code: `#${appointment.code}`,
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
    notes: appointment.notes.sort(function (a, b) {
      var c = a.appointmentNoteId;
      var d = b.appointmentNoteId;
      return d - c;
    })
  };
};

export const memberAdapter = member => {
  return {
    id: member.staffId,
    title: `${member.displayName}`,
    imageUrl:
      (member.imageUrl && `${member.imageUrl}`) ||
      `${BASE_URL}/${VAR_DEFAULT_AVATAR_PATH}`,
    orderNumber: member.orderNumber,
    workingTimes: member.workingTimes,
    isDisabled: member.isDisabled,
    pincode: member.pin,
    isNextAvailableStaff: member.isNextAvailableStaff,
    blockTime: []
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


export const statusConvertData = {
  ASSIGNED: 'unconfirm',
  CONFIRMED: 'confirm',
  CHECKED_IN: 'checkin',
  PAID: 'paid',
  WAITING: 'waiting',
  CANCEL: 'cancel',
};

const statusAdapter = status => statusConvertData[status]


export function* getMembers() {
  if (navigator.onLine) {
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
        const members = response.status === 200 ? response.data.data.map(member => memberAdapter(member)).filter(mem => mem.isDisabled === 0) : '';
        localStorage.setItem('staffList', JSON.stringify(members));
        yield put(membersLoaded(members));
        yield put(setDisplayedMembers(members.slice(0, 6)));
        yield put(loadAppointmentByMembers());
      }
    } catch (err) {
      yield put(memberLoadingError(err));
    }
  } else {
    const members = JSON.parse(localStorage.getItem('staffList'));
    yield put(membersLoaded(members));
    yield put(setDisplayedMembers(members.slice(0, 6)));
    yield put(loadAppointmentByMembers());
  }
}

function* checkResponse(response) {
  alert(response.data.message);
  yield put(loadMembers());
  yield put(loadWaitingAppointments());
  yield put(loadAppointmentByMembers());
  return;
}

export function* getAppointmentOffline_Saga(acion){
  alert(action.data)
}
export function* getWaitingListOffline_Saga(action){
  alert(action.data)
}

export function* getStaffOffline_Saga(action){
  alert(action.data)
}

export function* getWaitingAppointments() {
  if (navigator.onLine) {
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
      localStorage.setItem('AppointmentWaiting', JSON.stringify(appointments));

      if (response) {
        yield put(loadingWaiting(false))
      }

      yield put(waitingAppointmentsLoaded(appointments));
    } catch (err) {
      yield put(waitingAppointmentLoadingError(err));
    }
  } else {
    const appointments = JSON.parse(localStorage.getItem('AppointmentWaiting'));
    yield put(waitingAppointmentsLoaded(appointments));
  }
}

function addFullBlock(memberId, currentDate, day) {
  return {
    status: 'BLOCK',
    memberId: memberId,
    start: `${moment(currentDate).day(day).format('YYYY-MM-DD')}T06:00:00`,
    end: `${moment(currentDate).day(day).format('YYYY-MM-DD')}T23:00:00`,
    id: '',
    code: '',
    userFullName: '',
    phoneNumber: '',
    options: [],
    products: [],
    extras: [],
    notes: [],
  }
}

export function* getAppointmentsByMembersAndDate() {
  try {
    let appointments;
    const displayedMembers = yield select(makeSelectDisplayedMembers());
    const currentDate = yield select(makeCurrentDay());
    let apiDateQuery =
      currentDate.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');

    if (navigator.onLine) {
      yield put(loadingCalendar(true));
      yield put(getBlockTime());
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
          // alert(err)
        });
      appointments =
        response &&
        response.status === 200 &&
        response.data.data.map(appointment => appointmentAdapter(appointment));
      if (apiDateQuery === moment().format('YYYY-MM-DD')) {
        localStorage.setItem('AppointmentCalendar', JSON.stringify(appointments));
      }
      yield put(loadingCalendar(false));
    } else {
      appointments = JSON.parse(localStorage.getItem('AppointmentCalendar'));
    }
    const appointmentsMembers = displayedMembers.map(member => ({
      memberId: member.id,
      appointments: appointments.filter(
        appointment => appointment.memberId === member.id
          && appointment.status !== 'CANCEL'
          && appointment.status !== 'WAITING'
          && appointment.status !== 'PENDING'
          && appointment.status !== undefined
        // && appointment.user_id !== 0  
        ,
      )
    }));

    appointmentsMembers.forEach(mem => {
      const memFind = displayedMembers.find(member => member.id === mem.memberId);
      const blockTimeMember = memFind.blockTime.filter(b => moment(b.workingDate).format('YYYY-MM-DD') === apiDateQuery);
      for (let i = 0; i < blockTimeMember.length; i++) {
        mem.appointments.push({
          status: 'BLOCK_TEMP',
          memberId: mem.memberId,
          start: `${moment(currentDate).format('YYYY-MM-DD')}T${moment(blockTimeMember[i].blockTimeStart, ["h:mm A"]).format("HH:mm:ss")}`,
          end: `${moment(currentDate).format('YYYY-MM-DD')}T${moment(blockTimeMember[i].blockTimeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
          id: '',
          code: '',
          userFullName: '',
          phoneNumber: blockTimeMember[i].note,
          options: [],
          products: [],
          extras: [],
          notes: [],
        });
      }
    });

    switch (moment(currentDate).format('dddd')) {
      case 'Monday':
        appointmentsMembers.forEach(mem => {
          const memFind = displayedMembers.find(member => member.id === mem.memberId);
          if (memFind.workingTimes.Monday.isCheck === false) {
            mem.appointments.push(addFullBlock(mem.memberId, currentDate, 'Monday'))
          }
          else
            mem.appointments.push({
              status: 'BLOCK',
              memberId: mem.memberId,
              start: `${moment(currentDate).day('Monday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Monday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
              end: `${moment(currentDate).day('Monday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
              id: '',
              code: '',
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
                code: '',
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
          if (memFind.workingTimes.Tuesday.isCheck === false) {
            mem.appointments.push(addFullBlock(mem.memberId, currentDate, 'Tuesday'))
          }
          else
            mem.appointments.push({
              status: 'BLOCK',
              memberId: mem.memberId,
              start: `${moment(currentDate).day('Tuesday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Tuesday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
              end: `${moment(currentDate).day('Tuesday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
              id: '',
              code: '',
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
                code: '',
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
          if (memFind.workingTimes.Wednesday.isCheck === false) {
            mem.appointments.push(addFullBlock(mem.memberId, currentDate, 'Wednesday'))
          }
          else
            mem.appointments.push({
              status: 'BLOCK',
              memberId: mem.memberId,
              start: `${moment(currentDate).day('Wednesday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Wednesday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
              end: `${moment(currentDate).day('Wednesday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
              id: '',
              code: '',
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
                code: '',
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
          if (memFind.workingTimes.Thursday.isCheck === false) {
            mem.appointments.push(addFullBlock(mem.memberId, currentDate, 'Thursday'))
          }
          else
            mem.appointments.push({
              status: 'BLOCK',
              memberId: mem.memberId,
              start: `${moment(currentDate).day('Thursday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Thursday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
              end: `${moment(currentDate).day('Thursday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
              id: '',
              code: '',
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
                code: '',
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
          if (memFind.workingTimes.Friday.isCheck === false) {
            mem.appointments.push(addFullBlock(mem.memberId, currentDate, 'Friday'))
          }
          else
            mem.appointments.push({
              status: 'BLOCK',
              memberId: mem.memberId,
              start: `${moment(currentDate).day('Friday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Friday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
              end: `${moment(currentDate).day('Friday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
              id: '',
              code: '',
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
                code: '',
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
          if (memFind.workingTimes.Saturday.isCheck === false) {
            mem.appointments.push(addFullBlock(mem.memberId, currentDate, 'Saturday'))
          }
          else
            mem.appointments.push({
              status: 'BLOCK',
              memberId: mem.memberId,
              start: `${moment(currentDate).day('Saturday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Saturday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
              end: `${moment(currentDate).day('Saturday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
              id: '',
              code: '',
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
                code: '',
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
          if (memFind.workingTimes.Sunday.isCheck === false) {
            mem.appointments.push(addFullBlock(mem.memberId, currentDate, 'Sunday'))
          }
          else
            mem.appointments.push({
              status: 'BLOCK',
              memberId: mem.memberId,
              start: `${moment(currentDate).day(0).format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Sunday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
              end: `${moment(currentDate).day(0).endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
              id: '',
              code: '',
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
                code: '',
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

    yield put(appointmentByMembersLoaded(appointmentsMembers));
    yield put(loadedAllAppointments(appointments));
    if (navigator.onLine) {
        addEventsToCalendar(currentDate, appointmentsMembers);
    } else {
      setTimeout(() => {
        addEventsToCalendar(currentDate, appointmentsMembers);
      }, 1000);
    }
  } catch (err) {
    yield put(appointmentByMemberLoadingError(err));
  }
}

export function* getAppointmentAfterSlide() {
  try {
    const displayedMembers = yield select(makeSelectDisplayedMembers());
    const appointments = yield select(makeSelectAllAppointments());
    const currentDate = yield select(makeCurrentDay());
    let apiDateQuery =
      currentDate.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');
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

    appointmentsMembers.forEach(mem => {
      const memFind = displayedMembers.find(member => member.id === mem.memberId);
      const blockTimeMember = memFind.blockTime.filter(b => moment(b.workingDate).format('YYYY-MM-DD') === apiDateQuery);
      for (let i = 0; i < blockTimeMember.length; i++) {
        mem.appointments.push({
          status: 'BLOCK_TEMP',
          memberId: mem.memberId,
          start: `${moment(currentDate).format('YYYY-MM-DD')}T${moment(blockTimeMember[i].blockTimeStart, ["h:mm A"]).format("HH:mm:ss")}`,
          end: `${moment(currentDate).format('YYYY-MM-DD')}T${moment(blockTimeMember[i].blockTimeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
          id: '',
          code: '',
          userFullName: '',
          phoneNumber: blockTimeMember[i].note,
          options: [],
          products: [],
          extras: [],
          notes: [],
        });
      }
    });

    switch (moment(currentDate).format('dddd')) {
      case 'Monday':
        appointmentsMembers.forEach(mem => {
          const memFind = displayedMembers.find(member => member.id === mem.memberId);
          if (memFind.workingTimes.Monday.isCheck === false) {
            mem.appointments.push(addFullBlock(mem.memberId, currentDate, 'Monday'))
          }
          else
            mem.appointments.push({
              status: 'BLOCK',
              memberId: mem.memberId,
              start: `${moment(currentDate).day('Monday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Monday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
              end: `${moment(currentDate).day('Monday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
              id: '',
              code: '',
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
                code: '',
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
          if (memFind.workingTimes.Tuesday.isCheck === false) {
            mem.appointments.push(addFullBlock(mem.memberId, currentDate, 'Tuesday'))
          }
          else
            mem.appointments.push({
              status: 'BLOCK',
              memberId: mem.memberId,
              start: `${moment(currentDate).day('Tuesday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Tuesday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
              end: `${moment(currentDate).day('Tuesday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
              id: '',
              code: '',
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
                code: '',
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
          if (memFind.workingTimes.Wednesday.isCheck === false) {
            mem.appointments.push(addFullBlock(mem.memberId, currentDate, 'Wednesday'))
          }
          else
            mem.appointments.push({
              status: 'BLOCK',
              memberId: mem.memberId,
              start: `${moment(currentDate).day('Wednesday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Wednesday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
              end: `${moment(currentDate).day('Wednesday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
              id: '',
              code: '',
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
                code: '',
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
          if (memFind.workingTimes.Thursday.isCheck === false) {
            mem.appointments.push(addFullBlock(mem.memberId, currentDate, 'Thursday'))
          }
          else
            mem.appointments.push({
              status: 'BLOCK',
              memberId: mem.memberId,
              start: `${moment(currentDate).day('Thursday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Thursday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
              end: `${moment(currentDate).day('Thursday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
              id: '',
              code: '',
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
                code: '',
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
          if (memFind.workingTimes.Friday.isCheck === false) {
            mem.appointments.push(addFullBlock(mem.memberId, currentDate, 'Friday'))
          }
          else
            mem.appointments.push({
              status: 'BLOCK',
              memberId: mem.memberId,
              start: `${moment(currentDate).day('Friday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Friday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
              end: `${moment(currentDate).day('Friday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
              id: '',
              code: '',
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
                code: '',
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
          if (memFind.workingTimes.Saturday.isCheck === false) {
            mem.appointments.push(addFullBlock(mem.memberId, currentDate, 'Saturday'))
          }
          else
            mem.appointments.push({
              status: 'BLOCK',
              memberId: mem.memberId,
              start: `${moment(currentDate).day('Saturday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Saturday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
              end: `${moment(currentDate).day('Saturday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
              id: '',
              code: '',
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
                code: '',
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
          if (memFind.workingTimes.Sunday.isCheck === false) {
            mem.appointments.push(addFullBlock(mem.memberId, currentDate, 'Sunday'))
          }
          else
            mem.appointments.push({
              status: 'BLOCK',
              memberId: mem.memberId,
              start: `${moment(currentDate).day(0).format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Sunday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
              end: `${moment(currentDate).day(0).endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
              id: '',
              code: '',
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
                code: '',
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
    yield put(appointmentByMembersLoaded(appointmentsMembers));
    addEventsToCalendar(currentDate, appointmentsMembers);

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

  if (appointment.status !== "CHECKED_IN") {
    appointment.status = "ASSIGNED";
  }
  if (appointment.status === 'CHECKED_IN') {
    let test = moment(appointment.start).diff(moment(movedAppointment.start), 'minutes');
    if ((test < 45 && test >= 0) || (test < 0 && test > -45)) {
      appointment.status = "CHECKED_IN";
    } else {
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

  try {
    const requestURL = new URL(PUT_STATUS_APPOINTMENT_API);
    const kq = yield axios.put(`${requestURL.toString()}/${appointment.id}`, data, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", }
    }).then((result) => {
      return result
    });
    if (kq.status === 200 && kq.data.codeStatus !== 1) {
      return yield* checkResponse(kq);
    }

    if (kq.status === 200) {
      yield put(appointmentMoved(appointment));
      yield put(updateAppointmentFrontend({ appointment: data, id: appointment.id }));
    } else {
      yield put(appointmentMovingError(result));
    }
  } catch (err) {
    yield put(updateAppointmentFrontend({ appointment: data, id: appointment.id }));
    yield put(renderAppointment());
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

    try {
      const kq = yield axios.put(`${requestURL.toString()}/${appointment.id}`, data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", }
      }).then((result) => {
        return result
      });
      if (kq.status === 200 && kq.data.codeStatus !== 1) {
        return yield* checkResponse(kq);
      }

      if (kq.status === 200) {
      } else {
        yield put(appointmentPuttingBackError(result));
      }
    } catch (err) {

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
    if(navigator.onLine === false)
    yield put(renderAppointment());

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
      
    });

    if (kq.status === 200 && kq.data.codeStatus !== 1) {
      return yield* checkResponse(kq);
    }

    if (kq.status === 200) {
      // yield put(loadMembers());
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
    let { appointment, status, old_duration,
      servicesUpdate, productsUpdate, notes, old_status,
      old_appointment, extrasUpdate
    } = action.appointment;

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
      // yield put(appointmentUpdatedStatus({ appointmentID: appointment.id, status, BookingServices2: servicesUpdate, newDate, productsUpdate, notes }));
      // const displayedMember_app = yield select(makeSelectCalendarAppointments());
      // const currentDate = yield select(makeCurrentDay());
      // addEventsToCalendar(currentDate, displayedMember_app);
    }

    if (status === 'cancel') {
      yield put(deleteAppointmentCalendar(appointment));
      yield put(renderAppointment());
      const url_update_status = new URL(PUT_UPDATE_STATUS_APPOINTMENT);
      const kq = yield axios.put(`${url_update_status.toString()}/${appointment.id}`, {
        status: status
      }, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", }
        }).then((result) => {
          return result
        }).catch((err) => {
          // const data_offline = JSON.parse(localStorage.getItem('updateAppointment')) ? JSON.parse(localStorage.getItem('updateAppointment')) : [];
          // data_offline.push(data);
          // localStorage.setItem('updateAppointment', JSON.stringify(data_offline));
          // return { error: err }
        });
      if (kq.status === 200 && kq.data.codeStatus !== 1) {
        return yield* checkResponse(kq);
      }

      if (kq.status === 200) {
        yield put(updateAppointmentSuccess(result.data.data))
        return;
      } else {
        yield put(updateAppointmentError(error));
        return;
      }
    }

    let notesUpdate = []
    notes.forEach(note => {
      notesUpdate.push({
        note: note.note
      })
    });

    let data;

    if (old_status === 'ASSIGNED') {
      data = {
        staffId: memberId,
        fromTime: old_appointment.start,
        toTime: old_appointment.end,
        status,
        services: old_appointment.options,
        products: old_appointment.products,
        extras: old_appointment.extras,
        notes: notesUpdate
      }
    } else {
      data = {
        staffId: memberId,
        fromTime: start,
        toTime: newDate,
        status,
        services: servicesUpdate,
        products: productsUpdate,
        extras: extrasUpdate,
        notes: notesUpdate
      }
    }

    yield put(updateAppointmentFrontend({ appointment: data, id: appointment.id }));
    yield put(renderAppointment());

    const requestURL = new URL(PUT_STATUS_APPOINTMENT_API);
    const kq = yield axios.put(`${requestURL.toString()}/${appointment.id}`, data, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", }
    }).then((result) => {
      return result
    }).catch((err) => {
      // const data_offline = JSON.parse(localStorage.getItem('updateAppointment')) ? JSON.parse(localStorage.getItem('updateAppointment')) : [];
      // data_offline.push(data);
      // localStorage.setItem('updateAppointment', JSON.stringify(data_offline));
      // return { error: err }
    });
    if (kq.status === 200 && kq.data.codeStatus !== 1) {
      return yield* checkResponse(kq);
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
    const fcEvent = yield select(makeSelectFCEvent());
    if (!fcEvent) {
      yield put(appointmentUpdatingStatusError('Cannot find selected fcEvent'));
    }

    let { appointment, dayPicker, fromTime, notes, selectedStaff, servicesUpdate, productsUpdate, extrasUpdate } = action.appointment;
    let { memberId, options, products, extras, id, start } = appointment;

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
    if (window.confirm('Are you sure want to change ?')) {
      yield* changeTime(appointment, fcEvent, start_time, end_time, memberId, servicesUpdate, productsUpdate, extrasUpdate, notes, start, selectedStaff);
    }
  }
  catch (error) {
    yield put(updateAppointmentError(error))
  }

  function* changeTime(appointmentEdit, fcEvent, start_time, end_time, memberId, options, products, extras, notes, start, selectedStaff) {
    yield put(appointmentCanceled(appointmentEdit.id));
    deleteEventFromCalendar(fcEvent._id);
    yield put(deselectAppointment());
    let appointment = {
      ...appointmentEdit,
      memberId: selectedStaff.id
    }

    let notesUpdate = []

    notes.forEach(note => {
      notesUpdate.push({
        note: note.note
      })
    });
    let statusChange = 'confirm'
    let test = moment(start_time).diff(moment(start), 'minutes');
    if ((test < 45 && test >= 0) || (test < 0 && test > -45)) {
      statusChange = 'checkin'
    }

    let data = {
      staffId: selectedStaff.id,
      fromTime: start_time,
      toTime: end_time,
      status: appointment.status === 'CHECKED_IN' ? statusChange : 'unconfirm',
      services: options,
      products: products,
      extras,
      notes: notesUpdate
    };
    try {
      const requestURL = new URL(PUT_STATUS_APPOINTMENT_API);
      const kq = yield axios.put(`${requestURL.toString()}/${appointment.id}`, data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", }
      }).then((result) => {
        return result;
      })

      if (kq.status === 200 && kq.data.codeStatus !== 1) {
        return yield* checkResponse(kq);
      }

      if (kq.status === 200) {
        yield put(updateAppointmentSuccess(result));
      }
      else {
        yield put(updateAppointmentError(error));
      }
    } catch (err) {
      yield put(updateAppointmentFrontend({ appointment: data, id: appointment.id }));
      yield put(renderAppointment());
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

    if (navigator.onLine === false) {
      window.postMessage(JSON.stringify({
        first_name, last_name, phone, staffID, time, refPhone, note, email,
        action: 'signinAppointmentOffLine'
      }));
      return;
    }
    
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

    if (navigator.onLine) {
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
    } else {
      yield put(checkPhoneNumberCustomerSuccess(true));
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

    if (kq.status === 200 && kq.data.codeStatus !== 1) {
      return yield* checkResponse(kq);
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

function* checkPinCode_Saga() {
  yield takeLatest(CHECKPINCODE, function* (action) {
    const { pincode } = action;
    const url = `${GET_CHECKPINCODE}/${pincode}`;
    const kq = yield axios.put(url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((result) => {
      return result;
    }).catch((err) => {

    });

    if (kq.status === 200 && kq.data.codeStatus !== 1) {
      alert(kq.data.message);
    }

    if (kq.status === 200 && kq.data.codeStatus === 1) {
      yield put(loadMembers());
      yield put(loadWaitingAppointments());
      yield put(loadAppointmentByMembers());
    }
  });
}

function* updateNextStaff_Saga() {
  yield takeLatest(UPDATE_NEXT_STAFF, function* () {
    try {
      const requestURL = new URL(`${GET_MEMBERS_API}/${merchantId}`);
      const response = yield axios.get(requestURL.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }).then((result) => {
        return result;
      }).catch((err) => {

      });

      if (response.status === 200 && response.data.codeStatus === 1) {
        const members = response.status === 200 ? response.data.data.map(member => memberAdapter(member)).filter(mem => mem.isDisabled === 0) : '';
        yield put(updateNextStaffSuccess(members));
      }
    } catch (err) {

      // yield put(memberLoadingError(err));
    }
  });
}

export function* SubmitEditBlockTime_Saga(action) {
  try {
    const { data } = action;
    const { staff, start, end, note } = data;
    const currentDate = yield select(makeCurrentDay());
    let apiDateQuery =
      currentDate.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');
    const requestURL = new URL(`${POST_ADD_BLOCK_TIME}`);
    const dataSubmit = {
      staffId: staff.id,
      workingDate: apiDateQuery,
      blockTimeStart: start,
      blockTimeEnd: end,
      note: note
    }
    const response = yield axios.post(requestURL.toString(), dataSubmit, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((result) => {
      console.log(result)
      return result;
    }).catch((err) => {
      console.log(err)
    });

    if (response.status === 200 && response.data.codeStatus === 1) {
      yield put(loadMembers());
    }
  } catch (error) {

  }
}

export function* deleteBlockTime_Saga(action) {
  try {
    const { block, staff } = action.data;
    const requestURL = new URL(`${DELETE_BLOCKTIME_API}/${block.blockTimeId}`);
    const response = yield axios.delete(requestURL.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((result) => {
      return result;
    }).catch((err) => {
      console.log(err)
    });

    if (response.status === 200 && response.data.codeStatus === 1) {
      yield put(loadMembers());
      yield put(deleteBlockTimeSuccess({ staff, block }))
    }

  } catch (error) {

  }
} 

export function* getBlockTimeSaga() {
  try {
    const currentDate = yield select(makeCurrentDay());
    let apiDateQuery =
      currentDate.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');
    const requestURL = new URL(`${GET_WORKINGTIME_MERCHANT}${apiDateQuery}`);
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
      yield put(getBlockTime_Success(response.data.data)); // lấy ra danh sách blocktime của staff
      yield put(renderAppointment());
    }

  } catch (error) {

  }
}





/* **************************** Subroutines ******************************** */

export function* selectDayAndWeek(action) {
  yield put(selectDay(action.day));
  yield put(selectWeek(action.day));
  setTimeout(() => {
    const x = document.getElementsByClassName("fc-now-indicator fc-now-indicator-arrow");
    for (let i = 0; i < x.length; i++) {
      x[i].scrollIntoView();
    }
  }, 300);

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

export function* EditBlockTime() {
  yield takeLatest(SUBMIT_EDIT_BLOCKTIME, SubmitEditBlockTime_Saga);
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

export function* renderAppointmentSaga() {
  yield takeLatest(RENDER_APPOINTMEMT, getAppointmentAfterSlide);
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
export function* delete_BlockTime() {
  yield takeLatest(DELETE_BLOCKTIME, deleteBlockTime_Saga)
}
export function* getBlockTime_() {
  yield takeLatest(GET_BLOCKTIME, getBlockTimeSaga)
}
export function* getAppointmentOffline_() {
  yield takeLatest(GET_APPOINTMENT_OFFLINE, getAppointmentOffline_Saga)
}
export function* getWaitingListOffline_() {
  yield takeLatest(GET_WAITINGLIST_OFFLINE, getWaitingListOffline_Saga)
}
export function* getStaffOffline_() {
  yield takeLatest(GET_STAFF_OFFLINE, getStaffOffline_Saga)
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* root() {
  yield all([
    fork(selectDayOnCalendar),
    fork(membersData),
    fork(waitingAppointmentsData),
    fork(renderAppointmentSaga),
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
    fork(getAppointmentAgain),
    fork(checkPinCode_Saga),
    fork(updateNextStaff_Saga),
    fork(EditBlockTime),
    fork(delete_BlockTime),
    fork(getBlockTime_),
    fork(getAppointmentOffline_),
    fork(getWaitingListOffline_),

  ]);
}





