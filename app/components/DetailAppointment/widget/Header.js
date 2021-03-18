import React, { Component } from 'react'
import styled from 'styled-components'

const HeaderAppointment = styled.div`
	height: 3rem;
	font-size: 22px;
	font-weight: 600;
	background: ${(props) => props.backgroundColor};
	color: ${(props) => (props.color ? props.color : 'white')};
	letter-spacing: 0.6;
	width: 100%;
	padding: 0.5rem 1rem;
	line-height: 1.5;
	text-align: center;
	border-top-left-radius: 1.5rem;
	border-top-right-radius: 1.5rem;
`;

export default class Header extends Component {
    render() {
        const { appointment } = this.props;
        if (!appointment) return null;
        switch (appointment.status) {
            case 'ASSIGNED':
                return (
                    <HeaderAppointment color="#585858" backgroundColor={'#ffe559'}>
                        <div
                            style={{
                                position: 'absolute',
                                left: 15,
                                fontSize: 18,
                                marginTop: 4
                            }}
                        >
                            {appointment.code}
                        </div>
						Unconfirmed Appointment
                    </HeaderAppointment>
                );
            case 'CONFIRMED':
                return (
                    <HeaderAppointment color="#585858" backgroundColor={'#c2f4ff'}>
                        <div
                            style={{
                                position: 'absolute',
                                left: 15,
                                fontSize: 18,
                                marginTop: 4
                            }}
                        >
                            {appointment.code}
                        </div>
						Confirmed Appointment
                    </HeaderAppointment>
                );

            case 'CHECKED_IN':
                return (
                    <HeaderAppointment color={'white'} backgroundColor={'#28AAE9'}>
                        <div
                            style={{
                                position: 'absolute',
                                left: 15,
                                fontSize: 18,
                                marginTop: 4
                            }}
                        >
                            {appointment.code}
                        </div>
						Check-In Appointment
                    </HeaderAppointment>
                );

            case 'PAID':
                return (
                    <HeaderAppointment color={'white'} backgroundColor={'#50CF25'}>
                        <div
                            style={{
                                position: 'absolute',
                                left: 15,
                                fontSize: 18,
                                marginTop: 4
                            }}
                        >
                            {appointment.code}
                        </div>
						Paid Appointment
                    </HeaderAppointment>
                );

            case 'VOID':
                return (
                    <HeaderAppointment color={'white'} backgroundColor={'#FD594F'}>
                        <div
                            style={{
                                position: 'absolute',
                                left: 15,
                                fontSize: 18,
                                marginTop: 4
                            }}
                        >
                            {appointment.code}
                        </div>
						Void Appointment
                    </HeaderAppointment>
                );

            case 'REFUND':
                return (
                    <HeaderAppointment color={'white'} backgroundColor={'#FD594F'}>
                        <div
                            style={{
                                position: 'absolute',
                                left: 15,
                                fontSize: 18,
                                marginTop: 4
                            }}
                        >
                            {appointment.code}
                        </div>
						Refund Appointment
                    </HeaderAppointment>
                );

            case 'WAITING':
                return (
                    <HeaderAppointment color={'#585858'} backgroundColor={'#f4f4f5'}>
                        <div
                            style={{
                                position: 'absolute',
                                left: 15,
                                fontSize: 18,
                                marginTop: 4
                            }}
                        >
                            {appointment.code}
                        </div>
						Waiting Appointment
                    </HeaderAppointment>
                );

            default:
                return (
                    <HeaderAppointment backgroundColor="red">
                        <div
                            style={{
                                position: 'absolute',
                                left: 15,
                                fontSize: 18,
                                marginTop: 4
                            }}
                        >
                            {appointment.code}
                        </div>
						Appointment Canceled
                    </HeaderAppointment>
                );
        }
    }
}
