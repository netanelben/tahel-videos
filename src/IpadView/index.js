import React, { useEffect } from 'react'
import styled from 'styled-components';

const Wrapper = styled.div`
    width: 100%;
    height: 100%;

    .ipad-wide {
        width: 100%;
        height: 100%;
        margin: 0;

        &>div {
            max-width: 100% !important;
            flex: 1 0 100% !important;
        }
    }
`;

export default function IpadView({ children, filteredVideos, setCurrentVideo }) {
    useEffect(() => {
        setCurrentVideo(filteredVideos[0])
    }, [])

    return (
        <Wrapper>
            {children}
        </Wrapper>
    )
}
