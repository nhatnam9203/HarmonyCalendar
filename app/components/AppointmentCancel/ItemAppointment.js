import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { convertMinsToHrsMins } from '../../utils/helper';


const WrapItem = styled.div`
    width : 100%;
    border-bottom :  ${(props) => props.isLast ? 'none' : '1px solid #dddddd'};
    display : flex;
    flex-direction : row;
    justify-content : space-between;
    min-height : 200px;
`;


const Item = styled.div`
    padding-bottom : 0.6rem;
    margin-top : 0.5rem;
    padding-left : 2rem;
    padding-right : 2rem;
    background : ${(props) => props.isActive ? '#e3fbff' : 'transparent'};
    padding-top : 1rem;
    width : 95%;
`;

Item.Row = styled.div`
    display: flex;
    flex-direction : row;
    align-items: 'center';
    justify-content : space-between;
`;

Item.RowExtra = styled.div`
    display: flex;
    flex-direction : row;
    align-items: 'center';
    justify-content : space-between;
`;

const RowInfo = styled.div`
    display: flex;
    flex-direction : row;
    margin-bottom : 0.3rem;
    margin-top : 0.3rem;
    margin-bottom : 0.3rem;
`;

Item.Date = styled.div`
    font-size : 1rem;
    color : #585858;
    font-weight : 600;
`;

Item.Code = styled.div`
    font-size : 1rem;
    color : #585858;
    font-weight : 600;
`;

Item.Name = styled.div`
    font-size : 1.2rem;
    color : #136AB7;
    font-weight : 600;
`;

Item.PhoneNumber = styled.div`
    font-size : 1.2rem;
    color : #585858;
    margin-left : 0.5rem;
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
    /* margin-left : 1rem; */
`;

const InvoiceNumber = styled.div`
    font-size : 1rem;
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

const RowExtra = styled.div`
    display: flex;
    flex-direction : row;
    width : 70%;
    padding-left : 1.15rem;
    padding-right : 1rem;
    margin-bottom : 0 !important;
`;

const ItemAppointment = ({ item, selectItem, indexActive, appointmentSelected = [], isLast }) => {

    const isSelected = appointmentSelected.find(obj => obj.appointmentId === item.appointmentId) ? false : true;

    return (
        <WrapItem isLast={isLast}>
            <img
                style={{ width: 23, height: 23, marginTop: "1.8rem", marginLeft: "1.5rem", cursor: "pointer" }}
                src={require(isSelected ? '../../images/check-box-empty@3x.png' : '../../images/check-box@3x.png')}
                alt=""
                onClick={() => selectItem(item.fromTime, item)}
            />
            <Item
                isActive={item.appointmentId === indexActive}
                onClick={() => selectItem(item.fromTime, item)}
            >
                <Item.Row>
                    <Item.Code>
                        #{item.code}
                    </Item.Code>
                    <Item.Status color={statusConvertColor[item.status] ? statusConvertColor[item.status] : "grey"}>
                        {statusConvertKey[item.status] ? statusConvertKey[item.status] : "NO SHOW"}
                    </Item.Status>
                </Item.Row>
                <RowInfo>
                    <Item.Name>{`${item.firstName}`}</Item.Name>
                    <Item.PhoneNumber>{`${item.phoneNumber}`}</Item.PhoneNumber>
                </RowInfo>
                <Item.Date style={{ marginBottom: 18 }}>
                    {moment(item.fromTime).format('MMMM DD dddd, YYYY')}
                </Item.Date>
                {
                    item.services.map((service) => {
                        return (
                            <ItemService
                                service={service}
                                item={item}
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
        </WrapItem>
    )
}

const ItemService = ({ service, extras, item }) => {
    return (
        <ContainerItem>
            <Item.Row key={service.bookingServiceId}>
                <Item.Text weight width='30%'>{service.serviceName}</Item.Text>
                <Item.Text width='15%'>
                    {item.status !== 'waiting' ? moment(service.fromTime).format('hh:mm A') : ' '}
                </Item.Text>
                <Item.Text width='15%'></Item.Text>
                <Item.Text width='30%'>{`${convertMinsToHrsMins(service.duration)}`}</Item.Text>
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
        <ContainerItem>
            <Item.Row>
                <Item.Text weight width='70%'>{product.productName}</Item.Text>
                <Item.Text width='20%'>{`${product.quantity} items`}</Item.Text>
                <Item.Text width='15%' right>{`$ ${product.price}`}</Item.Text>
            </Item.Row>
        </ContainerItem>
    )
}

const Giftcard = ({ gift }) => {
    return (
        <ContainerItem>
            <Item.Row>
                <Item.Text weight width='70%'>{gift.name}</Item.Text>
                <Item.Text width='20%'>{`${gift.quantity} items`}</Item.Text>
                <Item.Text width='15%' right>{`$ ${gift.price}`}</Item.Text>
            </Item.Row>
        </ContainerItem>
    )
}

const Extra = ({ extra }) => {
    return (
        <Item.RowExtra>
            <RowExtra>
                <ImgExtra src={require('../../images/iconExtra.png')} />
                <Item.Text width='100%'>{extra.extraName}</Item.Text>
            </RowExtra>
            <Item.Text width='38%'>{convertMinsToHrsMins(extra.duration)}</Item.Text>
            <Item.Text width='15%' right>{`$ ${extra.price}`}</Item.Text>
        </Item.RowExtra>
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