import getURLParam from './app/utils/helper';

const token = getURLParam('token');
const storeid = getURLParam('storeid');
const merchantId = getURLParam('merchantid');
const staffId = getURLParam('staffId');
const deviceId = getURLParam('deviceId');

const API_PORT = 8010;

// const DEV_API_BASE_URL = `https://api.harmonypayment.com`;
// const PROD_API_BASE_URL = `https://api.harmonypayment.com`;

const DEV_API_BASE_URL = `https://dev.harmonypayment.com`;
const PROD_API_BASE_URL = `https://dev.harmonypayment.com`;

//  const DEV_API_BASE_URL = `https://staging.harmonypayment.com`;
//  const PROD_API_BASE_URL = `https://staging.harmonypayment.com`;

const isDesktopOrLaptop = window.innerWidth > 1000 ? true : false;


const API_BASE_URL =
  process.env.NODE_ENV === 'production' ? `${PROD_API_BASE_URL}/api` : `${DEV_API_BASE_URL}/api`;
const BASE_URL =
  process.env.NODE_ENV === 'production' ? `${PROD_API_BASE_URL}` : `${DEV_API_BASE_URL}`;

const GET_MEMBERS_API = `${API_BASE_URL}/staff/getbymerchant/${merchantId}?getDisabled=${false}`;
const GET_MEMBER = `${API_BASE_URL}/staff/getbydate/${merchantId}?date=`;
const GET_APPOINTMENT_BY_DATE = `${API_BASE_URL}/appointment/date`;
const GET_APPOINTMENT_STATUS = `${API_BASE_URL}/appointment/getbystatus?status=waiting`;
const PUT_STATUS_APPOINTMENT_API = `${API_BASE_URL}/appointment`;
const PUT_UPDATE_STATUS_APPOINTMENT = `${API_BASE_URL}/appointment/updatestatus`;
const GET_BY_PHONE = `${API_BASE_URL}/customer/getbyphone`;
const POST_ADD_CUSTOMER = `${API_BASE_URL}/customer`;
const POST_ADD_APPOINTMENT = `${API_BASE_URL}/appointment`;
const GET_APPOINTMENT_ID = `${API_BASE_URL}/appointment`;
const GET_CHECKPINCODE = `${API_BASE_URL}/staff/signin`;
const POST_ADD_BLOCK_TIME = `${API_BASE_URL}/blocktime`;
const DELETE_BLOCKTIME_API = `${API_BASE_URL}/blocktime`;
const EDIT_BLOCKTIME_API = `${API_BASE_URL}/blocktime`;
const GET_BLOCK_TIME_BY_STAFFID_API = `${API_BASE_URL}/blocktime`;
const GET_WORKINGTIME_MERCHANT = `${API_BASE_URL}/blocktime?workingdate=`;
const PUT_CHECKOUT = `${API_BASE_URL}/appointment/checkout`;
const API_GET_TIME_STAFF_LOGIN = `${API_BASE_URL}/staff/loginTime`;
const PUT_UPDATE_NOTE = `${API_BASE_URL}/appointment/note`;
const GET_SENDLINK_CUSTOMER = `${API_BASE_URL}/user/sendlink?phone=`;
const GET_DETAIL_MERCHANT = `${API_BASE_URL}/merchant`
const PUT_UPDATE_COMPANION = `${API_BASE_URL}/appointment/updateCompanion`

const VAR_DEFAULT_AVATAR_PATH = `/upload/staff/avatar.svg`;

export {
  token,
  storeid,
  merchantId,
  staffId,
  deviceId,
  API_PORT,
  API_BASE_URL,
  BASE_URL,
  PROD_API_BASE_URL,
  GET_MEMBERS_API,
  GET_MEMBER,
  GET_APPOINTMENT_BY_DATE,
  GET_APPOINTMENT_STATUS,
  PUT_STATUS_APPOINTMENT_API,
  PUT_UPDATE_STATUS_APPOINTMENT,
  GET_BY_PHONE,
  POST_ADD_CUSTOMER,
  POST_ADD_APPOINTMENT,
  GET_APPOINTMENT_ID,
  GET_CHECKPINCODE,
  POST_ADD_BLOCK_TIME,
  EDIT_BLOCKTIME_API,
  DELETE_BLOCKTIME_API,
  GET_BLOCK_TIME_BY_STAFFID_API,
  GET_WORKINGTIME_MERCHANT,
  PUT_CHECKOUT,
  API_GET_TIME_STAFF_LOGIN,
  PUT_UPDATE_NOTE,
  GET_SENDLINK_CUSTOMER,
  GET_DETAIL_MERCHANT,
  PUT_UPDATE_COMPANION,
  VAR_DEFAULT_AVATAR_PATH,
  isDesktopOrLaptop,
}


