import React, { Component } from 'react';

import styled from 'styled-components';

export default class Button extends Component {
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
		const { isLeft = false, isRight = false } = this.props;
		return (
			<SplashButton isLeft={isLeft} isRight={isRight} onClick={this.props.onClick} Opacity={this.state.isSplash ? 0.5 : 1}>
				{this.props.children}
			</SplashButton>
		);
	}
}

const SplashButton = styled.div`
	color: #3883bb;
	font-size: 2rem;
	line-height: 2rem;
	cursor: pointer;
	padding-left: ${(props) => (props.isLeft ? '0.5rem' : '0')};
	padding-right: ${(props) => (props.isRight ? '0.5rem' : '0')};
	opacity: ${(props) => props.Opacity};
	cursor: pointer;
`;
