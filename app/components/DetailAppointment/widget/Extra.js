import React, { Component } from 'react'
import styled from 'styled-components';

const ButtonExtra = styled.button`
	color: #ffffff;
	padding: 5px 15px;
	margin: 0 10px;
	width: 47px;
	border-radius: 3px;
	cursor: ${(props) => (props.active ? 'pointer' : 'initial')};
    background: ${(props) => props.backgroundColor};
`;

const Row = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
`;

export default class Extra extends Component {

    getStyleExtra(appointment, extra, index) {
        let backgroundColor = '#dddddd';
        if (appointment.status !== 'PAID' && appointment.status !== 'VOID' && appointment.status !== 'REFUND' && extra.duration > 5) backgroundColor = '#0071c5';
        return backgroundColor;
    }

    getStyleExtra2(appointment, extra, index) {
        let backgroundColor = '#dddddd';
        if (appointment.status !== 'PAID' && appointment.status !== 'VOID' && appointment.status !== 'REFUND') backgroundColor = '#0071c5';
        return backgroundColor;
    }

    render() {
        const { appointment, pricesExtras, extra, index } = this.props;

        let price = pricesExtras[index] ? parseFloat(pricesExtras[index].replace(/,/g, '')).toFixed(2) : "0.00";
        price = price.toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');

        return (
            <tr key={index}>
                <td>{extra.extraName}</td>
                <td style={{ textAlign: 'center' }}>
                    <ButtonExtra
                        backgroundColor={this.getStyleExtra(appointment, extra, index)}
                        disabled={appointment.status === 'PAID' || appointment.status === 'VOID' || appointment.status === 'REFUND' || extra.duration <= 5}
                        onClick={() => this.props.subtractExtra(index)}
                    >
                        -5&#39;
					</ButtonExtra>
                    {extra.duration}
                    <ButtonExtra
                        backgroundColor={this.getStyleExtra2(appointment, extra, index)}
                        disabled={appointment.status === 'PAID' || appointment.status === 'VOID' || appointment.status === 'REFUND'}
                        onClick={() => this.props.addExtra(index)}
                    >
                        +5&#39;
					</ButtonExtra>
                </td>

                <td onClick={appointment.status !== 'PAID' && appointment.status !== 'VOID' && appointment.status !== 'REFUND' ? (
                    () => this.props.openPopupPrice(price, index, 'extra')) : (() => { })} style={{ textAlign: 'center' }}
                >
                    <Row>
                        <div>
                            <div style={appointment.status !== 'PAID' && appointment.status !== 'VOID' && appointment.status !== 'REFUND' ? style.priceS : {}}>{price}</div>
                        </div>

                        {appointment.status !== 'PAID' && appointment.status !== 'VOID' && appointment.status !== 'REFUND' && (
                            <img src={require('../../../images/edit.png')} style={{ width: 16, height: 16 }} />
                        )}
                    </Row>
                </td>
            </tr>
        );
    }
}


const style = {
    priceS: {
        color: '#1173C3',
        fontWeight: 'bold',
        marginRight: 5,
        fontFamily: 'sans-serif'
    }
};