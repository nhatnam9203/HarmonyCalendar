import getURLParam from './app/utils/helper';

export const token = getURLParam('token');
export const storeid = getURLParam('storeid');
export const merchantId = getURLParam('merchantid');
export const staffId = getURLParam('staffId');

export const API_PORT = 8010;

// export const DEV_API_BASE_URL = `https://api.harmonypayment.com`;
// export const PROD_API_BASE_URL = `https://api.harmonypayment.com`;

 export const DEV_API_BASE_URL = `https://api2.levincidemo.com`;
 export const PROD_API_BASE_URL = `https://api2.levincidemo.com`;

export const API_BASE_URL =
  process.env.NODE_ENV === 'production' ? `${PROD_API_BASE_URL}/api` : `${DEV_API_BASE_URL}/api`;
export const BASE_URL =
  process.env.NODE_ENV === 'production' ? `${PROD_API_BASE_URL}` : `${DEV_API_BASE_URL}`;

// export const GET_MEMBERS_API = `${API_BASE_URL}/staff`;
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
export const GET_BLOCK_TIME_BY_STAFFID_API = `${API_BASE_URL}/blocktime`;
export const GET_WORKINGTIME_MERCHANT = `${API_BASE_URL}/blocktime?workingdate=`;
export const PUT_CHECKOUT = `${API_BASE_URL}/appointment/checkout`;
export const API_GET_TIME_STAFF_LOGIN = `${API_BASE_URL}/staff/loginTime`;
export const VAR_DEFAULT_AVATAR_PATH = `/upload/staff/avatar.svg`;


