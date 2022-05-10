import React, { Component } from 'react';
import styled from 'styled-components';

const WrapperFooterPaid = styled.div`
	padding: 10px;
	display: flex;
    flex-direction: row;
    color: #585858;
`;
WrapperFooterPaid.Item = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	width: 50%;
	margin-left: 10px;
	color: #0b0b0b;
`;

WrapperFooterPaid.ItemLeft = styled(WrapperFooterPaid.Item)`
    padding-right : 4rem;
    & > div:nth-child(0) {
        font-weight : 600;
        color : #585858;
    }
`;

const FooterTotal = styled(WrapperFooterPaid)`
    justify-content : space-between;
    border-top: 1px solid #ebebeb;
    margin-top : 0.3rem;
    padding-left : 20px;
    & > div {
        font-weight: 900; 
        font-size: 20px; 
        color: #585858;
    }
`;

export default class FooterAppointment extends Component {

	goToInvoicePage = async () => {
		const { appointment } = this.props;
		if (appointment.status === "PAID") {

			const data = await JSON.stringify({
				appointment: appointment,
				action: 'goToInvoice'
			});

			window.postMessage(data);
		}
	}

	render() {
		const { appointment } = this.props;


		let subTotal = appointment.subTotal
			? parseFloat(appointment.subTotal.toString().replace(/,/g, ''))
				.toFixed(2)
				.replace(/\d(?=(\d{3})+\.)/g, '$&,')
			: '0.00';

		let total = appointment.total
			? parseFloat(appointment.total.toString().replace(/,/g, '')).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
			: '0.00';

		let tipAmount = appointment.tipAmount
			? parseFloat(appointment.tipAmount.toString().replace(/,/g, ''))
				.toFixed(2)
				.replace(/\d(?=(\d{3})+\.)/g, '$&,')
			: '0.00';

		let tipPercent = appointment.tipPercent
			? parseFloat(appointment.tipPercent.toString().replace(/,/g, ''))
				.toFixed(2)
				.replace(/\d(?=(\d{3})+\.)/g, '$&,')
			: '0.00';

		if (appointment.status === 'PAID' || appointment.status === 'VOID' || appointment.status === 'REFUND') {
			return (
				<React.Fragment>
					<div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
						<div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
							<WrapperFooterPaid>
								<WrapperFooterPaid.ItemLeft>
									<div>Invoice : </div>
									<div onClick={this.goToInvoicePage}>{appointment.code}</div>
								</WrapperFooterPaid.ItemLeft>
								<WrapperFooterPaid.Item>
									<div>Subtotal : </div>
									<div>$ {appointment.subTotal}</div>
								</WrapperFooterPaid.Item>
							</WrapperFooterPaid>
						</div>

						<div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
							<WrapperFooterPaid>
								<WrapperFooterPaid.ItemLeft>
									<div>Discount : </div>
									<div>$ {appointment.discount}</div>
								</WrapperFooterPaid.ItemLeft>
								<WrapperFooterPaid.Item>
									<div>Tip : </div>
									<div>$ {tipAmount}</div>
								</WrapperFooterPaid.Item>
							</WrapperFooterPaid>
						</div>

						<div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
							<WrapperFooterPaid>
								<WrapperFooterPaid.ItemLeft>
									<div>Gift card : </div>
									<div>$ {appointment.giftCard}</div>
								</WrapperFooterPaid.ItemLeft>
								<WrapperFooterPaid.Item>
									<div>Tax : </div>
									<div>$ {appointment.tax}</div>
								</WrapperFooterPaid.Item>
							</WrapperFooterPaid>
						</div>

						<FooterTotal>
							<div>Total</div>
							<div>$ {total}</div>
						</FooterTotal>
					</div>
				</React.Fragment>
			);
		} else {
			return (
				<React.Fragment>
					<div>
						<span style={{ color: '#585858' }}>Code : </span>
						<strong style={{ color: '#585858' }}>{appointment.code}</strong>
					</div>
					<div>
						<span style={{ color: '#585858' }}>Tip : </span>
						<strong style={{ color: '#585858' }}>$ {tipAmount}</strong>
					</div>

					{
						appointment.depositAmount && appointment.appointmentDepositStatus === "Default" &&
						<div>
							<span style={{ color: 'red', fontWeight: '600' }}>Deposited : </span>
							<strong style={{ color: 'red', fontWeight: "600" }}>$ {appointment.depositAmount}</strong>
						</div>
					}
					<div>
						<span style={{ color: '#585858' }}>Total : </span>
						<strong style={{ color: '#585858' }}>$ {subTotal}</strong>
					</div>
				</React.Fragment>
			);
		}
	}
}
