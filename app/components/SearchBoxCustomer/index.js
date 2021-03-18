import React from 'react';
import styled from 'styled-components';
import Popup from 'reactjs-popup';
import AppointmentList from './AppointmentList';
import { isEmpty } from 'lodash'
import closeGrey from '../../images/closeGrey.png';
import closeBlack from '../../images/close_black.png';
import searchIcon from '../../images/searchIcon.png';
import moment from 'moment';
import ReactLoading from 'react-loading';

const AppPopup = styled(Popup)`
  padding: 0 !important;
  border: none !important;
  overflow: hidden;
  border-radius : 8px;
  width : 45rem !important;

`;

const Container = styled.div`
    padding : 2rem 0px;
    min-height : 30rem;
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
    align-items : center;
    background : transparent;
`;

const Title = styled.div`
    font-weight : 600;
    font-size : 1.5rem;
    color : #1964A3;
    margin-bottom : 0.5rem;
    margin-left : 2rem;
`;

const Row = styled.div`
    display : flex;
    flex-direction : row;
`;
const WrapInput = styled.div`
    flex : 1;
    height : 2.5rem;
    border-radius : 3px;
    border : 1.5px solid #dddddd;
    display : flex;
    flex-direction : row;
    align-items : center;
    padding : 8px;
    & > input {
        flex : 1
    }
    & > div{
        & > img {
            width : 26px;
            height : 26px;
        }
    }
`;

const Line = styled.div`
    width : 100% - 2rem;
    margin : 0 2rem;
    height : 3px;
    border-bottom : 1px solid #dddddd;
    margin-top : 0.8rem;
    margin-bottom : 1rem;
`;

const ButtonSearch = styled.div`
    width: 10rem;
    height : 2.5rem;
    display : flex;
    justify-content : center;
    align-items: center;
    border-radius : 5px;
    margin-left : 0.7rem;
    background-color:  ${(props) => props.isActive ? '#136AB7' : '#f2f2f2'};
`;

ButtonSearch.Text = styled.div`
    color:  ${(props) => props.isActive ? 'white' : '#585858'};
    font-size : 1rem;
    font-weight : ${(props) => props.isActive ? '600' : '500'};
`;

const Subtitle = styled.div`
    color : #757575;
    font-size : 1rem;
    margin-left : 2rem;
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
	top: 0.3rem;
	line-height: 1;
	font-size: 2rem;
	color: #ffffff;
	cursor: pointer;
	& > img{
		width : 32px;
		height : 32px;
	}
`;

export default class SearchBoxCustomer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            valueInput: '',
            indexActive: '',
            isLoading: '',
        }
    }

    onChangeInput = (e) => {
        this.setState({ valueInput: e.target.value });
    }

    onClickSearch = () => {
        const { valueInput } = this.state;
        if (valueInput.length > 0) {
            this.setState({ isLoading: true })
            this.props.searchCustomerBox({ data: valueInput, cb: this.stopLoading });
        }
    }

    stopLoading = () => {
        this.setState({ isLoading: false })
    }

    closeSearchBox = () => {
        this.props.toggleSearchBox(false);
        this.setState({ valueInput: '', indexActive: '', isLoading: '' });
    }

    selectItem = (date, appointment) => {
        this.setState({ indexActive: appointment.appointmentId });
        this.props.onChangeDay(moment(date).format('DDMMYYYY'));
        this.props.scrollToAppointment(appointment.appointmentId);
        let app = {
            ...appointment,
            id : appointment.appointmentId
        }
        this.props.getApppointmentById({ appointment: app });
        setTimeout(() => {
            this.closeSearchBox();
        }, 500);
    }
    render() {
        const { isPopupSearchBox, appointmentSearchBox } = this.props;
        const { isLoading } = this.state;
        return (
            <AppPopup
                open={isPopupSearchBox}
                onClose={() => () => { }}
                closeOnDocumentClick={false}
                modal={true}
                position={'left center'}
            >
                <Container>
                    {
                        isLoading &&
                        <ContainerLoading>
                            <ReactLoading
                                type={'spin'}
                                color={'#136AB7'}
                                height={50}
                                width={50}
                            />
                        </ContainerLoading>
                    }

                    <BtnClose onClick={this.closeSearchBox}>
                        {<img src={closeBlack} />}
                    </BtnClose>

                    <Title>Search</Title>

                    <Row style={{ marginLeft: '2rem', marginRight: '2rem' }}>
                        <WrapInput>
                            <input
                                value={this.state.valueInput}
                                onChange={e => this.onChangeInput(e)}
                                placeholder={`Enter customer name / phone number`}
                            />
                            {
                                this.state.valueInput.length > 0 ?
                                    <div onClick={() => this.setState({ valueInput: '' })}>
                                        <img src={closeGrey} />
                                    </div> : 
                                    <div>
                                        <img src={searchIcon} />
                                    </div>
                            }
                        </WrapInput>

                        <ButtonSearch
                            isActive={this.state.valueInput.length > 0}
                            onClick={() => this.onClickSearch()}
                        >
                            <ButtonSearch.Text
                                isActive={this.state.valueInput.length > 0}
                            >
                                Search
                            </ButtonSearch.Text>
                        </ButtonSearch>
                    </Row>
                    <Line />

                    <Subtitle>Upcoming appointment</Subtitle>
                    {
                        isEmpty(appointmentSearchBox) && isLoading !== '' &&
                        <NoAppointment>
                            No appointments
                        </NoAppointment>
                    }
                    <AppointmentList
                        appointmentSearchBox={appointmentSearchBox}
                        selectItem={(date, appointment) => this.selectItem(date, appointment)}
                        indexActive={this.state.indexActive}
                    />
                </Container>
            </AppPopup>
        )
    }
}
