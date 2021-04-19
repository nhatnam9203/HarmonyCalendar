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
        if (status !== 'PAID' && status !== 'VOID' && status !== 'REFUND' && extra.duration > 5) backgroundColor = '#0071c5';
        return backgroundColor;
    }

    getStyleExtra2(appointment, extra, index) {
        let backgroundColor = '#dddddd';
        if (status !== 'PAID' && status !== 'VOID' && status !== 'REFUND') backgroundColor = '#0071c5';
        return backgroundColor;
    }

    render() {
        const { appointment, pricesExtras, extra, index } = this.props;
        const { status } = this.props;

        let price = pricesExtras[index] ? parseFloat(pricesExtras[index].replace(/,/g, '')).toFixed(2) : "0.00";
        price = price.toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');

        return (
            <tr key={index}>
                <td>{extra.extraName}</td>
                <td style={{ textAlign: 'center' }}>
                    <ButtonExtra
                        backgroundColor={this.getStyleExtra(appointment, extra, index)}
                        disabled={status === 'PAID' || status === 'VOID' || status === 'REFUND' || extra.duration <= 5}
                        onClick={() => this.props.subtractExtra(extra)}
                    >
                        -5&#39;
					</ButtonExtra>
                    {extra.duration}
                    <ButtonExtra
                        backgroundColor={this.getStyleExtra2(appointment, extra, index)}
                        disabled={status === 'PAID' || status === 'VOID' || status === 'REFUND'}
                        onClick={() => this.props.addExtra(extra)}
                    >
                        +5&#39;
					</ButtonExtra>
                </td>

                <td onClick={status !== 'PAID' && status !== 'VOID' && status !== 'REFUND' ? (
                    () => this.props.openPopupPrice(price, index, 'extra')) : (() => { })} style={{ textAlign: 'center' }}
                >
                    <Row>
                        <div>
                            <div style={status !== 'PAID' && status !== 'VOID' && status !== 'REFUND' ? style.priceS : {}}>
                                {price}
                            </div>
                        </div>

                        {status !== 'PAID' && status !== 'VOID' && status !== 'REFUND' && (
                            <img
                                src={require('../../../images/edit.png')}
                                style={{ width: 16, height: 16 }}
                            />
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