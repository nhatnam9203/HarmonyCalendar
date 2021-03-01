import React, { Component } from 'react'

import styled from 'styled-components';
import PopupStaff from './PopupStaff';
import moment from 'moment';

const ButtonService = styled.button`
	background: ${(props) => props.backgroundColor};
	color: #ffffff;
	padding: 5px 15px;
	margin: 0 10px;
	width: 47px;
	border-radius: 3px;
	cursor: ${(props) => (props.active ? 'pointer' : 'initial')};
`;

const ImgButton = styled.img`
	width : 12px;
	height : 6px; 
	margin-left : 8px; 
`;

const ButtonTime = styled.div`
	background-color: #eeeeee;
	border-radius: 5px;
	padding: 10px;
	text-align: center;
	width: 120px;
	position: relative;
`;

const IconEdit = styled.img`
    width: 16px;
    height : 16px;
`;

const Price = styled.div`
    color: #1173C3;
    font-weight: bold;
    margin-right: 5px;
    font-family: sans-serif;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding-right : 1rem;
`;

const ServiceName = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

export default class ServiceNormal extends Component {
    render() {
        const {
            service,
            openPopupTimePicker,
            fromTime,
            index,
            togglePopupStaff,
            title,
            isPopupStaff,
            indexPopupStaff,
            staffList,
            closePopupStaff,
            subtractService,
            addService,
            appointment,
            duration,
            openPopupPrice,
            price
        } = this.props;
        return (
            <React.Fragment>
                <td>
                    <div style={style.serviceColumn}>
                        <ServiceName>
                            {service.serviceName}
                        </ServiceName>
                    </div>
                </td>

                <td>
                    <ButtonTime onClick={() => openPopupTimePicker(index, fromTime)}>
                        {moment(fromTime).format('hh:mm A').toString()}
                        <ImgButton src={require('../../../images/top_arrow@3x.png')} />
                    </ButtonTime>
                </td>

                <td style={{ borderRight: 0 }}>
                    <div onClick={() => togglePopupStaff('', index)} style={style.staffService}>
                        <p style={style.staffNameColumn}>{title}</p>
                        <ImgButton src={require('../../../images/top_arrow@3x.png')} />
                        {isPopupStaff && index === indexPopupStaff && (
                            <PopupStaff
                                togglePopupStaff={(staff) => {
                                    this.props.togglePopupStaff(staff, index)
                                }}
                                staffList={staffList.filter((s) => s.id !== 0)}
                                closePopupStaff={() => closePopupStaff()}
                            />
                        )}
                    </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                    <div style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                        <ButtonService
                            backgroundColor={(appointment.status !== 'PAID' && appointment.status !== 'VOID' && appointment.status !== 'REFUND' && service.duration > 5) ? '#0071c5' : '#dddddd'}
                            disabled={appointment.status === 'PAID' || appointment.status === 'VOID' || appointment.status === 'REFUND' || service.duration <= 5}
                            onClick={() => subtractService(index)}
                        >
                            -5&#39;
						</ButtonService>
                        {duration}
                        <ButtonService
                            backgroundColor={(appointment.status !== 'PAID' && appointment.status !== 'VOID' && appointment.status !== 'REFUND') ? '#0071c5' : '#dddddd'}
                            disabled={appointment.status === 'PAID' || appointment.status === 'VOID' || appointment.status === 'REFUND'}
                            onClick={() => addService(index)}
                        >
                            +5&#39;
						</ButtonService>
                    </div>
                </td>

                <td>
                    <Row onClick={() => openPopupPrice(price, index, 'service')}>
                        <Price>{price}</Price>
                        <IconEdit src={require('../../../images/edit.png')} />
                    </Row>
                </td>

            </React.Fragment>
        )
    }
}


const style = {
    price: {
        fontWeight: '700',
        color: '#1366AF',
        width: 60,
        textAlign: 'center'
    },
    staffService: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        backgroundColor: '#EEEEEE',
        borderRadius: 5,
        maxWidth: 120,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        height: 40,
        paddingRight: 10
    },
    serviceColumn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '10rem',
    },
    staffNameColumn: {
        marginLeft: 8,
        width: 50,
        fontSize: 15,
    },
};