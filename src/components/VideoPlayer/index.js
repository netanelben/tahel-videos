import React from 'react'
import styled from 'styled-components';
import _ from 'lodash'
import Video from 'react-video-renderer';

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

    .icon-play {
        width: 35px;
    }
`;

const VideoWrapper = styled.div`
    width: 100%;
    height: 100%;
`;

const Placeholder = styled.div`
    width: 100%;
    height: 100%;
    background-color: white;
    border: 2px dashed #000;
    box-sizing: border-box;
`;

const Controls = styled.div`
    width: 100%;
    height: 70px;
    position: absolute;
    left: 0;
    bottom: 20px;
    z-index: 1;
`;

const ControlsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 70%;
    margin: auto;
`;

const ProgBar = styled.input`
    width: 100%;
    height: 3px;
    color: #000;
    border-color: #000;
    background-color: #000;
`;

const Timing = styled.div`
  margin-left: 30px;
  font-weight: bold;
`;

export default function VideoPlayer({ currentVideo = null }) {
    const videoPath = `./videos/${_.get(currentVideo, 'videoFileName')}`
    const classNames = currentVideo === null ? '' : 'wide'

    const navigate = (t, actions) => {
        actions.navigate(t.target.value)
    }

    return (
        <Wrapper className={classNames}>

            {currentVideo
                ? <Video src={videoPath}>
                    {(video, state, actions) => (
                        <div>
                            <VideoWrapper>{video}</VideoWrapper>

                            <Controls>
                                <ControlsWrapper>
                                    <button onClick={actions.play}>Play</button>
                                    <button onClick={actions.pause}>Pause</button>
                                    {/* <progress value={state.volume} max={1} onChange={actions.setVolume} /> */}

                                    <ProgBar type="range" step="0.0001"
                                        min="0" value={state.currentTime} max={state.duration}
                                        onChange={(t) => navigate(t, actions)}/>

                                    <Timing>{state.currentTime} / {state.duration}</Timing>
                                </ControlsWrapper>
                            </Controls>
                        </div>
                    )}
                </Video>
                : <Placeholder/>}

        </Wrapper>
    )
}
