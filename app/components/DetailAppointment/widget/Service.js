import React, { Component } from 'react'

import styled from 'styled-components';
import NumberFormat from 'react-number-format';
import PopupStaff from './PopupStaff';

const ButtonService = styled.button`
	background: ${(props) => props.backgroundColor};
	color: #ffffff;
	padding: 5px 15px;
	margin: 0 10px;
	width: 47px;
	border-radius: 3px;
	cursor: ${(props) => (props.active ? 'pointer' : 'initial')};
`;

const ImgButton = styled.img`
	width : 12px;
	height : 6px; 
	margin-left : 8px; 
`;


export default class Service extends Component {

    getStyleService(appointment, service, index) {
        let backgroundColor = '#dddddd';
        if (appointment.status !== 'PAID' && service.duration > 5) backgroundColor = '#0071c5';
        return backgroundColor;
    }

    getStyleService2(appointment, service, index) {
        let backgroundColor = '#dddddd';
        if (appointment.status !== 'PAID') backgroundColor = '#0071c5';
        return backgroundColor;
    }

    render() {
        const { appointment, staffList, prices, isPopupStaff, indexPopupStaff, service, index } = this.props;

        const staff = staffList.find((s) => parseInt(s.id) === parseInt(service.staffId));

        let price = prices[index] ? parseFloat(prices[index].replace(/,/g, '')).toFixed(2) : "0.00";
		price = price.toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');

        const duration =
            service.duration.toString().length === 1 ? '0' + service.duration.toString() : service.duration;

        const title = staff ? staff.title : '';

        if (appointment.status !== 'PAID' && appointment.status !== 'VOID' && appointment.status !== 'REFUND') {
            return (
                <tr key={index}>
                    <td style={{ borderRight: 0 }}>
                        <div onClick={() => this.props.togglePopupStaff('', index)} style={style.staffService}>
                            <p style={style.staffNameColumn}>{title}</p>
                            <ImgButton src={require('../../../images/top_arrow@3x.png')} />
                            {isPopupStaff &&
                                index === indexPopupStaff && (
                                    <PopupStaff
                                        togglePopupStaff={(staff) => this.props.togglePopupStaff(staff, index)}
                                        staffList={staffList.filter((s) => s.id !== 0)}
                                        closePopupStaff={() => this.props.closePopupStaff()}
                                    />
                                )}
                        </div>
                    </td>

                    <td style={{ borderLeft: 0 }}>
                        <div style={style.serviceColumn}>
                            <div style={style.serviceName}>{service.serviceName}</div>
                        </div>
                    </td>

                    {appointment.status !== 'PAID' && (
                        <td style={{ textAlign: 'center' }}>
                            <ButtonService
                                backgroundColor={this.getStyleService(appointment, service, index)}
                                disabled={appointment.status === 'PAID' || service.duration <= 5}
                                onClick={() => this.props.subtractService(index)}
                            >
                                -5&#39;
							</ButtonService>

                            {duration}

                            <ButtonService
                                backgroundColor={this.getStyleService2(appointment, service, index)}
                                disabled={appointment.status === 'PAID'}
                                onClick={() => this.props.addService(index)}
                            >
                                +5&#39;
							</ButtonService>
                        </td>
                    )}
                    <td>
                        <div onClick={() => this.props.openPopupPrice(price, index, 'service')} style={style.row}>
                            <div style={style.priceS}>{price}</div>
                            <img
                                src={require('../../../images/edit.png')}
                                style={{
                                    width: 16,
                                    height: 16
                                }}
                            />
                        </div>
                    </td>
                </tr>
            );
        } else {
            if (service.staff) {
                return (
                    <tr key={index}>
                        <td style={{ borderRight: 0 }}>
                            <div style={{ display: 'flex', flexDirection: 'row' , alignItems: 'center' }}>
                                <img
                                    src={service.staff.imageUrl}
                                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 25 }}
                                />
                                <p style={{ marginLeft: 8 }}>{service.staff.displayName}</p>
                            </div>
                        </td>
                        <td style={{ borderLeft: 0 }}>
                            <div style={style.serviceName}>{service.serviceName}</div>
                        </td>

                        <td style={{ textAlign: 'center' }}>{service.staff.tip}</td>
                        <td>
                            <div style={{ textAlign: 'center' }}>{price}</div>
                        </td>
                    </tr>
                );
            } else {
                return (
                    <tr key={index}>
                        <td>{service.serviceName}</td>
                        <td>You're in Offline</td>
                        <td>You're in Offline</td>
                        <td>
                            <div style={style.row}>
                                <NumberFormat
                                    value={price}
                                    onValueChange={(value) => this.props.onChangePrice(value, index)}
                                    thousandSeparator={false}
                                    disabled={appointment.status === 'PAID'}
                                    style={style.price}
                                    type="tel"
                                />
                                <img src={require('../../../images/edit.png')} style={{ width: 16, height: 16 }} />
                            </div>
                        </td>
                    </tr>
                );
            }
        }
    }
}

const style = {
    price: {
        fontWeight: '700',
        color: '#1366AF',
        width: 60,
        textAlign: 'center'
    },

    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    staffService: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        backgroundColor: '#EEEEEE',
        borderRadius: 5,
        maxWidth: 120,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        height: 40,
        paddingRight: 10
    },
    serviceColumn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    staffNameColumn: {
        marginLeft: 8,
        width : 50,
        fontSize: 15,
    },
    serviceName: {
        width: 150,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    priceS: {
        color: '#1173C3',
        fontWeight: 'bold',
        marginRight: 5,
        fontFamily: 'sans-serif'
    }
};