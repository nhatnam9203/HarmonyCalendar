
import { statusConvertKey } from '../../containers/AppointmentPage/utilSaga';
import moment from 'moment'
import moment_tz from 'moment-timezone'

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
        bookingServiceId: extra.BookingServiceId,
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

const giftCardsAdapter = (gift) => {
    return {
        appointmentId: gift.AppointmentId,
        bookingGiftCardId: gift.BookingGiftCardId,
        giftCardId: gift.GiftCardId,
        imageUrl: gift.ImageUrl,
        name: gift.Name,
        price: gift.Price,
        quantity: gift.Quantity,
        settlementId: gift.SettlementId,
        status: gift.Status
    };
};


export function returnAppointment(appointment) {
    return {
        id: appointment.AppointmentId,
        code: `#${appointment.Code}`,
        userFullName: appointment.FirstName,
        firstName: appointment.FirstName,
        lastName: appointment.LastName,
        phoneNumber: appointment.PhoneNumber,
        options: appointment.Services.map((sv) => servicesAdapter(sv)).sort(function (a, b) {
            var c = a.bookingServiceId;
            var d = b.bookingServiceId;
            return d - c;
        }),
        products: appointment.Products.map((product) => productsAdapter(product)).sort(function (a, b) {
            var c = a.bookingProductId;
            var d = b.bookingProductId;
            return d - c;
        }),
        extras: appointment.Extras.map((extra) => extrasAdapter(extra)).sort(function (a, b) {
            var c = a.bookingExtraId;
            var d = b.bookingExtraId;
            return d - c;
        }),
        status: appointment.Status ? statusConvertKey[appointment.Status] : "ASSIGNED",
        memberId: appointment.StaffId,
        start: appointment.FromTime,
        end: appointment.Duration && parseInt(appointment.Duration) > 0 ? appointment.ToTime : moment(appointment.FromTime).add('minutes', 15),
        user_id: appointment.UserId,
        createDate: appointment.CreatedDate,
        tipPercent: appointment.TipPercent,
        tipAmount: appointment.TipAmount,
        subTotal: appointment.SubTotal,
        tax: appointment.Tax,
        giftCard: appointment.GiftCard,
        giftCards: appointment.GiftCards ? appointment.GiftCards.map((gift) => giftCardsAdapter(gift)).sort(function (a, b) {
            var c = a.bookingGiftCardId;
            var d = b.bookingGiftCardId;
            return d - c;
        }) : [],
        discount: appointment.Discount,
        customerId: appointment.CustomerId,
        isVip: appointment.IsVip,
        total: appointment.Total,
        bookingGroupId: appointment.BookingGroupId,
        companionName: appointment.CompanionName,
        companionPhone: appointment.CompanionPhone,
        isMainBookingGroup: appointment.IsMainBookingGroup,
        notes: appointment.Notes
            .sort(function (a, b) {
                var c = a.AppointmentNoteId;
                var d = b.AppointmentNoteId;
                return d - c;
            })
            .map((note) => notesAdapter(note))
    };
}


export const PromiseAction = async (action, data) => {
    return await new Promise((resolve, rejects) => {
        action({ data, resolve, rejects });
    });
};


export const PromiseAction2 = async (action, data) => {
    return await new Promise((resolve, rejects) => {
        const body = {
            data,
            resolve,
            rejects
        }
        console.log({ body })
        action(body);
    });
};


export function checkDragWaitingInThePast(merchantInfo, start_time) {
    const timezone = merchantInfo.timezone;
    let timeNow = timezone ? moment_tz.tz(timezone.substring(12)) : moment().local();
    timeNow = `${moment(timeNow).format("YYYY-MM-DD")}T${moment(timeNow).format('HH:mm:ss')}`;
    if (moment(start_time).isBefore(moment(timeNow))) {
        if (window.confirm('This appointment is set for a time that has already passed. Do you still want to set this appointment at this time? ')) {
            return true;
        } else {
            return false;
        }
    }
    return true;
}