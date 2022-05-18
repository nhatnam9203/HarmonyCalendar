import React, { Component } from 'react';
import styled from 'styled-components';
import ItemAppointment from './ItemAppointment';

const Container = styled.div`
    display : flex;
    flex-direction : column;
    flex : 1;
    height : 30rem;
    overflow-y : scroll;
`;

export default class AppointmentList extends Component {

    render() {
        const { appointmentSearchBox, selectItem, indexActive, appointmentSelected } = this.props;
        return (
            <Container>
                {
                    appointmentSearchBox.map((item, index) =>
                        <ItemAppointment
                            item={item}
                            key={item.appointmentId}
                            selectItem={selectItem}
                            appointmentSelected={appointmentSelected}
                            indexActive={indexActive}
                            isLast={(appointmentSearchBox.length - 1) === index ? true : false}
                        />
                    )}
            </Container>
        )
    }
}
