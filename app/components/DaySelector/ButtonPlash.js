import React, { Component } from 'react';
import styled from "styled-components"

const Button = styled.div`
	position : absolute;
	top : -0.7rem;
	& > img {
	width: 26px;
	height: 26px;
	opacity:  ${(props) => props.isSplash ? 1 : 0.5};
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
		const { onClick, isLeft, style, styleImg } = this.props;
		const { isSplash } = this.state;
		return (
			<Button style={style} isLeft={isLeft} isSplash={isSplash} onClick={onClick}>
				<img src={require('../../images/arrow-right.png')} />
			</Button>
		);
	}
}
