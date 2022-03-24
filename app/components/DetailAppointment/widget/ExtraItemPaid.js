import React, { Component } from 'react'
import styled from 'styled-components';
import edit from '../../../images/edit.png';

const WrapPrice = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    &>img {
        width: 16px;
        height: 16px;
        margin-left : 5px;
    }
`;

const Price = styled.div`
    color: #404040;
    margin-right: 5;
    font-family: sans-serif
`;

const ImgExtra = styled.img`
    width: 16px;
    height: 16px;
    margin-right : 10px;
`;

const IconEdit = styled.img`
    width: 16px;
    height : 16px;
`;


export default class Service extends Component {

    render() {
        const { extra, openPopupPrice, isEditPaidAppointment } = this.props;
        return (
            <tr>
                <td style={{ height: 65 }} colSpan={3}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ImgExtra src={require('../../../images/iconExtra.png')} />
                        {extra.extraName}
                    </div>
                </td>
                <td onClick={() => {
                    if (isEditPaidAppointment) {
                        openPopupPrice();
                    }
                }}>
                    <WrapPrice>
                        <Price>{extra.price}</Price>
                        {isEditPaidAppointment && <IconEdit src={edit} />}
                    </WrapPrice>
                </td>
            </tr>
        );

    }
}