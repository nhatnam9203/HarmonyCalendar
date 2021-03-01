import React, { Component } from 'react'
import closeWhite from '../../../images/close_white.png'
import styled from 'styled-components'
import Popup from 'reactjs-popup';

const AppPopup = styled(Popup)`
	border-radius: 1.5rem;
	border-top-left-radius: 1.7rem;
	border-top-right-radius: 1.7rem;
	padding: 0 !important;
	border: none !important;
	box-shadow : ${(props) => props.BoxShadow};
`;

const AppPopupWrapper = styled.div`position: relative;`;

AppPopupWrapper.Header = styled.div`
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

AppPopupWrapper.Body = styled.div`
	background: #ffffff;
	width: 100%;
	padding: 1rem 1rem 0 1rem;
	height: 460px;
	overflow-y: ${(props) => (props.scroll ? 'scroll' : 'hidden')};
`;

AppPopupWrapper.Footer = styled.div`
	display: flex;
	padding: 0.5rem 1rem 1rem 1rem;
	& > div {
		width: 50%;
		text-align: center;
	}
`;

AppPopupWrapper.Close = styled.div`
	position: absolute;
	right: 0.5rem;
	top: 0.25rem;
	line-height: 1;
	font-size: 2rem;
	color: #ffffff;
	cursor: pointer;
`;

const BtnClose = styled.div`
	position: absolute;
	right: 0.5rem;
	top: 0.25rem;
	line-height: 1;
	font-size: 2rem;
	color: #ffffff;
	cursor: pointer;
	& > img {
		width: 32px;
		height: 32px;
	}
`;

const ConfirmationPopup = styled(AppPopup)`
	width: 30rem !important;
	height: 10rem !important;
`;

const ConfirmationWrapper = styled(AppPopupWrapper)`
	//
	`;

ConfirmationWrapper.Header = styled(AppPopupWrapper.Header)`
	//
    `;

ConfirmationWrapper.Body = styled(AppPopupWrapper.Body)`
	text-align: center;
	height: 150px;
	border-bottom-left-radius: 1.5rem;
	border-bottom-right-radius: 1.5rem;
	font-size : 1rem;
	@media (max-width: 1024px) {
    	font-size : 1.1rem;
  	}
	`;

ConfirmationWrapper.Close = styled(AppPopupWrapper.Close)`
	//
	`;

ConfirmationWrapper.Footer = styled(AppPopupWrapper.Footer)`
	//
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

const WrapperCancelAppointment = styled.div`
	display: flex;
	width: 100%;
	justify-content: row;
	margin-top: 50px;
`;


export default class PopupCancel extends Component {
    render() {
        const { onClose,isOpen , confirmCancelAppointment } = this.props;
        return (
            <ConfirmationPopup
                onClose={onClose}
                open={isOpen}
            >
                <ConfirmationWrapper>
                    <BtnClose onClick={onClose}>
                        <img src={closeWhite} />
                    </BtnClose>

                    <ConfirmationWrapper.Header backgroundColor="#1173C3">
                        Confirmation
                    </ConfirmationWrapper.Header>
                    <ConfirmationWrapper.Body>
                        Do you want to Cancel this Appointment?
                        <WrapperCancelAppointment>
                            <div style={{ width: '50%', textAlign: 'center' }}>
                                <Button onClick={onClose}>
                                    No
                                </Button>
                            </div>
                            <div style={{ width: '50%', textAlign: 'center' }}>
                                <Button primary onClick={confirmCancelAppointment}>
                                    Yes
                                </Button>
                            </div>
                        </WrapperCancelAppointment>
                    </ConfirmationWrapper.Body>
                </ConfirmationWrapper>
            </ConfirmationPopup>
        )
    }
}
