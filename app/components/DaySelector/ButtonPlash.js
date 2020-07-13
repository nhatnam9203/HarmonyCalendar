import React, { Component } from 'react';

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
		const { onClick, isLeft } = this.props;
		const { isSplash } = this.state;
		return (
			<div onClick={onClick}>
				<img style={{
					width: 19,
					height: 19,
					opacity: isSplash ? 1 : 0.5,
					marginRight: isLeft ? 0 : 8,
					marginLeft: isLeft ? 8 : 0,
					transform : isLeft ? 'rotate(180deg)' : 'rotate(0deg)' 
				}} src={require('../../images/arrow-right.png')} />
			</div>
		);
	}
}
