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
  LOADING_WAITING,
  LOADING_CALENDAR,
  TIME_STAFFID,
  ADD_APPOINTMENT_TO_CALENDAR,
  REMOVE_APPOINTMENT_WAITING,
  DELETE_WAITING_APPPOINTMENT,
  CHANGE_APPOINTMENT_TIME_SUCCESS,
  ADD_APPOINTMENT_TO_WAITING,
  ADD_APPOINTMENT_RELOAD_CALENDAR,
  ADD_APPOINTMENT_REALTIME,
  INFO_CHECK_PHONE,
  UPDATE_APPOINTMENT_PAID,
  DELETE_APPOINTMENT_CALENDAR,
  UPDATE_STAFF,
  OPEN_PINCODE,
  UPDATE_NEXT_STAFF_SUCCESS,
  UPDATE_USER
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
  info_after_check_phone: '',
  members: {
    all: [],
    displayed: [],
  },
  appointments: {
    calendar: [],
    waiting: [],
    allAppoointment: [],
  },
  checkPhoneNumber_success: false,
  checkPhoneNumber_error: false,
  addCustomer_success: false,
  addCustomer_error: false,
  disable_Calendar: false,
  isLoadingWaiting: false,
  isLoadingCalendar: false,
  time_staffId: '',
  StatusDeleteWaiting: false,
  PopupPincode: false,
  PinStaff: '',
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
      let resourceId = 0;
      for (let index = 0; index < action.members.length; index++) {
        action.members[index].resourceId = resourceId;
        resourceId = resourceId + 1;
        if (resourceId === 6) {
          resourceId = 0;
        }
      }
      return state.setIn(['members', 'displayed'], action.members);

    case LOAD_WAITING_APPOINTMENT:
      return state.setIn(['appointments', 'waiting'], []);

    case LOAD_WAITING_APPOINTMENT_SUCCESS:
      const waitingApointments = action.appointments.sort(function (a, b) {
        var c = new Date(a.id);
        var d = new Date(b.id);
        return d - c;
      });
      return state.setIn(['appointments', 'waiting'], waitingApointments);

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
      const { appointmentID, status, newDate, notes } = action.appointment;
      return state.updateIn(['appointments', 'calendar'], arr => {
        const member = arr.find(mem =>
          mem.appointments.find(
            app => parseInt(app.id) === parseInt(appointmentID),
          ),
        );
        if (!member) return [...arr];
        const appointmentIndex = member.appointments.findIndex(
          app => parseInt(app.id) === parseInt(appointmentID),
        );
        if (appointmentIndex < 0) return [...arr];
        member.appointments[appointmentIndex].end = newDate.substr(0, 19);
        member.appointments[appointmentIndex].notes = [
          ...notes,
          ...member.appointments[appointmentIndex].notes,
        ];
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

    case CHANGE_APPOINTMENT_TIME_SUCCESS:
      return state.updateIn(['appointments', 'calendar'], arr => {
        const member = arr.find(
          mem =>
            parseInt(mem.memberId) === parseInt(action.appointment.memberId),
        );
        if (!member) return;
        const status_app = action.appointment.status;
        if (status_app === 'ASSIGNED') {
          action.appointment.status = 'ASSIGNED';
        }
        if (status_app === 'CONFIRMED') {
          action.appointment.status = 'ASSIGNED';
        }
        if (status_app === 'UNCONFIRM') {
          action.appointment.status = 'ASSIGNED';
        }
        if (status_app === 'CHECKED_IN') {
          action.appointment.status = 'CHECKED_IN';
        }
        member.appointments.push(action.appointment);

        return [...arr];
      });

    case ADD_APPOINTMENT_TO_CALENDAR:
      var indexArr;
      return state.updateIn(['appointments', 'calendar'], arr => {
        for (let i = 0; i < arr.length; i++) {
          if (
            parseInt(arr[i].memberId) === parseInt(action.appointment.memberId)
          ) {
            indexArr = i;
          }
        }
        action.appointment.appointment.end = action.appointment.new_end_time;
        arr[indexArr].appointments.push(action.appointment.appointment);

        return [...arr];
      });

    case UPDATE_WAITING_APPOINTMENT:
      return state.updateIn(['appointments', 'waiting'], arr => { });
    case ADD_APPOINTMENT_TO_WAITING:
      return state.updateIn(['appointments', 'waiting'], arr => {
        const pos_to_find = arr.findIndex(
          appointment => appointment.id === action.data.id,
        );

        if (pos_to_find === -1) {
          arr = [action.data, ...arr];
        }
        return [...arr];
      });

    case ADD_APPOINTMENT_RELOAD_CALENDAR:
      var pos_add = '';
      return state.updateIn(['appointments', 'calendar'], arr => {
        for (let i = 0; i < arr.length; i++) {
          if (parseInt(arr[i].memberId) === parseInt(action.data.memberId)) {
            pos_add = i;
          }
        }
        arr[pos_add].appointments.push(action.data);
        return [...arr];
      });

    case ADD_APPOINTMENT_REALTIME:
      var pos_add_r = '';
      return state.updateIn(['appointments', 'calendar'], arr => {
        if (
          action.data.status === 'ASSIGNED' ||
          action.data.status === 'CHECKED_IN'
        ) {
          for (let i = 0; i < arr.length; i++) {
            if (parseInt(arr[i].memberId) === parseInt(action.data.memberId)) {
              pos_add_r = i;
            }
          }
          if (pos_add_r !== '') {
            arr[pos_add_r].appointments.push(action.data);
          }
        }
        return [...arr];
      });

    case REMOVE_APPOINTMENT_WAITING:
      return state.updateIn(['appointments', 'waiting'], arr => {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === action.appointment.id) {
            arr.splice(i, 1);
          }
        }
        return [...arr];
      });

    case DELETE_APPOINTMENT_CALENDAR:
      return state.updateIn(['appointments', 'calendar'], arr => {
        const oldPosition = arr.find(member =>
          member.appointments.find(
            appointment => appointment.id === action.appointment.id,
          ),
        );
        if (!oldPosition) return [...arr];

        const appointmentIndex = oldPosition.appointments.findIndex(
          appointment => appointment.id === action.appointment.id,
        );
        if (appointmentIndex < 0) return [...arr];
        oldPosition.appointments.splice(appointmentIndex, 1);
        return [...arr];
      });

    case UPDATE_APPOINTMENT_PAID:
      return state.updateIn(['appointments', 'calendar'], arr => {
        const member = arr.find(mem =>
          mem.appointments.find(
            app => parseInt(app.id) === parseInt(action.appointment.id),
          ),
        );

        if (!member) {
          const memb = arr.find(
            mem =>
              parseInt(mem.memberId) === parseInt(action.appointment.memberId),
          );
          if (!memb) return [...arr];
          memb.appointments.push(action.appointment);
          return [...arr];
        }
        const appointmentIndex = member.appointments.findIndex(
          app => parseInt(app.id) === parseInt(action.appointment.id),
        );

        if (parseInt(member.memberId) !== action.appointment.memberId) {
          const newMember = arr.find(
            mem =>
              parseInt(mem.memberId) === parseInt(action.appointment.memberId),
          );
          if (!newMember) return [...arr];
          newMember.appointments.push(action.appointment);
          member.appointments.splice(appointmentIndex, 1);
        } else if (action.appointment.status === 'CANCEL') {
          member.appointments.splice(appointmentIndex, 1);
        } else if (action.appointment.status === 'WAITING') {
          member.appointments.splice(appointmentIndex, 1);
        } else {
          member.appointments[appointmentIndex] = action.appointment;
        }
        return [...arr];
      });

    case INFO_CHECK_PHONE:
      return state.set('info_after_check_phone', action.data);

    case DELETE_WAITING_APPPOINTMENT:
      return state.set('StatusDeleteWaiting', action.status);

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
      return state.set('time_staffId', action.data);

    case OPEN_PINCODE:
      return state.set('PopupPincode', action.data).set('PinStaff', action.pincode)

    case UPDATE_STAFF:
      return state
        .setIn(['members', 'all'], arr => {
          // const member = arr.find(mem => mem.id === action.staff.id);
          // if (!member) return [...arr];
          // // console.log(member);
          // // member = action.staff;
          return [...arr];
        })
    // .setIn(['members', 'displayed'], arr => {
    //   const member = arr.find(mem => mem.id === action.staff.id);
    //   if (!member) return [...arr];
    //   member = action.staff;
    //   return [...arr];
    // });

    case UPDATE_NEXT_STAFF_SUCCESS:

      return state.setIn(['members', 'all'], action.data);

    case UPDATE_USER:
      let userInfo = JSON.parse(action.data);
      return state.updateIn(['appointments', 'calendar'], arr => {
        arr.forEach(element => {
          element.appointments.forEach(app => {
            if (app.phoneNumber === userInfo.Phone) {
              app.phoneNumber = userInfo.Phone;
              app.userFullName = userInfo.FirstName + ' ' + userInfo.LastName;
            }
          });
        });
        return [...arr]
      }).updateIn(['appointments', 'waiting'], arr => {
        arr.forEach(app => {
          if (app.phoneNumber === userInfo.Phone){
            app.phoneNumber = userInfo.Phone;
            app.userFullName = userInfo.FirstName + ' ' + userInfo.LastName;
          }
        });
        return [...arr];
      });

    default:
      return state;
  }
}

export default appointmentReducer;
