import { delay } from 'redux-saga';
import { fork, put, takeLatest, all, select } from 'redux-saga/effects';
import moment from 'moment';
import { api } from '../../utils/helper';
import * as constants from './constants';
import * as actions from './actions';
import * as api_constants from '../../../app-constants';

import {
	makeCurrentDay,
	makeSelectDisplayedMembers,
	makeSelectFCEvent,
	makeInfoCheckPhone,
	makeSelectAllAppointments,
	makeSlideIndex,
	makeSelectMembers
} from './selectors';

import { token, merchantId } from '../../../app-constants';

import {
	addBlockCalendar,
	checkTimeToAddAppointmdent,
	totalDuationChangeTime,
	totalDuartionUpdateAppointment,
	newDateUpdateAppointment,
	dataUpdateAppointment,
	totalDurationAssignAppointment,
	dataChangeTimeAppointment,
	dataPutBackAppointment,
	statusConvertData,
	appointmentAdapter,
	memberAdapter
} from './utilSaga';

import { assignAppointment as mockedPostAppointment } from '../../assets/mocks/assignAppointment';
import { addEventsToCalendar, deleteEventFromCalendar } from '../../components/Calendar/constants';

export function* reloadStaffSaga() {
	if (navigator.onLine === true) {
		try {
			const requestURL = new URL(`${api_constants.GET_MEMBER}`);
			const currentDate = yield select(makeCurrentDay());
			const url = `${requestURL.toString()}${currentDate.format('YYYY-MM-DD')}`;
			const resp = yield api(url, '', 'GET', token);
			if (resp.codeStatus !== 1) {
				console.log('error from api ' + url);
				return;
			}
			if (resp.codeStatus === 1) {
				const members = resp.data
					? resp.data.map((member) => memberAdapter(member)).filter((mem) => mem.isDisabled === 0)
					: [];

				const lastStaff = {
					id: 0,
					title: `Any staff`,
					imageUrl: '',
					orderNumber: 0,
					workingTimes: members[members.length - 2].workingTimes,
					isDisabled: false,
					pincode: 0,
					isNextAvailableStaff: false,
					blockTime: [],
					timeLogin: 0
				};

				members.push(lastStaff);
				const slideIndex = yield select(makeSlideIndex());

				localStorage.setItem('staffList', JSON.stringify(members));
				yield put(actions.membersLoaded(members));
				const isDeskTop = api_constants.isDesktopOrLaptop;
				const num = isDeskTop ? 7 : 5;
				yield put(actions.setDisplayedMembers(members.slice(slideIndex * 5, slideIndex * 5 + 5)));
				yield put(actions.reloadCalendar());
			}
		} catch (err) {
			yield put(actions.memberLoadingError(err));
		}
	} else {
		const members = JSON.parse(localStorage.getItem('staffList'));
		yield put(actions.membersLoaded(members));
		const isDeskTop = api_constants.isDesktopOrLaptop;
		const num = isDeskTop ? 7 : 5;
		yield put(actions.setDisplayedMembers(members.slice(slideIndex * 5, slideIndex * 5 + 5)));
		yield put(actions.reloadCalendar());
	}
}

export function* reloadCalendarSaga() {
	try {
		let appointments;
		const displayedMembers = yield select(makeSelectDisplayedMembers());
		const currentDate = yield select(makeCurrentDay());
		let apiDateQuery = currentDate.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');

		if (navigator.onLine) {
			yield put(actions.loadingCalendar(true));
			const requestURL = new URL(api_constants.GET_APPOINTMENT_BY_DATE);
			const url = `${requestURL.toString()}/${apiDateQuery}`;
			const response = yield api(url.toString(), '', 'GET', token);
			if (response.codeStatus !== 1) {
				console.log('error from api ' + requestURL);
				return;
			}
			appointments =
				response &&
				response.data
					.map((appointment) => appointmentAdapter(appointment))
					.filter(
						(app) =>
							moment(app.start).format('YYYY-MM-DD hh:mm A') !==
							moment(app.end).format('YYYY-MM-DD hh:mm A')
					);

			if (apiDateQuery === moment().format('YYYY-MM-DD')) {
				localStorage.setItem('AppointmentCalendar', JSON.stringify(appointments));
			}

			yield put(actions.loadingCalendar(false));
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
			)
		}));

		addBlockCalendar(appointmentsMembers, displayedMembers, currentDate, apiDateQuery);
		yield put(actions.loadedAllAppointments(appointments));
		yield put(actions.appointmentByMembersLoaded(appointmentsMembers));
		yield put(actions.getBlockTime());
		if (navigator.onLine) {
			addEventsToCalendar(currentDate, appointmentsMembers);
		} else {
			setTimeout(() => {
				addEventsToCalendar(currentDate, appointmentsMembers);
			}, 1000);
		}
	} catch (err) {
		yield put(actions.appointmentByMemberLoadingError(err));
	}
}

export function* getMembers() {
	if (navigator.onLine === true) {
		try {
			const requestURL = new URL(`${api_constants.GET_MEMBER}`);
			const currentDate = yield select(makeCurrentDay());
			const url = `${requestURL.toString()}${currentDate.format('YYYY-MM-DD')}`;
			const resp = yield api(url, '', 'GET', token);
			if (resp.codeStatus !== 1) {
				console.log('error from api ' + url);
				return;
			}
			if (resp.codeStatus === 1) {
				const members = resp.data
					? resp.data.map((member) => memberAdapter(member)).filter((mem) => mem.isDisabled === 0)
					: [];

				const lastStaff = {
					id: 0,
					title: `Any staff`,
					imageUrl: '',
					orderNumber: 0,
					workingTimes: members[members.length - 2].workingTimes,
					isDisabled: false,
					pincode: 0,
					isNextAvailableStaff: false,
					blockTime: [],
					timeLogin: 0
				};
				members.push(lastStaff);
				const slideIndex = yield select(makeSlideIndex());
				// const Staffs = sorrtStaffByDate('', members);

				localStorage.setItem('staffList', JSON.stringify(members));
				yield put(actions.membersLoaded(members));
				const isDeskTop = api_constants.isDesktopOrLaptop;
				const num = isDeskTop ? 7 : 5;
				yield put(actions.setDisplayedMembers(members.slice(slideIndex * 5, slideIndex * 5 + 5)));
				yield put(actions.reloadCalendar());
			}
		} catch (err) {
			yield put(actions.memberLoadingError(err));
		}
	} else {
		const members = JSON.parse(localStorage.getItem('staffList'));
		yield put(actions.membersLoaded(members));
		const isDeskTop = api_constants.isDesktopOrLaptop;
		const num = isDeskTop ? 7 : 5;
		yield put(actions.setDisplayedMembers(members.slice(slideIndex * 5, slideIndex * 5 + 5)));
		yield put(actions.reloadCalendar());
	}
}

function* checkResponse(response) {
	alert(response.data.message);
	yield put(actions.loadMembers());
	yield put(actions.loadWaitingAppointments());
	yield put(actions.loadAppointmentByMembers());
	return;
}

export function* getWaitingAppointments() {
	if (navigator.onLine) {
		try {
			yield put(actions.loadingWaiting(true));
			const requestURL = new URL(api_constants.GET_APPOINTMENT_STATUS);
			const timezone = new Date().getTimezoneOffset();
			const url = `${requestURL.toString()}&timezone=${timezone}&waitingTime=${false}`;
			const response = yield api(url.toString(), '', 'GET', token);
			if (response.codeStatus !== 1) {
				console.log('error from api ' + url);
				return;
			}
			yield put(actions.loadingWaiting(false));
			const appointments =
				response &&
				response.data
					.map((appointment) => appointmentAdapter(appointment))
					.filter(
						(app) =>
							moment(app.start).format('YYYY-MM-DD hh:mm A') !==
							moment(app.end).format('YYYY-MM-DD hh:mm A')
					);
			localStorage.setItem('AppointmentWaiting', JSON.stringify(appointments));

			yield put(actions.waitingAppointmentsLoaded(appointments));
		} catch (err) {
			yield put(actions.loadingWaiting(false));
			yield put(actions.waitingAppointmentLoadingError(err));
		}
	} else {
		const appointments = JSON.parse(localStorage.getItem('AppointmentWaiting'));
		yield put(actions.waitingAppointmentsLoaded(appointments));
		yield put(actions.loadingWaiting(false));
	}
}

export function* getAppointmentsByMembersAndDate() {
	try {
		let appointments;
		const displayedMembers = yield select(makeSelectDisplayedMembers());
		const currentDate = yield select(makeCurrentDay());
		let apiDateQuery = currentDate.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');

		if (navigator.onLine) {
			yield put(actions.loadingCalendar(true));
			// yield put(actions.getBlockTime());
			const requestURL = new URL(api_constants.GET_APPOINTMENT_BY_DATE);
			const url = `${requestURL.toString()}/${apiDateQuery}`;
			const response = yield api(url.toString(), '', 'GET', token);
			if (response.codeStatus !== 1) {
				console.log('error from api ' + requestURL);
				return;
			}
			appointments =
				response &&
				response.data
					.map((appointment) => appointmentAdapter(appointment))
					.filter(
						(app) =>
							moment(app.start).format('YYYY-MM-DD hh:mm A') !==
							moment(app.end).format('YYYY-MM-DD hh:mm A')
					);

			if (apiDateQuery === moment().format('YYYY-MM-DD')) {
				localStorage.setItem('AppointmentCalendar', JSON.stringify(appointments));
			}

			yield put(actions.loadingCalendar(false));
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

		yield put(actions.appointmentByMembersLoaded(appointmentsMembers));
		yield put(actions.loadedAllAppointments(appointments));
		yield put(actions.getBlockTime());
		if (navigator.onLine) {
			addEventsToCalendar(currentDate, appointmentsMembers);
		} else {
			setTimeout(() => {
				addEventsToCalendar(currentDate, appointmentsMembers);
			}, 1000);
		}
	} catch (err) {
		yield put(actions.appointmentByMemberLoadingError(err));
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
		yield put(actions.appointmentByMembersLoaded(appointmentsMembers));
		addEventsToCalendar(currentDate, appointmentsMembers);
	} catch (err) {
		yield put(actions.appointmentByMemberLoadingError(err));
	}
}

export function* moveAppointment(action) {
	const displayedMembers = yield select(makeSelectDisplayedMembers());
	// const allMember = yield select(makeSelectMembers());
	const allAppointment = yield select(makeSelectAllAppointments());
	const assignedMember = displayedMembers[action.newPositionIndex - 1];

	const movedAppointment = allAppointment.find((app) => app.id === action.appointmentId);
	if (!movedAppointment) return;

	let appointment = {
		...movedAppointment,
		start: action.newTime,
		end: action.newEndTime,
		memberId: assignedMember ? assignedMember.id : 0
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
		const requestURL = new URL(api_constants.PUT_STATUS_APPOINTMENT_API);
		const url = `${requestURL.toString()}/${appointment.id}`;
		const response = yield api(url, data, 'PUT', token);
		if (response.codeStatus !== 1) {
			return yield* checkResponse(response);
		}
		if (response.codeStatus === 1) {
			yield put(actions.appointmentMoved(appointment));
			yield put(actions.updateAppointmentFrontend({ appointment: data, id: appointment.id }));
		}
	} catch (err) {
		yield put(actions.updateAppointmentFrontend({ appointment: data, id: appointment.id }));
		yield put(actions.renderAppointment());
	}
}

export function* putBackAppointment(action) {
	try {
		const { appointment } = action;
		let { memberId, start, end, options, products, extras } = appointment;
		const requestURL = new URL(api_constants.PUT_STATUS_APPOINTMENT_API);
		const url = `${requestURL.toString()}/${appointment.id}`;
		yield put(actions.appointmentPutBack(action.appointment));
		const data = dataPutBackAppointment(memberId, start, end, options, products, extras);
		try {
			const response = yield api(url, data, 'PUT', token);
			if (response.codeStatus !== 1) return yield* checkResponse(response);
			if (response.codeStatus === 1) {
			}
		} catch (err) {}
	} catch (err) {
		yield put(actions.appointmentPuttingBackError(err));
	}
}

export function* cancelAppointment(action) {
	const fcEvent = yield select(makeSelectFCEvent());
	if (!fcEvent) {
		yield put(actions.appointmentCancellingError('Cannot find selected fcEvent'));
	}
	try {
		yield delay(200);
		const result = mockedPostAppointment;
		if (result) {
			yield put(actions.appointmentCanceled(action.appointmentId));
			deleteEventFromCalendar(fcEvent._id);
			yield put(actions.deselectAppointment());
		} else {
			yield put(actions.appointmentCancellingError(result));
		}
	} catch (err) {
		yield put(actions.appointmentCancellingError(err));
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
		yield put(actions.removeAppointmentWaiting(appointment));
		const { memberId, start, status, options, products, extras } = appointment;
		let duration_total = totalDurationAssignAppointment(extras, appointment);

		yield put(
			actions.addAppointmentToCalendar({
				appointment: appointment,
				new_end_time:
					duration_total > 0
						? moment(start).add(duration_total, 'minutes').format().substr(0, 19)
						: moment(start).add(15, 'minutes').format().substr(0, 19),
				memberId: appointment.memberId
			})
		);

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

		const pushData = {
			data: { ...data, id: appointment.id },
			action: 'updateAppointmemtOffline'
		};
		window.postMessage(pushData);

		const requestURL = new URL(api_constants.PUT_STATUS_APPOINTMENT_API);
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
		console.log('update saga app')

		const fcEvent = yield select(makeSelectFCEvent());
		if (!fcEvent) {
			yield put(actions.appointmentUpdatingStatusError('Cannot find selected fcEvent'));
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

		let new_total_duration = totalDuartionUpdateAppointment(servicesUpdate, extras, appointment);
		let newDate = newDateUpdateAppointment(status, old_duration, new_total_duration, end);

		if (status === 'cancel') {
			yield put(actions.appointmentCanceled(appointment.id));
			deleteEventFromCalendar(fcEvent._id);
			yield put(actions.deselectAppointment());

			yield put(actions.deleteAppointmentCalendar(appointment));
			yield put(actions.renderAppointment());
			const url_update_status = new URL(api_constants.PUT_UPDATE_STATUS_APPOINTMENT);
			const url = `${url_update_status}/${appointment.id}`;
			const kq = yield api(url, { status }, 'PUT', token);
			if (kq.codeStatus !== 1) return yield* checkResponse(kq);
			if (kq.codeStatus === 1) {
				return;
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

		yield put(actions.updateAppointmentFrontend({ appointment: data, id: appointment.id }));
		yield put(actions.renderAppointment());

		const requestURL = new URL(api_constants.PUT_STATUS_APPOINTMENT_API);
		const url = `${requestURL}/${appointment.id}`;
		const kq = yield api(url, data, 'PUT', token);
		if (kq.codeStatus !== 1) return yield* checkResponse(kq);
		if (kq.codeStatus === 1) {
		}
	} catch (error) {
		yield put(actions.updateAppointmentError(error));
	}
}

export function* changeTimeAppointment(action) {
	try {
		const fcEvent = yield select(makeSelectFCEvent());
		if (!fcEvent) {
			yield put(actions.appointmentUpdatingStatusError('Cannot find selected fcEvent'));
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

		console.log({totalDuration})

		const start_time = `${moment(dayPicker).format('YYYY-MM-DD')}T${moment(fromTime).format('HH:mm')}`;
		const end_time =
			totalDuration > 0
				? moment(start_time).add(totalDuration, 'minutes').format('YYYY-MM-DD HH:mm')
				: moment(start_time).add(15, 'minutes').format('YYYY-MM-DD HH:mm');
		console.log({end_time})
		if (window.confirm('Accept changes?')) {
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
		yield put(actions.updateAppointmentError(error));
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
		yield put(actions.appointmentCanceled(appointmentEdit.id));
		deleteEventFromCalendar(fcEvent._id);
		yield put(actions.deselectAppointment());
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
			actions.updateAppointmentFrontend({
				appointment: {
					...data,
					toTime: moment(data.fromTime).add(totalDuarion(data.services, data.extras), 'minutes')
				},
				id: appointment.id
			})
		);
		yield put(actions.renderAppointment());

		/* Gọi api submit data lên server, nếu lỗi ko có internet => cập nhật frontend , lưu local */
		try {
			const requestURL = new URL(api_constants.PUT_STATUS_APPOINTMENT_API);
			const url = `${requestURL.toString()}/${appointment.id}`;
			const response = yield api(url, data, 'PUT', token);
			if (response.codeStatus !== 1) return yield* checkResponse(kq);
			if (response.codeStatus === 1) {
			}
		} catch (err) {
			yield put(
				actions.updateAppointmentFrontend({
					appointment: {
						...data,
						toTime: moment(data.fromTime).add(totalDuarion(data.services, data.extras), 'minutes')
					},
					id: appointment.id
				})
			);
			yield put(actions.renderAppointment());
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
			const requestURL = new URL(api_constants.POST_ADD_CUSTOMER);
			const data = {
				FirstName: first_name,
				LastName: last_name,
				Email: email,
				Phone: phone,
				referrerPhone: '+' + refPhone,
				favourite: note
			};

			const result = yield api(requestURL.toString(), data, 'POST', token);
			if (parseInt(result.codeStatus) != 1) {
				alert('error from ' + api_constants.POST_ADD_CUSTOMER);
				return;
			}

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
		const url_add = new URL(api_constants.POST_ADD_APPOINTMENT);
		const rs_add = yield api(url_add.toString(), data, 'POST', token);
		if (rs_add.codeStatus !== 1) {
			alert('error add appoinment from ' + api_constants.POST_ADD_APPOINTMENT);
			return;
		}

		let id_appointment = '';
		if (rs_add.codeStatus === 1) {
			id_appointment = rs_add.data;
		}

		/* get appointment by id after add, add appointment to  waiting list */
		const url_detail = new URL(api_constants.GET_APPOINTMENT_ID).toString();
		const detailAppointment = yield api(`${url_detail}/${id_appointment}`, '', 'GET', token);

		if (detailAppointment.codeStatus !== 1) {
			alert('error from get appointmentId ' + api_constants.GET_APPOINTMENT_ID);
			return;
		}

		yield put(actions.addCustomerSuccess(true));

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
		} = detailAppointment.data;

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
			yield put(actions.addAppointmentWaiting(waitingAppointment));
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
		yield put(actions.addCustomerError(error));
	}
}

export function* checkPhoneCustomer(action) {
	try {
		const { phone, staffID, time } = action.phone;
		const requestURL = new URL(api_constants.GET_BY_PHONE);
		const url = `${requestURL.toString()}/${phone}`;
		if (navigator.onLine) {
			const result = yield api(url, '', 'GET', token);
			if (result.codeStatus === 2) {
				yield put(actions.checkPhoneNumberCustomerSuccess(true)); //phone is not exist
			} else {
				yield put(actions.checkPhoneNumberCustomerError(true));
				yield put(actions.infoCheckPhone(result.data));
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
					yield put(actions.TimeAndStaffID(''));
				}
			}
		} else {
			yield put(actions.checkPhoneNumberCustomerSuccess(true));
		}
	} catch (error) {
		yield put(actions.checkPhoneNumberCustomerError(error));
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

		const requestURL = new URL(api_constants.PUT_STATUS_APPOINTMENT_API);
		const url = `${requestURL.toString()}/${appointment.id}`;
		const response = yield api(url, data, 'PUT', token);
		if (response.codeStatus !== 1) return yield* checkResponse(response);
		if (response.codeStatus === 1) {
		}
	} catch (error) {
		yield put(actions.removeAppointmentWaiting({ ...appointment, status: 'cancel' }));
	}
}

export function* SubmitEditBlockTime_Saga(action) {
	try {
		const { data } = action;
		const { staff, start, end, note } = data;
		const currentDate = yield select(makeCurrentDay());
		let apiDateQuery = currentDate.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');
		const requestURL = new URL(`${api_constants.POST_ADD_BLOCK_TIME}`);
		const dataSubmit = {
			staffId: staff.id,
			workingDate: apiDateQuery,
			blockTimeStart: start,
			blockTimeEnd: end,
			note: note
		};
		const response = yield api(requestURL.toString(), dataSubmit, 'POST', token);
		if (response.codeStatus === 1) {
			yield put(actions.loadMembers());
			return;
		}
	} catch (error) {}
}

export function* deleteBlockTime_Saga(action) {
	try {
		const { block, staff } = action.data;
		const requestURL = new URL(`${api_constants.DELETE_BLOCKTIME_API}/${block.blockTimeId}`);
		const response = yield api(requestURL.toString(), '', 'DELETE', token);
		if (response.codeStatus === 1) {
			yield put(actions.loadMembers());
			yield put(actions.deleteBlockTimeSuccess({ staff, block }));
		}
	} catch (error) {}
}

export function* getBlockTimeSaga() {
	try {
		const currentDate = yield select(makeCurrentDay());
		let apiDateQuery = currentDate.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');
		const requestURL = new URL(`${api_constants.GET_WORKINGTIME_MERCHANT}${apiDateQuery}`);
		const response = yield api(requestURL.toString(), '', 'GET', token);
		if (response.codeStatus === 1) {
			yield put(actions.getBlockTime_Success(response.data));
			yield put(actions.renderAppointment());
			return;
		}
	} catch (error) {}
}

export function* getAppointmentByIdSaga(action) {
	try {
		if (navigator.onLine) {
			const idAppointment = action.data.id;
			const requestURL = new URL(`${api_constants.GET_APPOINTMENT_ID}/${idAppointment}`);
			const response = yield api(requestURL.toString(), '', 'GET', token);
			if (response.codeStatus === 1) {
				yield put({ type: 'GET_APP_BY_ID_SUCCESS', data: response.data });
				return;
			}
			if (response.codeStatus !== 1) {
				alert('error from get app id : ' + api_constants.GET_APPOINTMENT_ID);
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

export function* getTimeStaffLoginSaga(action) {
	try {
		const { staffId } = action;
		const timeZone = new Date().getTimezoneOffset();
		const requestURL = new URL(`${api_constants.API_GET_TIME_STAFF_LOGIN}/${staffId}?timezone=${timeZone}`);
		const response = yield api(requestURL.toString(), '', 'GET', token);

		if (response.codeStatus === 1) {
			yield put({ type: 'GET_TIME_STAFF_LOGIN_SUCCESS', data: { timeLogin: response.data, staffId } });
		}
		if (response.codeStatus !== 1) {
			alert('error from ' + api_constants.API_GET_TIME_STAFF_LOGIN);
			return;
		}
	} catch (err) {}
}

function* updateNextStaff_Saga() {
	yield takeLatest(constants.UPDATE_NEXT_STAFF, function*() {
		try {
			const requestURL = new URL(`${api_constants.GET_MEMBER}`);
			const currentDate = yield select(makeCurrentDay());
			const url = `${requestURL.toString()}${currentDate.format('YYYY-MM-DD')}`;

			const response = yield api(url, '', 'GET', token);
			if (response.codeStatus === 1) {
				const members = response.data
					? response.data.map((member) => memberAdapter(member)).filter((mem) => mem.isDisabled === 0)
					: [];
				const slideIndex = yield select(makeSlideIndex());
				// const Staffs = sorrtStaffByDate('', members);
				yield put(actions.membersLoaded(members));
				const isDeskTop = api_constants.isDesktopOrLaptop;
				const num = isDeskTop ? 7 : 5;
				yield put(actions.setDisplayedMembers(members.slice(slideIndex * 5, slideIndex * 5 + 5)));
				yield put(actions.getBlockTime());
				// yield put(actions.loadAppointmentByMembers());
				// yield put(updateNextStaffSuccess(members));
			}
		} catch (err) {
			// yield put(memberLoadingError(err));
		}
	});
}

/* **************************** Subroutines ******************************** */

export function* selectDayAndWeek(action) {
	yield put(actions.selectDay(action.day));
	yield put(actions.selectWeek(action.day));
	setTimeout(() => {
		const x = document.getElementsByClassName('fc-now-indicator fc-now-indicator-arrow');
		for (let i = 0; i < x.length; i++) {
			x[i].scrollIntoView();
		}
	}, 300);
}

export function* getDisplayedMembers() {
	yield put(actions.loadAppointmentByMembers());
}

/* ************************************************************************* */
/* ****************************** WATCHERS ********************************* */
/* ************************************************************************* */

export function* selectDayOnCalendar() {
	yield takeLatest(constants.SELECT_DAY_CALENDAR, selectDayAndWeek);
}

export function* EditBlockTime() {
	yield takeLatest(constants.SUBMIT_EDIT_BLOCKTIME, SubmitEditBlockTime_Saga);
}

export function* membersData() {
	yield takeLatest(constants.LOAD_MEMBERS, getMembers);
}

export function* reloadStaffWatch() {
	yield takeLatest(constants.RELOAD_STAFF, reloadStaffSaga);
}

export function* reloadCalendarWatch() {
	yield takeLatest(constants.RELOAD_CALENDAR, reloadCalendarSaga);
}

export function* waitingAppointmentsData() {
	yield takeLatest(constants.LOAD_WAITING_APPOINTMENT, getWaitingAppointments);
}

export function* appointmentsByMembersData() {
	yield takeLatest(constants.LOAD_APPOINTMENTS_BY_MEMBERS, getAppointmentsByMembersAndDate);

	yield takeLatest(constants.SELECT_DAY, getMembers);

	yield takeLatest(constants.UPDATE_CALENDAR_INTERVAL, getAppointmentsByMembersAndDate);
}

export function* renderAppointmentSaga() {
	yield takeLatest(constants.RENDER_APPOINTMEMT, getAppointmentAfterSlide);
}

export function* assignAppointmentData() {
	yield takeLatest(constants.ASSIGN_APPOINTMENT, assignAppointment);
}

export function* moveAppointmentData() {
	yield takeLatest(constants.MOVE_APPOINTMENT, moveAppointment);
}

export function* putBackAppointmentData() {
	yield takeLatest(constants.PUT_BACK_APPOINTMENT, putBackAppointment);
}

export function* cancelAppointmentData() {
	yield takeLatest(constants.CANCEL_APPOINTMENT, cancelAppointment);
}

export function* updateAppointmentStatus() {
	yield takeLatest(constants.UPDATE_APPOINTMENT_STATUS, upddateAppointment);
}
export function* add_Customer() {
	yield takeLatest(constants.ADD_CUSTOMER, addNewCustomer);
}
export function* check_Phone() {
	yield takeLatest(constants.CHECK_PHONE_ADD_CUSTOMER, checkPhoneCustomer);
}
export function* deleteEvent_WaitingList() {
	yield takeLatest(constants.DELETE_EVENT_WAITINGLIST, deleteEventInWaitingList);
}
export function* change_time_appointment() {
	yield takeLatest(constants.CHANGE_APPOINTMENT_TIME, changeTimeAppointment);
}

export function* delete_BlockTime() {
	yield takeLatest(constants.DELETE_BLOCKTIME, deleteBlockTime_Saga);
}
export function* getBlockTime_() {
	yield takeLatest(constants.GET_BLOCKTIME, getBlockTimeSaga);
}

export function* watch_getAppointmentById() {
	yield takeLatest(constants.GET_APP_BY_ID, getAppointmentByIdSaga);
}

export function* watch_getTimeStaffLogin() {
	yield takeLatest(constants.GET_TIME_STAFF_LOGIN, getTimeStaffLoginSaga);
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
		fork(EditBlockTime),
		fork(delete_BlockTime),
		fork(getBlockTime_),
		fork(watch_getAppointmentById),
		fork(watch_getTimeStaffLogin),
		fork(reloadStaffWatch),
		fork(reloadCalendarWatch),
		fork(updateNextStaff_Saga)
	]);
}
