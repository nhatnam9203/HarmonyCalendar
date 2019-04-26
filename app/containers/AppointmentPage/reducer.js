/*
 * AppointmentReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */
import moment from 'moment';
import { fromJS } from 'immutable';


import {
  SELECT_DAY,
  SELECT_WEEK,
  LOAD_MEMBERS,
  LOAD_MEMBERS_ERROR,
  LOAD_MEMBERS_SUCCESS,
  LOAD_APPOINTMENTS_BY_MEMBERS,
  LOAD_APPOINTMENTS_BY_MEMBERS_SUCCESS,
  LOAD_APPOINTMENTS_BY_MEMBERS_ERROR,
  SET_DISPLAYED_MEMBERS,
  LOAD_WAITING_APPOINTMENT,
  LOAD_WAITING_APPOINTMENT_SUCCESS,
  LOAD_WAITING_APPOINTMENT_ERROR,
  ASSIGN_APPOINTMENT_SUCCESS,
  MOVE_APPOINTMENT_SUCCESS,
  PUT_BACK_APPOINTMENT_SUCCESS,
  SELECT_APPOINTMENT,
  DESELECT_APPOINTMENT,
  OPEN_ADDING_APPOINTMENT,
  CLOSE_ADDING_APPOINTMENT,
  CANCEL_APPOINTMENT_SUCCESS,
  UPDATE_STATUS_APPOINTMENT_SUCCESS,
  UPDATE_WAITING_APPOINTMENT,
  CHECK_PHONE_ADD_CUSTOMER_SUCCESS,
  CHECK_PHONE_ADD_CUSTOMER_ERROR,
  ADD_CUSTOMER_SUCCESS,
  DISABLE_CALENDAR,
  UPDATE_APPOINTMENT_FRONTEND,
  LOADING_WAITING,
  LOADING_CALENDAR,
  TIME_STAFFID,
  ADD_APPOINTMENT_TO_CALENDAR,
} from './constants';


const initialCurrentDay = moment();
const firstDayOfWeek = initialCurrentDay.clone().startOf('isoWeek');
const initialWeekDays = [
  firstDayOfWeek,
  firstDayOfWeek.clone().add(1, 'd'),
  firstDayOfWeek.clone().add(2, 'd'),
  firstDayOfWeek.clone().add(3, 'd'),
  firstDayOfWeek.clone().add(4, 'd'),
  firstDayOfWeek.clone().add(5, 'd'),
  firstDayOfWeek.clone().add(6, 'd'),
];

// The initial state of the App
export const initialState = fromJS({
  loading: false,
  error: false,
  currentDay: initialCurrentDay,
  currentWeekDays: initialWeekDays,

  selectedAppointment: null,
  addingAppointment: null,
  selectedFCEvent: null,

  members: {
    all: [],
    displayed: [],
  },
  appointments: {
    calendar: [],
    waiting: [],
  },
  checkPhoneNumber_success: false,
  checkPhoneNumber_error: false,
  addCustomer_success: false,
  addCustomer_error: false,
  disable_Calendar: false,
  isLoadingWaiting: false,
  isLoadingCalendar: false,
  time_staffId: ''
});

function appointmentReducer(state = initialState, action) {
  let startOfWeek;
  switch (action.type) {
    case SELECT_DAY:
      return state.set('currentDay', moment(action.day, 'DDMMYYYY'));
    case SELECT_WEEK:
      startOfWeek = moment(action.dayOfWeek, 'DDMMYYYY').startOf('isoWeek');
      return state.set(
        'currentWeekDays',
        fromJS([
          startOfWeek,
          startOfWeek.clone().add(1, 'd'),
          startOfWeek.clone().add(2, 'd'),
          startOfWeek.clone().add(3, 'd'),
          startOfWeek.clone().add(4, 'd'),
          startOfWeek.clone().add(5, 'd'),
          startOfWeek.clone().add(6, 'd'),
        ]),
      );
    case SELECT_APPOINTMENT:
      return state
        .set('selectedAppointment', action.appointment)
        .set('selectedFCEvent', {
          ...action.fcEvent,
        });
    case DESELECT_APPOINTMENT:
      return state
        .set('selectedAppointment', null)
        .set('selectedFCEvent', null);
    case OPEN_ADDING_APPOINTMENT:
      return state.set('addingAppointment', action.appointment);
    case CLOSE_ADDING_APPOINTMENT:
      return state.set('addingAppointment', null);

    case LOAD_MEMBERS:
      return state
        .set('loading', true)
        .set('error', false)
        .setIn(['members', 'all'], []);
    case LOAD_MEMBERS_SUCCESS:
      return state
        .setIn(['members', 'all'], action.members)
        .set('loading', false);
    case LOAD_MEMBERS_ERROR:
      return state.set('error', action.error).set('loading', false);
    case SET_DISPLAYED_MEMBERS:
      return state.setIn(['members', 'displayed'], action.members);

    case LOAD_WAITING_APPOINTMENT:
      return state.setIn(['appointments', 'waiting'], []);
    case LOAD_WAITING_APPOINTMENT_SUCCESS:
      return state.setIn(['appointments', 'waiting'], action.appointments);
    case LOAD_WAITING_APPOINTMENT_ERROR:
      return state.set('error', action.error);

    case LOAD_APPOINTMENTS_BY_MEMBERS:
      return state.setIn(['appointments', 'calendar'], []);
    case LOAD_APPOINTMENTS_BY_MEMBERS_SUCCESS:
      return state.setIn(['appointments', 'calendar'], action.appointments);
    case LOAD_APPOINTMENTS_BY_MEMBERS_ERROR:
      return state.set('error', action.error);

    case ASSIGN_APPOINTMENT_SUCCESS:
      return state
        .updateIn(['appointments', 'calendar'], arr => {
          const assignedMember = arr.find(
            member => member.memberId === action.appointment.memberId,
          );
          if (assignedMember) {
            assignedMember.appointments.push(action.appointment);
          }

          return [...arr];
        })
        .updateIn(['appointments', 'waiting'], arr => {
          const movedAppointmentIndex = arr.findIndex(
            appointment => appointment.id === action.appointment.id,
          );
          if (movedAppointmentIndex < 0) return [...arr];
          arr.splice(movedAppointmentIndex, 1);
          return [...arr];
        });


    case MOVE_APPOINTMENT_SUCCESS:
      return state.updateIn(['appointments', 'calendar'], arr => {
        const oldPosition = arr.find(member =>
          member.appointments.find(
            appointment => appointment.id === action.appointment.id,
          ),
        );
        if (!oldPosition) return [...arr];

        const movedAppointmentIndex = oldPosition.appointments.findIndex(
          appointment => appointment.id === action.appointment.id,
        );
        if (movedAppointmentIndex < 0) return [...arr];

        oldPosition.appointments.splice(movedAppointmentIndex, 1);

        const newPositionIndex = arr.findIndex(
          member => member.memberId === action.appointment.memberId,
        );
        if (movedAppointmentIndex < 0) return [...arr];

        arr[newPositionIndex].appointments.push(action.appointment);

        return [...arr];
      });

    case PUT_BACK_APPOINTMENT_SUCCESS:
      return state
        .updateIn(['appointments', 'calendar'], arr => {
          const oldPosition = arr.find(member =>
            member.appointments.find(
              appointment => appointment.id === action.appointment.id,
            ),
          );
          if (!oldPosition) return [...arr];

          const movedAppointmentIndex = oldPosition.appointments.findIndex(
            appointment => appointment.id === action.appointment.id,
          );
          if (movedAppointmentIndex < 0) return [...arr];

          oldPosition.appointments.splice(movedAppointmentIndex, 1);

          return [...arr];
        })
        .updateIn(['appointments', 'waiting'], arr => [
          {
            ...action.appointment,
            status: 'WAITING',
            memberId: null,
            start: null,
          },
          ...arr,
        ]);

    case CANCEL_APPOINTMENT_SUCCESS:
      return state.updateIn(['appointments', 'calendar'], arr => {
        const oldPosition = arr.find(member =>
          member.appointments.find(
            appointment => appointment.id === action.appointmentId,
          ),
        );
        if (!oldPosition) return [...arr];

        const movedAppointmentIndex = oldPosition.appointments.findIndex(
          appointment => appointment.id === action.appointmentId,
        );
        if (movedAppointmentIndex < 0) return [...arr];

        oldPosition.appointments.splice(movedAppointmentIndex, 1);

        return [...arr];
      });

    case UPDATE_STATUS_APPOINTMENT_SUCCESS:

      const { appointmentID, status, BookingServices2, newDate } = action.appointment;

      return state.updateIn(['appointments', 'calendar'], arr => {
        const member = arr.find(mem =>
          mem.appointments.find(app => parseInt(app.id) === parseInt(appointmentID)),
        );
        if (!member) return [...arr];
        const appointmentIndex = member.appointments.findIndex(
          app => parseInt(app.id) === parseInt(appointmentID),
        );
        if (appointmentIndex < 0) return [...arr];
        member.appointments[appointmentIndex].end = newDate.substr(0, 19);

        if (status === 'checkin') {
          member.appointments[appointmentIndex].status = 'CHECKED_IN';
        }
        if (status === 'confirm') {
          member.appointments[appointmentIndex].status = 'CONFIRMED';
        }
        if (status === 'unconfirm') {
          member.appointments[appointmentIndex].status = 'UNCONFIRMED';
        }
        if (status === 'paid') {
          member.appointments[appointmentIndex].status = 'PAID';
        }
        return [...arr];
      });

    case ADD_APPOINTMENT_TO_CALENDAR:
      var indexArr;
      return state.updateIn(['appointments', 'calendar'], arr => {
        for (let i = 0; i < arr.length; i++) {
          if (parseInt(arr[i].memberId) === parseInt(action.appointment.memberId)) {
            indexArr = i;
          }
        }
        action.appointment.appointment.end = action.appointment.newDate;
        arr[indexArr].appointments.push(action.appointment.appointment);

        return [...arr];
      });


    case UPDATE_WAITING_APPOINTMENT:

      return state.updateIn(['appointments', 'waiting'], arr => {

        return [...arr];
      });

    case CHECK_PHONE_ADD_CUSTOMER_SUCCESS:
      return state.set('checkPhoneNumber_success', action.phone);

    case CHECK_PHONE_ADD_CUSTOMER_ERROR:
      return state.set('checkPhoneNumber_error', action.error);

    case ADD_CUSTOMER_SUCCESS:
      return state.set('addCustomer_success', action.customer);

    case DISABLE_CALENDAR:
      return state.set('disable_Calendar', action.status);

    case LOADING_WAITING:
      return state.set('isLoadingWaiting', action.status);
    case LOADING_CALENDAR:
      return state.set('isLoadingCalendar', action.status);

    case TIME_STAFFID:
      return state.set('time_staffId', action.data)
    default:
      return state;
  }
}


export default appointmentReducer;
