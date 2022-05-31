import React from 'react';
import styled from 'styled-components';
import Popup from 'reactjs-popup';
import closeBlack from '../../images/close_black.png';
import AppointmentList from "./AppointmentList";
import { PUT_UPDATE_STATUS_APPOINTMENT, token } from '../../../app-constants';
import axios from "axios";

const AppPopup = styled(Popup)`
  padding: 0 !important;
  border: none !important;
  overflow: hidden;
  border-radius : 8px;
  width : 48rem !important;
`;

const Container = styled.div`
    padding : 2rem 0px;
    min-height : 35rem;
    position : relative;
`;

const ContainerLoading = styled.div`
    position : absolute;
    top : 0px;
    right : 0px;
    left : 0px;
    bottom : 0px;
    display : flex;
    justify-content : center;
    padding-top : 6.5rem;
    background : transparent;
`;

const Title = styled.div`
    font-weight : 600;
    font-size : 1.5rem;
    color : #1964A3;
    padding-left : 2rem;
    margin-bottom : 0.5rem;
    border-bottom : 1px solid #dddddd;
    padding-bottom : 0.5rem;
`;


const Bottom = styled.div`
    width : 100%;
    display: flex;
    justify-content : center;
    align-items: center;
    border-top: 1px solid #dddddd;
    padding-top : 1.5rem;
`;

const ContainerBody = styled.div`
    min-height : 25rem;
    overflow-y: scroll;
`;

const ButtonRevert = styled.div`
    width: 10rem;
    height : 3rem;
    display : flex;
    justify-content : center;
    align-items: center;
    border-radius : 5px;
    margin-left : 0.7rem;
    font-size : 1.15rem;
    font-weight: ${(props) => (props.isActive ? '600' : '400')};
    color: ${(props) => (props.isActive ? '#ffffff' : '#585858')};
    background-color: ${(props) => (props.isActive ? '#136AB7' : '#F5F5F5')};
    cursor : pointer;
`;

const NoAppointment = styled.div`
    color : #585858;
    font-size : 1rem;
    margin-top : 0.5rem;
    margin-left : 2rem
`;

const BtnClose = styled.div`
    position : absolute;
	right: 0.5rem;
	top: 0.5rem;
	line-height: 1;
	font-size: 2rem;
	color: #ffffff;
	cursor: pointer;
	& > img{
		width : 32px;
		height : 32px;
	}
`;

export default class index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            appointmentSelected: [],
            count: 0,
            isLoading: false,
        };
    }

    close = () => {
        this.props.togglePopupAppointmentCancel(false);
        this.setState({ appointmentSelected: [], isLoading: false });
    }

    selectItem = (_, item) => {
        let { appointmentSelected = [] } = this.state;
        const findItem = appointmentSelected.find(obj => obj.appointmentId === item.appointmentId);
        if (!findItem && item) {
            appointmentSelected.push(item)
        } else {
            appointmentSelected = appointmentSelected.filter(obj => obj.appointmentId !== item.appointmentId);
        }
        this.setState({ appointmentSelected });
    };


    renderAppointmentsCancelled() {
        const { appointmentsCancelled = [] } = this.props;
        const { appointmentSelected } = this.state;

        if (appointmentsCancelled && appointmentsCancelled.length && appointmentsCancelled.length > 0) {
            return (
                <AppointmentList
                    appointmentSearchBox={appointmentsCancelled.filter(obj=>obj.previousStatus)}
                    appointmentSelected={appointmentSelected}
                    selectItem={(date, appointment) => this.selectItem(date, appointment)}
                    indexActive={0}
                />
            );
        }

        return (
            <NoAppointment>
                No appointment cancelled on this date.
            </NoAppointment>
        );
    }

    callApiUpdateStatus = async(appointment) => {
        const { appointmentId, previousStatus } = appointment;
        const requestUrl = `${PUT_UPDATE_STATUS_APPOINTMENT}/${appointmentId}`;
        const res = await axios.put(requestUrl, { status: previousStatus }, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        return res;
    };

    submitRevert = () => {
        const { appointmentSelected, isLoading } = this.state;
        try {
            if (appointmentSelected.length > 0) {
                this.setState({ isLoading: true });
                const promises = appointmentSelected.map(async appointment => {
                    return this.callApiUpdateStatus(appointment);
                });
                Promise.all(promises).then(data => {
                    if (data.length >= appointmentSelected.length) {
                        this.props.loadWaitingAppointments();
                        this.props.loadAppointmentByMembers();
                        this.setState({ isLoading: false });
                        this.close();
                    }
                })
            }
        } catch (err) {
            this.setState({ isLoading: false });
        }
    }

    render() {
        const {
            isPopupAppointmentCancel,
            isLoadingAppointmentCanel
        } = this.props;

        const { appointmentSelected = [], isLoading } = this.state;

        return (
            <AppPopup
                open={isPopupAppointmentCancel}
                onClose={() => () => { }}
                closeOnDocumentClick={false}
                modal={true}
                position={'left center'}
            >
                <Container>
                    <Title>Appointments Cancelled</Title>

                    <BtnClose onClick={isLoading ? () => { } : this.close}>
                        {<img src={closeBlack} />}
                    </BtnClose>

                    <ContainerBody>
                        {
                            isLoadingAppointmentCanel ?
                                <ContainerLoading>
                                    <img
                                        style={{ width: 63, height: 63 }}
                                        src={require('../../images/loading.gif')}
                                        alt=""
                                    />
                                </ContainerLoading> :
                                this.renderAppointmentsCancelled()

                        }
                    </ContainerBody>

                    <Bottom>
                        <ButtonRevert onClick={this.submitRevert} isActive={appointmentSelected.length > 0}>
                            {isLoading ? <img
                                style={{ width: 35, height: 35 }}
                                src={require('../../images/loading.gif')}
                                alt=""
                            /> : "Reverse"}
                        </ButtonRevert>
                    </Bottom>
                </Container>
            </AppPopup>
        )
    }
}

