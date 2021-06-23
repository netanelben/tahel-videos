import React from 'react'
import classnames from 'classnames'
import styled from 'styled-components';
import _ from 'lodash';

const Wrapper = styled.div`
    cursor: pointer;
    width: 150px;
    height: 100%;

    &.active {
        color: #0500FF;
    }

    .icn {
        display: block;
        width: 100%;
        height: 100%;
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        transition: all .3s ease;
        margin-top: 10px;
    }
`;

export default function ToggleBtn({ name, current, onClick = null, icon = null, handle = null }) {
    const icnClassnames = classnames(
        `icn icn-home-${icon}`, {
            'on': _.includes(current, handle || name)
        }
    );

    return (
        <Wrapper onClick={ onClick ? () => onClick(handle? handle : name) : null }>

            {icon ?
                <div className={icnClassnames}/> :
                <span>{name}</span>}

        </Wrapper>
    )
}
