import React, { Component } from 'react';
import styled from "styled-components"

const Button = styled.div`
	& > img {
	width: 19px;
	height: 19px;
	opacity:  ${(props) => props.isSplash ? 1 : 0.5};
	margin-right: ${(props) => props.isLeft ? "0px" : "-3px"};
	margin-left: ${(props) => props.isLeft ? "-3px" : "0px"};
	transform : ${(props) => props.isLeft ? "rotate(180deg)" : "rotate(0deg)"};
	}
`;

export default class ButtonSplash extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isSplash: true
		};
	}

	componentDidMount() {
		this.myInterval = setInterval(() => {
			const { isSplash } = this.state;
			this.setState({ isSplash: !isSplash });
		}, 500);
	}

	render() {
		const { onClick, isLeft, refButton } = this.props;
		const { isSplash } = this.state;
		return (
			<Button ref={refButton} isLeft={isLeft} isSplash={isSplash} onClick={onClick}>
				<img src={require('../../images/arrow-right.png')} />
			</Button>
		);
	}
}
