import moment from 'moment';

export const statusConvertData = {
	ASSIGNED: 'unconfirm',
	CONFIRMED: 'confirm',
	CHECKED_IN: 'checkin',
	PAID: 'paid',
	WAITING: 'waiting',
	CANCEL: 'cancel',
	VOID: 'void',
	REFUND: 'refund'
};

export const statusConvertKey = {
	unconfirm: 'ASSIGNED',
	confirm: 'CONFIRMED',
	checkin: 'CHECKED_IN',
	paid: 'PAID',
	waiting: 'WAITING',
	cancel: 'CANCEL',
	pending: 'PENDING',
	void: 'VOID',
	refund: 'REFUND',
};

export const appointmentAdapter = (appointment) => {
	return {
		id: appointment.appointmentId,
		code: `#${appointment.code}`,
		userFullName: appointment.firstName,
		firstName: appointment.firstName,
		lastName: appointment.lastName,
		phoneNumber: appointment.phoneNumber,
		options: appointment.services,
		products: appointment.products,
		extras: appointment.extras,
		categories: appointment.categories,
		customerNote: appointment.customerNote ? appointment.customerNote : '',
		status: statusConvertKey[appointment.status] ? statusConvertKey[appointment.status] : 'no show',
		memberId: appointment.staffId,
		start: appointment.fromTime,
		end:
			appointment.fromTime !== appointment.toTime
				? appointment.toTime
				: `${moment(appointment.fromTime).add('minutes', 15).format('YYYY-MM-DD')}T${moment(appointment.fromTime).add('minutes', 15).format('HH:mm:ss')}`,
		user_id: appointment.userId,
		createDate: appointment.createdDate,
		tipPercent: appointment.tipPercent,
		tipAmount: appointment.tipAmount,
		subTotal: appointment.subTotal,
		total: appointment.total,
		tax: appointment.tax,
		isVip: appointment.isVip,
		discount: appointment.discount,
		bookingGroupId: appointment.bookingGroupId,
		companionName: appointment.companionName,
		companionPhone: appointment.companionPhone,
		isMainBookingGroup: appointment.isMainBookingGroup,
		customerId: appointment.customerId,
		giftCard: appointment.giftCard,
		giftCards: appointment.giftCards ? appointment.giftCards : [],
		notes: appointment.notes
			? appointment.notes.sort(function (a, b) {
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

export function addFullBlock(memberId, currentDate, day) {
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
		isBlock: true,
	};
}

export function block(memberId, start, end) {
	return {
		status: 'BLOCK',
		memberId: memberId,
		start,
		end,
		id: '',
		code: '',
		userFullName: '',
		phoneNumber: '',
		options: [],
		products: [],
		extras: [],
		notes: [],
		isBlock: true,
	};
}

const notesServices = (notes = []) => {
	let noteServices = [];
	for (let i = 0; i < notes.length; i++) {
		if (notes[i].includes("- ")) {
			noteServices.push(notes[i])
		}
	}
	return noteServices;
}

const splitNotes = (note) => {
	let tempNote = note.toString().replace("</br>", "<br>");
	tempNote = tempNote.split("<br>");
	return {
		blockName: tempNote[0],
		blockPhone: tempNote[1],
		blockService: notesServices(tempNote)
	}
}

export function blockTemp(memberId, start, end, note, appointmentId, status, blockId, isVip, isWarning) {
	let tempNote = splitNotes(note);
	return {
		status,
		memberId,
		start,
		end,
		isVip,
		id: appointmentId ? appointmentId : 0,
		code: note,
		userFullName: '',
		phoneNumber: '',
		options: [],
		products: [],
		extras: [],
		notes: [],
		blockId,
		blockName: tempNote.blockName ? tempNote.blockName : "",
		blockPhone: tempNote.blockPhone ? tempNote.blockPhone.toString().replace("+84", "").replace("+1", "") : "",
		blockService: tempNote.blockService ? tempNote.blockService : "",
		isBlock: true,
		isWarning,
	};
}

export function checkStatusAppointment(appointmentId, appointments) {
	let find = false;
	appointments.forEach(appointment => {
		if (appointment.id === appointmentId) {
			if (appointment.status === 'PAID')
				find = 'PAID';
			if (appointment.status === 'REFUND' || appointment.status === 'VOID')
				find = 'REFUND'
			if (appointment.status === 'ASSIGNED')
				find = 'ASSIGNED'
			if (appointment.status === 'CONFIRMED')
				find = 'CONFIRMED'
			if (appointment.status === 'CHECKED_IN')
				find = 'CHECKED_IN'
			if (appointment.status === 'no show')
				find = 'no show'
		}
	})
	return find
}

export function addBlockCalendar(appointmentsMembers, displayedMembers, currentDate, apiDateQuery, appointments) {
	const currentDayName = moment(currentDate).format('dddd');
	/* ADD BLOCK TEMP ( YELLOW BLOCK ) */
	appointmentsMembers.forEach((mem) => {
		const memFind = displayedMembers.find((member) => member.id === mem.memberId);
		const blockTimeMember = memFind.blockTime.filter(
			(b) => moment(b.workingDate).format('YYYY-MM-DD') === apiDateQuery
		);

		for (let i = 0; i < blockTimeMember.length; i++) {
			const memberId = mem.memberId;
			const start = `${moment(currentDate).format('YYYY-MM-DD')}T${moment(blockTimeMember[i].blockTimeStart, [
				'h:mm A'
			]).format('HH:mm:ss')}`;
			const end = `${moment(currentDate).format('YYYY-MM-DD')}T${moment(blockTimeMember[i].blockTimeEnd, [
				'h:mm A'
			]).format('HH:mm:ss')}`;
			const note = blockTimeMember[i].note;
			const appointmentId = blockTimeMember[i].appointmentId;
			const blockTimeId = blockTimeMember[i].blockTimeId;
			const isWarning = blockTimeMember[i].isWarning;
			const app = appointments.find(obj => obj.id === appointmentId);
			const isVip = app ? app.isVip : 0

			if (checkStatusAppointment(appointmentId, appointments) === 'PAID') {
				mem.appointments.push(blockTemp(memberId, start, end, note, appointmentId, 'BLOCK_TEMP_PAID', blockTimeId, isVip, isWarning));
			} else if (checkStatusAppointment(appointmentId, appointments) === 'REFUND') {
				mem.appointments.push(blockTemp(memberId, start, end, note, appointmentId, 'BLOCK_TEMP_REFUND', blockTimeId, isVip, isWarning));
			} else if (checkStatusAppointment(appointmentId, appointments) === 'ASSIGNED') {
				mem.appointments.push(blockTemp(memberId, start, end, note, appointmentId, 'BLOCK_TEMP_ASSIGNED', blockTimeId, isVip, isWarning));
			} else if (checkStatusAppointment(appointmentId, appointments) === 'CONFIRMED') {
				mem.appointments.push(blockTemp(memberId, start, end, note, appointmentId, 'BLOCK_TEMP_CONFIRMED', blockTimeId, isVip, isWarning));
			} else if (checkStatusAppointment(appointmentId, appointments) === 'CHECKED_IN') {
				mem.appointments.push(blockTemp(memberId, start, end, note, appointmentId, 'BLOCK_TEMP_CHECKED_IN', blockTimeId, isVip, isWarning));
			}
			else if (checkStatusAppointment(appointmentId, appointments) === 'no show') {
				mem.appointments.push(blockTemp(memberId, start, end, note, appointmentId, 'no show', blockTimeId, isVip, isWarning));
			}
			else {
				mem.appointments.push(blockTemp(memberId, start, end, [], appointmentId, 'BLOCK_TEMP', blockTimeId));
			}
		}
	});

	/* ADD BLOCK ( GREY BLOCK ) */
	appointmentsMembers.forEach((mem) => {
		const memFind = displayedMembers.find((member) => member.id === mem.memberId);
		const checkWorkingTime = Object.entries(memFind.workingTimes).find((b) => b[0] === currentDayName);

		if (checkWorkingTime[1].isCheck === false) {
			mem.appointments.push(addFullBlock(mem.memberId, currentDate, currentDayName));
		} else {
			const blockStart = block(
				mem.memberId,
				`${moment(currentDate).day(currentDayName).format('YYYY-MM-DD')}T${moment(checkWorkingTime[1].timeEnd, [
					'h:mm A'
				]).format('HH:mm:ss')}`,
				`${moment(currentDate).day(currentDayName).endOf('days').format('YYYY-MM-DD')}T${moment()
					.endOf('days')
					.subtract(1, 'seconds')
					.format('HH:mm:ss')}`
			);
			const blockEnd = block(
				mem.memberId,
				`${moment(currentDate).day(currentDayName).format('YYYY-MM-DD')}T${moment()
					.startOf('days')
					.format('HH:mm:ss')}`,
				`${moment(currentDate).day(currentDayName).format('YYYY-MM-DD')}T${moment(
					checkWorkingTime[1].timeStart,
					['h:mm A']
				).format('HH:mm:ss')}`
			);

			mem.appointments.push(blockStart, blockEnd);
		}
	});
	return;
}

export function checkTimeToAddAppointmdent() {
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

export function totalDuationChangeTime(appointment, extras, services) {
	let totalDuration = 0;

	services.forEach((app) => {
		if (appointment.memberId === app.staffId) totalDuration += app.duration;
		extras.forEach((ext) => {
			if (app.bookingServiceId === ext.bookingServiceId) totalDuration += ext.duration;
		});
	});

	return totalDuration;
}

export function totalDuartionUpdateAppointment(services, extras, appointment) {
	let total = 0;
	const lastIndex = findLastIndex(services, appointment);
	for (let i = 0; i < services.length; i++) {
		total += services[i].duration;
		const findExtra = extras.find((ex) => ex.bookingServiceId && ex.bookingServiceId === services[i].bookingServiceId);
		if (findExtra) {
			total += findExtra.duration;
		}
		if (i === lastIndex) {
			break;
		}
	}

	return total;
}

export function newDateUpdateAppointment(status, old_duration, new_total_duration, end) {
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
	return newDate;
}

export function dataUpdateAppointment(
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
) {
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
			giftCards
		};
	} else {
		data = {
			staffId: memberId,
			fromTime: start,
			toTime: newDate,
			status,
			services: servicesUpdate,
			products: productsUpdate,
			extras: extrasUpdate,
			giftCards
		};
	}
	return data;
}

export function totalDurationAssignAppointment(extras, appointment) {
	let duration_total = 0;
	appointment.options.forEach((el) => {
		if (appointment.memberId === el.staffId) duration_total += parseInt(el.duration);
	});
	extras.forEach((ext) => {
		duration_total += parseInt(ext.duration);
	});

	return duration_total;
}

export function dataAssignAppointment(memberId, start, duration_total, status, options, products, extras) {
	return {
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
}

const optionsAdataper = (options, fromTime) => {
	let services = [...options];
	for (let i = 0; i < services.length; i++) {
		services[i].fromTime = moment(fromTime).format('MM/DD/YYYY') + ' ' + moment(services[i].fromTime).format('hh:mm A');
	}
	return services;
}

export function dataChangeTimeAppointment(
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
) {
	let status = 'unconfirm';
	const services = optionsAdataper(options, start_time);
	if (memberId !== 0) {
		if (appointment.status === 'CHECKED_IN') {
			status = statusChange;
		} else {
			status = 'unconfirm';
		}
	} else if (memberId === 0 && appointment.memberId === 0) {
		status = 'unconfirm'
	}
	else {
		/* change appointment trong cột any stafff tới staff khác */
		if (memberId === 0 && appointment.memberId !== 0) {
			const now = moment();
			if (now.isBefore(appointment.end) && now.isAfter(appointment.start)) {
				status = 'checkin'
			}
		} else {
			status = statusConvertData[appointment.status];
		}
	}

	if(appointment.status === "CONFIRMED"){
		status = "confirm";
	}

	return {
		staffId: selectedStaff.id,
		fromTime: start_time,
		toTime: end_time,
		status,
		services,
		products: products,
		extras,
		giftCards
	};
}

export function dataPutBackAppointment(memberId, start, end, options, products, extras, giftCards) {
	return {
		staffId: memberId,
		fromTime: start,
		toTime: end,
		status: 'waiting',
		services: options,
		products,
		extras,
		giftCards
	};
}

export function dataMoveAppoinment(memberId, start, end, status, options, products, extras) {
	return {
		staffId: memberId,
		fromTime: start,
		toTime: end,
		status: statusConvertData[status],
		services: options,
		products,
		extras
	};
}

export function findLastIndex(services, appointment) {
	let lastIndex = -1;
	for (let i = services.length - 1; i >= 0; i--) {
		if (services[i].staffId === appointment.memberId) {
			lastIndex = i;
			break;
		}
	}
	return lastIndex;
}

export function findLastIndexChangeTime(services, sv) {
	let lastIndex = -1;
	if (sv) {
		for (let i = services.length - 1; i >= 0; i--) {
			if (services[i].staffId === sv.staffId) {
				lastIndex = i;
				break;
			}
		}
	}
	return lastIndex;
}

export function totalDurationMoveAppointment(services, extras) {
	let total = 0;
	services.forEach((sv) => {
		total += sv.duration;
	});

	extras.forEach((ex) => {
		total += ex.duration;
	});

	return total;
}

const cloneWorkingTime = {
	Monday: {
		isCheck: true,
		timeEnd: '08:00 PM',
		timeStart: '10:00 AM'
	},
	Tuesday: {
		isCheck: true,
		timeEnd: '08:00 PM',
		timeStart: '10:00 AM'
	},
	Wednesday: {
		isCheck: true,
		timeEnd: '08:00 PM',
		timeStart: '10:00 AM'
	},
	Thursday: {
		isCheck: true,
		timeEnd: '08:00 PM',
		timeStart: '10:00 AM'
	},
	Friday: {
		isCheck: true,
		timeEnd: '08:00 PM',
		timeStart: '10:00 AM'
	},
	Saturday: {
		isCheck: true,
		timeEnd: '08:00 PM',
		timeStart: '10:00 AM'
	},
	Sunday: {
		isCheck: true,
		timeEnd: '08:00 PM',
		timeStart: '10:00 AM'
	}
};

export function addLastStaff(members) {
	return {
		id: 0,
		title: `Any staff`,
		imageUrl: '',
		orderNumber: 99999999999,
		workingTimes: cloneWorkingTime,
		isDisabled: false,
		pincode: 0,
		isNextAvailableStaff: false,
		blockTime: [],
		timeLogin: 0
	};
}

export function addBlockAnyStaff(merchantInfo, currentDayName, currentDate, appointments) {
	const businessHour = Object.entries(merchantInfo.businessHour).find((b) => b[0] === currentDayName);
	if (merchantInfo) {
		const blockStart = block(
			0,
			`${moment(currentDate).day(currentDayName).format('YYYY-MM-DD')}T${moment(businessHour[1].timeEnd, [
				'h:mm A'
			]).format('HH:mm:ss')}`,
			`${moment(currentDate).day(currentDayName).endOf('days').format('YYYY-MM-DD')}T${moment()
				.endOf('days')
				// .subtract(1, 'hours')
				.subtract(1, 'seconds')
				.format('HH:mm:ss')}`
		);
		const blockEnd = block(
			0,
			`${moment(currentDate).day(currentDayName).format('YYYY-MM-DD')}T${moment()
				.startOf('days')
				// .add(6, 'hours')
				.format('HH:mm:ss')}`,
			`${moment(currentDate).day(currentDayName).format('YYYY-MM-DD')}T${moment(businessHour[1].timeStart, [
				'h:mm A'
			]).format('HH:mm:ss')}`
		);
		appointments.push(blockStart, blockEnd);
	}
}

export function new_total_duration(services, extras) {
	let total = 0;
	if (services.length === 1) {
		total += services[0].duration;
		for (let j = 0; j < extras.length; j++) {
			if (extras[j].bookingServiceId === services[0].bookingServiceId) {
				total += extras[j].duration;
			}
		}
	}
	if (services.length > 1) {
		let servicesTemp = _servicesTemp(services);
		for (let i = 0; i < servicesTemp.length; i++) {
			total += servicesTemp[i].duration;
			for (let j = 0; j < extras.length; j++) {
				if (extras[j].bookingServiceId === servicesTemp[i].bookingServiceId) {
					total += extras[j].duration;
				}
			}
		}
	}
	return total;
}

const _servicesTemp = (services) => {
	let firstServices = { ...services[0] };
	let arrTemp = [];
	for (let i = 0; i < services.length; i++) {
		if (firstServices.staffId !== services[i].staffId) {
			break;
		} else {
			arrTemp.push(services[i])
		}
	}
	if (arrTemp.length > 1) {
		arrTemp.pop();
	}
	return arrTemp;
}

export function checkMerchantWorking(merchantInfo, fromTime) {
	const { businessHour } = merchantInfo;
	const day = moment(fromTime).format('dddd');
	const dayCheck = Object.entries(businessHour).find((obj) => obj[0] === day);
	if (!dayCheck[1].isCheck) {
		return false;
	}
	return true;
}

export function adapterServicesMoved(services = [], staffId) {
	let arrTemp = [];
	for (let i = 0; i < services.length; i++) {
		if (staffId)
			services[i].staffId = staffId;
		arrTemp.push(services[i]);
	}
	return arrTemp;
}

export const blockTempFrontEnd = (appointment, newEndTime) => {
	const { memberId, start, firstName, phoneNumber, createdDate, options, products, extras } = appointment;
	return {
		appointmentId: appointment.id,
		blockTimeEnd: moment(newEndTime).format('hh:mm A'),
		blockTimeId: "",
		blockTimeStart: moment(start).format('hh:mm A'),
		bookingServiceId: "",
		createdDate,
		editable: false,
		isDisabled: 0,
		isPaid: false,
		merchantId: "",
		note: `${firstName}<br>${phoneNumber}<br>${tempServices(options)}${tempProducts(products)}${tempExtras(extras)}`,
		staffId: memberId,
		workingDate: `${moment(start).format('YYYY-MM-DD')}T00:00:00`
	}
}

const tempServices = (services) => {
	return services.map(sv => "- " + sv.serviceName + "<br>");
}

const tempExtras = (extras) => {
	return extras.map(ex => "- " + ex.extraName + "<br>");
}

const tempProducts = (products) => {
	return products.map(p => "- " + p.productName + "<br>");
}
