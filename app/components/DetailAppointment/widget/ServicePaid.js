import React, { Component } from 'react'

import styled from 'styled-components';
import PopupStaff from './PopupStaff';
import { api } from "../../../utils/helper";
import * as api_constants from '../../../../app-constants';
import { token } from '../../../../app-constants';

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

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            staffOfService: [],
        }
    }

    getStaffAvailable = async () => {
        this.setState({ isLoading: true });
        const { service: { serviceId, fromTime } } = this.props;
        const date = moment(fromTime).format('YYYY-MM-DD');

        const requestURL = new URL(`${api_constants.GET_STAFF_OF_SERVICE}/${serviceId}?date=${date}`);
        try {
            const response = await api(requestURL.toString(), "", 'GET', token);
            if (parseInt(response.codeNumber) === 200) {
                this.setState({
                    isLoading: false,
                    staffOfService: Array.isArray(response.data) ? response.data.map((s) => ({
                        ...s,
                        title: s.displayName,
                        id: s.staffId
                    })) : []
                });
            } else {
                // alert(response.message)
            }
        } catch (err) {
            // alert(err)
        }
    }

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
            openPopupPrice,
            price,
        } = this.props;
        const { status, memberId } = appointment;
        const { isWarning } = service;
        const isActive = isWarning && status !== "WAITING" && status !== "PAID" && parseInt(memberId) !== 0;

        const { staffOfService, isLoading } = this.state;
        return (
            <tr>
                <td style={{ borderRight: 1 }}>
                    <ServiceName>{service.serviceName}</ServiceName>
                </td>

                <td style={{ position: 'relative', background: isActive ? '#FCD2D5' : 'transparent' }}
                    onClick={() => {
                        if (appointment.status === 'PAID' && isEditPaidAppointment) {
                            togglePopupStaff('', index)
                            this.getStaffAvailable();
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
                                staffOfService={staffOfService}
                                isLoading={isLoading}
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
                    <div onClick={() => {
                        if (isEditPaidAppointment) {
                            openPopupPrice(price, index, 'service')
                        }
                    }} style={{ textAlign: 'center' }}>
                        {price}
                        {isEditPaidAppointment &&
                            <IconEdit src={require('../../../images/edit.png')} />}
                    </div>
                </td>
            </tr>
        )
    }
}