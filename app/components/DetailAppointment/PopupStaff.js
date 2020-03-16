import React, { Component } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

export default class PopupStaff extends Component {
	constructor(props) {
		super(props);
		this.state = {};
    }
    
    closePopupStaff(staff){
        this.props.togglePopupStaff(staff);
    }

    renderStaffList() {
		const { staffList } = this.props;
		return staffList.map((staff, index) => {
			return (
				<div
					onClick={() => this.closePopupStaff(staff)}
					key={index}
					style={{
						display: 'flex',
						flexDirection: 'row',
						paddingLeft: 10,
						paddingTop: 10,
						cursor: 'pointer',
					}}
				>
					<img
						style={{
							width: 40,
							height: 40,
							objectFit: 'cover',
							borderRadius: 30
						}}
						src={staff ? staff.imageUrl : ''}
					/>
					<p
						style={{
							marginLeft: 10
						}}
					>
						{staff.title}
					</p>
				</div>
			);
		});
	}

	render() {
		return (
			// <OutsideClickHandler
			// 	onOutsideClick={this.closePopupStaff}
			// >
		
            // </OutsideClickHandler>
            <div style={style.staffList}>{this.renderStaffList()}</div>
		);
	}
}

const style = {
	staffList: {
		height: 200,
		width: 170,
		overflowY: 'scroll',
		background: '#ffffff',
		zIndex: 9999,
		position: 'absolute',
        top: '0%',
        left : '70%',
		borderRadius: 5,
		boxShadow: '0 3px 9px rgba(0,0,0,.175)'
	},
	imgStaff: {
		width: 40,
		height: 40,
		objectFit: 'cover',
		borderRadius: 30
	}
};
