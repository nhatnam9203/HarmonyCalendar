import React, { Component } from 'react'
import Popup from 'reactjs-popup';

export default class CalendarLoading extends Component {
  render() {
    return (
      <Popup
        open
        contentStyle={{
          background: 'transparent',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: 'none'
        }}
        overlayStyle={{
          background: 'transparent'
        }}
      >
        <img style={{ width: 100, height: 100 }} src={require('../../images/loading.gif')} alt="" />
      </Popup>
    )
  }
}

