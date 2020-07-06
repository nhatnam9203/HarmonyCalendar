import React, { Component } from 'react'
import styled from 'styled-components'
import ReactLoading from 'react-loading';


const LoadingCalendar = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    display: block;
    z-index: 99;
    padding-top: 20%;
    text-align: center;
    font-weight: bold;
    font-style: italic;
    color: #61859f;
    font-size: 24px;
`

export default class CalendarLoading extends Component {
  render() {
    return (
     <LoadingCalendar>
         {/* <img style={{ width:100,height:100 }} src={require('../../images/loading.gif')} alt=""/> */}
         {/* <ReactLoading type={'spokes'} color={'#1366AE'} height={667} width={375} /> */}
          <p>loading</p>
     </LoadingCalendar>
    )
  }
}

