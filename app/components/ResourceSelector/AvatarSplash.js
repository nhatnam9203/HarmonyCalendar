import React, { Component } from 'react';
import styled from "styled-components";


const Avatar = styled.div`
	padding: 2px;
	cursor: pointer;
	& img {
		width: 3.7rem;
		height: 3.7rem;
		border-radius: 50%;
		object-fit: cover;
		border :  ${(props) => props.isSplash ? "2px solid red" : "2px solid transparent"};
	}
	@media (min-width: 1025px) {
		& img {
			width: 4rem;
			height: 4rem;
			border-radius: 50%;
			object-fit: cover;
		}
	}
`;

export default class AvatarSplash extends Component {
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
        const { onClick, children } = this.props;
        const { isSplash } = this.state;
        return (
            <Avatar
                isSplash={isSplash}
                onClick={onClick}
            >
                {children}
            </Avatar>
        );
    }
}
