import moment from 'moment'

export const statusConvertData = {
    ASSIGNED: 'unconfirm',
    CONFIRMED: 'confirm',
    CHECKED_IN: 'checkin',
    PAID: 'paid',
    WAITING: 'waiting',
    CANCEL: 'cancel',
  };

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
		options: appointment.services.sort(function (a, b) {
			var c = a.bookingServiceId;
			var d = b.bookingServiceId;
			return d - c;
		}),
		products: appointment.products.sort(function (a, b) {
			var c = a.bookingProductId;
			var d = b.bookingProductId;
			return d - c;
		}),
		extras: appointment.extras.sort(function (a, b) {
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
		isVip: appointment.isVip,
		discount: appointment.discount,
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
    }
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
    }
}

export function blockTemp(memberId, start, end, note,appointmentId) {
    return {
        status: 'BLOCK_TEMP',
        memberId,
        start,
        end,
        id: '',
        // appointmentId : appointmentId ? appointmentId : 0,
        code: '',
        userFullName:'',
        phoneNumber: note,
        options: [],
        products: [],
        extras: [],
        notes: [],
    }
}

export function addBlockCalendar(appointmentsMembers, displayedMembers, currentDate, apiDateQuery) {
    appointmentsMembers.forEach(mem => {
        const memFind = displayedMembers.find(member => member.id === mem.memberId);
        const blockTimeMember = memFind.blockTime.filter(b => moment(b.workingDate).format('YYYY-MM-DD') === apiDateQuery);
        for (let i = 0; i < blockTimeMember.length; i++) {
            const memberId = mem.memberId;
            const start = `${moment(currentDate).format('YYYY-MM-DD')}T${moment(blockTimeMember[i].blockTimeStart, ["h:mm A"]).format("HH:mm:ss")}`;
            const end = `${moment(currentDate).format('YYYY-MM-DD')}T${moment(blockTimeMember[i].blockTimeEnd, ["h:mm A"]).format("HH:mm:ss")}`;
            const note = blockTimeMember[i].note;
            mem.appointments.push(blockTemp(memberId, start, end, note,blockTimeMember[i].appointmentId));
        }
    });

    switch (moment(currentDate).format('dddd')) {
        case 'Monday':
            appointmentsMembers.forEach(mem => {
                const memFind = displayedMembers.find(member => member.id === mem.memberId);
                if (memFind.workingTimes.Monday.isCheck === false) {
                    mem.appointments.push(addFullBlock(mem.memberId, currentDate, 'Monday'))
                }
                else {
                    const blockStart = block(
                        mem.memberId,
                        `${moment(currentDate).day('Monday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Monday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
                        `${moment(currentDate).day('Monday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
                    );
                    const blockEnd = block(
                        mem.memberId,
                        `${moment(currentDate).day('Monday').format('YYYY-MM-DD')}T${moment().startOf('days').add(6, 'hours').format("HH:mm:ss")}`,
                        `${moment(currentDate).day('Monday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Monday.timeStart, ["h:mm A"]).format("HH:mm:ss")}`,
                    );
                    mem.appointments.push(blockStart, blockEnd);
                }
            });
            break;
        case 'Tuesday':
            appointmentsMembers.forEach(mem => {
                const memFind = displayedMembers.find(member => member.id === mem.memberId);
                if (memFind.workingTimes.Tuesday.isCheck === false) {
                    mem.appointments.push(addFullBlock(mem.memberId, currentDate, 'Tuesday'))
                }
                else {
                    const blockStart = block(
                        mem.memberId,
                        `${moment(currentDate).day('Tuesday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Tuesday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
                        `${moment(currentDate).day('Tuesday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
                    );
                    const blockEnd = block(
                        mem.memberId,
                        `${moment(currentDate).day('Tuesday').format('YYYY-MM-DD')}T${moment().startOf('days').add(6, 'hours').format("HH:mm:ss")}`,
                        `${moment(currentDate).day('Tuesday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Tuesday.timeStart, ["h:mm A"]).format("HH:mm:ss")}`,
                    );
                    mem.appointments.push(blockStart, blockEnd);
                }
            });
            break;
        case 'Wednesday':
            appointmentsMembers.forEach(mem => {
                const memFind = displayedMembers.find(member => member.id === mem.memberId);
                if (memFind.workingTimes.Wednesday.isCheck === false) {
                    mem.appointments.push(addFullBlock(mem.memberId, currentDate, 'Wednesday'))
                }
                else {
                    const blockStart = block(
                        mem.memberId,
                        `${moment(currentDate).day('Wednesday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Wednesday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
                        `${moment(currentDate).day('Wednesday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
                    );
                    const blockEnd = block(
                        mem.memberId,
                        `${moment(currentDate).day('Wednesday').format('YYYY-MM-DD')}T${moment().startOf('days').add(6, 'hours').format("HH:mm:ss")}`,
                        `${moment(currentDate).day('Wednesday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Wednesday.timeStart, ["h:mm A"]).format("HH:mm:ss")}`,
                    );
                    mem.appointments.push(blockStart, blockEnd);
                }
            });
            break;

        case 'Thursday':
            appointmentsMembers.forEach(mem => {
                const memFind = displayedMembers.find(member => member.id === mem.memberId);
                if (memFind.workingTimes.Thursday.isCheck === false) {
                    mem.appointments.push(addFullBlock(mem.memberId, currentDate, 'Thursday'))
                }
                else {
                    const blockStart = block(
                        mem.memberId,
                        `${moment(currentDate).day('Thursday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Thursday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
                        `${moment(currentDate).day('Thursday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
                    );
                    const blockEnd = block(
                        mem.memberId,
                        `${moment(currentDate).day('Thursday').format('YYYY-MM-DD')}T${moment().startOf('days').add(6, 'hours').format("HH:mm:ss")}`,
                        `${moment(currentDate).day('Thursday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Thursday.timeStart, ["h:mm A"]).format("HH:mm:ss")}`,
                    );
                    mem.appointments.push(blockStart, blockEnd);
                }
            });
            break;

        case 'Friday':
            appointmentsMembers.forEach(mem => {
                const memFind = displayedMembers.find(member => member.id === mem.memberId);
                if (memFind.workingTimes.Friday.isCheck === false) {
                    mem.appointments.push(addFullBlock(mem.memberId, currentDate, 'Friday'))
                }
                else {
                    const blockStart = block(
                        mem.memberId,
                        `${moment(currentDate).day('Friday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Friday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
                        `${moment(currentDate).day('Friday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
                    );
                    const blockEnd = block(
                        mem.memberId,
                        `${moment(currentDate).day('Friday').format('YYYY-MM-DD')}T${moment().startOf('days').add(6, 'hours').format("HH:mm:ss")}`,
                        `${moment(currentDate).day('Friday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Friday.timeStart, ["h:mm A"]).format("HH:mm:ss")}`,
                    );
                    mem.appointments.push(blockStart, blockEnd);
                }
            });
            break;

        case 'Saturday':
            appointmentsMembers.forEach(mem => {
                const memFind = displayedMembers.find(member => member.id === mem.memberId);
                if (memFind.workingTimes.Saturday.isCheck === false) {
                    mem.appointments.push(addFullBlock(mem.memberId, currentDate, 'Saturday'))
                }
                else {
                    const blockStart = block(
                        mem.memberId,
                        `${moment(currentDate).day('Saturday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Saturday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
                        `${moment(currentDate).day('Saturday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
                    );
                    const blockEnd = block(
                        mem.memberId,
                        `${moment(currentDate).day('Saturday').format('YYYY-MM-DD')}T${moment().startOf('days').add(6, 'hours').format("HH:mm:ss")}`,
                        `${moment(currentDate).day('Saturday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Saturday.timeStart, ["h:mm A"]).format("HH:mm:ss")}`,
                    );
                    mem.appointments.push(blockStart, blockEnd);
                }
            });
            break;

        case 'Sunday':
            appointmentsMembers.forEach(mem => {
                const memFind = displayedMembers.find(member => member.id === mem.memberId);
                if (memFind.workingTimes.Sunday.isCheck === false) {
                    mem.appointments.push(addFullBlock(mem.memberId, currentDate, 'Sunday'))
                }
                else {
                    const blockStart = block(
                        mem.memberId,
                        `${moment(currentDate).day('Sunday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Sunday.timeEnd, ["h:mm A"]).format("HH:mm:ss")}`,
                        `${moment(currentDate).day('Sunday').endOf('days').format('YYYY-MM-DD')}T${moment().endOf('days').subtract(1, 'hours').add(1, 'seconds').format('HH:mm:ss')}`,
                    );
                    const blockEnd = block(
                        mem.memberId,
                        `${moment(currentDate).day('Sunday').format('YYYY-MM-DD')}T${moment().startOf('days').add(6, 'hours').format("HH:mm:ss")}`,
                        `${moment(currentDate).day('Sunday').format('YYYY-MM-DD')}T${moment(memFind.workingTimes.Sunday.timeStart, ["h:mm A"]).format("HH:mm:ss")}`,
                    );
                    mem.appointments.push(blockStart, blockEnd);
                }
            });
            break;

        default:
            break;
    }
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

export function totalDuationChangeTime(appointment, extras) {
    let totalDuration = 0;
    appointment.options.forEach(app => {
        totalDuration += app.duration;
    });
    extras.forEach(ext => {
        totalDuration += ext.duration;
    });
    return totalDuration;
}

export function totalDuartionUpdateAppointment(servicesUpdate, extras) {
    let new_total_duration = 0;
    servicesUpdate.forEach(sv => {
        new_total_duration += parseInt(sv.duration);
    });
    extras.forEach(ext => {
        new_total_duration += parseInt(ext.duration);
    });
    return new_total_duration;
}

export function newDateUpdateAppointment(status, old_duration, new_total_duration, end) {
    let newDate;
    if (status === 'checkin' || status === 'confirm') {
        if (parseInt(old_duration) > parseInt(new_total_duration)) {
            const newDuration = parseInt(old_duration) - parseInt(new_total_duration);
            newDate = moment(end).subtract(newDuration, 'minutes').format();
        }
        else {
            const newDuration = parseInt(new_total_duration) - parseInt(old_duration);
            newDate = moment(end).add(newDuration, 'minutes').format();
        }
    }
    else {
        newDate = moment(end).add(new_total_duration, 'minutes').format();
    }
    return newDate;
}

export function dataUpdateAppointment(old_status, memberId, old_appointment, status, notesUpdate, start, newDate, servicesUpdate, productsUpdate, extrasUpdate) {
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
            notes: notesUpdate
        };
    }
    else {
        data = {
            staffId: memberId,
            fromTime: start,
            toTime: newDate,
            status,
            services: servicesUpdate,
            products: productsUpdate,
            extras: extrasUpdate,
            notes: notesUpdate
        };
    }
    return data;
}

export function totalDurationAssignAppointment(extras, appointment) {
    let duration_total = 0;
    appointment.options.forEach(el => {
        duration_total += parseInt(el.duration);
    });
    extras.forEach(ext => {
        duration_total += parseInt(ext.duration);
    });
    return duration_total;
}

export function dataAssignAppointment(memberId, start, duration_total, status, options, products, extras) {
    return {
        staffId: memberId,
        fromTime: start,
        toTime: duration_total > 0 ? moment(start).add(duration_total, 'minutes').format().substr(0, 19) : moment(start).add(15, 'minutes').format().substr(0, 19),
        status: statusConvertData[status],
        services: options,
        products,
        extras
    };
}

export function dataChangeTimeAppointment(selectedStaff, start_time, end_time, appointment, statusChange, options, products, extras, notesUpdate) {
    return {
        staffId: selectedStaff.id,
        fromTime: start_time,
        toTime: end_time,
        status: appointment.status === 'CHECKED_IN' ? statusChange : 'unconfirm',
        services: options,
        products: products,
        extras,
        notes: notesUpdate
    };
}

export function dataPutBackAppointment(memberId, start, end, options, products, extras) {
    return {
        staffId: memberId,
        fromTime: start,
        toTime: end,
        status: 'waiting',
        services: options,
        products,
        extras
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