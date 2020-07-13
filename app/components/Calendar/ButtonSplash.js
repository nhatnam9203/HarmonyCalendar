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
        const { onClick, isTop } = this.props;
        const { isSplash } = this.state;
        return (
            <div style={{
                textAlign: 'center',
                position: isTop ? 'relative' : 'absolute',
                bottom: 0,
                width: '100%'
            }} onClick={onClick}>
                <img style={{
                    width: 19,
                    height: 19,
                    opacity: isSplash ? 1 : 0.5,
                    marginBottom: isTop ? 0 : 8,
                    marginTop: isTop ? 8 : 0,
                    transform: isTop ? 'rotate(180deg)' : 'rotate(0deg)'
                }} src={require('../../images/down-arrow-2.png')} />
            </div>
        );
    }
}
