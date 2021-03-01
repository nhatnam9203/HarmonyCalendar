import React, { Component } from 'react'
import styled from 'styled-components';

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


export default class Service extends Component {

    render() {
        const { extra } = this.props;
        return (
            <tr>
                <td style={{ height : 65 }} colSpan={3}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ImgExtra src={require('../../../images/iconExtra.png')} />
                        {extra.extraName}
                    </div>
                </td>
                <td>
                    <WrapPrice>
                        <Price>{extra.price}</Price>
                    </WrapPrice>
                </td>
            </tr>
        );

    }
}