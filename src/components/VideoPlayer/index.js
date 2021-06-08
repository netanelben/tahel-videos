import React from 'react'
import styled from 'styled-components';


const Wrapper = styled.div`
    background-color: white;
    width: 100%;
    max-width: 300px;
`;


export default function VideoPlayer() {
    return (
        <Wrapper>
            <video controls>
                <source src="movie.mp4" type="video/mp4"/>
                Your browser does not support the video tag.
            </video>
        </Wrapper>
    )
}
