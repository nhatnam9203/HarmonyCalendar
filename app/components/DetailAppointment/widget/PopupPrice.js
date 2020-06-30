import React, { Component } from 'react';
import styled from 'styled-components';
import Popup from 'reactjs-popup';
import { FaDollarSign } from 'react-icons/fa';
import CurrencyInput from 'react-currency-masked-input';

const PricePopup = styled(Popup)`
    	width: 22rem !important;
	height: 10.4rem !important;
    padding : 0 !important;
    border-radius: 5px !important;
`;

const Container = styled.div`
	background-color: #ffffff;
	border-radius: 5px;
	z-index: 999999999999999;
	width: 22rem;
	height: 10.4rem;
	box-shadow: 0 3px 9px rgba(0, 0, 0, .175);
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
`;

const Body = styled.div`
	height: 4.6rem;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	position: relative;
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
	& > span {
		font-weight: bold;
	}
`;

const InputPrice = styled.div`
	border: 1px solid #dddddd;
	border-radius: 3px;
	height: 2.3rem;
	width: 85%;
	padding: 0.8rem;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

export default class PopupPrice extends Component {
	constructor(props) {
		super(props);
		this.state = {
			price: '',
			isZero: false,
			isFocus: false
		};
	}

	closePopup() {
		this.props.closePopupPrice();
	}

	donePopup() {
		const { indexPrice } = this.props;
		const price = (this.refinput && this.refinput.value) ? this.refinput.value : "0.00"
		this.props.donePopupPrice(price, indexPrice);
	}

	componentDidMount() {
		const { valuePriceIndex } = this.props;
		this.setState({
			price: valuePriceIndex, isFocus: false
		});
	}

	componentWillReceiveProps(nextProps) {
		const { valuePriceIndex } = nextProps;
		this.setState({
			price: valuePriceIndex, isFocus: false
		});
	}

	onChangePrice(e) {
		const value = e.target.value;
		this.setState({ price: value })
	}

	getWidthInput() {
		let width = 32;
		const { price } = this.state;
		if (price) {
			if (parseInt(price) === 0) {
				width = 32
			} else {
				width = price.length * 8
			}
		}
		return width;
	}

	handleFocus() {
		document.getElementById("myInput").focus();
	}

	render() {
		const { isPoupPrice } = this.props;
		const { price } = this.state;
		const width = this.getWidthInput();
		return (
			<PricePopup closeOnDocumentClick={false} open={isPoupPrice} position="right center">
				<Container>
					<Header>Edit Price</Header>

					<Body>
						<InputPrice onClick={() => this.handleFocus()}>
							<FaDollarSign style={{ color: '#585858' }} />
							<CurrencyInput
								name="myInput"
								id="myInput"
								onChange={e => this.onChangePrice(e)}
								type="tel"
								defaultValue={price}
								placeholder="0.00"
								style={{
									width: width + 20,
									paddingLeft: 5,
									color: '#1173c3',
									fontWeight: 600,
								}}
								autoFocus
								ref={ref => this.refinput = ref}
							/>
						</InputPrice>
					</Body>

					<Footer>
						<Button onClick={() => this.closePopup()} borderRight>
							Cancel
						</Button>
						<Button onClick={() => this.donePopup()} borderBottomRight>
							Done
						</Button>
					</Footer>
				</Container>
			</PricePopup>
		);
	}
}
