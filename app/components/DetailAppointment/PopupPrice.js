import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import OutsideClickHandler from 'react-outside-click-handler';
import styled from 'styled-components';
import Popup from 'reactjs-popup';
import { FaDollarSign } from 'react-icons/fa';

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
	flexDirection: row;
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
	z-zIndex: 1111;
	& > span {
		font-weight: bold;
	}
`;

const Input = styled(NumberFormat)`
    border : 1px solid #dddddd;
    border-radius: 3px;
    height: 2.3rem;
    width: 85%;
    text-align: right;
    padding-right: 1rem;
    color: #1173C3;
    font-weight: 600;
`;

export default class PopupPrice extends Component {
	constructor(props) {
		super(props);
		this.state = {
			price: ''
		};
	}

	closePopup() {
		this.props.closePopupPrice();
    }
    
    donePopup(){
        const {price} = this.state;
        const {indexPrice} = this.props;
        this.props.donePopupPrice(price,indexPrice);
    }

	componentDidMount() {
		const { valuePriceIndex } = this.props;
		this.setState({
			price: valuePriceIndex
		});
	}

	componentWillReceiveProps(nextProps) {
		const { valuePriceIndex } = nextProps;
		this.setState({
			price: valuePriceIndex
		});
    }
    
    onChangePrice(value){
        const { floatValue } = value;
		if (floatValue) {
			this.setState({
                price : floatValue
            })
		}
    }

	render() {
        const { isPoupPrice, valuePriceIndex, indexPrice } = this.props;
        const {price} = this.state;
		return (
			<PricePopup closeOnDocumentClick={false} open={isPoupPrice} position="right center">
				<Container>
					<Header>Edit Price</Header>
					<Body>
						<FaDollarSign
							style={{
								position: 'absolute',
								left: 40,
								color: '#585858'
							}}
						/>
						<Input
							value={parseFloat(price).toFixed(2)}
							thousandSeparator={false}
							onValueChange={(value) => this.onChangePrice(value)}
							type="tel"
						/>
					</Body>
					<Footer>
						<Button onClick={() => this.closePopup()} borderRight>
							Cancel
						</Button>
						<Button onClick={()=>this.donePopup()} borderBottomRight>Done</Button>
					</Footer>
				</Container>
			</PricePopup>
		);
	}
}
