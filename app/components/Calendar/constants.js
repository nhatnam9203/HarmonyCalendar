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
import vip from '../../images/vip.png'
import { AiFillStar } from 'react-icons'

const OPTION_RENDER_TEMPLATE = (option) => `<div class="app-event__option">- ${option.serviceName}</div>`;
const PRODUCT_RENDER_TEMPLATE = (product) => `<div class="app-event__option">- ${product.productName}</div>`;
const EXTRAS_RENDER_TEMPLATE = (extra) => `<div class="app-event__option">- ${extra.extraName}</div>`;

const EVENT_RENDER_TEMPLATE = (event) => `
  <div class="app-event">
	<div class="app-event__id-number">${event.code}</div>
    <div class="app-event__full-name">${event.userFullName}</div>
    <div class="app-event__phone-number">&nbsp ${formatPhone(event.phoneNumber)}</div>
	${event.options.map((option) => OPTION_RENDER_TEMPLATE(option)).join('')}
	${event.products.map((product) => PRODUCT_RENDER_TEMPLATE(product)).join('')}
	${event.extras.map((extra) => EXTRAS_RENDER_TEMPLATE(extra)).join('')}
  </div>
`;

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
	// defaultTimedEventDuration: '01:30:00',
	eventOverlap: true,
	minTime: '06:00:00',
	maxTime: '23:00:00',
	timezone: 'local',
	longPressDelay: 200,
	resources: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
	schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',

	select: (start, end, event, view, resource) => {
		let check_block_temp = false;

		const displayedMembers = store.getState().getIn(['appointment', 'appointments', 'calendar']);
		const member = displayedMembers[resource.id];

		member.appointments.forEach((app) => {
			if (
				app.status === 'BLOCK_TEMP' &&
				moment(app.start).isSameOrBefore(moment(start)) &&
				moment(app.end).isAfter(moment(start))
			) {
				check_block_temp = true;
			}
		});

		const mem_resource = store.getState().getIn(['appointment', 'members', 'displayed']);

		let timeEnd = '';
		let timeStart = '';
		let isCheckWorking = '';

		let currentDay = store.getState().getIn(['appointment', 'currentDay']);

		switch (moment(currentDay).format('dddd')) {
			case 'Monday':
				if (mem_resource[resource.id]) {
					timeEnd = `${moment(currentDay).day('Monday').format('YYYY-MM-DD')}T${moment(
						mem_resource[resource.id].workingTimes.Monday.timeEnd,
						['h:mm A']
					).format('HH:mm:ss')}`;
					timeStart = `${moment(currentDay).day('Monday').format('YYYY-MM-DD')}T${moment(
						mem_resource[resource.id].workingTimes.Monday.timeStart,
						['h:mm A']
					).format('HH:mm:ss')}`;
					isCheckWorking = mem_resource[resource.id].workingTimes.Monday.isCheck;
				}

				break;

			case 'Tuesday':
				if (mem_resource[resource.id]) {
					timeEnd = `${moment(currentDay).day('Tuesday').format('YYYY-MM-DD')}T${moment(
						mem_resource[resource.id].workingTimes.Tuesday.timeEnd,
						['h:mm A']
					).format('HH:mm:ss')}`;
					timeStart = `${moment(currentDay).day('Tuesday').format('YYYY-MM-DD')}T${moment(
						mem_resource[resource.id].workingTimes.Tuesday.timeStart,
						['h:mm A']
					).format('HH:mm:ss')}`;
					isCheckWorking = mem_resource[resource.id].workingTimes.Tuesday.isCheck;
				}

				break;

			case 'Wednesday':
				if (mem_resource[resource.id]) {
					timeEnd = `${moment(currentDay).day('Wednesday').format('YYYY-MM-DD')}T${moment(
						mem_resource[resource.id].workingTimes.Wednesday.timeEnd,
						['h:mm A']
					).format('HH:mm:ss')}`;
					timeStart = `${moment(currentDay).day('Wednesday').format('YYYY-MM-DD')}T${moment(
						mem_resource[resource.id].workingTimes.Wednesday.timeStart,
						['h:mm A']
					).format('HH:mm:ss')}`;
					isCheckWorking = mem_resource[resource.id].workingTimes.Wednesday.isCheck;
				}
				break;

			case 'Thursday':
				if (mem_resource[resource.id]) {
					timeEnd = `${moment(currentDay).day('Thursday').format('YYYY-MM-DD')}T${moment(
						mem_resource[resource.id].workingTimes.Thursday.timeEnd,
						['h:mm A']
					).format('HH:mm:ss')}`;
					timeStart = `${moment(currentDay).day('Thursday').format('YYYY-MM-DD')}T${moment(
						mem_resource[resource.id].workingTimes.Thursday.timeStart,
						['h:mm A']
					).format('HH:mm:ss')}`;
					isCheckWorking = mem_resource[resource.id].workingTimes.Thursday.isCheck;
				}
				break;

			case 'Friday':
				if (mem_resource[resource.id]) {
					timeEnd = `${moment(currentDay).day('Friday').format('YYYY-MM-DD')}T${moment(
						mem_resource[resource.id].workingTimes.Friday.timeEnd,
						['h:mm A']
					).format('HH:mm:ss')}`;
					timeStart = `${moment(currentDay).day('Friday').format('YYYY-MM-DD')}T${moment(
						mem_resource[resource.id].workingTimes.Friday.timeStart,
						['h:mm A']
					).format('HH:mm:ss')}`;
					isCheckWorking = mem_resource[resource.id].workingTimes.Friday.isCheck;
				}
				break;

			case 'Saturday':
				if (mem_resource[resource.id]) {
					timeEnd = `${moment(currentDay).day('Saturday').format('YYYY-MM-DD')}T${moment(
						mem_resource[resource.id].workingTimes.Saturday.timeEnd,
						['h:mm A']
					).format('HH:mm:ss')}`;
					timeStart = `${moment(currentDay).day('Saturday').format('YYYY-MM-DD')}T${moment(
						mem_resource[resource.id].workingTimes.Saturday.timeStart,
						['h:mm A']
					).format('HH:mm:ss')}`;
					isCheckWorking = mem_resource[resource.id].workingTimes.Saturday.isCheck;
				}
				break;

			case 'Sunday':
				if (mem_resource[resource.id]) {
					timeEnd = `${moment(currentDay).day(0).format('YYYY-MM-DD')}T${moment(
						mem_resource[resource.id].workingTimes.Sunday.timeEnd,
						['h:mm A']
					).format('HH:mm:ss')}`;
					timeStart = `${moment(currentDay).day(0).format('YYYY-MM-DD')}T${moment(
						mem_resource[resource.id].workingTimes.Sunday.timeStart,
						['h:mm A']
					).format('HH:mm:ss')}`;
					isCheckWorking = mem_resource[resource.id].workingTimes.Sunday.isCheck;
				}
				break;
			default:
				break;
		}

		const time = moment(start._d.toString().substr(0, 24));

		if (isCheckWorking && check_block_temp === false) {
			if (moment(time).isBefore(timeEnd) && moment(time).isSameOrAfter(timeStart)) {
				store.dispatch(disableCalendar(true));
				store.dispatch(openAddingAppointment({}));
				store.dispatch(TimeAndStaffID({ time: time, staffID: member.memberId }));
			}
		}
	},

	eventClick: (event) => {
		const displayedMembers = store.getState().getIn(['appointment', 'appointments', 'calendar']);

		const oldPosition = displayedMembers.find((member) =>
			member.appointments.find((appointment) => appointment.id === event.data.id)
		);
		if (!oldPosition) return;

		const appointment = oldPosition.appointments.find((app) => app.id === event.data.id);
		if (!appointment) return;

		store.dispatch(selectAppointment(appointment, event));
		store.dispatch(getApppointmentById(appointment));
		store.dispatch(disableCalendar(true));
	},

	drop(date, jsEvent, ui, resourceId) {
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
		let check2 = false;
		let member_clone = JSON.parse(JSON.stringify(memberdisplay));
		member_clone.forEach((element) => {
			delete element.memberId;
		});

		// if (moment(event.start).format('YYYY-MM-DD HH:mm') !== moment(start_time).format('YYYY-MM-DD HH:mm')) {
		//   check = false;
		// }

		const displayedMembers = store.getState().getIn(['appointment', 'members', 'displayed']);

		let all_appointments = [];
		member_clone.forEach((apps) => {
			all_appointments = [...all_appointments, ...apps.appointments];
		});

		let check_workingStaff = '';
		let check_staff_drop = false;
		let time_working_start = '';
		let time_working_end = '';

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

						// ((moment(app.start).format('YYYY-MM-DD HH:mm') === moment(start_time).format('YYYY-MM-DD HH:mm')) ||
						//   (moment(app.end).format('YYYY-MM-DD HH:mm') === moment(end_time).format('YYYY-MM-DD HH:mm')))
					) {
						if (parseInt(app.id) !== parseInt(event.id)) {
							if (app.status === 'BLOCK_TEMP') {
								check = 1;
							} else {
								check = false;
							}
						}
					}

					// if (moment(end_time).isBetween(app.start, app.end)) {
					//   if (parseInt(app.id) !== parseInt(event.data.id)) {
					//     if (app.status === 'CONFIRMED' || app.status === 'CHECKED_IN' || app.status === 'BLOCK') {
					//       check = false;
					//     }
					//   }
					// }

					// if ((moment(app.start).format('YYYY-MM-DD HH:mm') === moment(start_time).format('YYYY-MM-DD HH:mm')) &&
					//   (moment(app.end).format('YYYY-MM-DD HH:mm') === moment(end_time).format('YYYY-MM-DD HH:mm'))) {
					//   if (parseInt(app.id) !== parseInt(event.data.id)) {
					//     if (app.status === 'CONFIRMED' || app.status === 'CHECKED_IN' || app.status === 'BLOCK') {
					//       check = false;
					//     }
					//   }
					// }
				}
			});
		} else {
			check = false;
		}

		let check_time_block = true;
		let checkDate = `${date.format('YYYY-MM-DD')}T${date.format('HH:mm:ss')}`;
		// if (moment(checkDate).isSameOrAfter(`${moment().format('YYYY-MM-DD')}T${moment(time_working_end, ["h:mm A"]).format("HH:mm:ss")}`)) {
		//   check_time_block = false;
		// }
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
		console.log({ event })
		const start_time = event.start;
		const end_time = event.end;
		let check = true;
		const memberdisplay = store.getState().getIn(['appointment', 'appointments', 'calendar']);
		let member_clone = JSON.parse(JSON.stringify(memberdisplay));
		member_clone.forEach((element) => {
			delete element.memberId;
		});
		const displayedMembers = store.getState().getIn(['appointment', 'members', 'displayed']);
		const currentDay = store.getState().getIn(['appointment', 'currentDay']);
		let check_workingStaff = '';

		if (!displayedMembers[parseInt(event.resourceId)]) {
			check = false;
		} else {
			switch (moment(currentDay).format('dddd')) { // kiểm tra isCheck cuả staff ( có làm việc không ?)
				case 'Monday':
					check_workingStaff = displayedMembers[parseInt(event.resourceId)].workingTimes.Monday.isCheck;
					break;

				case 'Tuesday':
					check_workingStaff = displayedMembers[parseInt(event.resourceId)].workingTimes.Tuesday.isCheck;
					break;

				case 'Wednesday':
					check_workingStaff = displayedMembers[parseInt(event.resourceId)].workingTimes.Wednesday.isCheck;
					break;

				case 'Thursday':
					check_workingStaff = displayedMembers[parseInt(event.resourceId)].workingTimes.Thursday.isCheck;
					break;

				case 'Friday':
					check_workingStaff = displayedMembers[parseInt(event.resourceId)].workingTimes.Friday.isCheck;
					break;

				case 'Saturday':
					check_workingStaff = displayedMembers[parseInt(event.resourceId)].workingTimes.Saturday.isCheck;
					break;

				case 'Sunday':
					check_workingStaff = displayedMembers[parseInt(event.resourceId)].workingTimes.Sunday.isCheck;
					break;

				default:
					break;
			}
		}

		let all_appointments = []; // tất cả appointment trên calendar
		member_clone.forEach((apps) => {
			all_appointments = [...all_appointments, ...apps.appointments];
		});

		if (!displayedMembers[parseInt(event.resourceId)]) {
			check = false;
		} else if (check_workingStaff) { // có làm việc
			all_appointments.forEach((app) => {
				if (parseInt(app.memberId) === parseInt(displayedMembers[parseInt(event.resourceId)].id)) {
					if (
						moment(start_time).isBetween(app.start, app.end) ||
						moment(end_time).isBetween(app.start, app.end) ||
						moment(app.start).isBetween(start_time, end_time) ||
						moment(app.end).isBetween(start_time, end_time)
						// ((moment(app.start).format('YYYY-MM-DD HH:mm') === moment(start_time).format('YYYY-MM-DD HH:mm')) ||
						//   (moment(app.end).format('YYYY-MM-DD HH:mm') === moment(end_time).format('YYYY-MM-DD HH:mm')))
					) {
						if (parseInt(app.id) !== parseInt(event.data.id)) {
							// if (app.status === 'CONFIRMED' || app.status === 'CHECKED_IN' || app.status === 'BLOCK') {

							// }
							if (app.status === 'BLOCK_TEMP') {
								if (app.appointmentId !== event.data.id)
									check = 1;
							} else {
								check = false;
							}
						}
					}

					// if (moment(end_time).isBetween(app.start, app.end)) {
					//   if (parseInt(app.id) !== parseInt(event.data.id)) {
					//     if (app.status === 'CONFIRMED' || app.status === 'CHECKED_IN' || app.status === 'BLOCK') {
					//       check = false;
					//     }
					//   }
					// }

					// if ((moment(app.start).format('YYYY-MM-DD HH:mm') === moment(start_time).format('YYYY-MM-DD HH:mm')) &&
					//   (moment(app.end).format('YYYY-MM-DD HH:mm') === moment(end_time).format('YYYY-MM-DD HH:mm'))) {
					//   if (parseInt(app.id) !== parseInt(event.data.id)) {
					//     if (app.status === 'CONFIRMED' || app.status === 'CHECKED_IN' || app.status === 'BLOCK') {
					//       check = false;
					//     }
					//   }
					// }
				}
			});
		} else { // không làm việc
			check = false;
		}
		const resourceId = event.resourceId;

		const pos = displayedMembers.findIndex((mem) => parseInt(mem.resourceId) === parseInt(resourceId));

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
					store.dispatch(moveAppointment(event.data.id, event.resourceId, start_time, endTime));
				} else {
					revertFunc();
				}
			} else {
				store.dispatch(moveAppointment(event.data.id, event.resourceId, start_time, endTime));
			}
		}
	},
	/* eslint no-param-reassign: "error" */
	eventDragStop: (event, jsEvent) => {
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
				const override = displayedMembers[event.resourceId];
				store.dispatch(
					putBackAppointment({
						...event.data,
						memberId: override.memberId
					})
				);
			}
		}
	},
	/* eslint no-param-reassign: "error" */
	eventRender: (event, element) => {
		element[0].innerHTML = EVENT_RENDER_TEMPLATE(event.data);
		if (event.data.isVip === 1)
			element.find("div.app-event").prepend("<div class='app-event__full-name2'><img src='" + vip + "' width='18' height='18'></div>");
	},
	resourceRender: (resourceObj, labelTds) => {
		labelTds[0].innerHTML = '';
	}
};

export const addEventsToCalendar = (currentDate, appointmentsMembers) => {
	$('#full-calendar').fullCalendar('gotoDate', currentDate);
	$('#full-calendar').fullCalendar('removeEvents');
	const events = [];
	appointmentsMembers.forEach((member, index) => {
		//index dùng de lay vi tri resource
		member.appointments.forEach((appointment) => {
			let eventColor = '#00b4f7';
			let eventClass = 'event-paid';
			let bordercolor = '';
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
			events.push({
				resourceId: index,
				start: appointment.start,
				end: appointment.end,
				data: appointment,
				color: eventColor,
				rendering: appointment.status === 'BLOCK' || appointment.status === 'BLOCK_TEMP' ? 'background' : '',
				className: eventClass,
				startEditable: !(appointment.status === 'PAID'),
				resourceEditable: !(appointment.status === 'PAID')
			});
		});
	});

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
		resourceId: resourceId,
		start: fcEvent.start,
		end: fcEvent.end,
		data: fcEvent,
		color: eventColor,
		className: eventClass,
		startEditable,
		resourceEditable
	};

	$('#full-calendar').fullCalendar('addEventSource', [data]);
};
