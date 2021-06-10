import React from 'react'
import styled from 'styled-components';
import _ from 'lodash'

const Wrapper = styled.div`
    background-color: white;
    width: 100%;
    height: 150px;
    max-width: 300px;
    float: right;
`;

const Placeholder = styled.div`
    width: 100%;
    height: 100%;
    background-color: white;
    border: 2px dashed #000;
`;

export default function VideoPlayer({ currentVideo = null }) {
    const videoPath = `./videos/${_.get(currentVideo, 'videoFileName')}`

    return (
        <Wrapper>
            {currentVideo ? <video width="100%" height="100%" controls>
                <source src={videoPath} type="video/mp4"/>
                Your browser does not support the video tag.
            </video> : <Placeholder/>}
        </Wrapper>
    )
}
