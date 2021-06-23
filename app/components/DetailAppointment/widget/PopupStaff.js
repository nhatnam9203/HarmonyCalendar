import React, { Component } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import ReactLoading from 'react-loading';
import styled from "styled-components";

const ContainerLoading = styled.div`
	margin-left : 67px;
	margin-top : 80px;
`;

const ItemStaff = styled.div`
	display: flex;
	flex-direction: row;
	padding-left: 10px;
	padding-top: 10px;
	cursor: 'pointer';
	&>img{
		width: 40px;
		height: 40px;
		object-fit: cover;
		border-radius: 30px;
	}
	&>p{
		margin-left : 10px;
	}
`;

const StaffList = styled.div`
	height: 200px;
	width: 170px;
	overflow-y: scroll;
	background: #ffffff;
	z-index: 9999;
	position: absolute;
	top: 0%;
	left: 50%;
	border-radius: 5px;
	box-shadow: 0 3px 9px rgba(0,0,0,.175);
`;

export default class PopupStaff extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	closePopupStaff(staff) {
		this.props.togglePopupStaff(staff);
	}

	renderStaffList() {
		const { staffOfService = [] } = this.props;
		return staffOfService.map((staff, index) => {
			return (
				<ItemStaff
					onClick={(e) => {
						e.stopPropagation();
						this.closePopupStaff(staff);
					}}
					key={index}
				>
					<img src={staff ? staff.imageUrl : ''} />
					<p>{staff.title}</p>
				</ItemStaff>
			);
		});
	}

	render() {
		const { isLoading } = this.props;
		return (
			<OutsideClickHandler onOutsideClick={() => this.props.closePopupStaff()}>
				<StaffList>
					{
						isLoading ?
							<ContainerLoading>
								<ReactLoading
									type={'spinningBubbles'}
									color={'pink'}
									height={40}
									width={40}
								/>
							</ContainerLoading>
							:
							this.renderStaffList()
					}
				</StaffList>
			</OutsideClickHandler>
		);
	}
}