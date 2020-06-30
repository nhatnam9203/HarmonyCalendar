
import { statusConvertKey } from '../../containers/AppointmentPage/utilSaga';

const servicesAdapter = (service) => {
	return {
		appointmentId: service.AppointmentId,
		bookingServiceId: service.BookingServiceId,
		duration: service.Duration,
		price: service.Price,
		serviceId: service.ServiceId,
		serviceName: service.ServiceName,
		staffId: service.StaffId
	};
};
const productsAdapter = (product) => {
	return {
		appointmentId: product.AppointmentId,
		bookingProductId: product.BookingProductId,
		productId: product.ProductId,
		productName: product.ProductName,
		quantity: product.Quantity,
		price: product.Price
	};
};
const extrasAdapter = (extra) => {
	return {
		appointmentId: extra.AppointmentId,
		bookingExtraId: extra.BookingExtraId,
		duration: extra.Duration,
		extraId: extra.ExtraId,
		extraName: extra.ExtraName,
		price: extra.Price
	};
};

const notesAdapter = (notes) => {
	return {
		appointmentId: notes.AppointmentId,
		appointmentNoteId: notes.AppointmentNoteId,
		createDate: notes.CreateDate,
		note: notes.Note,
		staffId: notes.StaffId,
		staffName: notes.StaffName
	};
};

export function	returnAppointment(appointment) {
    return {
        id: appointment.AppointmentId,
        code: `#${appointment.Code}`,
        userFullName: appointment.FirstName,
        firstName: appointment.FirstName,
		lastName: appointment.LastName,
        phoneNumber: appointment.PhoneNumber,
        options: appointment.Services.map((sv) => servicesAdapter(sv)).sort(function(a, b) {
            var c = a.bookingServiceId;
            var d = b.bookingServiceId;
            return d - c;
        }),
        products: appointment.Products.map((product) => productsAdapter(product)).sort(function(a, b) {
            var c = a.bookingProductId;
            var d = b.bookingProductId;
            return d - c;
        }),
        extras: appointment.Extras.map((extra) => extrasAdapter(extra)).sort(function(a, b) {
            var c = a.bookingExtraId;
            var d = b.bookingExtraId;
            return d - c;
        }),
        status: statusConvertKey[appointment.Status],
        memberId: appointment.StaffId,
        start: appointment.FromTime,
        end: appointment.ToTime,
        user_id: appointment.UserId,
        createDate: appointment.CreatedDate,
        tipPercent: appointment.TipPercent,
        tipAmount: appointment.TipAmount,
        subTotal: appointment.SubTotal,
        tax: appointment.Tax,
        giftCard: appointment.GiftCard,
        discount: appointment.Discount,
        customerId : appointment.CustomerId,
        isVip : appointment.IsVip,
        total: appointment.Total,
        notes: appointment.Notes
            .sort(function(a, b) {
                var c = a.AppointmentNoteId;
                var d = b.AppointmentNoteId;
                return d - c;
            })
            .map((note) => notesAdapter(note))
    };
}