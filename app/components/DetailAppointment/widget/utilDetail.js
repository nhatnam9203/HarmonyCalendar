export const statusConvertData = {
	ASSIGNED: 'unconfirm',
	CONFIRMED: 'confirm',
	CHECKED_IN: 'checkin',
	PAID: 'paid',
	WAITING: 'waiting',
	CANCEL: 'cancel'
};

export const convertAppointment = (appointment) => {
	return {
		id: appointment.id,
		code: appointment.code,
		userFullName: appointment.firstName,
		firstName: appointment.firstName,
		lastName: appointment.lastName,
		phoneNumber: appointment.phoneNumber,
		services: appointment.options.sort(function(a, b) {
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
		status: statusConvertData[appointment.status],
		staffId: appointment.memberId,
		fromTime: appointment.start,
		toTime: appointment.end,
		userId: appointment.user_id,
		createDate: appointment.createDate,
		tipPercent: appointment.tipPercent,
		tipAmount: appointment.tipAmount,
		subTotal: appointment.subTotal,
		customerId : appointment.customerId,
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

export const initialState = {
	noteValue: '',
	confirmationModal: false,
	userFullName: '',
	old_service: [],
	old_product: [],
	old_extra: [],
	services: [],
	products: [],
	extras: [],
	prices: [],
	old_prices: [],
	pricesExtras: [],
	old_priceExtras: [],
	old_total_duration: 0,
	dayChange: new Date(),
	old_dayChange: new Date(),
	fromTime: moment(),
	old_fromTime: moment(),
	toTime: new Date(),
	notes: [],
	newNotes: [],
	time: new Date(),
	old_selectedStaff: {
		id : 75876786678,
	},
	selectedStaff: {
		id : 544564564564
	},
	isOpenStaffList: false,
	cloneAppointment: '',

	isPopupDay: false,
	isChange: false,
	isPopupStaff : false,
	indexPopupStaff : '',
	isPopupTimePicker : false,
	isPoupPrice : false,
	indexPrice : '',
	valuePriceIndex : '',
	isPopupPriceState : 'service'
};