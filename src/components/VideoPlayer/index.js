import React, { useRef } from 'react'
import styled from 'styled-components';
import _ from 'lodash'
import ReactPlayer from 'react-player'


const Wrapper = styled.div`
    background-color: white;
    width: 100%;
    height: 150px;
    width: 300px;

    position: absolute;
    z-index: 11;
    right:0;
    bottom:0;
    
    &.wide {
        height: 80%;
        width: 85%;
        transition: .400s ease-in-out all;
    }
`;

const Placeholder = styled.div`
    width: 100%;
    height: 100%;
    background-color: white;
    border: 2px dashed #000;
    box-sizing: border-box;
`;

const Controls = styled.div`
    background-color: red;
    width: 100%;
    height: 70px;
    position: absolute;
    left: 0;
    bottom: 20px;
    z-index: 1;
    display: flex;
    
    align-items: center;
`;

const ControlsWrapper = styled.div`
  max-width: 80%;
    margin: auto;
`;

export default function VideoPlayer({ currentVideo = null }) {
    const videoPath = `./videos/${_.get(currentVideo, 'videoFileName')}`
    const classNames = currentVideo === null ? '' : 'wide'
    const playerRef = useRef()

    const play = () => {
        if (playerRef.current.player.isPlaying)
            playerRef.current.getInternalPlayer().pause()
        else 
            playerRef.current.getInternalPlayer().play()
    }

    const getTime = () => playerRef.current.getCurrentTime()

    return (
        <Wrapper className={classNames}>

            {currentVideo ? <ReactPlayer width="100%" height="100%"
                url={videoPath} ref={playerRef}/> : <Placeholder/>}

            {currentVideo &&
                <Controls>
                    <ControlsWrapper>
                        <div onClick={play}>play</div>
                    </ControlsWrapper>
                </Controls>}
        </Wrapper>
    )
}
