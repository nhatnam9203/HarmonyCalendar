import React, { Component } from 'react';
import styled from 'styled-components';
import ItemAppointment from './ItemAppointment';

const Container = styled.div`
    overfow-y: scroll;
    height: 30rem;
`;

export default class AppointmentList extends Component {

    render() {
        const { appointmentSearchBox, selectItem, indexActive, appointmentSelected } = this.props;
        return (
            <Container>
                {
                    appointmentSearchBox.slice(0,4).map((item, index) =>
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
