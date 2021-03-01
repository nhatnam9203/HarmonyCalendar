import React, { Component } from 'react'

import styled from 'styled-components';
import PopupStaff from './PopupStaff';
const ImgButton = styled.img`
	width : 12px;
	height : 6px; 
	margin-left : 8px; 
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    &>p{
        margin-left: 8px;
        width: 90px; 
    }
`;

const IconEdit = styled.img`
   width: 16px;
    height: 16px;
    margin-left: 5px;
    margin-bottom: 5px;
`;

const ServiceName = styled.div`
    width: 130px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

export default class ServicePaid extends Component {
    render() {
        const {
            service,
            appointment,
            isEditPaidAppointment,
            togglePopupStaff,
            staffName,
            isPopupStaff,
            index,
            indexPopupStaff,
            staffList,
            closePopupStaff,
            openPopupTip,
            price
        } = this.props;
        return (
            <tr>
                <td style={{ borderRight: 1 }}>
                    <ServiceName>{service.serviceName}</ServiceName>
                </td>
                <td style={{ position: 'relative' }}
                    onClick={() => {
                        if (appointment.status === 'PAID' && isEditPaidAppointment) {
                            togglePopupStaff('', index)
                        }
                    }}
                >
                    <Row>
                        <p>{staffName}</p>
                        {
                            appointment.status === 'PAID' && isEditPaidAppointment
                            && <ImgButton src={require('../../../images/top_arrow@3x.png')} />
                        }
                        {isPopupStaff && index === indexPopupStaff && (
                            <PopupStaff
                                togglePopupStaff={(staff) => {
                                    togglePopupStaff(staff, index);
                                }}
                                staffList={staffList.filter((s) => s.id !== 0)}
                                closePopupStaff={() => closePopupStaff()}
                            />
                        )}
                    </Row>
                </td>
                <td style={{ textAlign: 'center' }}
                    onClick={() => {
                        if (isEditPaidAppointment) {
                            openPopupTip(service.tipAmount, index)
                        }
                    }}
                >
                    {service.tipAmount}
                    {isEditPaidAppointment &&
                        <IconEdit src={require('../../../images/edit.png')} />}
                </td>
                <td>
                    <div style={{ textAlign: 'center' }}>{price}</div>
                </td>
            </tr>
        )
    }
}