import React, { Component } from 'react'
import styled from 'styled-components';

const ButtonProduct = styled.button`
	background: ${(props) => props.backgroundColor};
	color: #ffffff;
	width: 47px;
	display : flex;
	justify-content : center;
	align-items: center;
	font-size: 18px;
	height : 28px;
	margin: 0 10px;
	border-radius: 3px;
	cursor: ${(props) => (props.active ? 'pointer' : 'initial')};
`;

const WrapButton = styled.div`
	display: flex;
	flex-direction: row;
	height: 40px;
	align-items: center;
`;

const Quantity = styled.div`
	font-size : ${({ size }) => size}
`;

const Price = styled.div`
	display: flex; 
	flex-direction: row;
	justify-content: center;
`;

Price.Text = styled.div`
	font-weight: 900;
	color: #1366AF;
	width: 60;
	text-align: center;
	margin-left: -15;
	font-size: 16;
	letter-spacing: 0.06;
	font-family: sans-serif;
`;

export default class Product extends Component {

	getStyleProduct(appointment, product, index) {
		let backgroundColor = '#dddddd';
		if (appointment.status !== 'PAID' && appointment.status !== 'VOID' && appointment.status !== 'REFUND' && product.quantity > 1)
			backgroundColor = '#0071c5';
		return backgroundColor;
	}

	getStyleProduct2(appointment, product, index) {
		let backgroundColor = '#dddddd';
		if (appointment.status !== 'PAID' && appointment.status !== 'VOID' && appointment.status !== 'REFUND')
			backgroundColor = '#0071c5';
		return backgroundColor;
	}

	renderPrice(price) {
		const { appointment } = this.props;
		if ((appointment.status !== 'PAID' && appointment.status !== 'VOID' && appointment.status !== 'REFUND')) {
			return (
				<Price.Text>{price}</Price.Text>
			)
		} else
			return (
				<div>{price}</div>
			)
	}

	render() {
		const { appointment, product, index } = this.props;
		const quantity =
			product.quantity.toString().length === 1 ? '0' + product.quantity.toString() : product.quantity;

		let price = product.price ? parseFloat(product.price.replace(/,/g, '')).toFixed(2) : "0.00";
		price = (parseFloat(price) * product.quantity).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');

		return (
			<tr key={index}>
				<td>{product.productName}</td>
				<td style={{ display: 'flex', justifyContent: 'center' }}>
					<WrapButton>
						<ButtonProduct
							backgroundColor={this.getStyleProduct(appointment, product, index)}
							disabled={appointment.status === 'PAID' || appointment.status === 'VOID' || appointment.status === 'REFUND' || product.quantity <= 1}
							onClick={() => this.props.subtractProduct(index)}
						>
							-
					</ButtonProduct>
						<Quantity
							size={quantity.toString().length < 4 ? '16px' : quantity.toString().length < 7 ? '11px' : "8px"}
						>
							{quantity}
						</Quantity>
						<ButtonProduct
							backgroundColor={this.getStyleProduct2(appointment, product, index)}
							disabled={appointment.status === 'PAID' || appointment.status === 'VOID' || appointment.status === 'REFUND'}
							onClick={() => this.props.addProduct(index)}
						>
							+
					</ButtonProduct>
					</WrapButton>
				</td>
				<td>
					<Price>
						{this.renderPrice(price)}
					</Price>
				</td>
			</tr>
		);
	}
}