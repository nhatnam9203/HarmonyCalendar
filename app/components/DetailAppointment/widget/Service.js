import React, { Component } from 'react'

import styled from 'styled-components';
import NumberFormat from 'react-number-format';
import ExtraItem from './ExtraItem';
import ExtraItemPaid from './ExtraItemPaid';
import ServiceNormal from './ServiceNormal';
import ServicePaid from './ServicePaid';
import { isEmpty } from 'lodash';
import { appointmentMoved } from '../../../containers/AppointmentPage/actions';

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

export default class Service extends Component {
    render() {
        const {
            appointment,
            staffList,
            prices,
            isPopupStaff,
            indexPopupStaff,
            service,
            index,
            isEditPaidAppointment,
            openPopupTimePicker,
            extras,
            extraAll,
            togglePopupStaff,
            closePopupStaff,
            subtractService,
            addService,
            openPopupPrice,
            openPopupTip,
            getStaffOfService,
            staffOfService,
            invoiceDetail
        } = this.props;

        const staff = staffList.find((s) => parseInt(s.id) === parseInt(service.staffId));
        let price = prices[index] ? parseFloat(prices[index].replace(/,/g, '')).toFixed(2) : "0.00";
        price = price.toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
        const duration =
            service.duration.toString().length === 1 ? '0' + service.duration.toString() : service.duration;
        const title = staff ? staff.title.toString().length > 13 ?
            staff.title.toString().slice(0, 10) + "..." :
            staff.title : '';
        const fromTime = service.fromTime && service.fromTime !== '0001-01-01T00:00:00' ? service.fromTime : appointment.start;

        if (appointment.status !== 'PAID' && appointment.status !== 'VOID' && appointment.status !== 'REFUND' && appointment.status !== "no show") {
            return (
                <React.Fragment key={index}>
                    <tr>
                        <ServiceNormal
                            service={service}
                            openPopupTimePicker={openPopupTimePicker}
                            fromTime={fromTime}
                            index={index}
                            togglePopupStaff={togglePopupStaff}
                            title={title}
                            isPopupStaff={isPopupStaff}
                            indexPopupStaff={indexPopupStaff}
                            staffList={staffList}
                            closePopupStaff={closePopupStaff}
                            subtractService={subtractService}
                            addService={addService}
                            duration={duration}
                            appointment={appointment}
                            price={price}
                            openPopupPrice={openPopupPrice}
                            getStaffOfService={getStaffOfService}
                            staffOfService={staffOfService}
                        />
                    </tr>
                    {
                        extras.map((extra, i) => {
                            return (
                                <ExtraItem
                                    key={'extra' + extra.bookingExtraId}
                                    extra={extra}
                                    extraAll={extraAll}
                                    appointment={appointment}
                                    index={i}
                                    subtractExtra={(ex) => this.props.subtractExtra(ex)}
                                    addExtra={(ex) => this.props.addExtra(ex)}
                                    openPopupPrice={() => this.props.openPopupPriceExtra(extra.price, i, "extra")}
                                    isEditPaidAppointment={isEditPaidAppointment}
                                />
                            )
                        })
                    }
                </React.Fragment>
            );
        }
        else {
            if (service.staff) {
                let staffName = isEmpty(title) ? service.staff.displayName : title;
                return (
                    <React.Fragment key={index}>
                        <ServicePaid
                            service={service}
                            appointment={appointment}
                            isEditPaidAppointment={isEditPaidAppointment}
                            togglePopupStaff={togglePopupStaff}
                            staffName={staffName}
                            isPopupStaff={isPopupStaff}
                            index={index}
                            indexPopupStaff={indexPopupStaff}
                            staffList={staffList}
                            closePopupStaff={closePopupStaff}
                            openPopupTip={openPopupTip}
                            price={price}
                            getStaffOfService={getStaffOfService}
                            staffOfService={staffOfService}
                            openPopupPrice={openPopupPrice}
                            invoiceDetail={invoiceDetail}
                        />
                        {
                            extras.map((extra, i) => {
                                return (
                                    <ExtraItemPaid
                                        key={'extraPaid' + extra.bookingExtraId}
                                        extra={extra}
                                        appointment={appointment}
                                        index={i}
                                        subtractExtra={(ex) => this.props.subtractExtra(ex)}
                                        addExtra={(ex) => this.props.addExtra(ex)}
                                        openPopupPrice={(price, index, key) => this.props.openPopupPriceExtra(price, index, key)}
                                        invoiceDetail={invoiceDetail}
                                        isEditPaidAppointment={isEditPaidAppointment}
                                    />
                                )
                            })
                        }
                    </React.Fragment>
                );
            } else {
                return (
                    <tr key={index}>
                        <td>{service.serviceName}</td>
                        <td>You're in Offline</td>
                        <td>You're in Offline</td>
                        <td>
                            <Row>
                                <NumberFormat
                                    value={price}
                                    onValueChange={(value) => this.props.onChangePrice(value, index)}
                                    thousandSeparator={false}
                                    disabled={appointment.status === 'PAID'}
                                    style={{
                                        fontWeight: '700',
                                        color: '#1366AF',
                                        width: 60,
                                        textAlign: 'center'
                                    }}
                                    type="tel"
                                />
                                <img src={require('../../../images/edit.png')} style={{ width: 16, height: 16 }} />
                            </Row>
                        </td>
                    </tr>
                );
            }
        }
    }
}