import React, { Component } from 'react'
import styled from 'styled-components'

const LoadingCalendar = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    padding-top : 20%;
    text-align : center;
    display: block;
    z-index: 99;
    font-weight: bold;
    font-style: italic;
    color: #61859f;
    font-size: 24px;
    justify-content : center;
    align-items: center;
    overflow: hidden;
    /* padding-left : 45%; */
`

export default class CalendarLoading extends Component {
  render() {
    return (
     <LoadingCalendar>
         <img style={{ width:100,height:100 }} src={require('../../images/loading.gif')} alt=""/>
     </LoadingCalendar>
    )
  }
}

