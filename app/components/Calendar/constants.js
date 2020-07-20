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
		? event.status === 'CHECKED_IN' || event.status === 'PAID' || event.status === 'WAITING' || event.status === 'VOID' ||  event.status === 'REFUND'
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
	minTime: '00:00:00',
	maxTime: '24:00:00',
	timezone: 'local',
	longPressDelay: 200,
	resources: resource,
	schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',

	select: (start, end, event, view, resource) => {

		let check_block_temp = false;
		let timeEnd, timeStart, isCheckWorking;

		/* book any staff */
		if (parseInt(resource.id) === 0) {
			const allAppointment = store.getState().getIn(['appointment', 'appointments', 'allAppointment']);
			let allMember = store.getState().getIn(['appointment', 'members', 'all']);
			let count = 0;
			let countAppAnyStaff = 0;

			let displayAllMember = allMember.map((mem) => {
				return {
					member: mem,
					appointments: allAppointment.filter((app) => app.memberId === mem.id)
				};
			});

			displayAllMember.forEach((el) => {
				if (el.member.id !== 0) { // bỏ duyệt cột any staff
					if (el.member.orderNumber === 0) { // đếm staff chưa login
						count = count + 1;
					}
					else {
						let _i = 0;
						let _j = 0;
						el.member.blockTime.forEach(b => {
							const timeStart = `${moment(b.workingDate).format('YYYY-MM-DD')}T${moment(b.blockTimeStart, ['h:mm A']).format('HH:mm:ss')}`;
							const timeEnd = `${moment(b.workingDate).format('YYYY-MM-DD')}T${moment(b.blockTimeEnd, ['h:mm A']).format('HH:mm:ss')}`;
							if (
								// check block time 
								moment(start).isBefore(moment(timeEnd)) &&
								moment(start).isSameOrAfter(moment(timeStart))

							) {
								if(_i === 0){
									count = count + 1;
									_i = _i + 1;
								}
							}
						});

						el.appointments.forEach((app) => {
							if (
								// check appointment available ở các cột staff
								moment(start).isBefore(moment(app.end)) &&
								moment(start).isSameOrAfter(moment(app.start)) &&
								(app.status === 'CHECKED_IN' || app.status === 'CONFIRMED' || app.status === 'BLOCK_TEMP')
								// (app.memberId !== 0)
							) {
								if(_j === 0){
									count = count + 1;
									_j = _j + 1;
								}
							}

							if (
								// check appointment available ở cột any staff
								moment(start).isBefore(moment(app.end)) &&
								moment(start).isSameOrAfter(moment(app.start)) &&
								app.memberId === 0
							) {
								countAppAnyStaff = countAppAnyStaff + 1;
							}
						});
					}
				}
			});

			if (count >= allMember.length - 1) {
				alert('There is no staff available at this time.');
				return;
			}

			if (countAppAnyStaff > 0 && countAppAnyStaff >= count && count > 0) {
				alert('There is no staff available at this time.');
			} else {
				const data = {
					fromTime: start,
					toTime: end,
					staffId: 0,
					action: 'addGroupAnyStaff'
				};
				const currentDay = store.getState().getIn(['appointment', 'currentDay']);
				const merchantInfo = store.getState().getIn(['appointment', 'merchantInfo'])
				const currentDayName = moment(currentDay).format('dddd');
				const businessHour = Object.entries(merchantInfo.businessHour).find(b => b[0] === currentDayName);

				const start_bussiness = `${moment(currentDay).format('YYYY-MM-DD')}T${moment(businessHour[1].timeStart, [
					'h:mm A'
				]).format('HH:mm:ss')}`;
				const end_bussiness = `${moment(currentDay).format('YYYY-MM-DD')}T${moment(businessHour[1].timeEnd, [
					'h:mm A'
				]).format('HH:mm:ss')}`;

				if(moment(start).isSameOrAfter(moment(start_bussiness)) && moment(start).isBefore(moment(end_bussiness))){
					// window.postMessage(JSON.stringify(data));
					const time = moment(start._d.toString().substr(0, 24));
					store.dispatch(disableCalendar(true));
					store.dispatch(openAddingAppointment({}));
					store.dispatch(TimeAndStaffID({ time: time, staffID: 0, dataAnyStaff : data }));
				}
			
			}
		}
		/* end book any staff */


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

			let currentDay = store.getState().getIn(['appointment', 'currentDay']);

			const staffAvailable = displayedMembers[parseInt(resource.id) - 1]
				? displayedMembers[parseInt(resource.id) - 1]
				: '';

			if (staffAvailable) {
				const currentDayName = moment(currentDay).format('dddd');
				const checkWorkingTime = Object.entries(staffAvailable.workingTimes).find(b => b[0] === currentDayName);
				timeEnd = `${moment(currentDay).day(currentDayName).format('YYYY-MM-DD')}T${moment(
					checkWorkingTime[1].timeEnd,
					['h:mm A']
				).format('HH:mm:ss')}`;
				timeStart = `${moment(currentDay).day(currentDayName).format('YYYY-MM-DD')}T${moment(
					checkWorkingTime[1].timeStart,
					['h:mm A']
				).format('HH:mm:ss')}`;
				isCheckWorking = checkWorkingTime[1].isCheck;
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

		let check_workingStaff = '';
		let check_staff_drop = false;
		let time_working_start = '';
		let time_working_end = '';
		let totalDuration = 0;
		let check_workingTime = false

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

		const resourceId = parseInt(idResource) - 1;

		const pos = displayedMembers.findIndex((mem) => parseInt(mem.resourceId) === parseInt(resourceId));

		if (pos !== -1) {
			const currentDay = store.getState().getIn(['appointment', 'currentDay']);
			const currentDayName = moment(currentDay).format('dddd');
			const checkWorkingTime = Object.entries(displayedMembers[parseInt(resourceId)].workingTimes).find(b => b[0] === currentDayName)
			check_workingStaff = checkWorkingTime[1].isCheck;
			time_working_start = checkWorkingTime[1].timeStart;
			time_working_end = checkWorkingTime[1].timeEnd;
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
								if(app.status === 'BLOCK') check_workingTime = true;
								check = false;
							}
						}
					}
				}
			});
		} else {
			check = false;
		}

		if (check_workingStaff) {
			if(displayedMembers[parseInt(resourceId)] && displayedMembers[parseInt(resourceId)].id === 0){
				check_staff_drop = false
			}else{
				check_staff_drop = true;
			}
		}

		if (pos === -1 || check_staff_drop === false || check === 1 ) {
			$('#full-calendar').fullCalendar('removeEvents', (event) => event.data.id === $(this).data().event.data.id);
		} else {
			/* check appointment assign overlap */
			// if (check === false && displayedMembers[parseInt(resourceId)].orderNumber !== 0) {
			if (check === false) {
				// const text =  "Are you sure want to assign appointment at this position ?";

				const text = check_workingTime ? "Accept this appointment outside of business hours?" : "Are you sure want to assign appointment at this position ?";
				if (window.confirm(text)) {
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
				/* assign appointment */
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
		let check_block_grey = false;
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
				let isTest = false;
				const currentDay = store.getState().getIn(['appointment', 'currentDay']);
				const merchantInfo = store.getState().getIn(['appointment', 'merchantInfo'])
				const currentDayName = moment(currentDay).format('dddd');
				const businessHour = Object.entries(merchantInfo.businessHour).find(b => b[0] === currentDayName);

				const endTime =
					event.end !== null
						? `${event.end.format('YYYY-MM-DD')}T${event.end.format('HH:mm:ss')}`
						: moment(start_time).add(90, 'minutes').format('YYYY-MM-DD HH:mm:ss');
				const startTime = `${event.start.format('YYYY-MM-DD')}T${event.start.format('HH:mm:ss')}`;

				const start = `${moment(currentDay).format('YYYY-MM-DD')}T${moment(businessHour[1].timeStart, [
					'h:mm A'
				]).format('HH:mm:ss')}`;
				const end = `${moment(currentDay).format('YYYY-MM-DD')}T${moment(businessHour[1].timeEnd, [
					'h:mm A'
				]).format('HH:mm:ss')}`;

				if(moment(startTime).isBefore(start) || moment(endTime).isAfter(end)){
					isTest = true
				}

				if(isTest){
					if (window.confirm('Accept this appointment outside of business hours?')){
						store.dispatch(moveAppointment(event.data.id, 0, startTime, endTime));
						return;
					}else{
						revertFunc();
						return;
					}
				}

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
			all_appointments.forEach((app) => {
				// check khi thả appointment overlap
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
								if (app.status === 'BLOCK') {
									check_block_grey = true
								}
								check = false;
							}
						} else {
							// if (app.status === 'BLOCK_TEMP') {
							// 	if (window.confirm('Accept appointment outside working hours?')) {
							// 		check = true;
							// 	} else {
							// 		check = 1;
							// 	}
							// }
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
				const text = check_block_grey ? 'Accept this appointment outside of business hours?' : 'Accept overlapping appointments?';
				if (window.confirm(text)) {
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
					startEditable: !(appointment.status === 'PAID' || appointment.status === 'VOID'),
					resourceEditable: !(appointment.status === 'PAID' || appointment.status === 'VOID')
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
		eventColor = '#ffe559';
		eventClass = 'event-assigned';
	}
	if (status === 'CONFIRMED') {
		eventColor = '#baedf7';
		eventClass = 'event-confirmed';
	}
	if (status === 'CHECKED_IN') {
		eventColor = '#28AAE9';
		eventClass = 'event-checkin';
	}
	if (status === 'PAID') {
		eventColor = '#50CF25';
		eventClass = 'event-paid';
		startEditable = false;
		resourceEditable = false;
	}
	if (!status) {
		eventColor = 'red';
		eventClass = 'event-checkin';
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
		eventColor = '#ffe559';
		eventClass = 'event-assigned';
	}
	if (appointment.status === 'CONFIRMED') {
		eventColor = '#baedf7';
		eventClass = 'event-confirmed';
	}
	if (appointment.status === 'CHECKED_IN') {
		eventColor = '#28AAE9';
		eventClass = 'event-checkin';
	}
	if (appointment.status === 'PAID') {
		eventColor = '#50CF25';
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
	if (appointment.status === 'VOID' || appointment.status === "REFUND") {
		eventColor = '#FD594F';
		eventClass = 'event-void';
	}
	if (!appointment.status) {
		eventColor = 'red';
		eventClass = 'event-paid';
	}
	return {
		eventColor,
		eventClass
	};
}
