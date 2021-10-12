import React from 'react';
import styled from 'styled-components';
import Popup from 'reactjs-popup';
import iconCheckin from "../../images/Check-in.png";
import iconConfirm from "../../images/Confirm.png";
import iconNoShow from "../../images/no-show.png";
import iconPaid from "../../images/Paid.png";
import iconUnconfirm from "../../images/Unconfirm.png";
import iconVoid from "../../images/Void.png";
import customer_confirm from "../../images/customer-confirm.png";
import iconRequest from "../../images/Request.png";
import iconVip from "../../images/iconVip.png";

import iconsAppointment from "../../images/iconsAppointment.png";

import closeWhite from '../../images/close_white.png'



const AppPopup = styled(Popup)`
  padding: 0 !important;
  border: none !important;
  overflow: hidden;
  border-radius : 8px;
  width : 55rem !important;
`;

const Container = styled.div`
    min-height : 30rem;
    position : relative;
    width : 55rem;
    height: 32rem;
    background-color: white;
`;

const Header = styled.div`
    width : 100%;
    background : #1B68AC;
    color: white;
    font-weight : 600;
    font-size : 1.7rem;
    text-align: center;
    padding : 11px 14px;
    position: relative;
`;

const Content = styled.div`
  padding : 40px;  
`;

const Row = styled.div`
    display: flex;
    flex-direction : row;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const LastRow = styled.div`
    display: flex;
    flex-direction : row;
`;

const Item = styled.div`
    & > img{
        width : 100px;
        height: 130px;
        margin-bottom: 15px;
    }
    & > div {
        font-size : 1rem;
        color : #404040;
        text-align: center;
    }

    & > div:nth-child(1){
        margin-left : 0px !important;
    }
    
`;

const CloseButton = styled.img`
    position: absolute;
    right: 16px;
    top : 12px;
    width : 38px;
    height : 38px;
    cursor: pointer;
`;

export default class Information extends React.Component {

    render() {
        const { isPopupInformation } = this.props;
        return (
            <AppPopup
                open={isPopupInformation}
                onClose={() => () => { }}
                closeOnDocumentClick={false}
                modal={true}
                position={'left center'}
            >
                <Container>
                    <Header>
                        Informations
                        <CloseButton onClick={()=>this.props.toggleInformation(false)} src={closeWhite} alt="" />
                    </Header>
                    <Content>
                        <Row>
                            <ItemAppointment title="Unconfirn" icon={iconUnconfirm} />
                            <ItemAppointment title="Confirmed" icon={iconConfirm} />
                            <ItemAppointment title="Check-In" icon={iconCheckin} />
                            <ItemAppointment title="Paid" icon={iconPaid} />
                            <ItemAppointment title="No Show" icon={iconNoShow} />
                            <ItemAppointment title="Void/Refund" icon={iconVoid} />
                        </Row>

                        <LastRow style={{ marginTop: 50, justifyContent : 'center' }}>
                            <Item>
                                <img src={iconsAppointment} alt="" />
                                <div></div>
                            </Item>
                            <div>
                                <LastRow style={{ marginLeft: 20, marginTop : 12 }}>
                                    <img src={iconVip} style={{ width: 25, height: 25 }} />
                                    <span style={{ marginLeft: 8 }}>VIP customer</span>
                                </LastRow>
                                <LastRow style={{ marginLeft: 20, marginTop : 16 }}>
                                    <img src={iconRequest} style={{ width: 25, height: 25 }} />
                                    <span style={{ marginLeft: 8 }}>Request</span>
                                </LastRow>
                                <LastRow style={{ marginLeft: 20, marginTop : 16 }}>
                                    <img src={customer_confirm} style={{ width: 25, height: 25 }} />
                                    <span style={{ marginLeft: 8 }}>Customer confirmed</span>
                                </LastRow>
                            </div>
                        </LastRow>
                    </Content>
                </Container>
            </AppPopup>
        )
    }
}


const ItemAppointment = ({ title = '', icon }) => (
    <Item>
        <img src={icon} alt="" />
        <div>{title}</div>
        <div>Appointment</div>
    </Item>
)