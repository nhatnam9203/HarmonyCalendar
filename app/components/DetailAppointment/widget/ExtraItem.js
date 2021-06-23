import React, { Component } from 'react'
import styled from 'styled-components';
import edit from '../../../images/edit.png';
import iconExtra from '../../../images/iconExtra.png';

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

const ContainerButton = styled.div`
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
`;

const ExtraIcon = styled.div`
    display: flex; 
    align-items: center;
`;


export default class Service extends Component {

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
        const { extra, index, appointment, extraAll } = this.props;
        const { status } = appointment;

        const findIndex = extraAll.findIndex(ex=>ex.bookingExtraId == extra.bookingExtraId);
        return (
            <tr>
                <td colSpan={3}>
                    <ExtraIcon>
                        <ImgExtra src={iconExtra} />
                        {extra.extraName}
                    </ExtraIcon>
                </td>
                <td style={{ textAlign: 'center' }}>
                    <ContainerButton>
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
                    </ContainerButton>
                </td>

                <td>
                    <WrapPrice onClick={() => this.props.openPopupPrice(extra.price, findIndex, 'extra')}>
                        <Price>{extra.price}</Price>
                        <img src={edit} />
                    </WrapPrice>
                </td>
            </tr>
        );

    }
}