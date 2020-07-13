import React, { Component } from 'react'
import styled from 'styled-components';

const ButtonProduct = styled.button`
	background: ${(props) => props.backgroundColor};
	color: #ffffff;
	padding: 5px 15px;
	width: 47px;
	margin: 0 10px;
	border-radius: 3px;
	cursor: ${(props) => (props.active ? 'pointer' : 'initial')};
`;

export default class Product extends Component {

    getStyleProduct(appointment, product, index) {
		let backgroundColor = '#dddddd';
		if (appointment.status !== 'PAID' && product.quantity > 1) backgroundColor = '#0071c5';

		return backgroundColor;
	}

	getStyleProduct2(appointment, product, index) {
		let backgroundColor = '#dddddd';
		if (appointment.status !== 'PAID') backgroundColor = '#0071c5';
		return backgroundColor;
	}

    render() {

        const { appointment , product,index } = this.props;
		const quantity =
			product.quantity.toString().length === 1 ? '0' + product.quantity.toString() : product.quantity;
		
		let price = product.price ? parseFloat(product.price.replace(/,/g, '')).toFixed(2) : "0.00";
		price = (parseFloat(price) * product.quantity).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');

		return (
			<tr key={index}>
				<td>{product.productName}</td>
				<td style={{ textAlign: 'center' }}>
					<ButtonProduct
						backgroundColor={this.getStyleProduct(appointment, product, index)}
						disabled={appointment.status === 'PAID' || product.quantity <= 1}
						onClick={() => this.props.subtractProduct(index)}
					>
						-
					</ButtonProduct>
						{quantity}
					<ButtonProduct
						backgroundColor={this.getStyleProduct2(appointment, product, index)}
						disabled={appointment.status === 'PAID'}
						onClick={() => this.props.addProduct(index)}
					>
						+
					</ButtonProduct>
				</td>
				<td>
					<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
						<div style={appointment.status !== 'PAID' ? style.price2 : {}}>
							{price}
						</div>
					</div>
				</td>
			</tr>
		);
    }
}

const style = {
	price2: {
		fontWeight: '900',
		color: '#1366AF',
		width: 60,
		textAlign: 'center',
		marginLeft: -15,
		fontSize: 16,
		letterSpacing: 0.06,
		fontFamily: 'sans-serif'
	},
};