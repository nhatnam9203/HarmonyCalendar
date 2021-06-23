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
    background: ${(props) => (props.primary && props.primary !== "cancel" ? '#0071c5' : '#eeeeee')};
    color: ${(props) => (props.primary && props.primary !== "cancel" ? '#ffffff' : '#333333')};
    opacity: ${(props) => (props.primary || props.primary === "cancel" ? 1 : 0.6)};
    border: 1px solid #dddddd;
    font-size: 1rem;
    font-weight : 500;
    line-height: 2.8;
    height: 100%;
    cursor: pointer;
    text-align: center;
    padding: 0 2rem;
    width: 9rem;
    height: 2.92rem;
`;

const ButtonChange = styled(Button)`
    /* box-shadow: 0 0px #fff inset, 0 0.6px 10px #1FB5F4; */
    border: none !important;
`;

const WrapButton = styled.div`
    display : flex;
    justify-content : center;
    align-items : center;
    width : 200%;
`;


export default class BottomButton extends Component {

    renderNextStatusButton() {
        const { appointment, isEditPaidAppointment, isChange, isDisabled } = this.props;

        if (isChange && appointment.status !== 'PAID') {
            if (appointment.status === 'ASSIGNED')
                return (
                    <Button primary={!isDisabled} onClick={() => !isDisabled && this.props.nextStatus()}>
                        Confirm
                    </Button>
                );
            if (appointment.status === 'CONFIRMED' && appointment.memberId !== 0)
                return (
                    <Button primary={!isDisabled} onClick={() => !isDisabled && this.props.nextStatus()}>
                        Check-In
                    </Button>
                );
            if (appointment.status === 'CHECKED_IN' && appointment.memberId !== 0)
                return (
                    <Button primary={!isDisabled} onClick={() => !isDisabled && this.props.nextStatus()}>
                        Check-Out
                    </Button>
                );
        } else {
            if (appointment.status === 'PAID' && appointment.memberId !== 0) {
                if (role === 'Admin') {
                    if (isEditPaidAppointment) {
                        return (
                            <WrapButton>
                                <Button
                                    primary={!isDisabled}
                                    style={{ fontWeight: '700' }}
                                    onClick={() => !isDisabled && this.props.updateStaffAppointmentPaid()}

                                >
                                    Submit
                                </Button>
                            </WrapButton>
                        );
                    } else {
                        return (
                            <WrapButton>
                                <Button
                                    primary={"true"}
                                    onClick={() => this.props.toggleEditPaidAppointment()}

                                >
                                    Edit
                                </Button>
                            </WrapButton>
                        );
                    }
                } else return null;
            } else if (appointment.status !== 'WAITING' && appointment.status !== 'CANCEL' && appointment.status !== 'PAID' && appointment.status !== 'REFUND' && appointment.status !== 'VOID') {
                return (
                    <ButtonChange primary={!isDisabled} onClick={() => !isDisabled && this.props.changeAppointmentTime()}>
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
                    appointment.status !== 'PAID' &&
                    appointment.status !== 'CANCEL' && (
                        <div>
                            <Button
                                primary="cancel"
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
