import { createGlobalStyle } from 'styled-components';
import OpenSan from './utils/font/SF-UI/SF-UI-Text-Regular.otf';

const GlobalStyle = createGlobalStyle`

    @font-face {
    font-family: 'Open Sans';
    src: url(${OpenSan});
    font-weight: 400;
    font-style: normal;
  }

  html,
  body {
    height: 100%;
    width: 100%;
    position: fixed;
    overflow: hidden;
}
  }

  body {
    font-family: 'Helvetica Neue'
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue'
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }
  
  :focus {
    outline: none;
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
  }

  thead {
    background: #585858;
    color: #ffffff;
  }
  
  td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 0.5rem;
  }

  // ############################################
  // Main calendar - Fullcalendar
  // ############################################
  .fc-unthemed td.fc-today {
    background: #ffffff;
}
  .fc-unthemed th, .fc-unthemed td {
    border-color: #1484c0;
    border-width: 1px;
  }
  .fc-unthemed th:first-child, .fc-unthemed td:first-child {
    border-left: none;
  }
  .fc-unthemed th:last-child, .fc-unthemed td:last-child {
    border-right: none;
  }
  .fc-unthemed .fc-widget-content {
    border-color: #ddd;
    border-width: 1px;
  }
  .fc-unthemed .fc-axis {
    border-right: 1px solid #1484c0;
  }
  .fc-axis { 
    width: 71px !important;
    font-size : 1rem;
  }
  .fc th {
    border-width: 1px;
  }
  .fc-resource-cell {
    position: relative;
  }
  .fc-event {
    border: none;
    padding: 0;
    background: #00b4f7;
    color: #ffffff;
  }

  .event-block-temp{
    overflow : hidden;
  }

  .event-anystaff{
    font-weight : 500;
    color : #333;
    letter-spacing : 0.6;
  }
  
  .fc-ltr .fc-time-grid .fc-now-indicator-arrow {
    left: 50px;
    background: #ffffff;
    color: #f00;
    border: none;
    box-shadow: 0 0 10px #949494;
    border-radius: 10px;
    font-size: 12px;
    margin-top: -10px;
    padding: 1px 10px;
    z-index: 9;
  }

  .fc-time-grid-container::-webkit-scrollbar { width: 0 !important }
  
  // ############################################
  // Main calendar - App Event
  // ############################################
  .app-event {
    border-radius: 4px;
    margin: 1px 1px 4px 1px;
    padding: 4px;
    text-align: left;
    cursor: move;
    position : relative;
  }
  .app-event__id-number {
    font-size: 11px;
    font-weight: bold;
    margin-bottom: 2px;
  }
  .app-event__full-name {
    font-size: 18px;
    font-weight: 600;
    margin-left: 8px;
    margin-bottom: 4px;
    line-height: 1.3;
  }

  .app-event__full-name2 {
    position : absolute;
    right: 5px;
    top : 5px;
  }

  .app-event__full-name3 {
    position : absolute;
    right: 5px;
    top : 5px;
  }

  .app-event__full-name3 img{
    filter: sepia(100%) saturate(300%) brightness(20%) hue-rotate(0deg);
  }

  .app-event__phone-number {
    font-size: 13px;
    margin-left: 0px;
    margin-bottom: 4px;
    line-height: 1.8;
    font-style: italic;
    font-weight : 500;
    word-wrap: break-word;
  }
  .app-event__option {
    font-size: 13px;
    margin-left: 16px;
    line-height: 1.2;
    font-style: italic;
  }

  .timeline {
    position: absolute;    
    border-top: 2px dashed red;
    width: 100%;
    margin: 0;
    padding: 0;
    z-index: 999;
  }

  .fc-event {
    border: 1px solid ;
}
.event-assigned, .event-confirmed{
  font-weight : 500;
  color : #333;
  letter-spacing : 0.6;
}
.event-checkin,.event-confirmed,.event-paid,.event-anystaff{
  border : 1px solid #ffffff !important;
}

.btn-arrow{
  color: linear-gradient(
        to right,
        #873f72,
        #ed3144,
        #f20920,
        #b9ce2b,
        #873f72
      )
      160%
      0
      repeat-x,
    linear-gradient(to top, #873f72, #ed3144, #f20920, #b9ce2b, #873f72)
      100%
      20%
      repeat-y,
    linear-gradient(to left, #873f72, #ed3144, #f20920, #b9ce2b, #873f72)
      10%
      100%
      repeat-x,
    linear-gradient(to bottom, #873f72, #ed3144, #f20920, #b9ce2b, #873f72)
      0%
      10%
      repeat-y;
  background-size: 300% 2px, 2px 300%;/* increase size to show at once the bit from 2 gradient colors */
  animation: bd 5s infinite linear;
}

.event-assigned{
  background: linear-gradient(
        to right,
        #873f72,
        #ed3144,
        #f20920,
        #b9ce2b,
        #873f72
      )
      160%
      0
      repeat-x,
    linear-gradient(to top, #873f72, #ed3144, #f20920, #b9ce2b, #873f72)
      100%
      20%
      repeat-y,
    linear-gradient(to left, #873f72, #ed3144, #f20920, #b9ce2b, #873f72)
      10%
      100%
      repeat-x,
    linear-gradient(to bottom, #873f72, #ed3144, #f20920, #b9ce2b, #873f72)
      0%
      10%
      repeat-y;

  background-size: 300% 2px, 2px 300%;/* increase size to show at once the bit from 2 gradient colors */
  animation: bd 5s infinite linear;
}

.timePicker{
  border : 10px !important;
  margin-top : 5px;
}

.rc-time-picker-input{
  border : 0 !important;
}
.rc-time-picker-clear{
  display : none;

}
.rc-time-picker-input{
  font-size : 1rem !important;
  color : #333;
  padding-left : 10px !important;
}

.event-assigned:hover ,.event-confirmed:hover,.event-anystaff:hover{
  font-weight : 500;
  color : #333;
}
.DayPickerInput input{
  color : #333 !important;
}
.DayPickerInput{
  padding-top : 1rem !important;
}

.fc-highlight{
  background : #b0e7ff;
  opacity : 0.7;
}
.rc-time-picker-panel{
  width : 300px !important;
}
.rc-time-picker-panel-narrow{
  max-width : 300px !important;
}
.rc-time-picker-panel-select{
  width : 80px !important;
}

.headerRefPhone{
    width: 4rem !important;
    height : 2.14rem !important;
    background: #ffffff !important;
    border: 1px solid #dddddd !important;
    border-radius: 4px;
    margin-right: 0.5rem;
    padding-left: 1.2rem;
    -moz-appearance: none;
    -webkit-appearance: none;
}

.rc-time-picker-panel-select ul li{
  height : 43px !important;
}

.txtTimeChange{
  color : #919191;
  font-size : 0.9rem;
}

.am-picker{
  width:60%;
  margin:auto;
}
.am-picker-popup{
  left : 25% !important;
  width : 50% !important;
  border-top-left-radius : 10px;
  border-top-right-radius : 10px;
}
#full-calendar{

}
.App-pages {
    height: 100%;
    width: calc(((100vw - 5.05rem) / 7) * 6 + 4.75rem);
    perspective: 960px;
}
.am-picker-popup-header{
  background : #1073C2;
  border-top-left-radius : 15px;
  border-top-right-radius : 15px;
}
.am-picker-popup{
  border-top-left-radius : 15px;
  border-top-right-radius : 15px; 
}
.am-picker-popup-item{
  color : #ffffff !important;
}
.popup-overlay{

}
.fc-now-indicator-arrow{
  display : none !important; 
}

::-webkit-scrollbar { 
    display: none; 
}

@keyframes bd {
  50% {
    background-position: 460% 0, 100% 320%, 310% 100%, 0% 310%;/* average reset of bg-position , tune it to desired effect */
  }
}
`;

export default GlobalStyle;
