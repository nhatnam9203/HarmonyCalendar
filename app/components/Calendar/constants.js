import $ from 'jquery';
import moment from 'moment';
import moment_tz from 'moment-timezone';
import { store } from 'app';
import {
	checkDragWaitingInThePast,
	EVENT_RENDER_TEMPLATE,
	EVENT_RENDER_TEMPLATE_BLOCK,
	checkAnyStaffFuture,
	extrasRender,
} from './util';
import {
	assignAppointment,
	moveAppointment,
	openAddingAppointment,
	disableCalendar,
	TimeAndStaffID,
	getApppointmentById,
	editBlockTime,
} from '../../containers/AppointmentPage/actions';
import vip from '../../images/vip.png';
import { blockTemp, checkStatusAppointment } from "../../containers/AppointmentPage/utilSaga";


const resouceDesktop = [
	{ id: 0 },
	{ id: 1 },
	{ id: 2 },
	{ id: 3 },
	{ id: 4 },
	{ id: 5 },
	{ id: 6 },
	{ id: 7 },
	{ id: 8 }
];

export const MAIN_CALENDAR_OPTIONS = (timezone_merchant) => {
	return {
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
		timezone: timezone_merchant ? 'local' : false,
		now: timezone_merchant ? moment_tz.tz('US/Eastern') : moment_tz().tz(),
		longPressDelay: 200,
		resources: resouceDesktop,
		schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',

		select: (start_time, end, event, view, resource) => {
			let check_block_temp = false;
			let timeEnd, timeStart, isCheckWorking;
			let start = moment(start_time).local();

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
					if (el.member.id !== 0) {
						// bỏ duyệt cột any staff
						if (el.member.orderNumber === 0) {
							// đếm staff chưa login
							count = count + 1;
						} else {
							let _i = 0;
							let _j = 0;
							el.member.blockTime.forEach((b) => {
								const timeStart = `${moment(b.workingDate).format(
									'YYYY-MM-DD'
								)}T${moment(b.blockTimeStart, ['h:mm A']).format('HH:mm:ss')}`;
								const timeEnd = `${moment(b.workingDate).format(
									'YYYY-MM-DD'
								)}T${moment(b.blockTimeEnd, ['h:mm A']).format('HH:mm:ss')}`;
								if (
									// check block time
									moment(start).isBefore(moment(timeEnd)) &&
									moment(start).isSameOrAfter(moment(timeStart))
								) {
									if (_i === 0) {
										count = count + 1;
										_i = _i + 1;
									}
								}
							});
							if (_i === 0) {
								el.appointments.forEach((app) => {
									if (
										// check appointment available ở các cột staff
										moment(start).isBefore(moment(app.end)) &&
										moment(start).isSameOrAfter(moment(app.start)) &&
										(app.status === 'CHECKED_IN' ||
											app.status === 'CONFIRMED' ||
											app.status === 'BLOCK_TEMP')
										// (app.memberId !== 0)
									) {
										if (_j === 0) {
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
					}
				});

				if (count >= allMember.length - 1) {
					if (checkAnyStaffFuture() == false) {
						alert('There is no staff available at this time.');
						return;
					}
				}

				if (countAppAnyStaff > 0 && countAppAnyStaff >= count && count > 0) {
					if (checkAnyStaffFuture() == false) {
						alert('There is no staff available at this time.');
						return;
					}
				} else {
					const data = {
						fromTime: start,
						toTime: end,
						staffId: 0,
						action: 'addGroupAnyStaff'
					};
					const currentDay = store.getState().getIn(['appointment', 'currentDay']);
					const merchantInfo = store.getState().getIn(['appointment', 'merchantInfo']);
					const currentDayName = moment(currentDay).format('dddd');
					const businessHour = Object.entries(merchantInfo.businessHour).find((b) => b[0] === currentDayName);

					const start_bussiness = `${moment(currentDay).format('YYYY-MM-DD')}T${moment(
						businessHour[1].timeStart,
						['h:mm A']
					).format('HH:mm:ss')}`;
					const end_bussiness = `${moment(currentDay).format('YYYY-MM-DD')}T${moment(
						businessHour[1].timeEnd,
						['h:mm A']
					).format('HH:mm:ss')}`;

					if (
						moment(start).isSameOrAfter(moment(start_bussiness)) &&
						moment(start).isBefore(moment(end_bussiness))
					) {
						// window.postMessage(JSON.stringify(data));
						const time = moment(start._d.toString().substr(0, 24));
						const merchantInfo = store.getState().getIn(['appointment', 'merchantInfo']);
						const timezone = merchantInfo.timezone;
						let timeNow = timezone ? moment_tz.tz(timezone.substring(12)) : moment();
						timeNow = `${moment(timeNow).format('YYYY-MM-DD')}T${moment(timeNow).format('HH:mm:ss')}`;
						const _time = `${moment(start).format('YYYY-MM-DD')}T${moment(end).local().format('HH:mm:ss')}`;

						if (moment(_time).isBefore(timeNow)) {
							if (
								window.confirm(
									'This appointment is set for a time that has already passed. Do you still want to set this appointment at this time? '
								)
							) {
								store.dispatch(disableCalendar(true));
								store.dispatch(openAddingAppointment({}));
								store.dispatch(TimeAndStaffID({ time: time, staffID: 0, dataAnyStaff: data }));
							} else {
								return;
							}
						}
						store.dispatch(disableCalendar(true));
						store.dispatch(openAddingAppointment({}));
						store.dispatch(TimeAndStaffID({ time: time, staffID: 0, dataAnyStaff: data }));
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
					const checkWorkingTime = Object.entries(staffAvailable.workingTimes).find(
						(b) => b[0] === currentDayName
					);
					timeEnd = `${moment(currentDay)
						.day(currentDayName)
						.format('YYYY-MM-DD')}T${moment(checkWorkingTime[1].timeEnd, ['h:mm A']).format('HH:mm:ss')}`;
					timeStart = `${moment(currentDay)
						.day(currentDayName)
						.format('YYYY-MM-DD')}T${moment(checkWorkingTime[1].timeStart, ['h:mm A']).format(
							'HH:mm:ss'
						)}`;
					isCheckWorking = checkWorkingTime[1].isCheck;
				}

				const time = moment(start._d.toString().substr(0, 24));

				if (Boolean(isCheckWorking) === true && check_block_temp === false) {
					if (moment(time).isBefore(timeEnd) && moment(time).isSameOrAfter(timeStart)) {
						/* Get timenow merchant's timezone */
						const merchantInfo = store.getState().getIn(['appointment', 'merchantInfo']);
						const timezone = merchantInfo.timezone;
						let timeNow = timezone ? moment_tz.tz(timezone.substring(12)) : moment().local();
						timeNow = `${moment(timeNow).format('YYYY-MM-DD')}T${moment(timeNow).format('HH:mm:ss')}`;
						const _time = `${moment(start).format('YYYY-MM-DD')}T${moment(end).local().format('HH:mm:ss')}`;

						if (moment(_time).isBefore(moment(timeNow))) {
							if (
								window.confirm(
									'This appointment is set for a time that has already passed. Do you still want to set this appointment at this time? '
								)
							) {
								store.dispatch(disableCalendar(true));
								store.dispatch(openAddingAppointment({}));
								store.dispatch(TimeAndStaffID({ time: time, staffID: member.memberId }));
							} else {
								return;
							}
						}

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
			store.dispatch(getApppointmentById({ appointment, event }));
			store.dispatch(disableCalendar(true));
		},

		drop(date_time, jsEvent, ui, idResource) {
			let date = moment(date_time).local();
			const event = $(this).data().event.data;
			const merchantInfo = store.getState().getIn(['appointment', 'merchantInfo']);
			let check = true;
			let check_workingStaff = '';
			let check_staff_drop = false;
			let time_working_start = '';
			let time_working_end = '';
			let totalDuration = 0;
			let check_workingTime = false;

			event.options.forEach((evt) => {
				totalDuration += evt.duration;
			});

			const start_time = `${date.format('YYYY-MM-DD')}T${date.format('HH:mm:ss')}`;
			const end_time =
				event.options.length > 0
					? moment(start_time).add(totalDuration, 'minutes')
					: moment(start_time).add(90, 'minutes');

			const memberdisplay = store.getState().getIn(['appointment', 'appointments', 'calendar']);
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

			/* MOVE APPOINTMET TRONG QUÁ KHỨ */
			if (!checkDragWaitingInThePast(merchantInfo, end_time)) {
				check = 1;
			}
			/* END */

			if (pos !== -1) {
				const currentDay = store.getState().getIn(['appointment', 'currentDay']);
				const currentDayName = moment(currentDay).format('dddd');
				const checkWorkingTime = Object.entries(displayedMembers[parseInt(resourceId)].workingTimes).find(
					(b) => b[0] === currentDayName
				);
				check_workingStaff = checkWorkingTime[1].isCheck;
				time_working_start = checkWorkingTime[1].timeStart;
				time_working_end = checkWorkingTime[1].timeEnd;
			}

			if (!displayedMembers[parseInt(resourceId)]) {
				check = false;
			} else if (check_workingStaff) {
				all_appointments.forEach((app) => {
					if (parseInt(app.memberId) === parseInt(displayedMembers[parseInt(resourceId)].id)) {
						const tempEndTime =
							event.options.length > 0
								? moment(start_time).add(totalDuration, 'minutes')
								: moment(start_time).add(15, 'minutes');
						if (
							moment(start_time).isBetween(app.start, app.end) ||
							moment(tempEndTime).isBetween(app.start, app.end) ||
							moment(app.start).isBetween(start_time, tempEndTime) ||
							moment(app.end).isBetween(start_time, tempEndTime) ||
							(moment(app.start).format('HH:mm') === moment(start_time).format('HH:mm') &&
								moment(app.end).format('HH:mm') === moment(tempEndTime).format('HH:mm'))
						) {
							if (parseInt(app.id) !== parseInt(event.id)) {
								if (app.status === 'BLOCK_TEMP') {
									check = 1;
								} else {
									if (app.status === 'BLOCK') check_workingTime = true;
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
				if (displayedMembers[parseInt(resourceId)] && displayedMembers[parseInt(resourceId)].id === 0) {
					check_staff_drop = false;
				} else {
					check_staff_drop = true;
				}
			}

			if (pos === -1 || check_staff_drop === false || check === 1) {
				$('#full-calendar').fullCalendar(
					'removeEvents',
					(event) => event.data.id === $(this).data().event.data.id
				);
			} else {
				/* check appointment assign overlap */
				// if (check === false && displayedMembers[parseInt(resourceId)].orderNumber !== 0) {
				if (check === false) {
					const text = check_workingTime
						? 'Accept this appointment outside of business hours?'
						: 'Are you sure want to assign appointment at this position ?';
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

			const start_time = moment(event.start).local();
			const end_time = moment(event.end).local();

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
					const merchantInfo = store.getState().getIn(['appointment', 'merchantInfo']);
					const currentDayName = moment(currentDay).format('dddd');
					const businessHour = Object.entries(merchantInfo.businessHour).find((b) => b[0] === currentDayName);

					const endTime =
						event.end !== null
							? `${event.end.format('YYYY-MM-DD')}T${event.end.format('HH:mm:ss')}`
							: moment(start_time).add(90, 'minutes').format('YYYY-MM-DD HH:mm:ss');
					const startTime = `${start_time.format('YYYY-MM-DD')}T${start_time.format('HH:mm:ss')}`;

					const start = `${moment(currentDay).format('YYYY-MM-DD')}T${moment(businessHour[1].timeStart, [
						'h:mm A'
					]).format('HH:mm:ss')}`;
					const end = `${moment(currentDay).format('YYYY-MM-DD')}T${moment(businessHour[1].timeEnd, [
						'h:mm A'
					]).format('HH:mm:ss')}`;

					if (moment(startTime).isBefore(start) || moment(endTime).isAfter(end)) {
						isTest = true;
					}

					if (isTest) {
						if (window.confirm('Accept this appointment outside of business hours?')) {
							store.dispatch(moveAppointment(event.data.id, 0, startTime, endTime, event.data));
							return;
						} else {
							revertFunc();
							return;
						}
					}
					if (moment(event.data.start).format('HH:mm A') === moment(startTime).format('HH:mm A')) {
						store.dispatch(moveAppointment(event.data.id, 0, startTime, endTime, event.data));
						return;
					} else {
						if (
							window.confirm(
								' This Any Staff appointment is set to begin at a different time. Do you want to change original time of appointment? '
							)
						) {
							store.dispatch(moveAppointment(event.data.id, 0, startTime, endTime, event.data));
							return;
						} else {
							revertFunc();
							return;
						}
					}
					return;
				}
			}
			/* end move any staff */

			if (
				(event.resourceId === '0' && event.data.memberId !== 0) ||
				(staffAvailable && staffAvailable.id === 0)
			) {
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
										check_block_grey = true;
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
				const start_time = `${moment(event.start).local().format('YYYY-MM-DD')}T${moment(event.start)
					.local()
					.format('HH:mm:ss')}`;
				const endTime =
					event.end !== null
						? `${moment(event.end).local().format('YYYY-MM-DD')}T${moment(event.end)
							.local()
							.format('HH:mm:ss')}`
						: moment(start_time).add(90, 'minutes').format('YYYY-MM-DD HH:mm:ss');

				if (check === false) {
					const text = check_block_grey
						? 'Accept this appointment outside of business hours?'
						: 'Accept overlapping appointments?';
					if (window.confirm(text)) {
						store.dispatch(
							moveAppointment(event.data.id, parseInt(event.resourceId), start_time, endTime, event.data)
						);
						return;
					} else {
						revertFunc();
						return;
					}
				} else {
					if (event.data.memberId === 0) {
						// move appointment từ cột any staff qua cột khác
						if (moment(event.data.start).format('HH:mm A') === moment(start_time).format('HH:mm A')) {
							store.dispatch(
								moveAppointment(
									event.data.id,
									parseInt(event.resourceId),
									start_time,
									endTime,
									event.data
								)
							);
							return;
						} else {
							if (
								window.confirm(
									' This Any Staff appointment is set to begin at a different time. Do you want to change original time of appointment? '
								)
							) {
								store.dispatch(
									moveAppointment(
										event.data.id,
										parseInt(event.resourceId),
										start_time,
										endTime,
										event.data
									)
								);
								return;
							} else {
								revertFunc();
								return;
							}
						}
					} else {
						const merchantInfo = store.getState().getIn(['appointment', 'merchantInfo']);
						const timezone = merchantInfo.timezone;
						let timeNow = timezone ? moment_tz.tz(timezone.substring(12)) : moment().local();
						const _time = `${moment(end_time).format('YYYY-MM-DD')}T${moment(end_time).format('HH:mm:ss')}`;
						timeNow = `${moment(timeNow).format('YYYY-MM-DD')}T${moment(timeNow).format('HH:mm:ss')}`;
						if (moment(_time).isBefore(moment(timeNow))) {
							const text =
								'This appointment is set for a time that has already passed. Do you still want to set this appointment at this time?';
							if (window.confirm(text)) {
								store.dispatch(
									moveAppointment(
										event.data.id,
										parseInt(event.resourceId),
										start_time,
										endTime,
										event.data
									)
								);
								return;
							} else {
								revertFunc();
								return;
							}
						} else {
							store.dispatch(
								moveAppointment(
									event.data.id,
									parseInt(event.resourceId),
									start_time,
									endTime,
									event.data
								)
							);
							return;
						}
						//move appointment từ staff này qua staff khác
					}
				}
			}
			// }
		},
		eventDragStop: (event, jsEvent) => {
			// if (event.data.status.toString().includes('BLOCK')) {
			// 	return;
			// }
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
						store.dispatch(
							editBlockTime({
								start: event.data.start,
								end: event.data.end,
								note: event.data.code,
								id: event.data.blockId,
								staffId: -1
							})
						);
					}
				}
			}
		},
		/* eslint no-param-reassign: "error" */
		eventRender: (event, element) => {
			if (!event.data.status.toString().includes('BLOCK') && event.data.status.toString() !== "no show") {
				let options = event.data.options.filter(obj => obj.staffId === event.data.memberId);
				let _extrasRender = extrasRender(options, event.data.extras);
				let dataEvent = {
					...event.data,
					extrasRender: _extrasRender
				}
				element[0].innerHTML = EVENT_RENDER_TEMPLATE(dataEvent);
				if (event.data.isVip === 1) {
					element
						.find('div.app-event')
						.prepend("<div class='app-event__full-name2'><img src='" + vip + "' width='18' height='18'></div>");
				}
			} else {
				element[0].innerHTML = EVENT_RENDER_TEMPLATE_BLOCK(event.data);
				if (event.data.isVip === 1) {
					element
						.find('div.app-event')
						.prepend("<div class='app-event__vipBlock'><img src='" + vip + "' width='18' height='18'></div>");
				}
			}

			if (
				event.data.status === 'BLOCK_TEMP_PAID'
				|| event.data.status === 'BLOCK_TEMP_REFUND'
				|| event.data.status === 'no show'
			) {
				const displayedMembers = store.getState().getIn(['appointment', 'members', 'displayed']);
				const allAppointments = store.getState().getIn(['appointment', 'appointments', 'allAppointment']);
				if (event.data.memberId) {
					const member = displayedMembers.find((mem) => parseInt(mem.id) === parseInt(event.data.memberId));
					if (member) {
						const blockTime = member.blockTime ? member.blockTime : [];
						let count = 0;
						blockTime.forEach((block) => {
							const { appointmentId } = block;
							if (parseInt(event.data.id) !== parseInt(appointmentId)) {
								const { start, end } = event.data;
								const app = allAppointments.find((obj) => parseInt(obj.id) === parseInt(appointmentId));
								if (app)
									if (
										(moment(start).isAfter(app.start) && moment(start).isBefore(app.end)) ||
										(moment(end).isAfter(app.start) && moment(end).isBefore(app.end))
									) {
										count += 1;
									}
							}
						});
						if (count >= 2) {
							$(element).css('width', 30 + '%');
						} else if (count === 1) {
							$(element).css('width', 40 + '%');
						} else {
							$(element).css('width', 50 + '%');
						}
					} else {
						$(element).css('width', 50 + '%');
					}
				} else {
					$(element).css('width', 50 + '%');
				}
			}
		},
		resourceRender: (resourceObj, labelTds) => {
			labelTds[0].innerHTML = '';
		}
	};
};

export const addEventsToCalendar = async (currentDate, appointmentsMembers) => {
	//apointmentMember render appointment tai slide hien tai
	$('#full-calendar').fullCalendar('gotoDate', currentDate);
	$('#full-calendar').fullCalendar('removeEvents');
	const events = [];
	appointmentsMembers.forEach((member, index) => {
		if (member.memberId !== 0) {
			member.appointments.filter(app => app.isBlock).forEach((appointment) => {
				events.push({
					resourceId: index + 1,
					start: appointment.start,
					end: appointment.end,
					data: appointment,
					color: getAtrributeByStatus(appointment).eventColor,
					rendering:
						appointment.status === 'BLOCK' || appointment.status === 'BLOCK_TEMP' ? 'background' : '',
					className: getAtrributeByStatus(appointment).eventClass,
					startEditable: !(
						appointment.status === 'PAID' ||
						appointment.status === 'VOID' ||
						appointment.status === 'REFUND' ||
						appointment.status === 'BLOCK_TEMP_PAID' ||
						appointment.status === 'BLOCK_TEMP_REFUND' ||
						appointment.status === 'no show'
					),
					resourceEditable: !(
						appointment.status === 'PAID' ||
						appointment.status === 'VOID' ||
						appointment.status === 'REFUND' ||
						appointment.status === 'BLOCK_TEMP_PAID' ||
						appointment.status === 'BLOCK_TEMP_REFUND' ||
						appointment.status === 'no show'
					)
				});
			});
		}
	});

	const allAppointments = store.getState().getIn(['appointment', 'appointments', 'allAppointment']);

	let blockTimes = store.getState().getIn(['appointment', 'members', 'blockTime']);
	blockTimes = blockTimes.filter(b => parseInt(b.staffId) === 0);
	blockTimes = blockTimes.map(block => {
		const temptApp = mapBlockTemp(block, currentDate, allAppointments);
		return temptApp;
	});

	const blockGreyAnyStaff = allAppointments
		? allAppointments.filter((app) => app.memberId === 0 && app.status !== 'WAITING' && app.status === "BLOCK")
		: [];

	mapAppointmentAnyStaff(blockGreyAnyStaff, events);
	mapAppointmentAnyStaff(blockTimes, events);

	$('#full-calendar').fullCalendar('renderEvents', events);
};
export const deleteEventFromCalendar = (eventId) => {
	$('#full-calendar').fullCalendar('removeEvents', [eventId]);
};

export const updateEventToCalendar = (fcEvent) => {
	let startEditable = true;
	let resourceEditable = true;

	const { status, start, end, isWarning } = fcEvent;
	const { eventColor, eventClass } = getEventStyle(status, isWarning);
	const displayedMembers = store.getState().getIn(['appointment', 'members', 'displayed']);
	const resourceId = displayedMembers.findIndex((mem) => mem.id === fcEvent.memberId);

	const data = {
		resourceId: fcEvent.memberId === 0 && fcEvent.status !== 'WAITING' ? 0 : resourceId + 1,
		start,
		end,
		data: fcEvent,
		color: eventColor,
		className: eventClass,
		startEditable,
		resourceEditable
	};

	$('#full-calendar').fullCalendar('addEventSource', [data]);
};

function getAtrributeByStatus(appointment) {
	const { status, isWarning } = appointment;
	const { eventColor, eventClass } = getEventStyle(status, isWarning);
	return {
		eventColor,
		eventClass
	};
}

function getEventStyle(status, isWarning) {

	let eventColor = '#00b4f7';
	let eventClass = 'event-paid';

	if (status === 'no show') {
		eventColor = '#f1f1f1';
		eventClass = 'event-no-show';
		if (isWarning) {
			eventClass = 'event-no-show-warning';
		} else {
			eventClass = 'event-no-show';
		}
	}

	if (status === 'ASSIGNED') {
		eventColor = '#ffe559';
		eventClass = 'event-assigned';
		if (isWarning) {
			eventClass = 'event-assigned-warning';
		} else {
			eventClass = 'event-assigned';
		}
	}

	if (status === 'CONFIRMED') {
		eventColor = '#baedf7';
		if (isWarning) {
			eventClass = 'event-confirmed-warning';
		} else {
			eventClass = 'event-confirmed';
		}
	}

	if (status === 'CHECKED_IN') {
		eventColor = '#28AAE9';
		eventClass = 'event-checkin';
		if (isWarning) {
			eventClass = 'event-checkin-warning';
		} else {
			eventClass = 'event-checkin';
		}
	}

	if (status === 'PAID') {
		eventColor = '#50CF25';
		if (isWarning) {
			eventClass = 'event-paid-warning';
		} else {
			eventClass = 'event-paid';
		}
	}

	if (status === 'BLOCK_TEMP_ASSIGNED') {
		eventColor = '#ffe559';
		if (isWarning) {
			eventClass = 'event-block-temp-assigned-warning';
		} else {
			eventClass = 'event-block-temp-assigned';
		}
	}

	if (status === 'BLOCK_TEMP_CONFIRMED') {
		eventColor = '#baedf7';
		if (isWarning) {
			eventClass = 'event-block-temp-confirmed-warning';
		} else {
			eventClass = 'event-block-temp-confirmed';
		}
	}

	if (status === 'BLOCK_TEMP_CHECKED_IN') {
		eventColor = '#28AAE9';
		if (isWarning) {
			eventClass = 'event-block-temp-check-in-warning';
		} else {
			eventClass = 'event-block-temp-check-in';
		}
	}

	if (status === 'BLOCK_TEMP_PAID') {
		eventColor = '#38ff05';
		if (isWarning) {
			eventClass = 'event-block-temp-paid-warning';
		} else {
			eventClass = 'event-block-temp-paid';
		}
	}

	if (status === 'BLOCK_TEMP_REFUND') {
		eventColor = '#FB5B54';
		if (isWarning) {
			eventClass = 'event-block-temp-warning';
		} else {
			eventClass = 'event-block-temp';
		}
	}

	if (status === 'VOID' || status === "REFUND") {
		eventColor = '#FD594F';
		if (isWarning) {
			eventClass = 'event-void-warning';
		} else {
			eventClass = 'event-void';
		}
	}

	if (status === 'BLOCK') {
		eventColor = '#b5b5b5';
		eventClass = 'event-block';
	}

	if (status === 'BLOCK_TEMP') {
		eventColor = '#b5b5b5';
		eventClass = 'event-block-temp';
	}

	if (!status) {
		eventColor = 'red';
		eventClass = 'event-paid';
	}

	return {
		eventColor,
		eventClass
	};
}

export const mapBlockTemp = (blockTime, currentDate, appointments) => {
	let temptData;
	const memberId = blockTime.staffId;
	const start = `${moment(currentDate).format('YYYY-MM-DD')}T${moment(blockTime.blockTimeStart, [
		'h:mm A'
	]).format('HH:mm:ss')}`;
	const end = `${moment(currentDate).format('YYYY-MM-DD')}T${moment(blockTime.blockTimeEnd, [
		'h:mm A'
	]).format('HH:mm:ss')}`;

	const note = blockTime.note;
	const appointmentId = blockTime.appointmentId;
	const blockTimeId = blockTime.blockTimeId;
	const isWarning = (blockTime.isWarning && parseInt(memberId === 0)) ? blockTime.isWarning : false;
	const app = appointments.find(obj => obj.id === appointmentId);
	const isVip = app ? app.isVip : 0

	if (checkStatusAppointment(appointmentId, appointments) === 'PAID') {
		temptData = blockTemp(memberId, start, end, note, appointmentId, 'BLOCK_TEMP_PAID', blockTimeId, isVip, isWarning);
	} else if (checkStatusAppointment(appointmentId, appointments) === 'REFUND') {
		temptData = blockTemp(memberId, start, end, note, appointmentId, 'BLOCK_TEMP_REFUND', blockTimeId, isVip, isWarning);
	} else if (checkStatusAppointment(appointmentId, appointments) === 'ASSIGNED') {
		temptData = blockTemp(memberId, start, end, note, appointmentId, 'BLOCK_TEMP_ASSIGNED', blockTimeId, isVip, isWarning);
	} else if (checkStatusAppointment(appointmentId, appointments) === 'CONFIRMED') {
		temptData = blockTemp(memberId, start, end, note, appointmentId, 'BLOCK_TEMP_CONFIRMED', blockTimeId, isVip, isWarning);
	} else if (checkStatusAppointment(appointmentId, appointments) === 'CHECKED_IN') {
		temptData = blockTemp(memberId, start, end, note, appointmentId, 'BLOCK_TEMP_CHECKED_IN', blockTimeId, isVip, isWarning);
	} else if (checkStatusAppointment(appointmentId, appointments) === 'no show') {
		mem.appointments.push(blockTemp(memberId, start, end, note, appointmentId, 'no show', blockTimeId, isVip, isWarning));
	}
	else {
		temptData = blockTemp(memberId, start, end, [], appointmentId, 'BLOCK_TEMP', blockTimeId);
	}

	return temptData;
}

const mapAppointmentAnyStaff = (appointments, events) => {
	appointments.forEach((appointment) => {
		events.push({
			resourceId: 0,
			start: appointment.start,
			end: appointment.end,
			data: appointment,
			color: getAtrributeByStatus(appointment).eventColor,
			rendering: appointment.status === 'BLOCK' || appointment.status === 'BLOCK_TEMP' ? 'background' : '',
			className: getAtrributeByStatus(appointment).eventClass,
			startEditable: !(
				appointment.status === 'PAID' ||
				appointment.status === 'VOID' ||
				appointment.status === 'REFUND' ||
				appointment.status === 'BLOCK_TEMP_PAID' ||
				appointment.status === 'BLOCK_TEMP_REFUND'
			),
			resourceEditable: !(
				appointment.status === 'PAID' ||
				appointment.status === 'VOID' ||
				appointment.status === 'REFUND' ||
				appointment.status === 'BLOCK_TEMP_PAID' ||
				appointment.status === 'BLOCK_TEMP_REFUND'
			)
		});
	});
}