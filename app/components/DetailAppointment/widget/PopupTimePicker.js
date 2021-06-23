import React, { Component } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import styled from 'styled-components';
import Picker from 'react-mobile-picker';
import moment from 'moment';
import Popup from 'reactjs-popup';

const Container = styled(Popup)`
    padding : 0 !important;
    border-radius: 5px !important;
	background-color: #ffffff;
	z-index: 999999999999999;
	width: 22rem;
	height: 17rem;
	box-shadow: 0 3px 9px rgba(0, 0, 0, 0.15);    
	width: 22rem !important;
`;

const Header = styled.div`
	width: 100%;
	height: 3rem;
	padding: 15px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #eaeaea;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
	font-weight: 500;
	font-size: 1.17rem;
	color : #585858;
	font-family : 'arial'
`;

const Body = styled.div`
	height: 11rem;
	overflow: hidden;
`;

const Footer = styled.div`
	width: 100%;
	flex-direction: row;
	display: flex;
	border: '4px solid #333';
	background-color: #eaeaea;
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
	border-top: 2px solid #dddddd;
`;

const Button = styled.div`
	width: 50%;
	height: 3rem;
	justify-content: center;
	align-items: center;
	display: flex;
	color: #1366af;
	background-color: #eaeaea;
	border-bottom-left-radius: 8px;
	border-bottom-right-radius: ${(props) => (props.borderBottomRight ? '8px' : 0)};
	border-right: ${(props) => (props.borderRight ? '2px solid #dddddd' : 0)};
	zIndex: 1111;
	& > div {
		font-weight: 500;
	},
`;

const minutesArr = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

export default class PopupTimePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			valueGroups: {
				hour: '08',
				minutes: '30',
				localization: 'AM'
			},
			optionGroups: {
				hour: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
				minutes: minutesArr,
				localization: ['AM', 'PM']
			}
		};
	}


	componentDidMount() {
		const { fromTimeService } = this.props;
		this.setState({
			valueGroups: {
				hour: moment(fromTimeService).format('hh'),
				minutes: moment(fromTimeService).minutes().toString(),
				localization: moment(fromTimeService).format('A')
			}
		});
	}

	componentWillReceiveProps(nextProps) {
		const { fromTimeService } = nextProps;
		this.setState({
			valueGroups: {
				hour: moment(fromTimeService).format('hh'),
				minutes: moment(fromTimeService).minutes().toString(),
				localization: moment(fromTimeService).format('A')
			},

		});
	}

	handleChange = (name, value) => {
		this.setState(({ valueGroups }) => ({
			valueGroups: {
				...valueGroups,
				[name]: value
			},
		}));
	};

	done() {
		const { valueGroups } = this.state;
		const { hour, minutes, localization } = valueGroups;
		const { currentDay, indexFromTime } = this.props;

		const time = `${moment(currentDay).format('MM/DD/YYYY')} ${hour}:${minutes} ${localization}`;
		this.props.doneTimePicker(time, indexFromTime);
	}

	cancel() {
		this.props.cancelTimePicker();
	}

	render() {
		const { style, isPopupTimePicker } = this.props;
		const { optionGroups, valueGroups } = this.state;
		return (
			<OutsideClickHandler onOutsideClick={() => this.cancel()}>
				<Container style={style} closeOnDocumentClick={false} open={isPopupTimePicker} position="right center">
					<Header>Select Time</Header>
					<Body>
						<Picker
							optionGroups={optionGroups}
							valueGroups={valueGroups}
							onChange={(name, value) => this.handleChange(name, value)}
						/>
					</Body>
					<Footer>
						<Button borderRight onClick={() => this.cancel()}>
							<div>Cancel</div>
						</Button>
						<Button borderBottomRight onClick={() => this.done()}>
							<div>Done</div>
						</Button>
					</Footer>
				</Container>
			</OutsideClickHandler>
		);
	}
}
