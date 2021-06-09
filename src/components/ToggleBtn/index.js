import React from 'react'
import styled from 'styled-components';

const Wrapper = styled.div`
    border-radius: 15px;
    padding: 6px 10px;
    
    &.active {
        background-color: snow;
    }
`;

const Toggle = styled.div`
    cursor: pointer;

    
`;

export default function ToggleBtn({ name, current, onClick }) {
    return (
        <Wrapper className={current === name ? 'active' : ''}>
            <Toggle 
                onClick={ () => onClick(name) }>{name}</Toggle>
        </Wrapper>
    )
}
