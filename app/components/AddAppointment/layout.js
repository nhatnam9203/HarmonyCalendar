import React from 'react';
import styled from 'styled-components';
import Popup from 'reactjs-popup';
import { formatUsPhone } from '../../utils/helper';
import NumberFormat from 'react-number-format';

const AppPopup = styled(Popup)`
  border-radius: 1.5rem;
  padding: 0 !important;
  border: none !important;
  overflow: hidden;
`;

const AppPopupWrapper = styled.div`position: relative;`;

AppPopupWrapper.Header = styled.div`
	height: 3.5rem;
	justify-content : center;
	align-items: center;
	font-size: 20px;
	font-weight: bold;
	background: ${(props) => props.backgroundColor};
	color: #ffffff;
	width: 100%;
	padding: 0.7rem 1rem;
	line-height: 1.5;
	text-align: center;
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

AppPopupWrapper.Body = styled.div`
	background: #ffffff;
	width: 100%;
	padding: 1rem 1rem 0 1rem;
`;

AppPopupWrapper.Footer = styled.div`
	display: flex;
	flex-direction: row;
	padding: 0.5rem 1rem 1rem 1rem;

	& > div {
		flex: 1;
		text-align: center;
	}
	& > select {
		width: 5rem;
		height: 3rem;
	}
`;


const SearchingPopup = styled(AppPopup)`
  width: 30rem !important;
  
`;

const SearchingWrapper = styled(AppPopupWrapper)`
  //
`;

SearchingWrapper.Header = styled(AppPopupWrapper.Header)`
  height : 3rem;
`;

SearchingWrapper.Body = styled(AppPopupWrapper.Body)`
  text-align: center;
`;

SearchingWrapper.Close = styled(AppPopupWrapper.Close)`
  //
`;

SearchingWrapper.Footer = styled.div`
	display: flex;
	padding: 0.5rem 1rem 1rem 1rem;
`;



const AddingPopup = styled(AppPopup)`
  width: 30rem !important;
`;

const AddingWrapper = styled(AppPopupWrapper)`

`;

AddingWrapper.Header = styled(AppPopupWrapper.Header)`
	height : 3.5rem;
	padding: 0.8rem 1rem;
	font-size : 22px;
`;

AddingWrapper.Body = styled(AppPopupWrapper.Body)`
  text-align: center;
  height : 26rem;
  overflow-y : scroll;
`;

AddingWrapper.Close = styled(AppPopupWrapper.Close)`
  //
`;

AddingWrapper.Footer = styled(AppPopupWrapper.Footer)`
  //
`;

// ************************************************* //
// ************************************************* //
// ************************************************* //


const Label = styled.div`
	margin-bottom: 0.3rem;
	text-align: left;
	font-size : 1rem;
`;

const FooterChekPhone = styled.div`
	width: 100%;
	padding: 1rem;
	text-align: center;
`;

const FormCheckPhone = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 2.5rem;
	margin-bottom: 1rem;
	& > input {
		flex: 1;
		text-align: left;
		background: #ffffff;
		border: 1px solid #dddddd;
		border-radius: 4px;
		padding-left: 1.3rem;
		-moz-appearance: none;
		-webkit-appearance: none;
	}
	& > select {
		width: 4rem;
		background: #ffffff;
		border: 1px solid #dddddd;
		border-radius: 4px;
		margin-right: 0.5rem;
		padding-left: 1.2rem;
		-moz-appearance: none;
		-webkit-appearance: none;
	}
`;

const Row = styled.div`
	display : flex;
	flex-direction : row;
	align-items : center
`;

const ImageSendLink = styled.img`
	width: 20px;
	height: 20px;
	object-fit : cover;
	margin-right: 10px;
`;

const Form = styled.form`
  flex : 1;
  text-align: center;
  };

  input {
    width: 100%;
    background: #ffffff;
    border: 1px solid #dddddd;
    border-radius : 4px;
    padding: 0.7rem 1rem;
    margin-bottom: 1rem;
    text-align: left;
    -moz-appearance: none;
	font-size : 1rem;
    -webkit-appearance: none;

    &.w-50 {
      width: 48%;
    }
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
	padding: 0rem 3rem;
`;

const NoteWrapper = styled.div`
	border: 1px solid #dddddd;
	background: #eeeeee;
	padding: 0.5rem;
	height: 10rem;
	text-align: left;
	display: flex;
	flex-direction: column;
	word-wrap: break-word;
`;

NoteWrapper.Form = styled.form`
	display: flex;

	& > input {
		flex: 1;
		background: #ffffff;
		border: 1px solid #dddddd;
		border-right: none;
		border-top-left-radius: 4px;
		border-bottom-left-radius: 4px;
		padding: 0 1rem;
		-moz-appearance: none;
		-webkit-appearance: none;
	}
	& > button {
		width: 5rem;
		border-top-right-radius: 4px;
		border-bottom-right-radius: 4px;
		background: #0071c5;
		color: #ffffff;
		line-height: 2.8;
		cursor: pointer;
		text-align: center;
	}
`;

const ImageEnter = styled.img`
    width : 1.3rem;
    height : 1.3rem;
`;

const BtnClose = styled.div`
	position: absolute;
	right: 0.5rem;
	top: 0.25rem;
	line-height: 1;
	font-size: 2rem;
	color: #ffffff;
	cursor: pointer;
	& > img{
		width : 30px;
		height : 30px;
	}
`;


class AddAppointment extends React.Component {

    renderNote = (note, index) => (
        <NoteInformation key={index}>
            <div>{note}</div>
        </NoteInformation>
    );

    renderNotes() {
        const { notes } = this.state;
        return (
            <div style={{ height: 60, overflowY: 'scroll', marginTop: 15 }}>
                {notes.map((note, index) => {
                    return (
                        <div style={{ marginBottom: 5 }} key={index + "note"} >{note}</div>
                    )
                })}
            </div>
        );
    }

    renderPopupSearch() {
        const {
            isOpenSearchingPopup,
            error_phone,
        } = this.state;

        return (
            <SearchingPopup open={isOpenSearchingPopup} closeOnDocumentClick={false} lockScroll={true}>
                <SearchingWrapper>
                    <BtnClose onClick={() => this.closeAllModal()}>
                        <img src={require("../../images/close_white.png")} />
                    </BtnClose>
                    <SearchingWrapper.Header backgroundColor="#0071C5">Add Appointment</SearchingWrapper.Header>
                    <SearchingWrapper.Body>Enter Phone Number</SearchingWrapper.Body>

                    <FooterChekPhone>
                        <FormCheckPhone>
                            <select
                                value={this.state.phoneCheck}
                                onChange={(e) => this.setState({ phoneCheck: e.target.value })}
                                className=""
                                name=""
                                id=""
                            >
                                <option value="1">+1</option>
                                <option value="84">+84</option>
                                <option />
                            </select>
                            <NumberFormat
                                format="###-###-####"
                                mask="_"
                                value={this.state.phoneNumber}
                                onChange={(e) => this.handleChange(e)}
                                placeholder="Enter Phone Number"
                                type="tel"
                            />
                        </FormCheckPhone>
                        <Button
                            onClick={() => this.handleSubmitVerifyPhone()}
                            id="submit-create-appointment"
                            primary
                        >
                            Next
                    </Button>
                        {error_phone && <p style={{ color: 'red' }}>{error_phone}</p>}
                    </FooterChekPhone>
                </SearchingWrapper>
            </SearchingPopup>
        )
    }

    checkConditionSendLink() {
        const { InfoAfterCheckPhone } = this.props;
        if (InfoAfterCheckPhone && InfoAfterCheckPhone.userId === 0) return true
        if (!InfoAfterCheckPhone) return true;
        return false
    }

    renderPopupAddCustomer() {
        const {
            isOpenAddingPopup,
            success_addApointment,
            isSendLink
        } = this.state;

        const condition = this.checkConditionSendLink();

        const { InfoAfterCheckPhone, StateAddCustomerSuccess, checkPhoneError } = this.props;

        const PhoneShow = `+(${this.state.phoneCheck}) ${formatUsPhone(this.state.phoneNumber)}`;
        return (
            <AddingPopup
                open={isOpenAddingPopup}
                onClose={() => this.closeAllModal()}
                closeOnDocumentClick={false}
                modal={true}
                position={'left center'}
            >
                <AddingWrapper>
                    <BtnClose style={{ top : 10 }} onClick={() => this.closeAllModal()}>
                        <img src={require("../../images/close_white.png")} />
                    </BtnClose>

                    <AddingWrapper.Header backgroundColor="#1173C3">Add Appointment</AddingWrapper.Header>

                    <AddingWrapper.Body>
                        <Form onSubmit={(e) => e.preventDefault()}>
                            {success_addApointment && <p style={{ color: '#8D9440' }}>{success_addApointment}</p>}
                            {checkPhoneError && <Label style={{ textAlign: 'center' }}>Phone Number</Label>}
                            <input style={{ textAlign: 'center' }} value={PhoneShow} type="text" disabled />
                        </Form>

                        <Form className="left" onSubmit={(e) => e.preventDefault()}>
                            <Label>Customer Name*</Label>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <input
                                    disabled={InfoAfterCheckPhone !== ''}
                                    value={this.state.first_name || ''}
                                    onChange={(e) => this.setState({ first_name: e.target.value })}
                                    placeholder="First Name"
                                    className="w-50"
                                />
                                <input
                                    disabled={InfoAfterCheckPhone !== ''}
                                    value={this.state.last_name || ''}
                                    onChange={(e) => this.setState({ last_name: e.target.value })}
                                    placeholder="Last Name"
                                    className="w-50"
                                />
                            </div>
                        </Form>

                        <Form className="left" onSubmit={(e) => e.preventDefault()}>
                            <Label>Email</Label>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <input
                                    disabled={InfoAfterCheckPhone !== ''}
                                    type="email"
                                    value={this.state.email || ''}
                                    onChange={(e) => this.setState({ email: e.target.value })}
                                    placeholder="Email"
                                />
                            </div>
                        </Form>

                        <Form className="left" onSubmit={(e) => e.preventDefault()}>
                            <Label>Referral Phone</Label>
                            {InfoAfterCheckPhone === '' && (
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <select
                                        className="selectRef"
                                        value={this.state.refPhoneHeader}
                                        onChange={(e) => this.setState({ refPhoneHeader: e.target.value })}
                                        name=""
                                        id=""
                                    >
                                        <option value="1">+1</option>
                                        <option value="84">+84</option>
                                        <option />
                                    </select>
                                    <NumberFormat
                                        format="###-###-####"
                                        mask="_"
                                        value={this.state.phone}
                                        onChange={(e) => this.setState({ phone: e.target.value })}
                                        type="tel"
                                    />
                                </div>
                            )}
                            {InfoAfterCheckPhone !== '' && (
                                <input
                                    disabled={InfoAfterCheckPhone !== ''}
                                    value={this.RefPhoneExist() || ''}
                                    onChange={(e) => this.setState({ phone: e.target.value })}
                                    placeholder="Phone Number"
                                    type="tel"
                                />
                            )}
                        </Form>

                        <Form className="left" onSubmit={(e) => e.preventDefault()}>
                            <Label>Referred by</Label>
                            <input
                                disabled={InfoAfterCheckPhone !== ''}
                                value={this.state.referedBy || ''}
                                onChange={(e) => this.handleChangeReferedBy(e)}
                                placeholder="Referred by"
                            />
                        </Form>

                        <NoteWrapper>
                            <Label>Note:</Label>
                            {!InfoAfterCheckPhone.favourite && <NoteWrapper.Form onSubmit={(e) => e.preventDefault()}>
                                <input
                                    value={this.state.noteValue || ''}
                                    disabled={InfoAfterCheckPhone !== ''}
                                    onChange={(e) => this.handleChangeNote(e)}
                                />
                                <button disabled={InfoAfterCheckPhone.favourite ? true : false} type="submit" onClick={() => this.addNotes()}>
                                    <ImageEnter src={require('../../images/enter@3x.png')} />
                                </button>
                            </NoteWrapper.Form>}
                            {this.renderNotes()}
                        </NoteWrapper>

                        {/*********** SEND LINK ***********/}
                        {
                            condition &&
                            <Row style={{ marginTop: 15 }} onClick={() => this.toggleSendLink()} >
                                {
                                    isSendLink &&
                                    <ImageSendLink src={require('../../images/check-box@3x.png')} />
                                }
                                {
                                    !isSendLink &&
                                    <ImageSendLink src={require('../../images/check-box-empty@3x.png')} />
                                }
                                <div style={{ fontSize: 15 }}>Send application download link to customer</div>
                            </Row>
                        }
                        <div style={{ height: 70 }} />
                    </AddingWrapper.Body>

                    <AddingWrapper.Footer>
                        <div>
                            <Button
                                onClick={this.handleSubmitAppointment}
                                disabled={StateAddCustomerSuccess}
                                type="button"
                                primary
                            >
                                Next
                        </Button>
                        </div>
                    </AddingWrapper.Footer>
                </AddingWrapper>
            </AddingPopup>
        )
    }

    render() {
        const { appointment } = this.props;
        if (!appointment) return '';

        return (
            <div>
                {this.renderPopupSearch()}
                {this.renderPopupAddCustomer()}
            </div>
        );
    }
}

export default AddAppointment;
