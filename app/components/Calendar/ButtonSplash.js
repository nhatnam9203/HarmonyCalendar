import React, { Component } from 'react';
import styled from "styled-components";

const Button = styled.div`
    text-align: center;
    position: ${(props) => props.isTop ? "relative" : "absolute"};
    bottom: 0px;
    width: 100%;
	& > img {
	width: 19px;
	height: 19px;
	opacity:  ${(props) => props.isSplash ? 1 : 0.5};
	margin-bottom: ${(props) => props.isTop ? "0px" : "8px"};
	margin-top: ${(props) => props.isTop ? "8px" : "0px"};
	transform : ${(props) => props.isTop ? "rotate(180deg)" : "rotate(0deg)"};
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
        const { onClick, isTop } = this.props;
        const { isSplash } = this.state;
        return (
            <Button isSplash={isSplash} isTop={isTop} onClick={onClick}>
                <img src={require('../../images/down-arrow-2.png')} />
            </Button>
        );
    }
}
