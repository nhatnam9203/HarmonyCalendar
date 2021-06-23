import React, { Component } from 'react';
import styled from "styled-components";
import ReactLoading from 'react-loading';

const Container = styled.div`
    position: absolute;
    top : 0;
    right : 0;
    bottom : 0;
    left : 0;
    z-index: 99999;
    display: flex;
    justify-content: center;
    align-items : center;
    background : rgba(255,255,255,0.4);
    border-radius: 30px;
`;
export default class LoadingDetail extends Component {
    render() {
        return (
            <Container>
                <ReactLoading
                    type={'bubbles'}
                    height={'45px'}
                    width={'45px'}
                />
            </Container>
        )
    }
}
