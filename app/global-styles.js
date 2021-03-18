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
    -webkit-tap-highlight-color: rgba(0,0,0,0);
}
  }

  body {

  }

  body.fontLoaded {

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
    outline: none !important;
    box-shadow: none !important;
  }

  :active {
    outline: none !important;
    box-shadow: none !important;
  }

  :visited {
    outline: none !important;
    box-shadow: none !important;
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
    border-color : #dddddd;
}
  .fc-unthemed th, .fc-unthemed td {
    ${'' /* border-color: #1484c0; */}
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
    color : white !important;
  }

  .event-block-temp-paid{
    color : #ffffff !important;
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

  .app-event__appointmentId{
    opacity : 0;
  }

  .fc-time-grid-container::-webkit-scrollbar { width: 0 !important }
  
  // ############################################
  // Main calendar - App Event
  // ############################################
  .app-event {
    border-radius: 4px;
    margin: 1px 1px 4px 1px;
    ${'' /* padding: 4px; */}
    text-align: left;
    cursor: move;
    position : relative;
    margin-top : -3px;
  }
  .app-event__id-number {
    font-size : 0.72rem;
    line-height : 1.5;
    margin-top : -10px;
    margin-left : 5px;
    letter-spacing : 0.3;
  }

   .app-event__id-number2 {
    font-size: 11px;
    font-weight: bold;
    margin-bottom: 2px;
    margin-left : 5px;
    margin-top : 8px;
    letter-spacing : 0.3;
  }

  .app-event__full-name {
    font-size: 18px;
    font-weight: 900;
    margin-left: 8px;
    margin-top : 10px;
    ${'' /* margin-bottom: 4px; */}
    line-height: 1.3;
    color : '#585858';
    fontFamily: 'Arial'
  }

  .event-block-temp-paid{
    color : #ffffff !important;
    overflow : hidden;
    background-color : #56CD36 !important;
    opacity : 1 !important;
    ${'' /* margin-right : 40%; */}
    ${'' /* margin-right : 80px; */}
  }


  .waiting-event{
    font-weight : 600 !important;
    margin-top : 15px !important;
    color : '#585858' !important;
    overflow : hidden !important;
  }

  .option_waiting{
    // width : calc((100vw - 5.05rem) / 10);
  }


  .app-event__full-name2 {
    position : absolute;
    right: 5px;
    top : -2px;
  }

  .app-event__vipBlock{
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

  .img-call{
    margin-top : -4px;
    margin-right : 2px;
  }

  .app-event__phone-number {
    font-size : 0.72rem;
    margin-top : -13px;
    margin-bottom : -13px;
    margin-left : -8px;
    line-height: 1.8;
    font-style: italic;
    font-weight : 500;
    word-wrap: break-word;
  }

  .app-event__phone-number4{
    font-size: 13px;
    margin-left: 7px;
    margin-bottom: 4px;
    margin-top : 4px;
    line-height: 1.8;
    font-style: italic;
    font-weight : 500;
    word-wrap: break-word;
  }

  .icon-phone{
    filter: invert(95%) sepia(68%) saturate(24%) hue-rotate(173deg) brightness(114%) contrast(89%);
    margin-top: -3px;
    margin-right : -11px;
    margin-left : -12px;
  }

  .icon-phone2{
    margin-top: -3px;
    margin-right : -11px;
    margin-left : -12px;
  }

  .app-event__option {
    font-size : 0.72rem;
    margin-left: 8px;
    margin-bottom : 5px;
    line-height: 1.2;
    font-style: italic;
    letter-spacing : 0.3;
  }

  .fc-time-grid .fc-slats td{
      height : 1.75rem !important;
  }

.app-event__note {
  font-size : 0.73rem;
  padding : 10px;
  font-weight : 900;
}

.app-event__blockName{
  font-size : 1.1rem;
  padding : 10px;
  font-weight : 900;
}

.app-event__blockPhone{
  font-size : 0.72rem;
  font-style : italic;
  margin-top: -12px;
  padding : 10px;
  padding-left : 5px;
}

.app-event__blockService{
  font-size : 0.8rem;
  padding : 10px;
  margin-top: -12px;
  font-style : italic;
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
.event-assigned, .event-confirmed,.event-block-temp-assigned,.event-block-temp-confirmed{
  font-weight : 500;
  color : #585858;
  letter-spacing : 0.6;
}

.option_categories{
  color: #0764B0;
}

.event-assigned-anystaff , .event-confirmed-anystaff {
  font-weight : 500;
  color : #585858;
  letter-spacing : 0.6;
  max-width : 50%;
}

.event-checkin-anystaff{
  max-width : 50%;
}

.event-void{
  font-weight : 500;
  color : #ffffff;
  letter-spacing : 0.6;
}


.event-checkin,.event-confirmed,.event-paid,.event-anystaff,.event-void,.event-assigned,.event-block-temp-assigned,.event-block-temp-confirmed,.event-block-temp-check-in{
  border : 1px solid #ffffff !important;
  overflow: hidden !important;
}

.btn-arrow{

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

.event-assigned:hover ,.event-confirmed:hover,.event-anystaff:hover , .event-confirmed-anystaff:hover , .event-assigned-anystaff:hover , .event-block-temp-assigned:hover , .event-block-temp-confirmed:hover{
  font-weight : 500;
  color : #333;
}
.event-assigned{

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

.loading-animation{
  color: #1172C1 !important;
  opacity : 1 !important;
}

#full-calendar{

}
.test-arrow {
  background: linear-gradient(to right, #FFF 20%, #FF0 40%, #FF0 60%, #FFF 80%);
  background-size: 200% auto;
  
  color: #000;
  background-clip: text;
  text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  animation: shine 1s linear infinite;
  @keyframes shine {
    to {
      background-position: 200% center;
    }
  }
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

.app-event__option-container{
  margin-top : -0.85rem;
}


.selectRef{
    width : 4rem;
    height : 2.8rem;
    background: #ffffff;
		border: 1px solid #dddddd;
		border-radius: 4px;
    font-size : 1rem;
		padding: 0.8rem 1rem;
		-moz-appearance: none;
		/* for Chrome */
		-webkit-appearance: none;
    margin-right : 0.3rem;
}

.fc-now-indicator-arrow{
  opacity : 0 !important; 
}

.picker-item{
  font-size : 18px !important;
}

.fc-body .fc-time-grid .fc-content-skeleton table tbody tr td:nth-child(2) .fc-content-col .fc-event-container{
  margin-right : 40% !important;
}

::-webkit-scrollbar { 
    display: none; 
}

  @media only screen and (min-width: 1025px) {
    .app-event__option{
      font-size : 0.77rem !important;
    }
    .app-event__full-name{
      font-size : 1.2rem !important;
    }

    .app-event__blockService{
      font-size : 0.77rem !important;
    }
    .app-event__blockPhone{
      font-size : 0.77rem !important;
    }  

    .app-event__phone-number{
      font-size : 0.74rem !important;
    }
    .app-event__phone-number4{
      font-size : 1rem !important;
    }
    .app-event__id-number{
      font-size : 0.74rem !important;
    }
    .app-event__id-number2{
      font-size : 0.8rem !important;
    }
    .fc-time-grid .fc-slats td{
      height : 2.2rem !important;
    }
  }

@keyframes bd {
  50% {
    background-position: 460% 0, 100% 320%, 310% 100%, 0% 310%;/* average reset of bg-position , tune it to desired effect */
  }
}
`;



export default GlobalStyle;
