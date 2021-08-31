import React, { Component } from 'react'
import styled from 'styled-components';

const Loading = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    display: block;
    background: #fff;
    z-index: 99;
    opacity: 0.9;
    text-align: center;
    font-weight: bold;
    font-style: italic;
    color: #61859f;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    @media (min-width: 1025px) {
      font-size: 20px;
    }
`

export default class WaitingLoading extends Component {
  render() {
    return (
      <Loading>
        <img style={{ width: 80, height: 80 }} src={require('../../images/loading.gif')} alt="" />
      </Loading>
    )
  }
}
