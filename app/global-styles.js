import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
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
  }
  .app-event__id-number {
    font-size: 11px;
    font-weight: bold;
    margin-bottom: 2px;
  }
  .app-event__full-name {
    font-size: 18px;
    font-weight: bold;
    margin-left: 8px;
    margin-bottom: 4px;
    line-height: 1.3;
  }
  .app-event__phone-number {
    font-size: 13px;
    margin-left: 0px;
    margin-bottom: 4px;
    line-height: 1.8;
    font-style: italic;
    font-weight : 500;
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

.event-assigned:hover ,.event-confirmed:hover{
  font-weight : 500;
  color : #333;
}
.DayPickerInput input{
  color : #666 !important;
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
