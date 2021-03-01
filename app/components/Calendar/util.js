
import { statusConvertKey } from '../../containers/AppointmentPage/utilSaga';
import moment from 'moment'
import moment_tz from 'moment-timezone'
import { formatPhone, formatPhoneCalendar } from '../../utils/helper';
import { store } from 'app';


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
        options: appointment.Services,
        products: appointment.Products,
        extras: appointment.Extras,
        status: appointment.Status ? statusConvertKey[appointment.Status] : "ASSIGNED",
        memberId: appointment.StaffId,
        start: appointment.FromTime,
        categories: appointment.Categories,
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
            return c - d;
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
        action(body);
    });
};


export function checkDragWaitingInThePast(merchantInfo, time) {
    const timezone = merchantInfo.timezone;
    let timeNow = timezone ? moment_tz.tz(timezone.substring(12)) : moment().local();
    timeNow = `${moment(timeNow).format("YYYY-MM-DD")}T${moment(timeNow).format('HH:mm:ss')}`;
    if (moment(time).isBefore(moment(timeNow))) {
        if (window.confirm('This appointment is set for a time that has already passed. Do you still want to set this appointment at this time? ')) {
            return true;
        } else {
            return false;
        }
    }
    return true;
}

export function checkAnyStaffFuture() {
    let nowDay = store.getState().getIn(['appointment', 'currentDay']);
    nowDay = moment(nowDay).format('YYYY-MM-DD');
    const infoMerchant = store.getState().getIn(['appointment', 'merchantInfo']);
    const time_zone = infoMerchant.timezone;
    let time_now = time_zone ? moment_tz.tz(time_zone.substring(12)) : moment();
    let t_z = `${moment(time_now).format("YYYY-MM-DD")}T${moment(time_now).format('HH:mm:ss')}`;
    t_z = moment(t_z).format('YYYY-MM-DD');
    const _diff = moment(nowDay).diff(moment(t_z), 'days');
    if (_diff > 0) {
        return true;
    }
    return false;
}

const OPTION_RENDER_TEMPLATE = (option) => `<div class="app-event__option">- ${option.serviceName}</div>`;
const PRODUCT_RENDER_TEMPLATE = (product) => `<div class="app-event__option">- ${product.productName}</div>`;
const EXTRAS_RENDER_TEMPLATE = (extra) => `<div class="app-event__option">- ${extra.extraName}</div>`;

const BLOCK_RENDER_SERVICE = (obj) => `<div class="app-event__option">${obj}</div>`;


export const EVENT_RENDER_TEMPLATE = (event) => `
  <div class="app-event">
    <div class="app-event__full-name">${event.userFullName}</div>
    <div class="app-event__phone-number">
    ${formatPhoneCalendar(event.phoneNumber)}</div>
    <div class="app-event__option-container">
        ${event.options.filter(obj => obj.staffId === event.memberId).map((option) => OPTION_RENDER_TEMPLATE(option)).join('')}
    </div>
    <div class="app-event__option-container">
        ${event.products.map((product) => PRODUCT_RENDER_TEMPLATE(product)).join('')}
    </div>
    <div class="app-event__option-container">
        ${event.extrasRender.map((extra) => EXTRAS_RENDER_TEMPLATE(extra)).join('')}
    </div>
    <div class="app-event__id-number">${event.code}</div>
  </div>
`;

export const EVENT_RENDER_TEMPLATE_BLOCK = (event) => `
  <div class="app-event">
    <div class="app-event__blockName">${event.blockName ? event.blockName : ""}</div>
    <div class="app-event__blockPhone">${event.blockPhone ? event.blockPhone : ""}</div>
    <div class="app-event__blockService">
    ${event.blockService && event.blockService.length > 0 ?
        event.blockService.map(obj => BLOCK_RENDER_SERVICE(obj)).join('') :
        ""}
    </div>
  </div>
`;

export const extrasRender = (services = [], extras = []) => {
    let arrTemp = [];
    for (let i = 0; i < services.length; i++) {
        for (let j = 0; j < extras.length; j++) {
            if(services[i].bookingServiceId === extras[j].bookingServiceId){
                arrTemp.push(extras[j]);
            }
        }
    }
    return arrTemp;
}