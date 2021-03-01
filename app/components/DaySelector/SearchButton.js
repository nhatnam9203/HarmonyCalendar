import React from 'react';
import styled from 'styled-components';
import 'react-day-picker/lib/style.css';

const ButtonSearchBox = styled.div`
  width: calc(5.05rem - 1px);
  height: 100%;
  display : flex;
  text-align : center;
  justify-content : center;
  align-items: center;
  /* border-right: 1px solid #3883bb; */
  position: relative;
  padding: 0.5rem;
  & > img {
      width : 30px;
      height : 30px;
    }
`;

class MiniCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPopupOpen: false,
    };
  }

  render() {
    const {onPress} = this.props;
    return (
        <ButtonSearchBox onClick={()=>onPress()}>
          <img src={require('../../images/searchIcon.png')} />
        </ButtonSearchBox>
    );
  }
}

export default MiniCalendar;
