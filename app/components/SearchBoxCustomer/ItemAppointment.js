import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { convertMinsToHrsMins } from '../../utils/helper';

const Item = styled.div`
    border-bottom : 1px solid #dddddd;
    padding-bottom : 0.6rem;
    margin-top : 0.5rem;
    padding-left : 2rem;
    padding-right : 2rem;
    background : ${(props) => props.isActive ? '#e3fbff' : 'transparent'};
    padding-top : 1rem;
`;

Item.Row = styled.div`
    display: flex;
    flex-direction : row;
    align-items: 'center';
    justify-content : space-between;
    margin-bottom : 0.3rem;
`;

const RowInfo = styled.div`
    display: flex;
    flex-direction : row;
    align-items: 'center';
    margin-bottom : 0.3rem;
`;

Item.Date = styled.div`
    font-size : 1.15rem;
    color : #585858;
    font-weight : 600;
`;

Item.Code = styled.div`
    font-size : 1rem;
    color : #585858;
    font-weight : 600;
`;

Item.Name = styled.div`
    font-size : 1.3rem;
    color : #136AB7;
    font-weight : 600;
`;

Item.PhoneNumber = styled.div`
    font-size : 1.3rem;
    color : #585858;
    margin-left : 1.5rem;
`;

Item.Status = styled.div`
    font-size : 1rem;
    color:  ${(props) => props.color ? props.color : '#585858'};
`;

Item.Text = styled.div`
    font-size : 1rem;
    color : #585858;
    font-weight :  ${(props) => props.weight ? '600' : '500'};
    width:  ${(props) => props.width};
    text-align:  ${(props) => props.right ? 'right' : 'left'};
`;

const Price = styled.div`
    color: #1366AE;
    font-size : 1.4rem;
    font-weight : 600;
`;

const ImgExtra = styled.img`
	width: 14px;
	height: 14px;
	margin-right: 10px;
    margin-top : 4px;
    margin-left : 1rem;
`;

const InvoiceNumber = styled.div`
    font-size : 1.1rem;
    font-weight : 600;
    color : #585858;
`;

const RowTotal = styled.div`
    display: flex;
    flex-direction : row;
    align-items: flex-end;
    justify-content : space-between;
`;

const ContainerItem = styled.div`
    margin-top : 1rem;
`;

const ItemAppointment = ({ item, selectItem, indexActive }) => {
    return (
        <Item
            isActive={item.appointmentId === indexActive}
            onClick={() => selectItem(item.fromTime, item)}
        >
            <Item.Row>
                <Item.Code>
                    #{item.code}
                </Item.Code>
                <Item.Status color={statusConvertColor[item.status]}>
                    {statusConvertKey[item.status]}
                </Item.Status>
            </Item.Row>
            <RowInfo>
                <Item.Name>{`${item.firstName}`}</Item.Name>
                <Item.PhoneNumber>{`${item.phoneNumber}`}</Item.PhoneNumber>
            </RowInfo>
            <Item.Date style={{ marginBottom : 18 }}>
                {moment(item.fromTime).format('MMMM DD dddd, YYYY')}
            </Item.Date>
            {
                item.services.map((service) => {
                    return (
                        <ItemService
                            service={service}
                            key={service.bookingServiceId}
                            extras={item.extras.filter(ex => ex.bookingServiceId === service.bookingServiceId)}
                        />
                    )
                })
            }
            {
                item.products.map((product) => {
                    return (
                        <Product
                            product={product}
                            key={product.bookingProductId}
                        />
                    );
                })
            }
            {
                item.giftCards.map((gift) => {
                    return (
                        <Giftcard
                            gift={gift}
                            key={gift.bookingGiftCardId}
                        />
                    );
                })
            }
            <RowTotal>
                <InvoiceNumber>{item.invoiceNo ? `Invoice No : #${item.invoiceNo}` : ' '}</InvoiceNumber>
                <Price>{`$ ${item.total}`}</Price>
            </RowTotal>
        </Item>
    )
}

const ItemService = ({ service, extras }) => {
    return (
        <ContainerItem>
            <Item.Row key={service.bookingServiceId}>
                <Item.Text weight width='30%'>{service.serviceName}</Item.Text>
                <Item.Text width='15%'>
                    {moment(service.fromTime).format('hh:mm A')}
                </Item.Text>
                <Item.Text width='25%'>{service.staff.displayName}</Item.Text>
                <Item.Text width='20%'>{convertMinsToHrsMins(service.duration)}</Item.Text>
                <Item.Text width='15%' right>{`$ ${service.price}`}</Item.Text>
            </Item.Row>
            {
                extras.map((extra) => <Extra extra={extra} key={extra.extraId} />)
            }
        </ContainerItem>
    )
}

const Product = ({ product }) => {
    return (
        <Item.Row>
            <Item.Text weight width='30%'>{product.productName}</Item.Text>
            <Item.Text width='15%'>
                {''}
            </Item.Text>
            <Item.Text width='25%'>{''}</Item.Text>
            <Item.Text width='20%'>{`${product.quantity} items`}</Item.Text>
            <Item.Text width='15%' right>{`$ ${product.price}`}</Item.Text>
        </Item.Row>
    )
}

const Giftcard = ({ gift }) => {
    return (
        <Item.Row>
            <Item.Text weight width='30%'>{gift.name}</Item.Text>
            <Item.Text width='15%'>
                {''}
            </Item.Text>
            <Item.Text width='25%'>{''}</Item.Text>
            <Item.Text width='20%'>{`${gift.quantity} items`}</Item.Text>
            <Item.Text width='15%' right>{`$ ${gift.price}`}</Item.Text>
        </Item.Row>
    )
}

const Extra = ({ extra }) => {
    return (
        <Item.Row>
            <ImgExtra src={require('../../images/iconExtra.png')} />
            <Item.Text width='30%'>{extra.extraName}</Item.Text>
            <Item.Text width='11.5%'>
                {''}
            </Item.Text>
            <Item.Text width='25%'>{''}</Item.Text>
            <Item.Text width='20%'>{convertMinsToHrsMins(extra.duration)}</Item.Text>
            <Item.Text width='15%' right>{`$ ${extra.price}`}</Item.Text>
        </Item.Row>
    )
}


export default ItemAppointment;

const statusConvertKey = {
    unconfirm: 'UNCONFIRM',
    confirm: 'CONFIRMED',
    checkin: 'CHECKED_IN',
    paid: 'PAID',
    waiting: 'WAITING',
    cancel: 'CANCEL',
    pending: 'PENDING',
    void: 'VOID',
    refund: 'REFUND'
};

const statusConvertColor = {
    unconfirm: '#919191',
    confirm: '#1B68AC',
    checkin: '#1B68AC',
    paid: '#50CF25',
    waiting: '#919191',
    cancel: 'red',
    void: 'red',
    refund: 'red'
}