import React, { Component } from 'react'
import styled from 'styled-components'
import OutsideClickHandler from 'react-outside-click-handler';

const Container = styled.div`
    width : 100%;
    position : absolute;
    height : 15rem;
    left : 0;
    top : -4rem;
    background-color : white;
    border : 1px solid #dddddd;
    z-index: 999999999;
    padding : 1rem;
    overflow-y : scroll;
`;

const Staff = styled.div`
    color : #585858;
    margin-bottom : 1rem;
    font-size : 1.1rem;
    width : 100%;
`;

export default class EditStaff extends Component {
    render() {
        const { isPopupStaff, staffList } = this.props;
        if (!isPopupStaff) return null;
        return (
            <OutsideClickHandler onOutsideClick={() => this.props.closePopupEditStaff(null)}>
                <Container>
                    {staffList.map((staff) => {
                        if (staff.id !== 0)
                            return (
                                <Staff
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        this.props.closePopupEditStaff(staff);
                                    }}
                                    key={staff.id + 'staff'}
                                >
                                    {staff.title}
                                </Staff>
                            )
                    })}
                </Container>
            </OutsideClickHandler>
        )
    }
}
