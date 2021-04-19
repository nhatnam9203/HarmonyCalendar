

export const helperAnyStaffWidth = (resourceWidth) =>{
	let tempWidth = 7;
	let temResourceWidth = resourceWidth;
	if (temResourceWidth == 9) {
		tempWidth = 10.1;
	} else if (temResourceWidth == 10) {
		tempWidth = 7.4;
	} else if (temResourceWidth == 11) {
		tempWidth = 6.05;
	} else if (temResourceWidth == 12) {
		tempWidth = 4.025;
	}

	let width = `calc(((100vw - 5.05rem - ((100vw - 5.05rem) / 10)) / 9)`;
	if (temResourceWidth !== 8) {
		width = `calc(((100vw - 5.05rem - ((100vw - 5.05rem) / 10)) / ${tempWidth}) * 2)`;
	}
	const ths = document.querySelectorAll(".fc-bg table tbody tr td")
	ths[1].style.width = width;
	const tds = document.querySelectorAll(".fc-body .fc-time-grid .fc-content-skeleton table tbody tr td");
	tds[1].style.width = width;
}