/**
 * Get Query String Params from URL
 */

export default function getURLParam(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function checkOnline() {
	let check = false;
	if (navigator.onLine) {
		check = true;
	}
	return check;
}

export function formatUsPhone(phone) {
	phone = phone.replace(/\D/g, '');
	const match = phone.match(/^(\d{1,3})(\d{0,3})(\d{0,4})$/);
	if (match) {
		phone = `${match[1]}${match[2] ? '-' : ''}${match[2]}${match[3] ? '-' : ''}${match[3]}`;
	}
	return phone;
}

export function isCharNumber(c) {
	return c >= '0' && c <= '9';
}

export function checkStringNumber(chuoi) {
	let number = '';
	for (let i = 0; i < chuoi.length; i++) {
		if (isCharNumber(chuoi[i])) {
			number = number + chuoi[i].toString();
		}
	}
	return number.toString();
}

export function checkStringNumber2(chuoi) {
	let number = '';
	for (let i = 0; i < chuoi.length; i++) {
		if (isCharNumber(chuoi[i]) || chuoi[i] === '-') {
			number = number + chuoi[i].toString();
		}
	}
	if (number.charAt(number.length - 1) === '-') number = number.substring(0, number.length - 1);
	return number.toString();
}

export function formatPhone(phone) {
	let phoneFotmat = '';
	if (phone) {
		if (phone.charAt(0) === '1') {
			phoneFotmat = '+1-' + formatUsPhone(phone.substring(1));
		} else if (phone.charAt(0) === '8' && phone.charAt(1) === '4') {
			phoneFotmat = '+84-' + formatUsPhone(phone.substring(2));
		} else if (phone.charAt(0) === '+' && phone.charAt(1) === '1') {
			phoneFotmat = '+1-' + formatUsPhone(phone.substring(2));
		} else if (phone.charAt(0) === '+' && phone.charAt(1) === '8' && phone.charAt(2) === '4') {
			phoneFotmat = '+84-' + formatUsPhone(phone.substring(3));
		} else {
			return phone;
		}
	}
	return phoneFotmat;
}

export function formatPhoneCalendar(phone) {
	let phoneFotmat = '';
	if (phone) {
		if (phone.charAt(0) === '1') {
			phoneFotmat = formatUsPhone(phone.substring(1));
		} else if (phone.charAt(0) === '8' && phone.charAt(1) === '4') {
			phoneFotmat = formatUsPhone(phone.substring(2));
		} else if (phone.charAt(0) === '+' && phone.charAt(1) === '1') {
			phoneFotmat = formatUsPhone(phone.substring(2));
		} else if (phone.charAt(0) === '+' && phone.charAt(1) === '8' && phone.charAt(2) === '4') {
			phoneFotmat = formatUsPhone(phone.substring(3));
		} else {
			return phone;
		}
	}
	return phoneFotmat;
}


export function api(path, params, method, token) {

	let options;
	options = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
			// ...(token && { token: token })
		},
		method: method,
		...(params && { body: JSON.stringify(params) })
	};

	return fetch(path, options)
		.then((resp) => {
			if (resp.status === 200) return resp.json();
		})
		.then((json) => json)
		.catch((error) => error);
}

export const PromiseAction = async (action, data) => {
	return await new Promise((resolve, rejects) => {
		action({ data, resolve, rejects });
	});
};

export function scrollToNow() {
	setTimeout(() => {
		const x = document.getElementsByClassName('fc-now-indicator fc-now-indicator-arrow');
		for (let i = 0; i < x.length; i++) {
			x[i].scrollIntoView();
		}

	}, 50);
}

export function convertMinsToHrsMins(mins) {
	let h = Math.floor(mins / 60);
	let m = mins % 60;
	// h = h < 10 ? '0' + h : h;
	// m = m < 10 ? '0' + m : m;
	if (h !== 0) {
		if (m !== 0) {
			return `${h} hour ${m} min`;
		} else {
			return `${h} hour`;
		}
	}
	return `${m} min`;
}


export const getWindowSize = () => {

	let size = "medium"
	const width = window.screen.width;

	if (parseInt(width) > 1200) {
		size = "superLarge";
	} else
		if (parseInt(width) < 1024) {
			size = "medium";
		} else if (parseInt(width) >= 1024) {
			size = "large";
		}
	return size;
}