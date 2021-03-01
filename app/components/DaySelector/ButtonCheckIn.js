import React from 'react';
import styled from 'styled-components';

const WrapButtonCheckIn = styled.div`
    display : flex;
    flex : 1;
    position: relative;
    height : 4.4rem !important;
    display : flex;
    justify-content : center;
    align-items : center;
    @media (min-width: 1025px) {
      height : 5rem !important;
	  }
`;

const ButtonCheckIn = styled.div`
    width: 90%;
    height : 66%;
    border-radius : 5px;
    background-color : #1B68AC;
    display : flex;
    justify-content : center;
    align-items : center;
    cursor: pointer;
`;

ButtonCheckIn.Text = styled.div`
    color : white;
    font-size : 1.1rem;
    font-weight : 700;
`;

class Button extends React.Component {

  constructor() {
    super();
    this.state = {
    }
  }

  render() {
    const {onPress} = this.props;
    return (
        <WrapButtonCheckIn>
            <ButtonCheckIn onClick={()=>onPress()}>
                <ButtonCheckIn.Text>
                    Check-In
                </ButtonCheckIn.Text>
            </ButtonCheckIn>
        </WrapButtonCheckIn>
    );
  }
}
export default Button;
