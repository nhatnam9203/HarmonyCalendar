import React from 'react';
import styled from 'styled-components';
import 'react-day-picker/lib/style.css';

const Button = styled.div`
  width: calc(5.05rem - 1px);
  height: 100%;
  display : flex;
  text-align : center;
  justify-content : center;
  align-items: center;
  position: relative;
  padding: 0.5rem;
  & > img {
      width : 33px;
      height : 33px;
    }
`;

class InformationButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPopupOpen: false,
        };
    }

    render() {
        const { onPress } = this.props;
        return (
            <Button onClick={() => onPress()}>
                <img src={require('../../images/information.png')} />
            </Button>
        );
    }
}

export default InformationButton;
