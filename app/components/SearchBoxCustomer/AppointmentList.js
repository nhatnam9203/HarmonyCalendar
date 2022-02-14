import React, { Component } from 'react';
import styled from 'styled-components';
import ItemAppointment from './ItemAppointment';

const Container = styled.div`
    display : flex;
    flex-direction : column;
    flex : 1;
    height : 20rem;
    overflow-y : scroll;
`;

export default class AppointmentList extends Component {
    render() {
        const { appointmentSearchBox, selectItem, indexActive, jumpToCustomerHistory } = this.props;
        return (
            <Container>
                {
                    appointmentSearchBox.map((item) =>
                        <ItemAppointment
                            item={item}
                            key={item.appointmentId}
                            selectItem={selectItem}
                            indexActive={indexActive}
                            jumpToCustomerHistory={(e, item) => jumpToCustomerHistory(e, item)}
                        />
                    )}
            </Container>
        )
    }
}
