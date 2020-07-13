import React, { Component } from 'react'
import styled from 'styled-components';

const WrapperFooterPaid = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: row;
`;
WrapperFooterPaid.Item = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 50%;
    margin-left: 10px;
    color: #0b0b0b;
`;

WrapperFooterPaid.ItemLeft = styled(WrapperFooterPaid.Item)`
    padding-right : 4rem;
    & > div:nth-child(0) {
        font-weight : 600;
        color : #585858;
    }
`;

const FooterTotal = styled(WrapperFooterPaid)`
    justify-content : space-between;
    border-top: 1px solid #ebebeb;
    margin-top : 0.3rem;
    padding-left : 20px;
    & > div {
        font-weight: 900; 
        font-size: 20px; 
        color: #585858;
    }
`;

export default class FooterAppointment extends Component {

    render() {
        const { appointment } = this.props;

        let subTotal = appointment.subTotal ? parseFloat(appointment.subTotal.toString().replace(/,/g, '')).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') : "0.00";
        
        let total = appointment.total ? parseFloat(appointment.total.toString().replace(/,/g, '')).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') : "0.00";

        if (appointment.status === 'PAID') {
            return (
                <React.Fragment>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <WrapperFooterPaid>
                                <WrapperFooterPaid.ItemLeft>
                                    <div>Subtotal : </div>
                                    <div>$ {appointment.subTotal}</div>
                                </WrapperFooterPaid.ItemLeft>
                                <WrapperFooterPaid.Item>
                                    <div>Discount : </div>
                                    <div>$ {appointment.discount}</div>
                                </WrapperFooterPaid.Item>
                            </WrapperFooterPaid>
                        </div>

                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <WrapperFooterPaid>
                                <WrapperFooterPaid.ItemLeft>
                                    <div>Tip : </div>
                                    <div>$ {appointment.tipAmount}</div>
                                </WrapperFooterPaid.ItemLeft>
                                <WrapperFooterPaid.Item>
                                    <div>Gift card : </div>
                                    <div>$ {appointment.giftCard}</div>
                                </WrapperFooterPaid.Item>
                            </WrapperFooterPaid>
                        </div>

                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <WrapperFooterPaid>
                                <WrapperFooterPaid.ItemLeft>
                                    <div>Tax : </div>
                                    <div style={{ paddingRight: 10 }}>$ {appointment.tax}</div>
                                </WrapperFooterPaid.ItemLeft>
                            </WrapperFooterPaid>
                        </div>

                        <FooterTotal>
                            <div>Total</div>
                            <div>$ {total}</div>
                        </FooterTotal>
                    </div>
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <div>
                        <span>Arriving : </span>
                        <strong>{moment(appointment.start).fromNow()}</strong>
                    </div>
                    <div>
                        <span>Tip : </span>
                        <strong>{appointment.tipPercent}</strong>
                    </div>
                    <div>
                        <span>Total : </span>
                        <strong>$ {subTotal}</strong>
                    </div>
                </React.Fragment>
            );
        }
    }
}
