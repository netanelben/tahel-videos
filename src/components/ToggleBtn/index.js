import React from 'react'
import styled from 'styled-components';

const Wrapper = styled.div`
    background-color: snow;
    border-radius: 15px;
    padding: 6px 10px;
`;

const Toggle = styled.div`
    cursor: pointer;
`;

export default function ToggleBtn({ name, lang, onClick }) {
    return (
        <Wrapper>
            <Toggle onClick={ () => onClick(name) }>{name}</Toggle>
        </Wrapper>
    )
}
