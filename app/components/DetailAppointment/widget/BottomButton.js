import React, { Component } from 'react'
import styled from 'styled-components'
import { role } from '../../../../app-constants';

const Footer = styled.div`
	display: flex;
	padding: 0.5rem 1rem 1rem 1rem;
	& > div {
		width: 50%;
		text-align: center;
	}
`;

const Button = styled.button`
	border-radius: 4px;
	background: ${(props) => (props.primary ? '#0071c5' : '#eeeeee')};
	color: ${(props) => (props.primary ? '#ffffff' : '#333333')};
	border: 1px solid #dddddd;
	font-size: 1rem;
	line-height: 2.8;
	height: 100%;
	cursor: pointer;
	text-align: center;
	padding: 0 2rem;
	width: 9rem;
	height: 2.92rem;
`;

const ButtonChange = styled(Button)`
	box-shadow: 0 0px #fff inset, 0 0.6px 10px #1FB5F4;
	border: none !important;
`;


export default class BottomButton extends Component {

    renderNextStatusButton() {
        const { appointment, isEditPaidAppointment, isChange } = this.props;

        if (isChange && appointment.status !== 'PAID') {
            if (appointment.status === 'ASSIGNED')
                return (
                    <Button onClick={() => this.props.nextStatus()} primary="true">
                        Confirm
                    </Button>
                );
            if (appointment.status === 'CONFIRMED' && appointment.memberId !== 0)
                return (
                    <Button onClick={() => this.props.nextStatus()} primary="true">
                        Check-In
                    </Button>
                );
            if (appointment.status === 'CHECKED_IN' && appointment.memberId !== 0)
                return (
                    <Button onClick={() => this.props.nextStatus()} primary="true">
                        Check-Out
                    </Button>
                );
        } else {
            if (appointment.status === 'PAID' && appointment.memberId !== 0) {
                if (role === 'Admin') {
                    if (isEditPaidAppointment) {
                        return (
                            <Button
                                style={{ fontWeight: '700' }}
                                onClick={() => this.props.updateStaffAppointmentPaid()}
                                primary="true"
                            >
                                Submit
                            </Button>
                        );
                    } else {
                        return (
                            <Button
                                onClick={() => this.props.toggleEditPaidAppointment()}
                                primary="true"
                            >
                                Edit
                            </Button>
                        );
                    }
                } else return null;
            }
            if (appointment.status !== 'WAITING') {
                return (
                    <ButtonChange onClick={() => this.props.changeAppointmentTime()} primary="true">
                        <strong>Change</strong>
                    </ButtonChange>
                );
            }
        }
    }

    render() {
        const { appointment } = this.props;
        return (
            <Footer>
                {appointment.status !== 'VOID' &&
                    appointment.status !== 'REFUND' &&
                    appointment.status !== 'PAID' && (
                        <div>
                            <Button
                                onClick={() => {
                                    this.props.openConfirmationModal();
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                <div>{this.renderNextStatusButton()}</div>
            </Footer>
        )
    }
}
