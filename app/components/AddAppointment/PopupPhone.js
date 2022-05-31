import React from 'react';
import styled from 'styled-components';
import Popup from 'reactjs-popup';
import InputMask from 'react-input-mask';
import number_delete from "../../images/number_delete.png";
import number_delete_white from "../../images/number_delete_white.png";
import down_arrow from "../../images/down-arrow.png";
import OutsideClickHandler from 'react-outside-click-handler';

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
  width: 25rem !important;
  
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

`;

SearchingWrapper.Footer = styled.div`
	display: flex;
	padding: 0.5rem 1rem 1rem 1rem;
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

`;

AddingWrapper.Footer = styled(AppPopupWrapper.Footer)`

`;


const WrapBody = styled.div`
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

const Button = styled.button`
	border-radius: 4px;
	background: ${(props) => (props.primary ? '#1366AE' : '#eeeeee')};
	color: ${(props) => (props.primary ? '#ffffff' : '#333333')};
	border: 1px solid #dddddd;
	font-size: 1rem;
	line-height: 2.8;
	height: 100%;
	cursor: pointer;
	text-align: center;
	padding: 0rem 3rem;
`;


const BtnClose = styled.div`
	position: absolute;
	right: 0.5rem;
	top: 0.55rem;
	line-height: 1;
	font-size: 2rem;
	color: #ffffff;
	cursor: pointer;
	& > img{
		width : 30px;
		height : 30px;
	}
`;

const WrapButtonNumber = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
`;

const ButtonNumber = styled.div`
	display: flex;
	justify-content: center;
	align-items : center;
	border : 1px solid #dddddd;
	font-size : 1.5rem;
	font-weight : 600;
	border-radius : 3px;
	width : 7.2rem;
	height : 3.7rem;
	margin-bottom : 9px;
	touch-action: manipulation;
	background: ${(props) => (props.isActive ? '#1366AE' : 'white')};
	color: ${(props) => (props.isActive ? '#ffffff' : '#404040')};
	& > img{
		width : 40px;
		height : 40px;
		object-fit: contain;
	}
`;

const Footer = styled.div`
	width : 100%;
	border-top : 1px solid #dddddd;
	display : flex;
	justify-content: center;
	align-items: center;
	padding : 1rem;
	margin-top : -0.3rem;
`;

const Select = styled.div`
	display: flex;
	justify-content: space-between;
	align-items : center;
	background : white;
	border : 1px solid #dddddd;
	width : 4rem;
	height : 2.5rem;
	margin-right : 8px;
	font-size : 1rem;
	border-radius : 5px;
	padding : 0 8px;
	position : relative;
	color : #585858;
	& > img{
		width: 12px;
		height : 12px;
		object-fit: contain;
	}
`;

const PopupSelectPhone = styled.div`
	position: absolute;
	top: 45px;
	left : 0px;
	right : 0px;
	background : white;
	z-index: 99999;
	height : 4.5rem;
	border : 1px solid #333;
	box-shadow: 0 2px 6px rgba(65,11,16,.15);
	display: flex;
	flex-direction: column;
	padding-left : 16px;
	align-items: flex-start;
	color : #585858;
	& > div{
		padding-top : 5px;
	}
`;

const MaskInput = styled(InputMask)`
	color : black !important;
	opacity : 1 !important;
`;


const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"];

class AddAppointment extends React.Component {

	constructor(props) {
		super(props);
		this.refPhone = React.createRef();
		this.state = {
			isPopupPhone: false,
			isEnterDelete: false,
		}
	}

	togglePopupPhone = () => {
		const { isPopupPhone } = this.state;
		this.setState({ isPopupPhone: !isPopupPhone });
	}

	closePopupPhone = () => {
		this.setState({ isPopupPhone: false });
	}

	render() {
		const {
			closeAllModal,
			phoneCheck,
			onChangePhoneCheck,
			handleChangeNumber,
			handleSubmitVerifyPhone,
			isOpenSearchingPopup,
			phoneNumber,
			onClickNumber,
		} = this.props;

		const { isEnterDelete } = this.state;

		return (
			<SearchingPopup
				open={isOpenSearchingPopup}
				closeOnDocumentClick={false}
				lockScroll={true}
			>
				<SearchingWrapper>
					<BtnClose onClick={closeAllModal}>
						<img src={require("../../images/close_white.png")} />
					</BtnClose>
					<SearchingWrapper.Header backgroundColor="#1366AE">
						Add Appointment
                    </SearchingWrapper.Header>
					<SearchingWrapper.Body style={{ fontWeight: '500' }}>
						Enter Phone Number
                    </SearchingWrapper.Body>

					<WrapBody>
						<FormCheckPhone>
							<OutsideClickHandler
								onOutsideClick={() => this.closePopupPhone()}
							>
								<PhoneHeader
									toggle={this.togglePopupPhone}
									phone={'+' + phoneCheck}
									onChangePhoneCheck={onChangePhoneCheck}
									isPopupPhone={this.state.isPopupPhone}
								/>
							</OutsideClickHandler>
							<MaskInput
								ref={this.refPhone}
								mask="999-999-9999"
								value={phoneNumber}
								onChange={handleChangeNumber}
								placeholder="Enter phone number"
								disabled={true}
								style={{
									color: '#333'
								}}
							/>
						</FormCheckPhone>
						<WrapButtonNumber>
							{
								numbers.map((number, index) => (
									<NumPad
										key={"number" + index}
										text={number}
										onClickNumber={onClickNumber}
									/>
								))
							}
							<ButtonNumber
								onTouchStart={() => this.setState({ isEnterDelete: true })}
								onTouchEnd={() => this.setState({ isEnterDelete: false })}
								onMouseDown={() => this.setState({ isEnterDelete: true })}
								onMouseUp={() => this.setState({ isEnterDelete: false })}
								isActive={isEnterDelete}
								onClick={() => onClickNumber("x")}
							>
								<img src={ isEnterDelete ? number_delete_white : number_delete} />
							</ButtonNumber>
						</WrapButtonNumber>

					</WrapBody>
					<Footer>
						<Button
							onClick={handleSubmitVerifyPhone}
							id="submit-create-appointment"
							primary
							style={{ fontWeight: '600' }}
						>
							Next
                    </Button>
					</Footer>
				</SearchingWrapper>
			</SearchingPopup>
		);
	}
}

class NumPad extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isEnter: false
		}
	}

	render() {
		const { text } = this.props;
		return (
			<ButtonNumber
				onTouchStart={() => this.setState({ isEnter: true })}
				onTouchEnd={() => this.setState({ isEnter: false })}
				onMouseDown={() => this.setState({ isEnter: true })}
				onMouseUp={() => this.setState({ isEnter: false })}
				id="btn-delete-number"
				onClick={() => this.props.onClickNumber(text)}
				isActive={this.state.isEnter}
			>
				{text}
			</ButtonNumber>
		)
	}
}


const PhoneHeader = ({ phone, toggle, isPopupPhone, onChangePhoneCheck }) => {
	return (
		<Select
			onClick={(e) => {
				e.stopPropagation();
				toggle();
			}}
		>
			{phone}
			<img src={down_arrow} />
			{
				isPopupPhone &&
				<PopupSelectPhone onClick={e => e.stopPropagation()}>
					<div
						onClick={() => {
							onChangePhoneCheck("1");
							toggle();
						}}
					>
						+1
					 </div>
					<div
						onClick={() => {
							onChangePhoneCheck("84");
							toggle();
						}}
					>
						+84
					 </div>
				</PopupSelectPhone>
			}
		</Select>
	)
}

export default AddAppointment;
