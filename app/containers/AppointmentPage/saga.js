import { delay } from 'redux-saga';
import { fork, put, takeLatest, all, select } from 'redux-saga/effects';
import moment from 'moment';
import axios from 'axios';
import { differenceBy } from 'lodash';
import { api } from '../../utils/helper';
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
	GET_STAFF_OFFLINE,
	GET_APP_BY_ID,
	SELECT_APPOINTMENT,
	CHECKOUT,
	GET_TIME_STAFF_LOGIN
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
	GET_APPOINTMENT_STATUS,
	GET_CHECKPINCODE,
	PUT_UPDATE_STATUS_APPOINTMENT,
	POST_ADD_BLOCK_TIME,
	DELETE_BLOCKTIME_API,
	GET_WORKINGTIME_MERCHANT,
	GET_APPOINTMENT_ID,
	PUT_CHECKOUT,
	API_GET_TIME_STAFF_LOGIN
} from '../../../app-constants';

import {
	addBlockCalendar,
	checkTimeToAddAppointmdent,
	totalDuationChangeTime,
	totalDuartionUpdateAppointment,
	newDateUpdateAppointment,
	dataUpdateAppointment,
	totalDurationAssignAppointment,
	dataAssignAppointment,
	dataChangeTimeAppointment,
	dataPutBackAppointment
} from './utilSaga';

import { assignAppointment as mockedPostAppointment } from '../../assets/mocks/assignAppointment';
import {
	addEventsToCalendar,
	deleteEventFromCalendar,
	updateEventToCalendar
} from '../../components/Calendar/constants';

export const statusConvertKey = {
	unconfirm: 'ASSIGNED',
	confirm: 'CONFIRMED',
	checkin: 'CHECKED_IN',
	paid: 'PAID',
	waiting: 'WAITING',
	cancel: 'CANCEL',
	pending: 'PENDING'
};

export const appointmentAdapter = (appointment) => {
	return {
		id: appointment.appointmentId,
		code: `#${appointment.code}`,
		userFullName: appointment.firstName + ' ' + appointment.lastName,
		firstName: appointment.firstName,
		lastName: appointment.lastName,
		phoneNumber: appointment.phoneNumber,
		options: appointment.services.sort(function(a, b) {
			var c = a.bookingServiceId;
			var d = b.bookingServiceId;
			return d - c;
		}),
		products: appointment.products.sort(function(a, b) {
			var c = a.bookingProductId;
			var d = b.bookingProductId;
			return d - c;
		}),
		extras: appointment.extras.sort(function(a, b) {
			var c = a.bookingExtraId;
			var d = b.bookingExtraId;
			return d - c;
		}),
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
		giftCards: appointment.giftCards ? appointment.giftCards : [],
		notes: appointment.notes
			? appointment.notes.sort(function(a, b) {
					var c = a.appointmentNoteId;
					var d = b.appointmentNoteId;
					return d - c;
				})
			: []
	};
};

export const memberAdapter = (member) => {
	return {
		id: member.staffId,
		title: `${member.displayName}`,
		imageUrl: (member.imageUrl && `${member.imageUrl}`) || `${BASE_URL}/${VAR_DEFAULT_AVATAR_PATH}`,
		orderNumber: member.orderNumber,
		workingTimes: member.workingTimes,
		isDisabled: member.isDisabled,
		pincode: member.pin,
		isNextAvailableStaff: member.isNextAvailableStaff,
		blockTime: member.blockTime ? member.blockTime : [],
		timeLogin: 0
	};
};

export const memberAdapter_update = (member) => {
	return {
		id: member.StaffId,
		title: `${member.DisplayName}`,
		imageUrl: (member.ImageUrl && `${member.ImageUrl}`) || `${BASE_URL}/${VAR_DEFAULT_AVATAR_PATH}`,
		orderNumber: member.OrderNumber,
		workingTimes: JSON.parse(member.WorkingTime)
	};
};

export const statusConvertData = {
	ASSIGNED: 'unconfirm',
	CONFIRMED: 'confirm',
	CHECKED_IN: 'checkin',
	PAID: 'paid',
	WAITING: 'waiting',
	CANCEL: 'cancel'
};

const statusAdapter = (status) => statusConvertData[status];

export function* getMembers() {
	if (navigator.onLine === true) {
		try {
			const requestURL = new URL(`${GET_MEMBERS_API}`);
			const resp = yield api(requestURL.toString(), '', 'GET', token);
			if (resp.codeStatus === 1) {
				const members = resp.data
					? resp.data.map((member) => memberAdapter(member)).filter((mem) => mem.isDisabled === 0)
					: [];

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

export function* getAppointmentOffline_Saga(acion) {
	// alert(action.data);
}
export function* getWaitingListOffline_Saga(action) {
	// alert(action.data);
}

export function* getStaffOffline_Saga(action) {
	// alert(action.data);
}

export function* getWaitingAppointments() {
	if (navigator.onLine) {
		try {
			yield put(loadingWaiting(true));
			const requestURL = new URL(GET_APPOINTMENT_STATUS);
			const timezone = new Date().getTimezoneOffset();
			const url = `${requestURL.toString()}&timezone=${timezone}`;
			const response = yield api(url.toString(), '', 'GET', token);
			yield put(loadingWaiting(false));
			const appointments =
				response &&
				response.data.map((appointment) => appointmentAdapter(appointment)).filter(app=>moment(app.start).format('YYYY-MM-DD hh:mm A') !== moment(app.end).format('YYYY-MM-DD hh:mm A'));
			localStorage.setItem('AppointmentWaiting', JSON.stringify(appointments));

			// window.postMessage({
			// 	action : 'dataWaitingList',
			// 	waitingList : appointments
			// })

			yield put(waitingAppointmentsLoaded(appointments));
		} catch (err) {
			yield put(loadingWaiting(false));
			yield put(waitingAppointmentLoadingError(err));
		}
	} else {
		const appointments = JSON.parse(localStorage.getItem('AppointmentWaiting'));
		yield put(waitingAppointmentsLoaded(appointments));
		yield put(loadingWaiting(false));
	}
}

export function* getAppointmentsByMembersAndDate() {
	try {
		let appointments;
		const displayedMembers = yield select(makeSelectDisplayedMembers());
		const currentDate = yield select(makeCurrentDay());
		let apiDateQuery = currentDate.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');

		if (navigator.onLine) {
			yield put(loadingCalendar(true));
			yield put(getBlockTime());
			const requestURL = new URL(GET_APPOINTMENT_BY_DATE);
			const url = `${requestURL.toString()}/${apiDateQuery}`;
			const response = yield api(url.toString(), '', 'GET', token);
			appointments =
				response &&
				response.data.map((appointment) => appointmentAdapter(appointment)).filter(app=>moment(app.start).format('YYYY-MM-DD hh:mm A') !== moment(app.end).format('YYYY-MM-DD hh:mm A'));

			if (apiDateQuery === moment().format('YYYY-MM-DD')) {
				localStorage.setItem('AppointmentCalendar', JSON.stringify(appointments));
			}
			// window.postMessage({
			// 	action : 'dataCalendars',
			// 	Calendars : appointments
			// })
			yield put(loadingCalendar(false));
		} else {
			appointments = JSON.parse(localStorage.getItem('AppointmentCalendar')); // chưa filter lọc ngày cho chức năng offline
		}

		const appointmentsMembers = displayedMembers.map((member) => ({
			memberId: member.id,
			appointments: appointments.filter(
				(appointment) =>
					appointment.memberId === member.id &&
					appointment.status !== 'CANCEL' &&
					appointment.status !== 'WAITING' &&
					appointment.status !== 'PENDING' &&
					appointment.status !== undefined
				// && appointment.user_id !== 0
			)
		}));

		addBlockCalendar(appointmentsMembers, displayedMembers, currentDate, apiDateQuery);

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
		let apiDateQuery = currentDate.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');
		const appointmentsMembers = displayedMembers.map((member) => ({
			memberId: member.id,
			appointments: appointments.filter(
				(appointment) =>
					appointment.memberId === member.id &&
					appointment.status !== 'CANCEL' &&
					appointment.status !== 'WAITING' &&
					appointment.status !== 'PENDING' &&
					appointment.status !== undefined
			)
		}));

		addBlockCalendar(appointmentsMembers, displayedMembers, currentDate, apiDateQuery);
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

	const oldMemberPosition = calendarMembers.find((member) =>
		member.appointments.find((appointment) => appointment.id === action.appointmentId)
	);
	if (!oldMemberPosition) {
		yield put(appointmentMovingError('Cannot find previous position.'));
	}

	const movedAppointment = oldMemberPosition.appointments.find(
		(appointment) => appointment.id === action.appointmentId
	);
	if (!movedAppointment) {
		yield put(appointmentMovingError('Cannot find moved appointment.'));
	}

	let appointment = {
		...movedAppointment,
		start: action.newTime,
		end: action.newEndTime,
		memberId: assignedMember.id
	};

	if (appointment.status !== 'CHECKED_IN') {
		appointment.status = 'ASSIGNED';
	}
	if (appointment.status === 'CHECKED_IN') {
		let test = moment(appointment.start).diff(moment(movedAppointment.start), 'minutes');
		if ((test < 45 && test >= 0) || (test < 0 && test > -45)) {
			appointment.status = 'CHECKED_IN';
		} else {
			appointment.status = 'CONFIRMED';
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
	};

	try {
		const requestURL = new URL(PUT_STATUS_APPOINTMENT_API);
		const url = `${requestURL.toString()}/${appointment.id}`;
		const response = yield api(url, data, 'PUT', token);
		if (response.codeStatus !== 1) {
			return yield* checkResponse(response);
		}
		if (response.codeStatus === 1) {
			yield put(appointmentMoved(appointment));
			yield put(updateAppointmentFrontend({ appointment: data, id: appointment.id }));
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
		const url = `${requestURL.toString()}/${appointment.id}`;
		yield put(appointmentPutBack(action.appointment));
		const data = dataPutBackAppointment(memberId, start, end, options, products, extras);
		try {
			const response = yield api(url, data, 'PUT', token);
			if (response.codeStatus !== 1) return yield* checkResponse(response);
			if (response.codeStatus === 1) {
			}
		} catch (err) {}
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
		memberId: assignedMember.id
	};
	try {
		yield put(removeAppointmentWaiting(appointment));
		const { memberId, start, status, options, products, extras } = appointment;
		let duration_total = totalDurationAssignAppointment(extras, appointment);

		yield put(
			addAppointmentToCalendar({
				appointment: appointment,
				new_end_time:
					duration_total > 0
						? moment(start).add(duration_total, 'minutes').format().substr(0, 19)
						: moment(start).add(15, 'minutes').format().substr(0, 19),
				memberId: appointment.memberId
			})
		);
		// const data = dataAssignAppointment(memberId, start, duration_total, status, options, products, extras);
		let data = {
			staffId: memberId,
			fromTime: start,
			toTime:
				duration_total > 0
					? moment(start).add(duration_total, 'minutes').format().substr(0, 19)
					: moment(start).add(15, 'minutes').format().substr(0, 19),
			status: statusConvertData[status],
			services: options,
			products,
			extras
		};

		// if (navigator.onLine === false) {
		// yield put(renderAppointment());
		const pushData = {
			data: { ...data, id: appointment.id },
			action: 'updateAppointmemtOffline'
		};
		window.postMessage(pushData);
		// }

		const requestURL = new URL(PUT_STATUS_APPOINTMENT_API);
		const url = `${requestURL.toString()}/${appointment.id}`;
		const response = yield api(url, data, 'PUT', token);
		if (response.codeStatus !== 1) return yield* checkResponse(response);
		if (response.codeStatus === 1) {
		}
	} catch (err) {
		// yield put(appointmentAssigningError(err));
	}
}

export function* upddateAppointment(action) {
	try {
		const fcEvent = yield select(makeSelectFCEvent());
		if (!fcEvent) {
			yield put(appointmentUpdatingStatusError('Cannot find selected fcEvent'));
		}
		let {
			appointment,
			status,
			old_duration,
			servicesUpdate,
			productsUpdate,
			notes,
			old_status,
			old_appointment,
			extrasUpdate
		} = action.appointment;

		let { end, start, extras, memberId } = appointment;

		let new_total_duration = totalDuartionUpdateAppointment(servicesUpdate, extras);
		let newDate = newDateUpdateAppointment(status, old_duration, new_total_duration, end);

		if (status === 'cancel') {
			yield put(appointmentCanceled(appointment.id));
			deleteEventFromCalendar(fcEvent._id);
			yield put(deselectAppointment());

			yield put(deleteAppointmentCalendar(appointment));
			yield put(renderAppointment());
			const url_update_status = new URL(PUT_UPDATE_STATUS_APPOINTMENT);
			const url = `${url_update_status}/${appointment.id}`;
			const kq = yield api(url, { status }, 'PUT', token);
			if (kq.codeStatus !== 1) return yield* checkResponse(kq);
			if (kq.codeStatus === 1) {
			}
		}

		let notesUpdate = [];
		notes.forEach((note) => {
			notesUpdate.push({
				note: note.note
			});
		});

		let data = dataUpdateAppointment(
			old_status,
			memberId,
			old_appointment,
			status,
			notesUpdate,
			start,
			newDate,
			servicesUpdate,
			productsUpdate,
			extrasUpdate
		);

		yield put(updateAppointmentFrontend({ appointment: data, id: appointment.id }));
		yield put(renderAppointment());

		const requestURL = new URL(PUT_STATUS_APPOINTMENT_API);
		const url = `${requestURL}/${appointment.id}`;
		const kq = yield api(url, data, 'PUT', token);
		if (kq.codeStatus !== 1) return yield* checkResponse(kq);
		if (kq.codeStatus === 1) {
		}
	} catch (error) {
		yield put(updateAppointmentError(error));
	}
}

export function* changeTimeAppointment(action) {
	try {
		const fcEvent = yield select(makeSelectFCEvent());
		if (!fcEvent) {
			yield put(appointmentUpdatingStatusError('Cannot find selected fcEvent'));
		}

		let {
			appointment,
			dayPicker,
			fromTime,
			notes,
			selectedStaff,
			servicesUpdate,
			productsUpdate,
			extrasUpdate
		} = action.appointment;
		let { memberId, options, products, extras, id, start } = appointment;

		let totalDuration = totalDuationChangeTime(appointment, extras);

		const start_time = `${moment(dayPicker).format('YYYY-MM-DD')}T${moment(fromTime).format('HH:mm')}`;
		const end_time =
			totalDuration > 0
				? moment(start_time).add(totalDuration, 'minutes').format('YYYY-MM-DD HH:mm')
				: moment(start_time).add(15, 'minutes').format('YYYY-MM-DD HH:mm');
		if (window.confirm('Are you sure want to change ?')) {
			yield* changeTime(
				appointment,
				fcEvent,
				start_time,
				end_time,
				memberId,
				servicesUpdate,
				productsUpdate,
				extrasUpdate,
				notes,
				start,
				selectedStaff
			);
		}
	} catch (error) {
		yield put(updateAppointmentError(error));
	}

	function totalDuarion(services, extras) {
		let total = 0;
		services.forEach((sv) => {
			total += sv.duration;
		});
		extras.forEach((ex) => {
			total += ex.duration;
		});
		return total;
	}

	function* changeTime(
		appointmentEdit,
		fcEvent,
		start_time,
		end_time,
		memberId,
		options,
		products,
		extras,
		notes,
		start,
		selectedStaff
	) {
		yield put(appointmentCanceled(appointmentEdit.id));
		deleteEventFromCalendar(fcEvent._id);
		yield put(deselectAppointment());
		let appointment = {
			...appointmentEdit,
			memberId: selectedStaff.id
		};

		let notesUpdate = [];
		notes.forEach((note) => {
			notesUpdate.push({
				note: note.note
			});
		});

		/* check status của appointment check in > 45 mins */
		let statusChange = 'confirm';
		let test = moment(start_time).diff(moment(start), 'minutes');
		if ((test < 45 && test >= 0) || (test < 0 && test > -45)) {
			statusChange = 'checkin';
		}

		/* data submit lên server */
		let data = dataChangeTimeAppointment(
			selectedStaff,
			start_time,
			end_time,
			appointment,
			statusChange,
			options,
			products,
			extras,
			notesUpdate
		);

		/* cập nhật appointment trên frontend */
		yield put(
			updateAppointmentFrontend({
				appointment: {
					...data,
					toTime: moment(data.fromTime).add(totalDuarion(data.services, data.extras), 'minutes')
				},
				id: appointment.id
			})
		);
		yield put(renderAppointment());

		/* Gọi api submit data lên server, nếu lỗi ko có internet => cập nhật frontend , lưu local */
		try {
			const requestURL = new URL(PUT_STATUS_APPOINTMENT_API);
			const url = `${requestURL.toString()}/${appointment.id}`;
			const response = yield api(url, data, 'PUT', token);
			if (response.codeStatus !== 1) return yield* checkResponse(kq);
			if (response.codeStatus === 1) {
			}
		} catch (err) {
			yield put(
				updateAppointmentFrontend({
					appointment: {
						...data,
						toTime: moment(data.fromTime).add(totalDuarion(data.services, data.extras), 'minutes')
					},
					id: appointment.id
				})
			);
			yield put(renderAppointment());
		}
	}
}

export function* addNewCustomer(action) {
	try {
		const { first_name, last_name, phone, staffID, time, refPhone, note, email } = action.customer;

		if (navigator.onLine === false) {
			window.postMessage(
				JSON.stringify({
					first_name,
					last_name,
					phone,
					staffID,
					time,
					refPhone,
					note,
					email,
					action: 'signinAppointmentOffLine'
				})
			);
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
				referrerPhone: "+"+refPhone,
				favourite: note
			};

			const result = yield api(requestURL.toString(), data, 'POST', token);
			customerId = result.data.customerId;
			user_Id = result.data.userId;
		} else {
			customerId = Info_CheckPhone.customerId;
			user_Id = Info_CheckPhone.userId;
		}

		const data = {
			staffId: time ? staffID : 0,
			customerId,
			merchantId: merchantId,
			userId: user_Id,
			status: time ? 'checkin' : 'waiting',
			services: [],
			products: [],
			extras: [],
			fromTime: time ? moment(new Date(time)).format('YYYY-MM-DD HH:mm') : checkTimeToAddAppointmdent(),
			toTime: time
				? moment(new Date(time)).add(15, 'minutes').format('YYYY-MM-DD HH:mm')
				: moment(checkTimeToAddAppointmdent()).add(15, 'minutes').format('YYYY-MM-DD HH:mm')
		};

		/* Add Appointment  */
		const requestURL_AddAppointment = new URL(POST_ADD_APPOINTMENT);
		const resultAddAppointment = yield api(requestURL_AddAppointment.toString(), data, 'POST', token);

		let id_appointment = '';
		if (resultAddAppointment.codeStatus === 1) {
			id_appointment = resultAddAppointment.data;
		}

		/* get appointment by id after add, add appointment to  waiting list */
		const requestURL_DeailAppointment = new URL(GET_APPOINTMENT_ID).toString();
		const response_DetailAppointment = yield api(
			`${requestURL_DeailAppointment}/${id_appointment}`,
			'',
			'GET',
			token
		);

		yield put(addCustomerSuccess(true));

		const {
			appointmentId,
			createdDate,
			fromTime,
			toTime,
			staffId,
			phoneNumber,
			services,
			products,
			userId,
			firstName,
			lastName,
			extras
		} = response_DetailAppointment.data;

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
			notes: []
		};

		if (time) {
		} else {
			yield put(addAppointmentWaiting(waitingAppointment));
		}

		if (staffID) {
			window.postMessage(
				JSON.stringify({
					customerId,
					userId,
					appointmentId,
					action: 'newAppointment'
				})
			);
			window.postMessage(
				JSON.stringify({
					customerId,
					userId,
					appointmentId,
					action: 'signinAppointment'
				})
			);
		} else {
			window.postMessage(
				JSON.stringify({
					customerId,
					userId,
					appointmentId,
					action: 'newAppointment'
				})
			);
			window.postMessage(
				JSON.stringify({
					customerId,
					userId,
					appointmentId,
					action: 'signinAppointment'
				})
			);
		}
	} catch (error) {
		yield put(addCustomerError(error));
	}
}

export function* checkPhoneCustomer(action) {
	try {
		const { phone, staffID, time } = action.phone;
		const requestURL = new URL(GET_BY_PHONE);
		const url = `${requestURL.toString()}/${phone}`;
		if (navigator.onLine) {
			const result = yield api(url, '', 'GET', token);
			if (result.codeStatus === 2) {
				yield put(checkPhoneNumberCustomerSuccess(true)); //phone is not exist
			} else {
				yield put(checkPhoneNumberCustomerError(true));
				yield put(infoCheckPhone(result.data));
				if (staffID) {
					window.postMessage(
						JSON.stringify({
							consumerId: result.data.customerId,
							staffid: staffID,
							from_time: time,
							action: 'newAppointment'
						})
					);
				} else {
					window.postMessage(
						JSON.stringify({
							consumerId: result.data.customerId,
							action: 'newAppointment'
						})
					);
					yield put(TimeAndStaffID(''));
				}
			}
		} else {
			yield put(checkPhoneNumberCustomerSuccess(true));
		}
	} catch (error) {
		yield put(checkPhoneNumberCustomerError(error));
	}
}

export function* deleteEventInWaitingList(action) {
	const { appointment } = action;
	const { memberId, start, end, options, products, extras } = appointment;
	try {
		let data = {
			staffId: memberId,
			fromTime: start,
			toTime: end,
			status: 'cancel',
			services: options,
			products: products,
			extras
		};

		const requestURL = new URL(PUT_STATUS_APPOINTMENT_API);
		const url = `${requestURL.toString()}/${appointment.id}`;
		const response = yield api(url, data, 'PUT', token);
		if (response.codeStatus !== 1) return yield* checkResponse(response);
		if (response.codeStatus === 1) {
		}
	} catch (error) {
		yield put(removeAppointmentWaiting({ ...appointment, status: 'cancel' }));
	}
}

export function* updateAppointment_Offline(action) {
	try {
		const appointment = action.data;
		const requestURL = new URL(POST_STATUS_APPOINTMENT_UPDATE);
		const result = yield axios
			.post(requestURL.toString(), appointment, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			})
			.then((kq) => {
				return kq;
			})
			.catch((err) => {});
		if (result) {
			yield put(updateAppointmentOfflineSuccess(result));
		}
	} catch (error) {}
}

export function* getAppointmentAgain() {
	yield takeLatest(LOAD_APPOINTMENT_AGAIN, function*() {
		try {
			const displayedMembers = yield select(makeSelectDisplayedMembers());
			const currentDate = yield select(makeCurrentDay());
			let apiDateQuery = currentDate.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');

			const requestURL = new URL(GET_APPOINTMENT_BY_DATE);
			const url = `${requestURL.toString()}/${apiDateQuery}`;
			const response = yield axios
				.get(url, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				})
				.then((result) => {
					if (result.status === 200) {
						return result;
					}
				})
				.catch((err) => {});

			const appointments =
				response &&
				response.status === 200 &&
				response.data.data.map((appointment) => appointmentAdapter(appointment));

			const app_calendar = yield select(makeSelectCalendarAppointments());
			let arr_appointment = [];
			app_calendar.forEach((mem) =>
				mem.appointments.forEach((app) => (arr_appointment = [ ...arr_appointment, app ]))
			);

			let diff = differenceBy(appointments, arr_appointment, 'id');
			diff = diff.filter((app) => app.status === 'ASSIGNED');

			for (let index = 0; index < diff.length; index++) {
				const app = diff[index];
				yield put(addAppointmentReloadCalendar(app));
				updateEventToCalendar(app);
			}
		} catch (err) {
			yield put(appointmentByMemberLoadingError(err));
		}
	});
}

function* checkPinCode_Saga() {
	yield takeLatest(CHECKPINCODE, function*(action) {
		const { pincode } = action;
		const url = `${GET_CHECKPINCODE}/${pincode}`;
		const kq = yield axios
			.put(
				url,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			)
			.then((result) => {
				return result;
			})
			.catch((err) => {});

		if (kq.status === 200 && kq.data.codeStatus !== 1) {
			// alert(kq.data.message);
		}

		if (kq.status === 200 && kq.data.codeStatus === 1) {
			yield put(loadMembers());
			yield put(loadWaitingAppointments());
			yield put(loadAppointmentByMembers());
		}
	});
}

function* updateNextStaff_Saga() {
	yield takeLatest(UPDATE_NEXT_STAFF, function*() {
		try {
			const requestURL = new URL(`${GET_MEMBERS_API}`);
			const response = yield api(requestURL.toString(), '', 'GET', token);
			if (response.codeStatus === 1) {
				const members = response.data
					? response.data.map((member) => memberAdapter(member)).filter((mem) => mem.isDisabled === 0)
					: [];
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
		let apiDateQuery = currentDate.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');
		const requestURL = new URL(`${POST_ADD_BLOCK_TIME}`);
		const dataSubmit = {
			staffId: staff.id,
			workingDate: apiDateQuery,
			blockTimeStart: start,
			blockTimeEnd: end,
			note: note
		};
		const response = yield api(requestURL.toString(), dataSubmit, 'POST', token);
		if (response.codeStatus === 1) {
			yield put(loadMembers());
			return;
		}
	} catch (error) {}
}

export function* deleteBlockTime_Saga(action) {
	try {
		const { block, staff } = action.data;
		const requestURL = new URL(`${DELETE_BLOCKTIME_API}/${block.blockTimeId}`);
		const response = yield api(requestURL.toString(), '', 'DELETE', token);
		if (response.codeStatus === 1) {
			yield put(loadMembers());
			yield put(deleteBlockTimeSuccess({ staff, block }));
		}
	} catch (error) {}
}

export function* getBlockTimeSaga() {
	try {
		const currentDate = yield select(makeCurrentDay());
		let apiDateQuery = currentDate.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');
		const requestURL = new URL(`${GET_WORKINGTIME_MERCHANT}${apiDateQuery}`);
		const response = yield api(requestURL.toString(), '', 'GET', token);
		if (response.codeStatus === 1) {
			yield put(getBlockTime_Success(response.data));
			yield put(renderAppointment());
			return;
		}
	} catch (error) {}
}

export function* getAppointmentByIdSaga(action) {
	try {
		if (navigator.onLine) {
			const idAppointment = action.data.id;
			const requestURL = new URL(`${GET_APPOINTMENT_ID}/${idAppointment}`);
			const response = yield api(requestURL.toString(), '', 'GET', token);
			if (response.codeStatus === 1) {
				yield put({ type: 'GET_APP_BY_ID_SUCCESS', data: response.data });
				return;
			}
			if (response.codeStatus !== 1) {
				// alert(response.data);
				return;
			}
		} else {
			const appointment = action.data;
			yield put({ type: 'GET_APP_BY_ID_SUCCESS', data: appointment });
		}
	} catch (err) {
		const appointment = action.data;
		yield put({ type: 'GET_APP_BY_ID_SUCCESS', data: appointment });
	}
}

export function* checkOutSaga(action) {
	try {
		const { idAppointment, groupId } = action.data;
		const requestURL = new URL(`${PUT_CHECKOUT}/${idAppointment}`);
		const data = {
			checkoutGroupId: groupId ? groupId : 0
		};
		const response = yield api(requestURL.toString(), data, 'PUT', token);
		if (response.codeStatus === 1) {
		}
		if (response.codeStatus !== 1) {
			// alert(response.data);
			return;
		}
	} catch (err) {}
}

export function* getTimeStaffLoginSaga(action) {
	try {
		const { staffId } = action;
		const timeZone = new Date().getTimezoneOffset();
		const requestURL = new URL(`${API_GET_TIME_STAFF_LOGIN}/${staffId}?timezone=${timeZone}`);
		const response = yield api(requestURL.toString(), '', 'GET', token);

		if (response.codeStatus === 1) {
			yield put({ type: 'GET_TIME_STAFF_LOGIN_SUCCESS', data: { timeLogin: response.data, staffId } });
		}
		if (response.codeStatus !== 1) {
			// alert(response.data);
			return;
		}
	} catch (err) {}
}

/* **************************** Subroutines ******************************** */

export function* selectDayAndWeek(action) {
	yield put(selectDay(action.day));
	yield put(selectWeek(action.day));
	setTimeout(() => {
		const x = document.getElementsByClassName('fc-now-indicator fc-now-indicator-arrow');
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
	yield takeLatest(LOAD_APPOINTMENTS_BY_MEMBERS, getAppointmentsByMembersAndDate);

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
	yield takeLatest(UPDATE_APPOINTMENT_STATUS, upddateAppointment);
}
export function* add_Customer() {
	yield takeLatest(ADD_CUSTOMER, addNewCustomer);
}
export function* check_Phone() {
	yield takeLatest(CHECK_PHONE_ADD_CUSTOMER, checkPhoneCustomer);
}
export function* deleteEvent_WaitingList() {
	yield takeLatest(DELETE_EVENT_WAITINGLIST, deleteEventInWaitingList);
}
export function* change_time_appointment() {
	yield takeLatest(CHANGE_APPOINTMENT_TIME, changeTimeAppointment);
}
export function* update_App_Offline() {
	yield takeLatest(UPDATE_APPOINTMENT_OFFLINE, updateAppointment_Offline);
}
export function* delete_BlockTime() {
	yield takeLatest(DELETE_BLOCKTIME, deleteBlockTime_Saga);
}
export function* getBlockTime_() {
	yield takeLatest(GET_BLOCKTIME, getBlockTimeSaga);
}
export function* getAppointmentOffline_() {
	yield takeLatest(GET_APPOINTMENT_OFFLINE, getAppointmentOffline_Saga);
}
export function* getWaitingListOffline_() {
	yield takeLatest(GET_WAITINGLIST_OFFLINE, getWaitingListOffline_Saga);
}
export function* getStaffOffline_() {
	yield takeLatest(GET_STAFF_OFFLINE, getStaffOffline_Saga);
}
export function* watch_getAppointmentById() {
	yield takeLatest(GET_APP_BY_ID, getAppointmentByIdSaga);
}
export function* watch_checkOut() {
	yield takeLatest(CHECKOUT, checkOutSaga);
}

export function* watch_getTimeStaffLogin() {
	yield takeLatest(GET_TIME_STAFF_LOGIN, getTimeStaffLoginSaga);
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
		fork(watch_getAppointmentById),
		fork(watch_checkOut),
		fork(watch_getTimeStaffLogin)
	]);
}
