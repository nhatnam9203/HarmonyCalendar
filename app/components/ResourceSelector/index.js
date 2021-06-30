import React from 'react';
import moment from 'moment';
import moment_tz from "moment-timezone";
import layout from './layout';

function chunk(array, size) {
	const chunkedArr = [];
	for (let i = 0; i < array.length; i += 1) {
		const last = chunkedArr[chunkedArr.length - 1];
		if (!last || last.length === size) {
			chunkedArr.push([array[i]]);
		} else {
			last.push(array[i]);
		}
	}
	return chunkedArr;
}

class ResourceSelector extends layout {
	constructor(props) {
		super(props);
		this.refPrevButton = React.createRef();
		this.refNextButton = React.createRef();
		this.state = {
			isLoadingStaff: false
		}
	}

	toggleNotification = () => {
		this.props.toggleNotification(true);
		this.props.getNotification({ page: 1 });
	}



	async componentWillReceiveProps(nextProps) {
		const { appointmentScroll, isScrollToAppointment, isAssignAnyStaffToStaff } = nextProps;
		if (isScrollToAppointment === true && isScrollToAppointment !== this.props.isScrollToAppointment) {
			await this.findSlideScroll(appointmentScroll);
			await this.verticalScrollToAppointment(appointmentScroll);
			this.resetScrollAppointment();
		}

		if (nextProps.isFirstReloadCalendar == false && this.props.isFirstReloadCalendar !== nextProps.isFirstReloadCalendar) {
			const { resources, qtyResources } = this.props;
			const slide = chunk(resources, parseInt(qtyResources));

			if (slide.length > 1 && slide[slide.length - 1].length <= qtyResources && slide[slide.length - 1].length > 1) {
					await this.setState({ isLoadingStaff: true });
					this.refNextButton.current.click();
					setTimeout(() => {
						this.refPrevButton.current.click();
					}, 700);

					setTimeout(() => {
						this.setState({ isLoadingStaff: false });
					}, 1500);
			}
		}

		if (isAssignAnyStaffToStaff == true && isAssignAnyStaffToStaff !== this.props.isAssignAnyStaffToStaff) {

			let appAssignStaff = JSON.parse(localStorage.getItem('appointmentAssignStaff'));
			let appointmentExpand = JSON.parse(localStorage.getItem('appointmentExpand'));
			if (appAssignStaff || appointmentExpand) {
				let appointmentId = appAssignStaff ? appAssignStaff.AppointmentId : appointmentExpand.AppointmentId;
				await this.afterSlide(0);
				await this.findSlideScroll(appointmentId);
				await this.verticalScrollToAppointment(appointmentId);
				setTimeout(() => {
					this.props.anystaffAssignStaff(false);
					localStorage.removeItem('appointmentAssignStaff');
					localStorage.removeItem('appointmentExpand');
				}, 500);
			}
		}
	}

	resetScrollAppointment = () => {
		this.props.scrollToAppointment('');
		this.props.startScrollToAppointment(false);
	}

	findSlideScroll = (appointmentId) => {
		const { allAppointment, resources, slideIndex } = this.props;
		let app = allAppointment.find(app => app.id === appointmentId);

		if (app) {
			const { memberId } = app;
			let indexStaff = resources.findIndex(s => parseInt(s.id) === parseInt(memberId));
			let slideIndexAppointment = parseInt((indexStaff + 1) / this.props.qtyResources);
			let slideNeedToScroll = slideIndexAppointment - slideIndex;
			this.scrollToAppointment(slideNeedToScroll);
		}
	}
	verticalScrollToAppointment(appointmentId) {
		var els = document.getElementsByClassName("apppointment-calendar");
		Array.prototype.forEach.call(els, function (el) {
			let text = el.outerText;
			if (text.toString().includes(appointmentId.toString())) {
				el.scrollIntoView();
			}
		});
	}

	scrollToAppointment(slideNeedToScroll) {
		if (slideNeedToScroll > 0) {
			for (let i = 1; i <= Math.abs(slideNeedToScroll); i++) {
				this.refNextButton.current.click();
			}
		}
		if (slideNeedToScroll < 0) {
			for (let i = 1; i <= Math.abs(slideNeedToScroll); i++) {
				this.refPrevButton.current.click();
			}
		}
	}
	componentWillMount() {
		const { currentDay } = this.props;
		const dateCalendar = JSON.parse(localStorage.getItem('date'));
		if (dateCalendar) {
			this.props.getAppointmentAnyStaff(dateCalendar);
			setTimeout(() => {
				localStorage.removeItem('date');
			}, 500);
		} else {
			this.props.getAppointmentAnyStaff(moment(currentDay, ['DDMMYYYY']).format('YYYY-MM-DD'));
		}
		// this.props.getDetailMerchant({ isFirstLoad: true });
	}

	onPrevClick(event, previousSlide) {
		previousSlide(event);
	}

	onNextClick(event, nextSlide) {
		nextSlide(event);
	}


	afterSlide(index) {
		const {isLoadingStaff} = this.state;
		const { resources } = this.props;
		const { qtyResources } = this.props;
		const quantity = parseInt(qtyResources);
		this.props.setDisplayedMembers(resources.slice(index * quantity, index * quantity + quantity));
		if(!isLoadingStaff){
			this.props.renderAppointment();
		}
		this.props.setSlideIndex(index);
	}

	onTodayClick() {
		const { timezone } = this.props.merchantInfo;
		let timeNow = timezone ? moment_tz.tz(timezone.substring(12)).format('DDMMYYYY') : moment().format('DDMMYYYY');
		this.props.countAppointmentAnyStaff({ date: moment(timeNow, ['DDMMYYYY']).format('YYYY-MM-DD'), isDayClick: true, isReloadCalendar: true });
		localStorage.setItem('scrollNow', true);
		// this.props.onChangeToday(timeNow);
	}

	openPincode(staff) {
		if (navigator.onLine) {
			this.props.togglePopupPincode(true, staff);
			this.props.disableCalendar(true);
			this.props.getTimeStaffLogin(staff.id);
		} else {
			alert('You must have an internet connection to perform this !');
		}
	}

	getActiveArrow() {
		const { slideIndex, resources } = this.props;

		const { qtyResources } = this.props;
		let isActiveLeft = false,
			isActiveRight = false;
		const totalSlide = (resources.length - 1) / (qtyResources);

		if (totalSlide <= 1) {
			isActiveLeft = false;
			isActiveRight = false;
		} else if (totalSlide > 1) {
			if (slideIndex > 0) {
				if (slideIndex < totalSlide) {
					if (totalSlide - slideIndex <= 1) {
						isActiveRight = false;
						isActiveLeft = true;
					} else {
						isActiveRight = true;
						isActiveLeft = true;
					}
				}
				if (slideIndex === totalSlide) {
					isActiveRight = false;
					isActiveLeft = true;
				}
			} else {
				isActiveLeft = false;
				isActiveRight = true;
			}
		}

		return {
			isActiveLeft,
			isActiveRight
		};
	}

}

export default ResourceSelector;
