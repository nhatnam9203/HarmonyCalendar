import React, { Component } from 'react';
import styled from "styled-components";

const Button = styled.div`
    color: #3883bb;
    font-size: 2rem;
    height: 3rem;
    cursor: pointer;
    text-align: center;
    width: 100%;
  & > img {
	width: 26px;
	height: 26px;
	opacity:  ${(props) => props.isSplash ? 1 : 0.5};
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
