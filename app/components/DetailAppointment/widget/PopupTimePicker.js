import React, { Component } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import styled from 'styled-components';
import Picker from 'react-mobile-picker';
import moment from 'moment';

const PopupTimePK = styled.div`
	position: absolute;
	top: 2.8rem;
	left: 0rem;
	background-color: #ffffff;
	border-radius: 5px;
	z-index: 999999999999999;
	width: 22rem;
	height: 18rem;
	box-shadow: 0 3px 9px rgba(0, 0, 0, 0.15);
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
	font-weight: 900;
	font-size: 1rem;
	color : #585858;
`;

const Body = styled.div`height: 12rem;`;

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
	& > span {
		font-weight: 500;
		font-family : 'Arial'
	},
`;

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
				hour: [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12' ],
				minutes: [ '00', '15', '30', '45' ],
				localization: [ 'AM', 'PM' ]
			}
		};
	}

	componentDidMount() {
		const { fromTime } = this.props;
		this.setState({
			valueGroups: {
				hour: moment(fromTime).format('hh'),
				minutes: moment(fromTime).minutes().toString(),
				localization: moment(fromTime).format('A')
			}
		});
	}

	componentWillReceiveProps(nextProps) {
		const { fromTime } = nextProps;
		this.setState({
			valueGroups: {
				hour: moment(fromTime).format('hh'),
				minutes: moment(fromTime).minutes().toString(),
				localization: moment(fromTime).format('A')
			}
		});
	}

	handleChange = (name, value) => {
		this.setState(({ valueGroups }) => ({
			valueGroups: {
				...valueGroups,
				[name]: value
			}
		}));
	};

	done() {
		const { valueGroups } = this.state;
		const { hour, minutes, localization } = valueGroups;
		const { currentDay } = this.props;

		const time = `${moment(currentDay).format('MM/DD/YYYY')} ${hour}:${minutes} ${localization}`;
		this.props.doneTimePicker(time);
	}

	cancel() {
		this.props.cancelTimePicker();
	}

	render() {
		const { fromTime , style } = this.props;
		const { optionGroups, valueGroups } = this.state;
		return (
			<OutsideClickHandler onOutsideClick={() => this.cancel()}>
				<PopupTimePK style={style}>
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
							<span>Cancel</span>
						</Button>
						<Button borderBottomRight onClick={() => this.done()}>
							<span>Done</span>
						</Button>
					</Footer>
				</PopupTimePK>
			</OutsideClickHandler>
		);
	}
}
