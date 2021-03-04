import React from 'react'
import styled from 'styled-components';
import moment from 'moment';

const Item = styled.div`
    display : flex;
    flex-direction : row;
    &>div{
        margin-left : 1rem;
    }
    border-bottom : 1px solid #eeeeee;
    padding-bottom : 0.5rem;
    margin-top : 1rem;
    margin-bottom : 1.5rem;
`;

Item.Icon = styled.img`
    width : 45px;
    height : 45px;
`;

Item.Title = styled.div`
	color: ${(props) => (props.isView ? '#6a6a6a' : '#136AB7')};
    font-size : 1.2rem;
    font-weight : 600;
`;

Item.TitleCancel = styled.div`
	color: ${(props) => (props.isView ? '#6a6a6a' : 'red')};
    font-size : 1.2rem;
    font-weight : 600;
`;

Item.Content = styled.div`
    margin-top : 0.35rem;
    font-size : 1rem;
    color: ${(props) => (props.isView ? '#6a6a6a' : '#333')};
`;


Item.Date = styled.div`
    font-size : 0.8rem;
    margin-top : 0.35rem;
    color: ${(props) => (props.isView ? '#6a6a6a' : '#333')};
`;

const ItemNotification = ({ item, icon, onClick }) => {

    const rawMarkup = (content) => {
        return { __html: content };
    }

    return (
        <Item onClick={onClick}>
            <Item.Icon src={icon} />
            <div>
                {
                    item.type !== 'appointment_cancel' ?
                        <Item.Title isView={item.view === 1 ? true : false}>
                            {`${item.title}`}
                        </Item.Title>
                        :
                        <Item.TitleCancel isView={item.view === 1 ? true : false}>
                            {`${item.title}`}
                        </Item.TitleCancel>
                }
                <Item.Content
                    isView={item.view === 1 ? true : false}
                    dangerouslySetInnerHTML={rawMarkup(item.content)}
                />
                <Item.Date isView={item.view === 1 ? true : false}>
                    {moment(item.createdDate).format('MMMM,DD hh:mm A')}
                </Item.Date>
            </div>
        </Item>
    )
}

export default ItemNotification;
