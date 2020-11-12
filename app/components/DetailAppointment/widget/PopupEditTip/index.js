import React, { Component } from 'react'
import styled from 'styled-components';
import CurrencyInput from 'react-currency-masked-input'
import EditStaff from './EditStaff';

const Container = styled.div`
    position : absolute;
    left : 0;
    top : 0;
    right : 0;
    bottom : 0;
    z-index: 1;
	border-radius: 1.5rem;
    background-color : rgba(0,0,0,0.5);
    display : flex;
    padding : 3rem 10rem;
`;

const ContentPopup = styled.div`
    width : 100%;
`;

ContentPopup.Header = styled.div`
    background-color : #1366AE;
    display : flex;
    justify-content : center;
    align-items : center;
    padding-top : 1rem;
    padding-bottom : 1rem;
    border-top-left-radius : 1.5rem;
    border-top-right-radius : 1.5rem;
    color : white;
    font-weight : 600;
    font-size : 1.45rem;
`;

ContentPopup.Body = styled.div`
    width : 100%;
    height : 20rem;
    background-color : #FAFAFA;
    border-bottom-left-radius : 1.5rem;
    border-bottom-right-radius : 1.5rem;
    padding : 1rem 2rem;
`;

const StaffInput = styled.div`
    width : 100%;
    border : 1px solid #dddddd;
    height : 3rem;
    background-color : white;
    display : flex;
    justify-content : space-between;
    align-items : center;
    flex-direction : row;
    margin-bottom : 2rem;
    padding : 0 1rem;
`;

StaffInput.Text = styled.div`
    color : #333;
    font-size : 1.1rem;
`;

const TipInput = styled(StaffInput)`
`;

const Title = styled.div`
    font-size : 1.1rem;
    color : #585858;
    margin-bottom : 0.2rem;
`;

const ButtonSubmit = styled.div`
    display : flex;
    justify-content : center;
    align-items : center;
    text-align : center;
    background-color : #1366AE;
    font-weight : 600;
    font-size : 1.1rem;
    color : white;
    width : 7.3rem;
    height : 3rem;
    border-radius : 3px;
`;

const Bottom = styled.div`
    width : 100%;
    display : flex;
    align-items : center;
    justify-content : center;
`;

const ImgButton = styled.img`
	width : 12px;
	height : 6px; 
	margin-left : 8px; 
`;

const BtnClose = styled.div`
	position: absolute;
	right: 0.7rem;
	top: 0.9rem;
	line-height: 1;
	font-size: 2rem;
	color: #ffffff;
	cursor: pointer;
	& > img{
		width : 32px;
		height : 32px;
	}
`;

export default class PopupEditTip extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isPopupStaff: false,
            tipAmount: '',
            staffSelected: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        const { serviceEditPaid } = nextProps;
        if (serviceEditPaid) {
            const { tipAmount, staffId } = serviceEditPaid;
            const staffSelected = this.staffSelected(staffId);
            this.setState({ tipAmount, staffSelected })
        }
    }

    togglePopupEditStaff() {
        const { isPopupStaff } = this.state;
        this.setState({
            isPopupStaff: !isPopupStaff
        })
    }

    closePopupEditStaff(staff) {
        if (!staff) {
            this.setState({ isPopupStaff: false });
            return;
        }

        const { id } = staff;
        const staffSelected = this.staffSelected(id);
        this.setState({
            isPopupStaff: false,
            staffSelected
        })
    }

    openPopupEditStaff() {
        this.setState({
            isPopupStaff: true
        })
    }

    async onChangePrice(e, a) {
        const value = await e.target.value;
        this.setState({ tipAmount: value })
    }

    staffSelected(staffId) {
        const { staffList } = this.props;
        const staff = staffList.find(obj => parseInt(obj.id) === parseInt(staffId));
        if (staff) return staff;
        return '';
    }

    onSubmit() {
        const { staffSelected } = this.state;
        const tipAmount = (this.refinput && this.refinput.value) ? this.refinput.value : "0.00"
        this.props.onSubmit(tipAmount, staffSelected);
    }

    render() {
        const { isPopupEditTip, staffEditPaid, serviceEditPaid, staffList } = this.props;
        const { staffSelected } = this.state;
        if (!isPopupEditTip) return null;

        return (
            <Container
            // onClick={() => this.props.togglePopupEditTip()}
            >
                <ContentPopup>
                    <ContentPopup.Header style={{ position: 'relative' }}>
                        Modification

                        <BtnClose onClick={() => this.props.onSubmit()}>
                            <img src={require("../../../../images/close_white.png")} />
                        </BtnClose>
                    </ContentPopup.Header>
                    <ContentPopup.Body>
                        <Title>Staff</Title>
                        <StaffInput
                            onClick={() => this.openPopupEditStaff()}
                            style={{ position: 'relative' }}
                        >
                            <StaffInput.Text>
                                {staffSelected ? staffSelected.title : ''}
                            </StaffInput.Text>
                            <ImgButton src={require('../../../../images/top_arrow@3x.png')} />
                            <EditStaff
                                closePopupEditStaff={(staff) => this.closePopupEditStaff(staff)}
                                isPopupStaff={this.state.isPopupStaff}
                                staffList={staffList}
                            />
                        </StaffInput>
                        <Title>Tips</Title>
                        <TipInput>
                            <CurrencyInput
                                name="myInput"
                                id="myInput"
                                type='tel'
                                onChange={e => this.onChangePrice(e)}
                                defaultValue={this.state.tipAmount}
                                placeholder="0.00"
                                style={{
                                    width: '100%',
                                    color: '#585858',
                                }}
                                autoFocus
                                ref={ref => this.refinput = ref}
                            />
                        </TipInput>

                        <Bottom>
                            <ButtonSubmit onClick={() => this.onSubmit()}>
                                Edit
                            </ButtonSubmit>
                        </Bottom>

                    </ContentPopup.Body>
                </ContentPopup>
            </Container>
        )
    }
}
