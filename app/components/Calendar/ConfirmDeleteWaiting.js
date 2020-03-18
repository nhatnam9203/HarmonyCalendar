import React, { Component } from 'react'
import Popup from 'reactjs-popup';
import styled from 'styled-components';
import {FaTimesCircle} from 'react-icons/fa'
const ConfirmPopup = styled(Popup)`
  border-radius: 1.5rem;
  padding: 0 !important;
  border: none !important;
  height: 200px;
  width : 480px !important;
  position : relative;
`;

const ConfirmPopupWrapper = styled.div`
    
`
ConfirmPopupWrapper.Header = styled.div`
  height: 3rem;
  font-size: 1.6rem;
  font-weight: bold;
  background: #1FB5F4;
  color: #ffffff;
  padding: 0.5rem 1rem;
  line-height: 1.5;
  text-align: center;
  border-top-left-radius : 1.5rem;
  border-top-right-radius : 1.5rem;
  position : relative;
`
ConfirmPopupWrapper.ButtonX = styled.div`
 position: absolute;
  right: 0.5rem;
  top: 0.25rem;
  line-height: 1;
  font-size: 2rem;
  color: #ffffff;
  cursor: pointer;
`

ConfirmPopupWrapper.Body = styled.div`
  height: 5rem;
  font-size: 0.9rem;
  color: #333;
  text-align: center;
  padding-top : 1rem;
`

ConfirmPopupWrapper.Footer = styled.div`
  display : flex;
  flex-direction : row;
  justify-content : space-between;
  padding : 0 3rem;
`

ConfirmPopupWrapper.WrapperButton = styled.div`
    width : 50%;
    text-align : center;
`
ConfirmPopupWrapper.Button = styled.button`
    background-color : ${props => props.backgroundColor};
    color : ${props => props.Color};
    padding : 0.8rem 3.5rem;
    border-radius : 3px;
    font-size : 1rem;
    cursor : pointer;
`

ConfirmPopupWrapper.ButtonYes = styled.div`
    background-color : ${props => props.backgroundColor};
    color : ${props => props.Color};
    padding : 0.5rem 2.5rem;
    border-radius : 3px;
    font-size : 1rem;
    cursor : pointer;
`

ConfirmPopupWrapper.ButtonNo = styled(ConfirmPopupWrapper.ButtonYes)`

`

class ConfirmDeleteWaiting extends Component {

    deleteEventWaiting() {
        const { deleteEventWaitingList, event } = this.props;
        deleteEventWaitingList(event);
        this.closeModal();
    }

    closeModal() {
        const { deleteWaitingAppointment } = this.props;
        deleteWaitingAppointment(false);
    }

    render() {
        const { StatusDeleteWaiting, event } = this.props;
        if (StatusDeleteWaiting === false) return '';
        return (
            <ConfirmPopup
                closeOnDocumentClick
                open
                onOpen={() => this.openModal()}
                onClose={() => this.closeModal()}
            >
                <ConfirmPopupWrapper>
                    <ConfirmPopupWrapper.Header>Confirmation
                        <ConfirmPopupWrapper.ButtonX onClick={()=>this.closeModal()}>
                            <FaTimesCircle />
                        </ConfirmPopupWrapper.ButtonX>
                    </ConfirmPopupWrapper.Header>

                    <ConfirmPopupWrapper.Body>
                        {event && `Delete appointment ${ event.code} from Waiting List ?`}
                    </ConfirmPopupWrapper.Body>

                    <ConfirmPopupWrapper.Footer>
                        <ConfirmPopupWrapper.WrapperButton>
                            <ConfirmPopupWrapper.Button Color="#333" backgroundColor={'#EEEEEE'} onClick={() => this.deleteEventWaiting()}>Yes</ConfirmPopupWrapper.Button>
                        </ConfirmPopupWrapper.WrapperButton>

                        <ConfirmPopupWrapper.WrapperButton>
                            <ConfirmPopupWrapper.Button Color="#fff" backgroundColor={'#1FB5F4'} onClick={() => this.closeModal()}>No</ConfirmPopupWrapper.Button>
                        </ConfirmPopupWrapper.WrapperButton>
                    </ConfirmPopupWrapper.Footer>
                </ConfirmPopupWrapper>
            </ConfirmPopup>
        )
    }
}

export default ConfirmDeleteWaiting;
