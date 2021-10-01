import { delay } from 'redux-saga';
import { fork, put, takeLatest, all, select } from 'redux-saga/effects';
import moment from 'moment';
import moment_tz from 'moment-timezone';
import { api, scrollToNow } from '../../utils/helper';
import * as constants from './constants';
import * as actions from './actions';
import * as api_constants from '../../../app-constants';

import {
	makeCurrentDay,
	makeSelectDisplayedMembers,
	makeSelectFCEvent,
	makeInfoCheckPhone,
	makeSlideIndex,
	makeMerchantInfo,
	makeAppointmentScroll,
	makeAppointmentAnyStaff,
	makeQtyResource,
	makeResourceWidth,
	makeFirstReload,
	makeBlockTime
} from './selectors';

import { token, merchantId } from '../../../app-constants';

import {
	addBlockCalendar,
	checkTimeToAddAppointmdent,
	totalDuationChangeTime,
	dataUpdateAppointment,
	totalDurationAssignAppointment,
	dataChangeTimeAppointment,
	statusConvertData,
	appointmentAdapter,
	memberAdapter,
	addLastStaff,
	new_total_duration,
	checkMerchantWorking,
	blockTempFrontEnd,
	blockTemp,
	convertStatus,
	reduceServices
} from './utilSaga';


import { addEventsToCalendar, deleteEventFromCalendar } from '../../components/Calendar/constants';

/********************************* GET STAFF LIST *********************************/
export function* getMembers() {
	try {
		let qtyResources = yield select(makeQtyResource());
		qtyResources = parseInt(qtyResources);
		const requestURL = new URL(`${api_constants.GET_MEMBER}`);
		const currentDate = yield select(makeCurrentDay());
		const url = `${requestURL.toString()}${currentDate.format('YYYY-MM-DD')}`;
		const resp = yield api(url, '', 'GET', token);

		if (resp.codeStatus !== 1) {
			console.log(resp.message);
			console.log('error from api ' + url);
			return;
		}

		if (resp.codeStatus === 1) {
			const members = resp.data
				? resp.data.map((member) => memberAdapter(member)).filter((mem) => mem.isDisabled === 0)
				: [];
			if (members.length > 0) {
				const lastStaff = addLastStaff(members);
				members.push(lastStaff);
			}

			const slideIndex = yield select(makeSlideIndex());
			localStorage.setItem('staffList', JSON.stringify(members));
			yield put(actions.membersLoaded(members));
			yield put(actions.setDisplayedMembers(members.slice(slideIndex * qtyResources, slideIndex * qtyResources + qtyResources)));
			yield put(actions.getBlockTime());
		}
	} catch (err) {
		yield put(actions.memberLoadingError(err));
	}
}


function* checkResponse(response) {
	alert(response.message);
	yield put(actions.loadMembers());
	yield put(actions.loadWaitingAppointments());
	yield put(actions.loadAppointmentByMembers());
	return;
}

/********************************* GET WAITING APPOINTMENT LIST *********************************/
export function* getWaitingAppointments() {
	try {
		yield put(actions.loadingWaiting(true));
		const requestURL = new URL(api_constants.GET_APPOINTMENT_STATUS);
		const url = `${requestURL.toString()}&waitingTime=${false}`;

		const response = yield api(url.toString(), '', 'GET', token);
		if (response.codeStatus !== 1) {
			console.log(response.message);
			yield put(actions.loadingWaiting(false));
			return;
		}

		yield put(actions.loadingWaiting(false));

		const appointments = response && response.data.map((appointment) => appointmentAdapter(appointment));

		localStorage.setItem('AppointmentWaiting', JSON.stringify(appointments));

		yield put(actions.waitingAppointmentsLoaded(appointments));
	} catch (err) {
		yield put(actions.loadingWaiting(false));
		yield put(actions.waitingAppointmentLoadingError(err));
	}
}

/********************************* RENDER APPOINTMENT IN CALENDAR *********************************/
export function* reRenderAppointment() {
	try {
		const displayedMembers = yield select(makeSelectDisplayedMembers());
		const currentDate = yield select(makeCurrentDay());
		const appointmentScroll = yield select(makeAppointmentScroll());
		const isFirstLoadCalendar = yield select(makeFirstReload());
		const resourceWidth = yield select(makeResourceWidth());

		const blockTimes = yield select(makeBlockTime());

		const appointmentsMembers = displayedMembers.map((member) => ({
			memberId: member.id,
			appointments: blockTimes.filter(
				(block) =>
					block.staffId === member.id &&
					block.status !== 'cancel' &&
					block.status !== 'waiting' &&
					block.status !== undefined
			).map(block => blockTemp(
				block.staffId,
				block.blockTimeStart,
				block.blockTimeEnd,
				block.note,
				block.appointmentId,
				convertStatus(block.status),
				block.blockTimeId,
				block.isVip,
				block.isWarning,
				block.isFavorite,
			))
		}));

		addBlockCalendar(appointmentsMembers, displayedMembers, currentDate);
		yield put(actions.appointmentByMembersLoaded(appointmentsMembers));

		addEventsToCalendar(currentDate, appointmentsMembers);

		if (isFirstLoadCalendar) {
			yield* reRenderAnyStaffColumn(resourceWidth);
		}

		if (appointmentScroll && appointmentScroll !== '') {
			yield put({ type: 'START_SCROLL_TO_APPOINTMENT', isScrollToAppointment: true });
		}

		const scrollNow = JSON.parse(localStorage.getItem('scrollNow'));
		if (scrollNow) {
			scrollToNow();
			yield delay(500);
			localStorage.removeItem('scrollNow')
		}
	} catch (err) {
		yield put(actions.appointmentByMemberLoadingError(err));
	}
}

const columnWidth = `calc((100vw - 5.05rem - 2px) / 10)`;

function* reRenderAnyStaffColumn(resourceWidth) {

	let tempNumber = parseInt(resourceWidth) - 7;
	let width = `calc(${columnWidth} * ${tempNumber} - 1px)`;

	const ths = document.querySelectorAll(".fc-bg table tbody tr td");
	ths[1].style.width = width;
	const tds = document.querySelectorAll(".fc-body .fc-time-grid .fc-content-skeleton table tbody tr td");
	tds[1].style.width = width;

	yield put({ type: 'FIRST_LOAD_CALENDAR', payload: false });
}

/********************************* MOVE APPOINTMENT *********************************/
export function* moveAppointment(action) {
	const displayedMembers = yield select(makeSelectDisplayedMembers());

	const blockTimes = yield select(makeBlockTime());

	const assignedMember = displayedMembers[action.newPositionIndex - 1];

	const movedAppointment = blockTimes.find((app) => app.appointmentId === action.appointmentId);
	if (!movedAppointment) return;

	let new_endTime = moment(action.newEndTime);

	if (action.appointment.status.toString().includes('BLOCK_TEMP')) {
		yield put(
			actions.editBlockTime({
				start: moment(action.newTime).format('hh:mm A'),
				end: `${moment(new_endTime).format('hh:mm A')}`,
				note: action.appointment.code,
				id: action.appointment.blockId,
				staffId: assignedMember ? assignedMember.id : 0
			})
		);
		return;
	}

}

/********************************* ASSIGN APPOINTMENT FROM WAITING LIST TO CALENDAR *********************************/
export function* assignAppointment(action) {
	const displayedMembers = yield select(makeSelectDisplayedMembers());
	const currentDate = yield select(makeCurrentDay());

	const assignedMember = displayedMembers[action.resourceId];
	const appointment = {
		...action.eventData,
		memberId: assignedMember.id
	};

	try {
		yield put(actions.removeAppointmentWaiting(appointment));
		const { memberId, start, status, options, products, extras, giftCards } = appointment;
		options.forEach((sv) => {
			sv.staffId = assignedMember ? assignedMember.id : 0;
		});
		let duration_total = totalDurationAssignAppointment(extras, appointment);

		let new_end_time = duration_total > 0
			? moment(start).add(duration_total, 'minutes').format().substr(0, 19)
			: moment(start).add(15, 'minutes').format().substr(0, 19);

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

		const tempBlock = blockTempFrontEnd(appointment, new_end_time, currentDate);
		yield put(actions.addBlockTempFrontEnd(tempBlock));
		yield put(actions.renderAppointment());

		const services = reduceServices(options, start, extras);

		let data = {
			staffId: memberId,
			fromTime: start,
			toTime:
				duration_total > 0
					? moment(start).add(duration_total, 'minutes').format().substr(0, 19)
					: moment(start).add(15, 'minutes').format().substr(0, 19),
			status: statusConvertData[status],
			services,
			products,
			extras,
			giftCards,
			isWaiting: true
		};

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

/********************************* UPDATE STATUS APPOINTMENY CONFIRM, CHECK IN, CANCEL *********************************/
export function* upddateAppointment(action) {
	try {
		const fcEvent = yield select(makeSelectFCEvent());

		if (!fcEvent) {
			yield put(actions.appointmentUpdatingStatusError('Cannot find selected fcEvent'));
		}
		let {
			appointment,
			status,
			servicesUpdate,
			productsUpdate,
			old_status,
			old_appointment,
			extrasUpdate
		} = action.appointment;
		let { end, start, memberId, giftCards } = appointment;
		let newDate = end;

		if (status === 'cancel') {
			yield put(actions.appointmentCanceled(appointment.id));
			deleteEventFromCalendar(fcEvent._id);
			yield put(actions.deselectAppointment());
			yield put(actions.deleteAppointmentCalendar(appointment));
			yield put(actions.renderAppointment());

			const url_update_status = new URL(api_constants.PUT_UPDATE_STATUS_APPOINTMENT);
			const url = `${url_update_status}/${appointment.id}`;
			const kq = yield api(url, { status }, 'PUT', token);

			if (kq.codeStatus !== 1) {
				return yield* checkResponse(kq);
			} else return;
		}

		let data = dataUpdateAppointment(
			old_status,
			memberId,
			old_appointment,
			status,
			start,
			newDate,
			servicesUpdate,
			productsUpdate,
			extrasUpdate,
			giftCards
		);

		yield put(actions.updateAppointmentFrontend({ appointment: data, id: appointment.id }));
		yield put(actions.renderAppointment());

		const requestURL = new URL(api_constants.PUT_STATUS_APPOINTMENT_API);
		const url = `${requestURL}/${appointment.id}`;

		try {
			if (navigator.onLine) {
				const kq = yield api(url, data, 'PUT', token);
				if (kq.codeStatus !== 1) return yield* checkResponse(kq);
			}
		} catch (error) {
			yield put(actions.updateAppointmentFrontend({ appointment: data, id: appointment.id }));
			yield put(actions.renderAppointment());
		}
	} catch (error) {
		// yield put(actions.updateAppointmentError(error));
	}
}

/********************************* CHANGE DURATION, STATUS, STAFF ... OF APPOINTMENT *********************************/
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
			selectedStaff,
			servicesUpdate,
			productsUpdate,
			extrasUpdate
		} = action.appointment;
		const merchantInfo = yield select(makeMerchantInfo());
		const timezone = merchantInfo.timezone;

		let { memberId, start, giftCards } = appointment;

		let totalDuration = totalDuationChangeTime(appointment, extrasUpdate, servicesUpdate);

		const start_time = `${moment(dayPicker).format('YYYY-MM-DD')}T${moment(fromTime).format('HH:mm')}`;
		const end_time =
			totalDuration > 0
				? moment(start_time).add(totalDuration, 'minutes').format('YYYY-MM-DD HH:mm')
				: moment(start_time).add(15, 'minutes').format('YYYY-MM-DD HH:mm');

		let timeNow = timezone ? moment_tz.tz(timezone.substring(12)) : moment();
		let now = `${moment(timeNow).format('YYYY-MM-DD')}T${moment(timeNow).format('HH:mm:ss')}`;

		if (!checkMerchantWorking(merchantInfo, start_time)) {
			alert(`Merchant's not working on your selected date!`);
			return;
		}

		const payload = {
			appointmentEdit: appointment,
			fcEvent,
			start_time,
			end_time,
			memberId,
			options: servicesUpdate,
			products: productsUpdate,
			extras: extrasUpdate,
			start,
			selectedStaff,
			giftCards
		};
		if (
			(memberId === 0 && moment(start_time).format('HH:mm A') !== moment(start).format('HH:mm A')) ||
			(memberId !== 0 && moment(end_time).isBefore(moment(now)))
		) {
			const text =
				memberId === 0
					? 'This Any Staff appointment is set to begin at a different time. Do you want to change original time of appointment?'
					: 'This appointment is set for a time that has already passed. Do you still want to set this appointment at this time?';
			if (window.confirm(text)) {
				yield put(actions.changeAppointment(payload));
			}
		} else {
			yield put(actions.changeAppointment(payload));
		}
	} catch (error) {
		yield put(actions.updateAppointmentError(error));
	}
}

/********************************* CHANGE APPOINTMENT STEP 2 *********************************/
export function* changeAppointmentSaga(action) {
	const displayedMembers = yield select(makeSelectDisplayedMembers());
	const currentDate = yield select(makeCurrentDay());
	// const currentDayName = moment(currentDate).format('dddd');
	let isUpdate = true;

	const {
		appointmentEdit,
		fcEvent,
		start_time,
		end_time,
		memberId,
		options,
		products,
		extras,
		start,
		selectedStaff,
		giftCards
	} = action.payload;
	let appointment = {
		...JSON.parse(JSON.stringify(appointmentEdit)),
		memberId: options.length > 0 ? options[0].staffId : 0
	};

	let statusChange = 'confirm';

	if (memberId !== 0) {
		let diff_time = moment(start_time).diff(moment(start), 'minutes');
		if ((diff_time < 45 && diff_time >= 0) || (diff_time < 0 && diff_time > -45)) {
			statusChange = 'checkin';
		}
	}

	let data = dataChangeTimeAppointment(
		selectedStaff,
		start_time,
		end_time,
		appointment,
		statusChange,
		options,
		products,
		extras,
		giftCards,
		memberId
	);

	const staff = displayedMembers.find((s) => s.id === data.staffId);

	/* check condition update to grey block */
	const _duration = new_total_duration(data.services, data.extras, appointment, memberId);
	let toTime = moment(data.fromTime).add(_duration, 'minutes');
	toTime = `${moment(toTime).format('YYYY-MM-DD')}T${moment(toTime).format('HH:mm')}`;
	const currentDayName = moment(data.fromTime).format('dddd');

	if (staff) {
		const timeWorking = Object.entries(staff.workingTimes).find((b) => b[0] === currentDayName);

		const timeEnd = `${moment(currentDate).day(currentDayName).format('YYYY-MM-DD')}T${moment(
			timeWorking[1].timeEnd,
			['h:mm A']
		).format('HH:mm:ss')}`;

		const timeStart = `${moment(currentDate).day(currentDayName).format('YYYY-MM-DD')}T${moment(
			timeWorking[1].timeStart,
			['h:mm A']
		).format('HH:mm:ss')}`;

		if (
			(moment(toTime).isSameOrAfter(timeEnd) || moment(data.fromTime).isBefore(timeStart)) &&
			moment(toTime).format('MM/DD/YYYY') == moment().format('MM/DD/YYYY')
		) {
			if (window.confirm('Accept this appointment outside of business hours?')) {
				isUpdate = true;
			} else {
				isUpdate = false;
			}
		} else {
			if (window.confirm('Accept changes?')) {
				isUpdate = true;
			} else {
				isUpdate = false;
			}
		}
	}
	/* end check condition */

	if (isUpdate) {
		yield put(actions.appointmentCanceled(appointmentEdit.id));
		deleteEventFromCalendar(fcEvent._id);
		yield put(actions.deselectAppointment());

		try {
			if (navigator.onLine) {
				const requestURL = new URL(api_constants.PUT_STATUS_APPOINTMENT_API);
				const url = `${requestURL.toString()}/${appointment.id}`;
				const response = yield api(url, data, 'PUT', token);
				if (response.codeStatus !== 1) {
					return yield* checkResponse(response);
				}
				if (response.codeStatus === 1) {
				}
			}
		} catch (err) {

		}
	}
}

/********************************* ADD NEW CUSTOMER *********************************/
export function* addNewCustomer(action) {
	try {
		const {
			first_name,
			last_name,
			phone,
			staffID,
			time,
			refPhone,
			note,
			email,
			referedBy,
			dataAnyStaff,
			isSendLink
		} = action.customer;
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
		const infoUser = yield select(makeInfoCheckPhone());
		let customerId;
		let user_Id;
		if (infoUser === '') {
			const data = {
				FirstName: first_name,
				LastName: last_name,
				Email: email,
				Phone: phone,
				referrerPhone: refPhone ? '+' + refPhone : '',
				favourite: note,
				ReferrerBy: referedBy
			};
			const response = yield api(new URL(api_constants.POST_ADD_CUSTOMER), data, 'POST', token);
			if (parseInt(response.codeStatus) != 1) {
				alert(response.message);
				return;
			}
			customerId = response.data.customerId;
			user_Id = response.data.userId;
		} else {
			customerId = infoUser.customerId;
			user_Id = infoUser.userId;
		}

		if (isSendLink && parseInt(user_Id) === 0) {
			yield put(actions.sendLinkCustomer({ phone }));
		}

		const data = {
			staffId: staffID ? staffID : 0,
			customerId,
			merchantId: merchantId,
			userId: user_Id,
			status: !dataAnyStaff ? (time ? 'confirm' : 'waiting') : 'confirm',
			services: [],
			products: [],
			extras: [],
			fromTime: time ? moment(new Date(time)).format('YYYY-MM-DD HH:mm') : checkTimeToAddAppointmdent(),
			toTime: time
				? moment(new Date(time)).add(15, 'minutes').format('YYYY-MM-DD HH:mm')
				: moment(checkTimeToAddAppointmdent()).add(15, 'minutes').format('YYYY-MM-DD HH:mm'),
			time,
			staffID,
			dataAnyStaff,
			user_Id
		};

		yield put(actions.submitAddAppointment(data));
	} catch (error) {
		yield put(actions.addCustomerError(error));
	}
}

/********************************* ADD APPOINTMENT *********************************/
function* addAppointmentSaga() {
	yield takeLatest(constants.SUBMIT_ADD_APPOINTMENT, function* (action) {
		try {
			const data = action.payload;
			const { time, staffID, dataAnyStaff } = data;

			const response = yield api(new URL(api_constants.POST_ADD_APPOINTMENT).toString(), data, 'POST', token);

			if (response.codeStatus === 1) {
				let appointmentId = response.data;
				let dataPush = '';

				if (dataAnyStaff) {
					dataPush = JSON.stringify({
						appointmentId,
						dataAnyStaff,
						action: 'addGroupAnyStaff'
					});
				} else {
					dataPush = JSON.stringify({
						appointmentId,
						staffId: data.staffId,
						action: 'signinAppointment'
					});
				}

				window.postMessage(dataPush);

				delay(2000);
				yield put(actions.TimeAndStaffID(''));
			} else {
				alert(response.message);
			}
		} catch (err) {
			console.log({ err });
			// yield put(memberLoadingError(err));
		}
	});
}

/********************************* SEARCH PHONE CUSTOMER *********************************/
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
			}
		} else {
			yield put(actions.checkPhoneNumberCustomerSuccess(true));
		}
	} catch (error) {
		yield put(actions.checkPhoneNumberCustomerError(error));
	}
}

/********************************* SEND LINK CUSTOMER *********************************/
export function* sendLinkCustomerSaga(action) {
	try {
		const { phone } = action.payload;
		let phoneUpdate = phone.toString().replace('+', '');
		const requestURL = new URL(api_constants.GET_SENDLINK_CUSTOMER);
		const url = `${requestURL.toString()}${phoneUpdate}`;
		const result = yield api(url, '', 'GET', token);
		if (result.codeStatus !== 1) {
			alert(response.message);
		}
	} catch (error) {
		console.log({ error });
	}
}

export function* getDetailMerchantSaga(action) {
	try {
		// const currentDay = yield select(makeCurrentDay());
		const requestURL = new URL(api_constants.GET_DETAIL_MERCHANT);
		const url = `${requestURL.toString()}/${merchantId}`;
		const response = yield api(url, '', 'GET', token);

		if (parseInt(response.codeNumber) === 200) {
			let infoMerchant = { ...response.data };
			if (response.data.timezone === "null") {
				infoMerchant.timezone = null;
			}
			yield put(actions.setDetailMerchant(infoMerchant));
			const isLoadData = action.payload && action.payload.isLoadData ? action.payload.isLoadData : '';
			const isFirstLoad = action.payload && action.payload.isFirstLoad ? action.payload.isFirstLoad : '';

			if (isFirstLoad) {
				const { timezone } = response.data;
				let timeNow = timezone && timezone !== "null" ? moment_tz.tz(timezone.substring(12)) : moment();
				let day = `${moment(timeNow).format("DDMMYYYY")}`;

				const dateCalendar = JSON.parse(localStorage.getItem('date'));
				if (dateCalendar) {
					day = moment(dateCalendar, ['YYYY-MM-DD']).format('DDMMYYYY');
					setTimeout(() => {
						localStorage.removeItem('date');
					}, 500);
				}

				yield put(actions.selectDay(day));
				yield put(actions.setToday(day));
				yield put(actions.selectWeek(day));

				if (!dateCalendar) {
					localStorage.setItem('scrollNow', true);
				}

			}
			if (isLoadData) {
				yield put(actions.updateNextStaff({ isReloadCalendar: true }))
			}
		}
	} catch (error) {
		console.log({ error })
	}
}

/********************************* CANCEL APPONTMENT IN WAITING LIST *********************************/
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
		yield put(actions.loadingCalendar(true));
		const requestURL = new URL(api_constants.PUT_STATUS_APPOINTMENT_API);
		const url = `${requestURL.toString()}/${appointment.id}`;
		const response = yield api(url, data, 'PUT', token);
		if (response.codeStatus !== 1) return yield* checkResponse(response);
		if (response.codeStatus === 1) {
			return;
		}
	} catch (error) {
		yield put(actions.removeAppointmentWaiting({ ...appointment, status: 'cancel' }));
	}
}

/********************************* ADD BLOCK TIME *********************************/
export function* addBlockTime(action) {
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
			// yield put(actions.loadMembers());
			return;
		}
	} catch (error) { }
}

/********************************* EDIT BLOCK TIME *********************************/
export function* editBlockTime(action) {
	try {
		const { payload } = action;
		const { staff, start, end, note, id, staffId } = payload;
		const currentDate = yield select(makeCurrentDay());
		let apiDateQuery = currentDate.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');
		const requestURL = new URL(`${api_constants.EDIT_BLOCKTIME_API}/${id}`);
		const dataSubmit = {
			workingDate: apiDateQuery,
			blockTimeStart: start,
			blockTimeEnd: end,
			note: note,
			staffId
		};

		const response = yield api(requestURL.toString(), dataSubmit, 'PUT', token);
		if (response.codeStatus !== 1) {
			alert(response.message);
			return yield* checkResponse(response);
		}
	} catch (error) { }
}

/********************************* DELETE BLOCK TIME *********************************/
export function* deleteBlockTime_Saga(action) {
	try {
		const { block, staff } = action.data;
		const requestURL = new URL(`${api_constants.DELETE_BLOCKTIME_API}/${block.blockTimeId}`);
		const response = yield api(requestURL.toString(), '', 'DELETE', token);
		if (response.codeStatus === 1) {
			// yield put(actions.loadMembers());
			yield put(actions.deleteBlockTimeSuccess({ staff, block }));
		}
	} catch (error) { }
}

function updateWorkingTimeToday() {
	let calendarOptions = $('#full-calendar')
		.fullCalendar('getView')
		.options;

	$('#full-calendar')
		.fullCalendar('destroy');

	$('#full-calendar')
		.fullCalendar(calendarOptions);
}

/********************************* GET BLOCK TIME LIST IN CALENDAR *********************************/
export function* getBlockTimeSaga() {
	try {
		yield put(actions.loadingCalendar(true));
		const currentDate = yield select(makeCurrentDay());
		const count = yield select(makeAppointmentAnyStaff());
		const isFirstLoadCalendar = yield select(makeFirstReload());
		let apiDateQuery = currentDate.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');
		const requestURL = new URL(`${api_constants.GET_WORKINGTIME_MERCHANT}${apiDateQuery}`);
		const response = yield api(requestURL.toString(), '', 'GET', token);

		if (response.codeStatus === 1) {
			if (isFirstLoadCalendar) {
				if (count < 4) {
					updateWorkingTimeToday();
					yield put({ type: 'UPDATE_RESOURCE_WIDTH', payload: 8 });
					yield put({ type: 'UPDATE_QUANTITY_RESOURCE', payload: 8 });
					yield put({ type: 'SET_VISIBLE_CAROUSEL', payload: true });
				} else if (count >= 4 && count < 8) {
					yield* increaseResource(8, 8);
				}
				else if (count >= 8 && count < 12) {
					yield* increaseResource(9, 7);
				}
				else if (count >= 12) {
					yield* increaseResource(10, 6);
				}
			}

			const payload = response.data.map(block => ({
				...block,
				blockTimeStart: `${moment(currentDate).format('YYYY-MM-DD')}T${moment(block.blockTimeStart, [
					'h:mm A'
				]).format('HH:mm:ss')}`,
				blockTimeEnd: `${moment(currentDate).format('YYYY-MM-DD')}T${moment(block.blockTimeEnd, [
					'h:mm A'
				]).format('HH:mm:ss')}`,
			}));

			yield put(actions.getBlockTime_Success(payload));
			yield put(actions.renderAppointment());
			const app = JSON.parse(localStorage.getItem('appointmentExpand'));
			if (app) {
				setTimeout(() => {
					verticalScrollToAppointment(app.AppointmentId);
					setTimeout(() => {
						localStorage.removeItem('appointmentExpand');
					}, 1500);
				}, 1500);
			}
			return;
		}
	} catch (error) { }
	finally {
		yield put(actions.loadingCalendar(false));
	}
}

function verticalScrollToAppointment(appointmentId) {
	var els = document.getElementsByClassName("apppointment-calendar");
	Array.prototype.forEach.call(els, function (el) {
		let text = el.outerText;
		if (text.toString().includes(appointmentId.toString())) {
			el.scrollIntoView();
		}
	});
}
/********************************* GET DETAIL APPOINTMENT *********************************/
export function* getAppointmentByIdSaga(action) {
	try {
		yield put(actions.loadingCalendar(true));
		const { appointment } = action.data;
		const { id, end, appointmentId } = appointment;
		let _id = appointmentId ? appointmentId : id;
		const requestURL = new URL(`${api_constants.GET_APPOINTMENT_ID}/${_id}`);
		const response = yield api(requestURL.toString(), '', 'GET', token);

		if (response.codeStatus === 1) {
			let _data = { ...response.data, toTime: end };
			yield put({ type: 'GET_APP_BY_ID_SUCCESS', data: _data });
			yield put(actions.selectAppointment(appointmentAdapter(_data), event));
			return;
		}
		if (response.codeStatus !== 1) {
			alert(response.message);
			return;
		}
	} catch (err) {

	} finally {
		yield put(actions.loadingCalendar(false));
	}
}

/********************************* GET TIME STAFF LOGIN *********************************/
export function* getTimeStaffLoginSaga(action) {
	try {
		const { staffId } = action;
		const requestURL = new URL(`${api_constants.API_GET_TIME_STAFF_LOGIN}/${staffId}`);
		const response = yield api(requestURL.toString(), '', 'GET', token);

		if (response.codeStatus === 1) {
			yield put({ type: 'GET_TIME_STAFF_LOGIN_SUCCESS', data: { timeLogin: response.data, staffId } });
		}
		if (response.codeStatus !== 1) {
			alert('error from ' + api_constants.API_GET_TIME_STAFF_LOGIN);
			return;
		}
	} catch (err) { }
}

/********************************* RELOAD STAFF & GET BLOCK TIME *********************************/
function* updateNextStaff_Saga() {
	yield takeLatest(constants.UPDATE_NEXT_STAFF, function* (action) {
		try {
			let qtyResources = yield select(makeQtyResource());
			qtyResources = parseInt(qtyResources);
			const { isReloadCalendar } = action.payload;
			const requestURL = new URL(`${api_constants.GET_MEMBER}`);
			const currentDate = yield select(makeCurrentDay());
			const url = `${requestURL.toString()}${currentDate.format('YYYY-MM-DD')}`;

			const response = yield api(url, '', 'GET', token);
			if (response.codeStatus === 1) {
				const members = response.data
					? response.data.map((member) => memberAdapter(member)).filter((mem) => mem.isDisabled === 0)
					: [];

				const lastStaff = addLastStaff(members);
				members.push(lastStaff);
				const slideIndex = yield select(makeSlideIndex());
				yield put(actions.membersLoaded(members));
				yield put(actions.setDisplayedMembers(members.slice(slideIndex * qtyResources, slideIndex * qtyResources + qtyResources)));

				if (isReloadCalendar)
					yield put(actions.getBlockTime());
				else yield put(actions.getBlockTime());

			}
		} catch (err) {
		}
	});
}

/********************************* ADD NOTE APPOINTMENT *********************************/
export function* updateNote_Saga(action) {
	try {
		const { notes, idAppointment } = action.payload;
		const requestURL = new URL(`${api_constants.PUT_UPDATE_NOTE}/${idAppointment}`);
		const data = {
			notes
		};

		const response = yield api(requestURL.toString(), data, 'PUT', token);

		if (response.codeStatus === 1) {
		}
		if (response.codeStatus !== 1) {
			return yield* checkResponse(response);
		}
	} catch (err) { }
}

/********************************* SEARCH PHONE COMPANION *********************************/
export function* searchPhoneCompanion_Saga(action) {
	try {
		const { data, resolve } = action.payload;
		const { phone } = data;
		const requestURL = new URL(api_constants.GET_BY_PHONE);
		const url = `${requestURL.toString()}/${phone}`;

		const response = yield api(url, '', 'GET', token);
		if (response.codeStatus === 1) {
			const { firstName, lastName } = response.data;
			resolve({ success: true, data: `${firstName} ${lastName}` });
		}
		if (response.codeStatus !== 1) {
			resolve({ success: false });
		}
	} catch (err) { }
}

/********************************* UPDATE COMPANION *********************************/
export function* updateCompanion_Saga(action) {
	try {
		const { data, resolve } = action.payload;
		const { companionName, companionPhone, id } = data;
		const requestURL = new URL(`${api_constants.PUT_UPDATE_COMPANION}/${id}`);
		const body = {
			companionName,
			companionPhone
		};
		const response = yield api(requestURL.toString(), body, 'PUT', token);
		if (response.codeStatus === 1) {
		}
		resolve({ success: true });
		if (response.codeStatus !== 1) {
			resolve({ success: true });
			return yield* checkResponse(response);
		}
	} catch (err) { }
}

function mapServiceEditPaid(service) {
	return {
		bookingServiceId: service.bookingServiceId,
		staffId: service.staffId,
		tipAmount: parseFloat(service.tipAmount)
	};
}

export function* updateStaffAppointmentPaid(action) {
	try {
		let { appointment, services } = action.payload;
		const { id } = appointment;
		const requestURL = new URL(`${api_constants.UPDATE_STAFF_APPOINTMENT_PAID}/${id}`);
		services = services.map((obj) => mapServiceEditPaid(obj));
		const body = { services };
		const response = yield api(requestURL.toString(), body, 'PUT', token);
		if (response.codeStatus === 1) {
		} else {
			alert(response.message);
		}
	} catch (err) { }
}

export function* searchCustomerBox(action) {
	try {
		const requestURL = new URL(`${api_constants.SEARCH_CUSTOMER_BOX}${action.payload.data}`);
		const response = yield api(requestURL.toString(), '', 'GET', token);
		if (response.codeNumber == 200) {
			yield put({ type: 'SET_APPOINTMENT_SEARCH_BOX', data: response.data });
			action.payload.cb();
		} else {
			alert(response.message);
		}
	} catch (err) { }
}

export function* countNotificationUnread(action) {
	try {
		const requestURL = new URL(`${api_constants.NOTIFICATION_COUNT_UNREAD}`);
		const response = yield api(requestURL.toString(), '', 'GET', token);
		if (response.codeNumber == 200) {
			yield put({ type: 'SET_COUNT_NOTIFICATION_UNREAD', payload: response.data });
		} else {
			alert(response.message);
		}
	} catch (err) { }
}

export function* getNotification(action) {
	try {
		const requestURL = new URL(`${api_constants.NOTIFICATION_GET_BY_PAGE}?page=${action.payload.page}&row=10`);
		const response = yield api(requestURL.toString(), '', 'GET', token);

		if (response.codeNumber == 200) {
			if (response.data.length > 0) {
				yield put({
					type: 'SET_NOTIFICATION',
					payload: response.data,
					page: action.payload.page
				});
				if (action.payload.cb) {
					action.payload.cb(true);
				}
			}
		} else {
			alert(response.message);
		}
	} catch (err) { }
}

export function* readNotification(action) {
	try {
		const requestURL = new URL(`${api_constants.NOTIFICATION_MASK_READ}/${action.payload}`);;
		const response = yield api(requestURL.toString(), '', 'PUT', token);
		if (response.codeNumber == 200) {
			yield put({ type: 'COUNT_NOTIFICATION_UNREAD' });
		}
	} catch (err) { }
}

export function* getAppointmentAnyStaff(action) {
	try {
		const { date } = action;
		const requestURL = new URL(`${api_constants.COUNT_APPOINTMENT_ANY_STAFF}/${date}`);
		const response = yield api(requestURL.toString(), '', 'GET', token);
		if (response.codeNumber == 200) {
			yield put({ type: 'SET_APPOINTMENT_ANY_STAFF', payload: response.data });
			yield put({ type: 'GET_DETAIL_MERCHANT', payload: { isFirstLoad: true } })
			if (parseInt(response.data) >= 4) {
				localStorage.setItem('scrollNow', true);
			}
		} else {
			alert(response.message)
		}
	} catch (err) { }
}

export function* countAppointmentAnyStaff(action) {
	try {
		const { date, appointment, fromTime, isDayClick } = action.payload;
		const appointmentAnyStaff = yield select(makeAppointmentAnyStaff());
		const currentDay = yield select(makeCurrentDay());

		if (
			moment(currentDay).format('YYYY-MM-DD') == moment(fromTime).format('YYYY-MM-DD') ||
			isDayClick == true
		) {
			const requestURL = new URL(`${api_constants.COUNT_APPOINTMENT_ANY_STAFF}/${date}`);
			const response = yield api(requestURL.toString(), '', 'GET', token);

			if (response.codeNumber == 200) {
				const count = response.data;
				if (parseInt(appointmentAnyStaff) < 4) {
					if (count >= 4) {
						reloadWeb(date, appointment);
						return;
					}
				} else if (parseInt(appointmentAnyStaff) >= 4 && parseInt(appointmentAnyStaff) < 8) {
					if (count >= 8) {
						reloadWeb(date, appointment);
						return;
					} else if (count < 4) {
						reloadWeb(date, appointment);
						return;
					} else if (isDayClick) {
						yield put(actions.firstReload(true));
					}
				} else if (parseInt(appointmentAnyStaff) >= 8 && parseInt(appointmentAnyStaff) < 12) {
					if (count >= 12) {
						reloadWeb(date, appointment);
						return;
					} else if (count < 8) {
						reloadWeb(date, appointment);
						return;
					} else if (isDayClick) {
						yield put(actions.firstReload(true));
					}
				} else if (parseInt(appointmentAnyStaff) === 12) {
					if (count < 12) {
						reloadWeb(date, appointment);
						return;
					} else if (isDayClick) {
						yield put(actions.firstReload(true));
					}
				}
				else if (parseInt(appointmentAnyStaff) === 8) {
					if (count < 8) {
						reloadWeb(date, appointment);
						return;
					} else if (isDayClick) {
						yield put(actions.firstReload(true));
					}
				}

				yield put({ type: 'SET_APPOINTMENT_ANY_STAFF', payload: response.data });
				if (isDayClick) {
					const day = moment(date, ['YYYY-MM-DD']).format('DDMMYYYY');
					yield put(actions.selectDay(day));
				}

			} else {
				alert(response.message)
			}
		}

	} catch (err) { }
}

const reloadWeb = (date, appointment) => {
	localStorage.setItem('date', JSON.stringify(date));
	if (appointment) {
		if (appointment.StaffId == 0) {
			localStorage.setItem('appointmentExpand', JSON.stringify(appointment));
		} else {
			localStorage.setItem('appointmentAssignStaff', JSON.stringify(appointment));
		}
	}
	setTimeout(() => {
		window.location.reload();
	}, 1000);
}

function* increaseResource(resourceWidth, qtyResource) {

	yield put({ type: 'UPDATE_RESOURCE_WIDTH', payload: resourceWidth + 1 });

	var calendarOptions = $('#full-calendar')
		.fullCalendar('getView')
		.options;

	let arrTempResouces = [];

	for (let i = 0; i < parseInt(qtyResource); i++) {
		const tempStaff = { id: i };
		arrTempResouces.push(tempStaff);
	}
	calendarOptions.resources = arrTempResouces;

	$('#full-calendar')
		.fullCalendar('destroy');

	$('#full-calendar')
		.fullCalendar(calendarOptions);

	yield put({ type: 'UPDATE_QUANTITY_RESOURCE', payload: qtyResource - 1 });
	yield put({ type: 'SET_VISIBLE_CAROUSEL', payload: true });

}

/* **************************** Subroutines ******************************** */

export function* selectDayAndWeek(action) {
	yield put(actions.selectDay(action.day));
	yield put(actions.selectWeek(action.day));
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

export function* watch_addBlockTime() {
	yield takeLatest(constants.ADD_BLOCKTIME, addBlockTime);
}

export function* watch_editBlockTime() {
	yield takeLatest(constants.EDIT_BLOCKTIME, editBlockTime);
}

export function* membersData() {
	yield takeLatest(constants.LOAD_MEMBERS, getMembers);
}


export function* waitingAppointmentsData() {
	yield takeLatest(constants.LOAD_WAITING_APPOINTMENT, getWaitingAppointments);
}

export function* appointmentsByMembersData() {

	yield takeLatest(constants.SELECT_DAY, getMembers);

	// yield takeLatest(constants.UPDATE_CALENDAR_INTERVAL, getAppointmentsByMembersAndDate);
}

export function* renderAppointmentSaga() {
	yield takeLatest(constants.RENDER_APPOINTMEMT, reRenderAppointment);
}

export function* assignAppointmentData() {
	yield takeLatest(constants.ASSIGN_APPOINTMENT, assignAppointment);
}

export function* moveAppointmentData() {
	yield takeLatest(constants.MOVE_APPOINTMENT, moveAppointment);
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

export function* watch_changeAppointment() {
	yield takeLatest(constants.CHANGE_APPOINTMENT, changeAppointmentSaga);
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

export function* watch_updateNote() {
	yield takeLatest(constants.UPDATE_NOTE, updateNote_Saga);
}

export function* watch_updateCompanion() {
	yield takeLatest(constants.UPDATE_COMPANION, updateCompanion_Saga);
}

export function* watch_searchPhoneCompanion() {
	yield takeLatest(constants.SEARCH_PHONE_COMPANION, searchPhoneCompanion_Saga);
}

export function* watch_sendLinkCustomer() {
	yield takeLatest(constants.SENDLINK_CUSTOMER, sendLinkCustomerSaga);
}

export function* watch_getDetailMerchan() {
	yield takeLatest(constants.GET_DETAIL_MERCHANT, getDetailMerchantSaga);
}

export function* watch_updateStaffAppointmentPaid() {
	yield takeLatest(constants.UPDATE_STAFF_APPOINTMENT_PAID, updateStaffAppointmentPaid);
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
		fork(updateAppointmentStatus),
		fork(add_Customer),
		fork(check_Phone),
		fork(deleteEvent_WaitingList),
		fork(change_time_appointment),
		fork(watch_addBlockTime),
		fork(delete_BlockTime),
		fork(getBlockTime_),
		fork(watch_getAppointmentById),
		fork(watch_getTimeStaffLogin),
		fork(updateNextStaff_Saga),
		fork(watch_editBlockTime),
		fork(watch_updateNote),
		fork(addAppointmentSaga),
		fork(watch_changeAppointment),
		fork(watch_sendLinkCustomer),
		fork(watch_getDetailMerchan),
		fork(watch_updateCompanion),
		fork(watch_searchPhoneCompanion),
		fork(watch_updateStaffAppointmentPaid),
		takeLatest("SEARCH_CUSTOMER_BOX", searchCustomerBox),
		takeLatest("COUNT_NOTIFICATION_UNREAD", countNotificationUnread),
		takeLatest("GET_NOTIFICATION", getNotification),
		takeLatest("READ_NOTIFICATION", readNotification),
		takeLatest("COUNT_APPOINTMENT_ANY_STAFF", countAppointmentAnyStaff),
		takeLatest("GET_APPOINTMENT_ANY_STAFF", getAppointmentAnyStaff),
	]);
}
