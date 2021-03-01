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

const WrapPrice = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding-right : 1rem;
    &>img {
        width: 16px;
        height: 16px;
        margin-left : 5px;
    }
`;

const Price = styled.div`
    color: #1173C3;
    font-weight: bold;
    margin-right: 5;
    font-family: sans-serif
`;

const ImgExtra = styled.img`
    width: 16px;
    height: 16px;
    margin-right : 10px;
`;


export default class Service extends Component {

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
        const { extra, index, appointment } = this.props;

        return (
            <tr>
                <td colSpan={3}>
                    <div style={{ display: 'flex' , alignItems: 'center' }}>
                        <ImgExtra src={require('../../../images/iconExtra.png')} />
                        {extra.extraName}
                    </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                    <div style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                        <ButtonExtra
                            backgroundColor={this.getStyleExtra(appointment, extra, index)}
                            disabled={appointment.status === 'PAID' || appointment.status === 'VOID' || appointment.status === 'REFUND' || extra.duration <= 5}
                            onClick={() => this.props.subtractExtra(extra)}
                        >
                            -5&#39;
					</ButtonExtra>
                        {extra.duration}
                        <ButtonExtra
                            backgroundColor={this.getStyleExtra2(appointment, extra, index)}
                            disabled={appointment.status === 'PAID' || appointment.status === 'VOID' || appointment.status === 'REFUND'}
                            onClick={() => this.props.addExtra(extra)}
                        >
                            +5&#39;
					    </ButtonExtra>
                    </div>
                </td>

                <td>
                    <WrapPrice onClick={() => this.props.openPopupPrice(extra.price, index, 'extra')}>
                        <Price>{extra.price}</Price>
                        <img src={require('../../../images/edit.png')} />
                    </WrapPrice>
                </td>
            </tr>
        );

    }
}