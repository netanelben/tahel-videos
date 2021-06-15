import React from 'react'
import classnames from 'classnames'
import styled from 'styled-components';
import _ from 'lodash';

const Wrapper = styled.div`
    border-radius: 15px;
    padding: 6px 10px;
    cursor: pointer;

    &.active {
        color: #0500FF;
    }
`;

export default function ToggleBtn({ name, current, onClick = null, icon = null }) {
    const icnClassnames = classnames(
        `icn icn-home-${icon}`, {
            'on': _.includes(current, name)
        }
    );

    return (
        <Wrapper onClick={ onClick ? () => onClick(name) : null }>

            {icon ?
                <div className={icnClassnames}/> :
                <span>{name}</span>}

        </Wrapper>
    )
}
