import React, { Component } from 'react'

import styled from 'styled-components';
import PopupStaff from './PopupStaff';
import moment from 'moment';
import edit from '../../../images/edit.png';
import topArrow from '../../../images/top_arrow@3x.png';
import { api } from "../../../utils/helper";
import * as api_constants from '../../../../app-constants';
import { token } from '../../../../app-constants';

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

const ContainerButton = styled.div`
    width: 100% ;
    height: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
`;

const StaffName = styled.p`
    margin-left: 8px;
    width: 50px;
    font-size: 15px;
`;

const RenderStaff = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: relative;
    background-color: ${(props) => (props.isActive ? '#FDD2D4' : '#EEEEEE')};
    border: ${(props) => (props.isActive ? '1px solid red' : '')};
    border-radius: 5px;
    max-width: 120px;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 40px;
    padding-right: 10px;
`;

const ServiceColumn = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 10rem;
`;

export default class ServiceNormal extends Component {

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
            price,
        } = this.props;
        const { status, memberId } = appointment;
        const { isWarning } = service;
        const isActive = isWarning && status !== "WAITING" && parseInt(memberId) !== 0;

        const { staffOfService, isLoading } = this.state;

        return (
            <React.Fragment>
                <td>
                    <ServiceColumn>
                        <ServiceName>
                            {service.serviceName}
                        </ServiceName>
                    </ServiceColumn>
                </td>

                <td>
                    <ButtonTime onClick={() => openPopupTimePicker(index, fromTime)}>
                        {moment(fromTime).format('hh:mm A').toString()}
                        <ImgButton src={topArrow} />
                    </ButtonTime>
                </td>

                <td style={{ borderRight: 0 }}>
                    <RenderStaff
                        isActive={isActive}
                        onClick={() => {
                            togglePopupStaff('', index);
                            this.getStaffAvailable();
                        }}
                    >
                        <StaffName>{title}</StaffName>
                        <ImgButton src={topArrow} />
                        {
                            isPopupStaff && index === indexPopupStaff &&
                            (
                                <PopupStaff
                                    staffOfService={staffOfService}
                                    isLoading={isLoading}
                                    togglePopupStaff={(staff) => {
                                        this.props.togglePopupStaff(staff, index)
                                    }}
                                    staffList={staffList.filter((s) => s.id !== 0)}
                                    closePopupStaff={() => closePopupStaff()}
                                />
                            )
                        }
                    </RenderStaff>
                </td>

                <td style={{ textAlign: 'center' }}>
                    <ContainerButton>
                        <ButtonService
                            backgroundColor={(status !== 'PAID' && status !== 'VOID' && status !== 'REFUND' && appointment.status !== "no show" && service.duration > 5) ? '#0071c5' : '#dddddd'}
                            disabled={status === 'PAID' || status === 'VOID' || status === 'REFUND' || status === "no show" || service.duration <= 5}
                            onClick={() => subtractService(index)}
                        >
                            -5&#39;
						</ButtonService>
                        {duration}
                        <ButtonService
                            backgroundColor={(status !== 'PAID' && status !== 'VOID' && status !== 'REFUND' && status !== "no show") ? '#0071c5' : '#dddddd'}
                            disabled={status === 'PAID' || status === 'VOID' || status === 'REFUND' || status === "no show"}
                            onClick={() => addService(index)}
                        >
                            +5&#39;
						</ButtonService>
                    </ContainerButton>
                </td>

                <td>
                    <Row onClick={() => openPopupPrice(price, index, 'service')}>
                        <Price>{price}</Price>
                        <IconEdit src={edit} />
                    </Row>
                </td>

            </React.Fragment>
        )
    }
}