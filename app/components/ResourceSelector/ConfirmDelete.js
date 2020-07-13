import React, { Component } from 'react';
import Popup from 'reactjs-popup';
import styled from 'styled-components';

const ConfirmPopup = styled(Popup)`
  border-radius: 1.5rem;
  padding: 0 !important;
  border: none !important;
  height: 200px;
  width : 480px !important;
  position : relative;
`;

const ConfirmPopupWrapper = styled.div``;
ConfirmPopupWrapper.Header = styled.div`
	height: 3rem;
	font-size: 1.6rem;
	font-weight: bold;
	background: #1B75C1;
	color: #ffffff;
	padding: 0.5rem 1rem;
	line-height: 1.5;
	text-align: center;
	border-top-left-radius: 1.5rem;
	border-top-right-radius: 1.5rem;
	position: relative;
`;
ConfirmPopupWrapper.ButtonX = styled.div`
	position: absolute;
	right: 0.5rem;
	top: 0.25rem;
	line-height: 1;
	font-size: 2rem;
	color: #ffffff;
	cursor: pointer;
`;

ConfirmPopupWrapper.Body = styled.div`
	height: 5rem;
	font-size: 1rem;
	color: #333;
	text-align: center;
	padding-top: 1rem;
`;

ConfirmPopupWrapper.Footer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 0 3rem;
`;

ConfirmPopupWrapper.WrapperButton = styled.div`
	width: 50%;
	text-align: center;
`;
ConfirmPopupWrapper.Button = styled.button`
	background-color: ${(props) => props.backgroundColor};
	color: ${(props) => props.Color};
	padding: 0.8rem 3.5rem;
	border-radius: 3px;
	font-size: 1rem;
	cursor: pointer;
`;

ConfirmPopupWrapper.ButtonYes = styled.div`
	background-color: ${(props) => props.backgroundColor};
	color: ${(props) => props.Color};
	padding: 0.5rem 2.5rem;
	border-radius: 3px;
	font-size: 1rem;
	cursor: pointer;
`;

ConfirmPopupWrapper.ButtonNo = styled(ConfirmPopupWrapper.ButtonYes)`

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

class ConfirmDeleteWaiting extends Component {

	render() {
		const { isPopupDelete, onPressYes, onPressNo } = this.props;
		if (isPopupDelete === false) return '';
		return (
			<ConfirmPopup closeOnDocumentClick open onOpen={() => onPressNo()} onClose={() => onPressNo()}>
				<ConfirmPopupWrapper>
					<ConfirmPopupWrapper.Header>
						Confirmation
						<BtnClose onClick={() => onPressNo()}>
							<img src={require("../../images/close_white.png")} />
						</BtnClose>
					</ConfirmPopupWrapper.Header>

					<ConfirmPopupWrapper.Body>
						Do you want to Cancel this Blocked Time?
					</ConfirmPopupWrapper.Body>

					<ConfirmPopupWrapper.Footer>
						<ConfirmPopupWrapper.WrapperButton>
							<ConfirmPopupWrapper.Button
								Color="#333"
								backgroundColor={'#EEEEEE'}
								onClick={() => onPressNo()}
							>
								No
							</ConfirmPopupWrapper.Button>
						</ConfirmPopupWrapper.WrapperButton>

						<ConfirmPopupWrapper.WrapperButton>
							<ConfirmPopupWrapper.Button
								Color="#fff"
								backgroundColor={'#1173C3'}
								onClick={() => onPressYes()}
							>
								Yes
							</ConfirmPopupWrapper.Button>
						</ConfirmPopupWrapper.WrapperButton>
					</ConfirmPopupWrapper.Footer>
				</ConfirmPopupWrapper>
			</ConfirmPopup>
		);
	}
}

export default ConfirmDeleteWaiting;
