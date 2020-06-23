import $ from 'jquery';
import moment from 'moment';
import { store } from 'app';
import {
	assignAppointment,
	moveAppointment,
	putBackAppointment,
	selectAppointment,
	openAddingAppointment,
	disableCalendar,
	TimeAndStaffID,
	getApppointmentById
} from '../../containers/AppointmentPage/actions';
import { formatPhone } from '../../utils/helper';
import vip from '../../images/vip.png';
import vip_blue from '../../images/vip_blue.png';
import call from '../../images/call.png';

const OPTION_RENDER_TEMPLATE = (option) => `<div class="app-event__option">- ${option.serviceName}</div>`;
const PRODUCT_RENDER_TEMPLATE = (product) => `<div class="app-event__option">- ${product.productName}</div>`;
const EXTRAS_RENDER_TEMPLATE = (extra) => `<div class="app-event__option">- ${extra.extraName}</div>`;

const EVENT_RENDER_TEMPLATE = (event) => `
  <div class="app-event">
    <div class="app-event__id-number">${event.code}</div>
    <div class="app-event__full-name">${event.userFullName}</div>
    <div class="app-event__phone-number">
    ${event.status !== 'BLOCK' && event.status !== 'BLOCK_TEMP'
		? event.status === 'CHECKED_IN' || event.status === 'PAID' || event.status === 'WAITING'
			? "<img class='icon-phone' src='" + call + "' width='17' height='17'>"
			: "<img class='icon-phone2' src='" + call + "' width='17' height='17'>"
		: ''}
    ${formatPhone(event.phoneNumber)}</div>
    ${event.options.map((option) => OPTION_RENDER_TEMPLATE(option)).join('')}
    ${event.products.map((product) => PRODUCT_RENDER_TEMPLATE(product)).join('')}
    ${event.extras.map((extra) => EXTRAS_RENDER_TEMPLATE(extra)).join('')}
  </div>
`;

const resouceDesktop = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }];
const resource = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

export const MAIN_CALENDAR_OPTIONS = {
	header: false,
	defaultView: 'agendaDay',
	groupByResource: true,
	editable: true,
	eventResourceEditable: true,
	droppable: true,
	height: 'parent',
	allDaySlot: false,
	nowIndicator: true,
	selectable: true,
	slotLabelFormat: 'hh:mm A',
	slotDuration: '00:15:00',
	eventOverlap: true,
	minTime: '06:00:00',
	maxTime: '23:00:00',
	timezone: 'local',
	longPressDelay: 200,
	resources: resource,
	schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',

	select: (start, end, event, view, resource) => {
		let check_block_temp = false;

		if (parseInt(resource.id) === 0) {

			const allAppointment = store.getState().getIn(['appointment', 'appointments', 'allAppointment']);
			let count = 0;
			let countAppAnyStaff = 0;

			/* check staff available để add appointment any staff */
			allAppointment.forEach(app => {
				if (
					moment(start).isBefore(moment(app.end)) &&
					moment(start).isSameOrAfter(moment(app.start)) &&
					(app.status === "CHECKED_IN" || app.status === "CONFIRMED" || app.status === "BLOCK_TEMP")
				) {
					count = count + 1
				}

				if (
					moment(start).isBefore(moment(app.end)) &&
					moment(start).isSameOrAfter(moment(app.start)) && (app.memberId === 0)
				) {
					countAppAnyStaff = countAppAnyStaff + 1
				}
			});

			const allMember = store.getState().getIn(['appointment', 'members', 'all']);
			if(count === allMember.length - 1){
				alert('There is no staff available at this time.')
				return;
			}
			

			if (countAppAnyStaff > 0 && countAppAnyStaff >= count && count > 0) {
				alert('There is no staff available at this time.')
			} else {
				const data = {
					fromTime: start,
					toTime: end,
					staffId: 0,
					action: 'addGroupAnyStaff'
				};
				window.postMessage(JSON.stringify(data));
			}
		}

		if (parseInt(resource.id) !== 0) {
			const displayedAppointments = store.getState().getIn(['appointment', 'appointments', 'calendar']);

			const member = displayedAppointments[parseInt(resource.id) - 1];
			if (!member || member.memberId === 0) return;

			member.appointments.forEach((app) => {
				if (
					app.status === 'BLOCK_TEMP' &&
					moment(app.start).isSameOrBefore(moment(start)) &&
					moment(app.end).isAfter(moment(start))
				) {
					check_block_temp = true;
				}
			});

			const displayedMembers = store.getState().getIn(['appointment', 'members', 'displayed']);

			let timeEnd = '';
			let timeStart = '';
			let isCheckWorking = '';

			let currentDay = store.getState().getIn(['appointment', 'currentDay']);
			const staffAvailable = displayedMembers[parseInt(resource.id) - 1]
				? displayedMembers[parseInt(resource.id) - 1]
				: '';
			switch (moment(currentDay).format('dddd')) {
				case 'Monday':
					if (staffAvailable) {
						timeEnd = `${moment(currentDay).day('Monday').format('YYYY-MM-DD')}T${moment(
							staffAvailable.workingTimes.Monday.timeEnd,
							['h:mm A']
						).format('HH:mm:ss')}`;
						timeStart = `${moment(currentDay).day('Monday').format('YYYY-MM-DD')}T${moment(
							staffAvailable.workingTimes.Monday.timeStart,
							['h:mm A']
						).format('HH:mm:ss')}`;
						isCheckWorking = staffAvailable.workingTimes.Monday.isCheck;
					}

					break;

				case 'Tuesday':
					if (staffAvailable) {
						timeEnd = `${moment(currentDay).day('Tuesday').format('YYYY-MM-DD')}T${moment(
							staffAvailable.workingTimes.Tuesday.timeEnd,
							['h:mm A']
						).format('HH:mm:ss')}`;
						timeStart = `${moment(currentDay).day('Tuesday').format('YYYY-MM-DD')}T${moment(
							staffAvailable.workingTimes.Tuesday.timeStart,
							['h:mm A']
						).format('HH:mm:ss')}`;
						isCheckWorking = staffAvailable.workingTimes.Tuesday.isCheck;
					}

					break;

				case 'Wednesday':
					if (staffAvailable) {
						timeEnd = `${moment(currentDay).day('Wednesday').format('YYYY-MM-DD')}T${moment(
							staffAvailable.workingTimes.Wednesday.timeEnd,
							['h:mm A']
						).format('HH:mm:ss')}`;
						timeStart = `${moment(currentDay).day('Wednesday').format('YYYY-MM-DD')}T${moment(
							staffAvailable.workingTimes.Wednesday.timeStart,
							['h:mm A']
						).format('HH:mm:ss')}`;
						isCheckWorking = staffAvailable.workingTimes.Wednesday.isCheck;
					}
					break;

				case 'Thursday':
					if (staffAvailable) {
						timeEnd = `${moment(currentDay).day('Thursday').format('YYYY-MM-DD')}T${moment(
							staffAvailable.workingTimes.Thursday.timeEnd,
							['h:mm A']
						).format('HH:mm:ss')}`;
						timeStart = `${moment(currentDay).day('Thursday').format('YYYY-MM-DD')}T${moment(
							staffAvailable.workingTimes.Thursday.timeStart,
							['h:mm A']
						).format('HH:mm:ss')}`;

						isCheckWorking = staffAvailable.workingTimes.Thursday.isCheck;
					}
					break;

				case 'Friday':
					if (staffAvailable) {
						timeEnd = `${moment(currentDay).day('Friday').format('YYYY-MM-DD')}T${moment(
							staffAvailable.workingTimes.Friday.timeEnd,
							['h:mm A']
						).format('HH:mm:ss')}`;
						timeStart = `${moment(currentDay).day('Friday').format('YYYY-MM-DD')}T${moment(
							staffAvailable.workingTimes.Friday.timeStart,
							['h:mm A']
						).format('HH:mm:ss')}`;
						isCheckWorking = staffAvailable.workingTimes.Friday.isCheck;
					}
					break;

				case 'Saturday':
					if (staffAvailable) {
						timeEnd = `${moment(currentDay).day('Saturday').format('YYYY-MM-DD')}T${moment(
							staffAvailable.workingTimes.Saturday.timeEnd,
							['h:mm A']
						).format('HH:mm:ss')}`;
						timeStart = `${moment(currentDay).day('Saturday').format('YYYY-MM-DD')}T${moment(
							staffAvailable.workingTimes.Saturday.timeStart,
							['h:mm A']
						).format('HH:mm:ss')}`;
						isCheckWorking = staffAvailable.workingTimes.Saturday.isCheck;
					}
					break;

				case 'Sunday':
					if (staffAvailable) {
						timeEnd = `${moment(currentDay).day(0).format('YYYY-MM-DD')}T${moment(
							staffAvailable.workingTimes.Sunday.timeEnd,
							['h:mm A']
						).format('HH:mm:ss')}`;
						timeStart = `${moment(currentDay).day(0).format('YYYY-MM-DD')}T${moment(
							staffAvailable.workingTimes.Sunday.timeStart,
							['h:mm A']
						).format('HH:mm:ss')}`;
						isCheckWorking = staffAvailable.workingTimes.Sunday.isCheck;
					}
					break;
				default:
					break;
			}

			const time = moment(start._d.toString().substr(0, 24));

			if (Boolean(isCheckWorking) === true && check_block_temp === false) {
				if (moment(time).isBefore(timeEnd) && moment(time).isSameOrAfter(timeStart)) {
					store.dispatch(disableCalendar(true));
					store.dispatch(openAddingAppointment({}));
					store.dispatch(TimeAndStaffID({ time: time, staffID: member.memberId }));
				}
			}
		}
	},

	eventClick: (event) => {
		const allAppointment = store.getState().getIn(['appointment', 'appointments', 'allAppointment']);
		const appointment = allAppointment.find((app) => parseInt(app.id) === parseInt(event.data.id));
		if (!appointment) return;
		store.dispatch(selectAppointment(appointment, event));
		store.dispatch(getApppointmentById(appointment));
		store.dispatch(disableCalendar(true));
	},

	drop(date, jsEvent, ui, idResource) {
		const event = $(this).data().event.data;
		let totalDuration = 0;
		event.options.forEach((evt) => {
			totalDuration += evt.duration;
		});

		const start_time = `${date.format('YYYY-MM-DD')}T${date.format('HH:mm:ss')}`;
		const end_time =
			event.options.length > 0
				? moment(start_time).add(totalDuration, 'minutes')
				: moment(start_time).add(90, 'minutes');

		const memberdisplay = store.getState().getIn(['appointment', 'appointments', 'calendar']);
		let check = true;
		let member_clone = JSON.parse(JSON.stringify(memberdisplay));
		member_clone.forEach((element) => {
			delete element.memberId;
		});

		const displayedMembers = store.getState().getIn(['appointment', 'members', 'displayed']);

		let all_appointments = [];
		member_clone.forEach((apps) => {
			all_appointments = [...all_appointments, ...apps.appointments];
		});

		let check_workingStaff = '';
		let check_staff_drop = false;
		let time_working_start = '';
		let time_working_end = '';

		const resourceId = parseInt(idResource) - 1;

		const pos = displayedMembers.findIndex((mem) => parseInt(mem.resourceId) === parseInt(resourceId));

		if (pos !== -1) {
			const currentDay = store.getState().getIn(['appointment', 'currentDay']);

			switch (moment(currentDay).format('dddd')) {
				case 'Monday':
					check_workingStaff = displayedMembers[parseInt(resourceId)].workingTimes.Monday.isCheck;
					time_working_start = displayedMembers[parseInt(resourceId)].workingTimes.Monday.timeStart;
					time_working_end = displayedMembers[parseInt(resourceId)].workingTimes.Monday.timeEnd;
					break;

				case 'Tuesday':
					check_workingStaff = displayedMembers[parseInt(resourceId)].workingTimes.Tuesday.isCheck;
					time_working_start = displayedMembers[parseInt(resourceId)].workingTimes.Tuesday.timeStart;
					time_working_end = displayedMembers[parseInt(resourceId)].workingTimes.Tuesday.timeEnd;
					break;

				case 'Wednesday':
					check_workingStaff = displayedMembers[parseInt(resourceId)].workingTimes.Wednesday.isCheck;
					time_working_start = displayedMembers[parseInt(resourceId)].workingTimes.Wednesday.timeStart;
					time_working_end = displayedMembers[parseInt(resourceId)].workingTimes.Wednesday.timeEnd;
					break;

				case 'Thursday':
					check_workingStaff = displayedMembers[parseInt(resourceId)].workingTimes.Thursday.isCheck;
					time_working_start = displayedMembers[parseInt(resourceId)].workingTimes.Thursday.timeStart;
					time_working_end = displayedMembers[parseInt(resourceId)].workingTimes.Thursday.timeEnd;
					break;

				case 'Friday':
					check_workingStaff = displayedMembers[parseInt(resourceId)].workingTimes.Friday.isCheck;
					time_working_start = displayedMembers[parseInt(resourceId)].workingTimes.Friday.timeStart;
					time_working_end = displayedMembers[parseInt(resourceId)].workingTimes.Friday.timeEnd;
					break;

				case 'Saturday':
					check_workingStaff = displayedMembers[parseInt(resourceId)].workingTimes.Saturday.isCheck;
					time_working_start = displayedMembers[parseInt(resourceId)].workingTimes.Saturday.timeStart;
					time_working_end = displayedMembers[parseInt(resourceId)].workingTimes.Saturday.timeEnd;
					break;

				case 'Sunday':
					check_workingStaff = displayedMembers[parseInt(resourceId)].workingTimes.Sunday.isCheck;
					time_working_start = displayedMembers[parseInt(resourceId)].workingTimes.Sunday.timeStart;
					time_working_end = displayedMembers[parseInt(resourceId)].workingTimes.Sunday.timeEnd;
					break;

				default:
					break;
			}
		}

		if (!displayedMembers[parseInt(resourceId)]) {
			check = false;
		} else if (check_workingStaff) {
			all_appointments.forEach((app) => {
				if (parseInt(app.memberId) === parseInt(displayedMembers[parseInt(resourceId)].id)) {
					if (
						moment(start_time).isBetween(app.start, app.end) ||
						moment(end_time).isBetween(app.start, app.end) ||
						moment(app.start).isBetween(start_time, end_time) ||
						moment(app.end).isBetween(start_time, end_time)
					) {
						if (parseInt(app.id) !== parseInt(event.id)) {
							if (app.status === 'BLOCK_TEMP') {
								check = 1;
							} else {
								check = false;
							}
						}
					}
				}
			});
		} else {
			check = false;
		}

		let check_time_block = true;
		let checkDate = `${date.format('YYYY-MM-DD')}T${date.format('HH:mm:ss')}`;

		if (
			moment(checkDate).isBefore(
				`${moment().format('YYYY-MM-DD')}T${moment(time_working_start, ['h:mm A']).format('HH:mm:ss')}`
			)
		) {
			check_time_block = false;
		}

		if (check_workingStaff) {
			check_staff_drop = true;
		}

		if (pos === -1 || check_staff_drop === false || check_time_block === false || check === 1) {
			$('#full-calendar').fullCalendar('removeEvents', (event) => event.data.id === $(this).data().event.data.id);
		} else {
			if (check === false && displayedMembers[parseInt(resourceId)].orderNumber !== 0) {
				if (window.confirm('Are you sure want to assign appointment at this position ?')) {
					store.dispatch(
						assignAppointment({
							eventData: {
								...event,
								status: 'CHECKED_IN',
								start: `${date.format('YYYY-MM-DD')}T${date.format('HH:mm:ss')}`,
								end: event.end.toString().substr(0, 19)
							},
							resourceId
						})
					);
				} else {
					$('#full-calendar').fullCalendar(
						'removeEvents',
						(event) => event.data.id === $(this).data().event.data.id
					);
				}
			} else {
				store.dispatch(
					assignAppointment({
						eventData: {
							...event,
							status: 'CHECKED_IN',
							start: `${date.format('YYYY-MM-DD')}T${date.format('HH:mm:ss')}`,
							end: event.end.toString().substr(0, 19)
						},
						resourceId
					})
				);
			}
		}
	},

	eventDrop: (event, delta, revertFunc, jsEvent, ui, view) => {
		const memberdisplay = store.getState().getIn(['appointment', 'appointments', 'calendar']);
		const displayedMembers = store.getState().getIn(['appointment', 'members', 'displayed']);

		const start_time = event.start;
		const end_time = event.end;
		let check = true;
		let member_clone = JSON.parse(JSON.stringify(memberdisplay));
		member_clone.forEach((element) => {
			delete element.memberId;
		});

		const currentDay = store.getState().getIn(['appointment', 'currentDay']);
		let check_workingStaff = '';

		const staffAvailable = displayedMembers[parseInt(event.resourceId) - 1];

		/* 	move appointment any staff trong cột any staff */
		if (!staffAvailable) {
			if (event.data.memberId === 0) {
				const endTime =
					event.end !== null
						? `${event.end.format('YYYY-MM-DD')}T${event.end.format('HH:mm:ss')}`
						: moment(start_time).add(90, 'minutes').format('YYYY-MM-DD HH:mm:ss');
				const startTime = `${event.start.format('YYYY-MM-DD')}T${event.start.format('HH:mm:ss')}`;
				store.dispatch(moveAppointment(event.data.id, 0, startTime, endTime));
				return;
			}
		}
		/* end move any staff */

		if ((event.resourceId === '0' && event.data.memberId !== 0) || staffAvailable.id === 0) {
			revertFunc();
			return;
		}
		// if (parseInt(event.resouceId) !== 0) {
		if (!staffAvailable) {
			check = false;
		} else {
			switch (moment(currentDay).format('dddd')) { // kiểm tra isCheck cuả staff ( có làm việc không ?)
				case 'Monday':
					check_workingStaff = staffAvailable.workingTimes.Monday.isCheck;
					break;

				case 'Tuesday':
					check_workingStaff = staffAvailable.workingTimes.Tuesday.isCheck;
					break;

				case 'Wednesday':
					check_workingStaff = staffAvailable.workingTimes.Wednesday.isCheck;
					break;

				case 'Thursday':
					check_workingStaff = staffAvailable.workingTimes.Thursday.isCheck;
					break;

				case 'Friday':
					check_workingStaff = staffAvailable.workingTimes.Friday.isCheck;
					break;

				case 'Saturday':
					check_workingStaff = staffAvailable.workingTimes.Saturday.isCheck;
					break;

				case 'Sunday':
					check_workingStaff = staffAvailable.workingTimes.Sunday.isCheck;
					break;

				default:
					break;
			}
		}

		let all_appointments = []; // tất cả appointment trên calendar
		member_clone.forEach((apps) => {
			all_appointments = [...all_appointments, ...apps.appointments];
		});

		if (!staffAvailable) {
			check = false;
		} else if (check_workingStaff) {
			// có làm việc
			all_appointments.forEach((app) => { // check khi thả appointment overlap
				if (parseInt(app.memberId) === parseInt(staffAvailable.id)) {
					if (
						moment(start_time).isBetween(app.start, app.end) ||
						moment(end_time).isBetween(app.start, app.end) ||
						moment(app.start).isBetween(start_time, end_time) ||
						moment(app.end).isBetween(start_time, end_time)
					) {
						if (parseInt(app.id) !== parseInt(event.data.id)) {
							if (app.status === 'BLOCK_TEMP') {

								if (app.appointmentId !== event.data.id) {
									// alert('The Staff is not available on your time selected.')
									// check = 1;
								}
							} else {
								check = false;
							}
						} else {
							if (app.status === 'BLOCK_TEMP') {
								if (window.confirm('Accept appointment outside working hours')) {
									check = true;
								} else {
									check = 1;
								}
							}
						}
					}
				}
			});
		} else {
			// không làm việc
			check = false;
		}
		const resourceId = parseInt(event.resourceId) - 1;

		const pos = displayedMembers.findIndex((mem) => parseInt(mem.resourceId) === parseInt(resourceId));

		//pos : dùng để check vị trí appointment có nằm ngoài staff không ?
		//check : dùng để check appointment có bị overlap hay không , check = false là bị overlap ,  check = 1 là bị block temp
		if (pos === -1 || event.data.status === 'PAID' || check === 1) {
			revertFunc();
		} else {
			const start_time = `${event.start.format('YYYY-MM-DD')}T${event.start.format('HH:mm:ss')}`;

			const endTime =
				event.end !== null
					? `${event.end.format('YYYY-MM-DD')}T${event.end.format('HH:mm:ss')}`
					: moment(start_time).add(90, 'minutes').format('YYYY-MM-DD HH:mm:ss');
			if (check === false) {
				if (window.confirm('Accept overlapping appointments?')) {
					store.dispatch(moveAppointment(event.data.id, parseInt(event.resourceId), start_time, endTime));
				} else {
					revertFunc();
				}
			} else {
				store.dispatch(moveAppointment(event.data.id, parseInt(event.resourceId), start_time, endTime));
			}
		}
		// }
	},
	/* eslint no-param-reassign: "error" */
	eventDragStop: (event, jsEvent) => {
		if (parseInt(event.resourceId) !== 0) {
			const trashEl = $('#drag-zone');
			if (jsEvent) {
				const ofs = trashEl.offset();
				const x1 = ofs.left;
				const x2 = ofs.left + trashEl.outerWidth(true);
				const y1 = ofs.top;
				const y2 = ofs.top + trashEl.outerHeight(true);

				if (jsEvent.pageX >= x1 && jsEvent.pageX <= x2 && jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
					/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
					$('#full-calendar').fullCalendar('removeEvents', event._id);
					const displayedMembers = store.getState().getIn(['appointment', 'appointments', 'calendar']);
					const override = displayedMembers[parseInt(event.resourceId) - 1];
					store.dispatch(
						putBackAppointment({
							...event.data,
							memberId: override.memberId
						})
					);
				}
			}
		}
	},
	/* eslint no-param-reassign: "error" */
	eventRender: (event, element) => {
		element[0].innerHTML = EVENT_RENDER_TEMPLATE(event.data);
		if (event.data.isVip === 1) {
			element
				.find('div.app-event')
				.prepend("<div class='app-event__full-name2'><img src='" + vip + "' width='18' height='18'></div>");
		}
	},
	resourceRender: (resourceObj, labelTds) => {
		labelTds[0].innerHTML = '';
	}
};

export const addEventsToCalendar = async (currentDate, appointmentsMembers) => {
	//apointmentMember render appointment tai slide hien tai
	$('#full-calendar').fullCalendar('gotoDate', currentDate);
	$('#full-calendar').fullCalendar('removeEvents');
	const events = [];
	appointmentsMembers.forEach((member, index) => {
		if (member.memberId !== 0) {
			member.appointments.forEach((appointment) => {
				events.push({
					resourceId: index + 1,
					start: appointment.start,
					end: appointment.end,
					data: appointment,
					color: getAtrributeByStatus(appointment).eventColor,
					rendering:
						appointment.status === 'BLOCK' || appointment.status === 'BLOCK_TEMP' ? 'background' : '',
					className: getAtrributeByStatus(appointment).eventClass,
					startEditable: !(appointment.status === 'PAID'),
					resourceEditable: !(appointment.status === 'PAID')
				});
			});
		}
	});

	const allAppointments = store.getState().getIn(['appointment', 'appointments', 'allAppointment']);

	const app_in_anystaff = allAppointments
		? allAppointments.filter((app) => app.memberId === 0 && app.status !== 'WAITING')
		: [];
	app_in_anystaff.forEach((appointment) => {
		events.push({
			resourceId: 0,
			start: appointment.start,
			end: appointment.end,
			data: appointment,
			color: getAtrributeByStatus(appointment).eventColor,
			rendering: appointment.status === 'BLOCK' || appointment.status === 'BLOCK_TEMP' ? 'background' : '',
			className: getAtrributeByStatus(appointment).eventClass,
			startEditable: !(appointment.status === 'PAID'),
			resourceEditable: !(appointment.status === 'PAID')
		});
	});
	// viet ham render appointment cho cot any staff tai day
	$('#full-calendar').fullCalendar('renderEvents', events);
};

export const deleteEventFromCalendar = (eventId) => {
	$('#full-calendar').fullCalendar('removeEvents', [eventId]);
};

export const updateEventToCalendar = (fcEvent) => {
	let eventColor;
	let startEditable = true;
	let resourceEditable = true;
	let eventClass = '';
	const { status } = fcEvent;
	if (status === 'ASSIGNED') {
		// eventColor = '#FFFD71';
		eventColor = '#ffe559';
		eventClass = 'event-assigned';
	}
	if (status === 'CONFIRMED') {
		eventColor = '#baedf7';
		eventClass = 'event-confirmed';
	}
	if (status === 'CHECKED_IN') {
		eventColor = '#00b4f7';
		eventClass = 'event-checkin';
	}
	if (status === 'PAID') {
		eventColor = '#00dc00';
		eventClass = 'event-paid';
		startEditable = false;
		resourceEditable = false;
	}
	const displayedMembers = store.getState().getIn(['appointment', 'members', 'displayed']);

	const resourceId = displayedMembers.findIndex((mem) => mem.id === fcEvent.memberId);

	const data = {
		resourceId: fcEvent.memberId === 0 && fcEvent.status !== 'WAITING' ? 0 : resourceId + 1,
		start: fcEvent.start,
		end: fcEvent.end,
		data: fcEvent,
		color: eventColor,
		className: eventClass,
		startEditable,
		resourceEditable
	};

	//viet them ham update cho event o cot any staff tai day

	$('#full-calendar').fullCalendar('addEventSource', [data]);
};


function getAtrributeByStatus(appointment) {
	let eventColor = '#00b4f7';
	let eventClass = 'event-paid';
	if (appointment.status === 'ASSIGNED') {
		// eventColor = '#FFFD71';
		eventColor = '#ffe559';
		eventClass = 'event-assigned';
	}
	if (appointment.status === 'CONFIRMED') {
		eventColor = '#baedf7';
		eventClass = 'event-confirmed';
	}
	if (appointment.status === 'CHECKED_IN') {
		eventColor = '#00b4f7';
		eventClass = 'event-checkin';
	}
	if (appointment.status === 'PAID') {
		eventColor = '#00dc00';
		eventClass = 'event-paid';
	}
	if (appointment.status === 'BLOCK') {
		eventColor = '#DDDDDD';
		eventClass = 'event-block';
	}
	if (appointment.status === 'BLOCK_TEMP') {
		eventColor = 'yellow';
		eventClass = 'event-block-temp';
	}
	return {
		eventColor, eventClass
	}
}