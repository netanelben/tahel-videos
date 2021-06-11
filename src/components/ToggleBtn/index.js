import React from 'react'
import styled from 'styled-components';
import _ from 'lodash';
import {ReactComponent as IconAnger} from './emotions/anger.svg'


const Wrapper = styled.div`
    border-radius: 15px;
    padding: 6px 10px;
    cursor: pointer;
    
    &.active {
        color: #0500FF;
    }
`;

const Icon = styled.div`
    cursor: pointer;
    width: 28px;
    height: 28px;
    /* background: url('./assets/filterIcons/emotions/anger.svg');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center; */
`;


export default function ToggleBtn({ name, current, onClick, icon = null }) {
    return (
        <Wrapper className={ _.includes(current, name) ? 'active' : '' } onClick={ () => onClick(name) }>

            {/* <IconAnger style={{ path: { fill: 'red' }}}/> */}

            {icon ?
                <Icon icon/> :
                <span>{name}</span>}

        </Wrapper>
    )
}
