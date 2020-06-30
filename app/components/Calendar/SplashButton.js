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
		const { isTop = false, isBottom = false } = this.props;
		return (
			<SplashButton isTop={isTop} isBottom={isBottom} onClick={this.props.onClick} Opacity={this.state.isSplash ? 0.5 : 1}>
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
    text-align: center;
    width: 100%;
    position: ${(props) => (props.isBottom ? 'absolute' : 'relative')};
	opacity: ${(props) => props.Opacity};
	cursor: pointer;
    left: 0;
    bottom: 0;
    
`;
