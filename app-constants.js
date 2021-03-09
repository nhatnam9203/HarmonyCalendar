import getURLParam from './app/utils/helper';

export const token = getURLParam('token');
export const storeid = getURLParam('storeid');
export const merchantId = getURLParam('merchantid');
export const staffId = getURLParam('staffId');
export const deviceId = getURLParam('deviceId');
export const role = getURLParam('role');

export const API_PORT = 8010;

// const DEV_API_BASE_URL = `https://api.harmonypayment.com`;
// const PROD_API_BASE_URL = `https://api.harmonypayment.com`;

// export const DEV_API_BASE_URL = `https://dev.harmonypayment.com`;
// export const PROD_API_BASE_URL = `https://dev.harmonypayment.com`;

export const DEV_API_BASE_URL = `https://staging.harmonypayment.com`;
export const PROD_API_BASE_URL = `https://staging.harmonypayment.com`;

export const isDesktopOrLaptop = window.innerWidth > 1000 ? true : false;

export const API_BASE_URL =
  process.env.NODE_ENV === 'production' ? `${PROD_API_BASE_URL}/api` : `${DEV_API_BASE_URL}/api`;
export const BASE_URL =
  process.env.NODE_ENV === 'production' ? `${PROD_API_BASE_URL}` : `${DEV_API_BASE_URL}`;

export const GET_MEMBERS_API = `${API_BASE_URL}/staff/getbymerchant/${merchantId}?getDisabled=${false}`;
export const GET_MEMBER = `${API_BASE_URL}/staff/getbydate/${merchantId}?date=`;
export const GET_APPOINTMENT_BY_DATE = `${API_BASE_URL}/appointment/date`;
export const GET_APPOINTMENT_STATUS = `${API_BASE_URL}/appointment/getbystatus?status=waiting`;
export const PUT_STATUS_APPOINTMENT_API = `${API_BASE_URL}/appointment`;
export const PUT_UPDATE_STATUS_APPOINTMENT = `${API_BASE_URL}/appointment/updatestatus`;
export const GET_BY_PHONE = `${API_BASE_URL}/customer/getbyphone`;
export const POST_ADD_CUSTOMER = `${API_BASE_URL}/customer`;
export const POST_ADD_APPOINTMENT = `${API_BASE_URL}/appointment`;
export const GET_APPOINTMENT_ID = `${API_BASE_URL}/appointment`;
export const GET_CHECKPINCODE = `${API_BASE_URL}/staff/signin`;
export const POST_ADD_BLOCK_TIME = `${API_BASE_URL}/blocktime`;
export const DELETE_BLOCKTIME_API = `${API_BASE_URL}/blocktime`;
export const EDIT_BLOCKTIME_API = `${API_BASE_URL}/blocktime`;
export const GET_BLOCK_TIME_BY_STAFFID_API = `${API_BASE_URL}/blocktime`;
export const GET_WORKINGTIME_MERCHANT = `${API_BASE_URL}/blocktime?workingdate=`;
export const PUT_CHECKOUT = `${API_BASE_URL}/appointment/checkout`;
export const API_GET_TIME_STAFF_LOGIN = `${API_BASE_URL}/staff/loginTime`;
export const PUT_UPDATE_NOTE = `${API_BASE_URL}/appointment/note`;
export const GET_SENDLINK_CUSTOMER = `${API_BASE_URL}/user/sendlink?phone=`;
export const GET_DETAIL_MERCHANT = `${API_BASE_URL}/merchant/brief`
export const PUT_UPDATE_COMPANION = `${API_BASE_URL}/appointment/updateCompanion`
export const UPDATE_STAFF_APPOINTMENT_PAID = `${API_BASE_URL}/appointment/updateStaffAppointmentPaid`;
export const SEARCH_CUSTOMER_BOX = `${API_BASE_URL}/appointment/search?key=`;
export const NOTIFICATION_COUNT_UNREAD = `${API_BASE_URL}/notification/countUnRead?api-version=2.0`;
export const NOTIFICATION_MASK_READ = `${API_BASE_URL}/notification/view`;
export const NOTIFICATION_GET_BY_PAGE = `${API_BASE_URL}/notification`;
export const NOTIFICATION_DELETE = `${API_BASE_URL}/notification?ids=`;
export const VAR_DEFAULT_AVATAR_PATH = `/upload/staff/avatar.svg`;
