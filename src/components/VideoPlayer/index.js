import React from 'react'
import styled from 'styled-components';
import _ from 'lodash'
import Video from 'react-video-renderer';
import {ReactComponent as IcnPlay} from './play.svg'
import {ReactComponent as IcnPause} from './pause.svg'
import Annotation from './Annotation'
import { formatDuration } from '../../utils'

const Wrapper = styled.div`
    background-color: white;
    width: 300px;
    margin-left: auto;
    display: flex;
    justify-content: space-between;
    direction: rtl;

    &.wide {
        height: 100%;
        width: 100%;
        transition: .400s ease-in-out all;

        >div:first-of-type {
            flex: 1 0 calc(100% - 314px);
            max-width: calc(100% - 314px);
        }
        >div:last-child {
            flex: 1 0 314px;
            max-width: 314px;
        }

        .plus-sign {
            display: block;
        }
    }

    .icon-play {
        width: 35px;
    }
`;

const VideoWrapper = styled.div`
    width: 100%;
    position: relative;

    video {

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
    width: 100%;
    height: 70px;
    position: absolute;
    left: 0;
    bottom: 20px;
    z-index: 1;
    direction: ltr;
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
    position: relative;
    z-index: 9;
`;

const Timing = styled.div`
    width: 55px;
    text-align: center;
  margin-left: 30px;
  font-weight: bold;
`;

const PlayPauseBtn = styled.div`
    width: 35px;
    height: 35px;
    margin-right: 30px;
    cursor: pointer;

    svg {
        width: 90%;
        height: 90%;
    }
`;

const InnerWrapper = styled.div`
    position: relative;
    height: 100%;
`;

const SidePanel = styled.div`
    background-color: #fff;
    display: inline-block;
    padding: 16px 12px;
`;

const ProgBarWrapper = styled.div`
    position: relative;
    width: 100%;
`;

const NextVideoButton = styled.button`
    background: url('./assets/arrow-right.png') no-repeat center / contain;
    width: 100px;
    height: 50px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    bottom: 0;
    z-index: 1;
`;

const VideoText = styled.p`
    font-size: 18px;
    line-height: 28px;
    padding: 28px;
    min-height: 100px;
    height: fit-content;
    display: block;
    font-weight: ${props => props.bold && 'bold'};
`;

const SmallTitle = styled.div`
    font-weight: bold;
`;

const Filters = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;

    span {

    }
`;

export default function VideoPlayer({ currentVideo = null, nextVideo, filters }) {
    const videoPath = `./videos/${_.get(currentVideo, 'videoFileName')}.mp4`
    const classNames = currentVideo === null ? '' : 'wide'

    const navigate = (t, actions) => {
        actions.navigate(t.target.value)
    }

    const handlePlayPauseBtn = (state, actions) => {
        if (state.status === 'playing') {
            actions.pause()
        } else {
            actions.play()
        }
    }

    const {year, event, langs, subjects, relation, emotions, foods, objects} = filters

    return (
        <Wrapper className={classNames}>

            {currentVideo
                ? <Video src={videoPath}>
                    {(video, state, actions) => (
                        <InnerWrapper>
                            <VideoWrapper>
                                <div className="plus-sign"/>
                                {video}
                            </VideoWrapper>

                            <Controls>
                                <ControlsWrapper>
                                    <PlayPauseBtn onClick={() => handlePlayPauseBtn(state, actions)}>
                                        {state.status === 'playing'
                                            ? <IcnPause/>
                                            : <IcnPlay/>}
                                    </PlayPauseBtn>

                                    {/* <progress value={state.volume} max={1} onChange={actions.setVolume} /> */}

                                    <ProgBarWrapper>
                                        <ProgBar type="range" step="0.0001"
                                            min="0" value={state.currentTime} max={state.duration}
                                            onChange={(t) => navigate(t, actions)}/>

                                        <Annotation duration={state.duration} videoData={currentVideo}/>
                                    </ProgBarWrapper>

                                    <Timing>{formatDuration(state.currentTime)}</Timing>

                                </ControlsWrapper>
                            </Controls>

                            <NextVideoButton onClick={nextVideo}/>

                        </InnerWrapper>
                    )}

                </Video>
                : <Placeholder/>}

                {currentVideo &&
                    <SidePanel>
                        <VideoText bold>
                            {currentVideo.videoDesc}
                        </VideoText>

                        <VideoText>
                            <SmallTitle>יחסי הורים וילדים</SmallTitle>
                            {currentVideo.childrenAndParents}
                        </VideoText>

                        <VideoText>
                            <SmallTitle>יחסי גברים נשים</SmallTitle>
                            {currentVideo.menAndWomen}
                        </VideoText>

                        <VideoText>
                            <SmallTitle>נתוני יוטיוב</SmallTitle>
                            {currentVideo.videoInformation}
                        </VideoText>

                        <Filters>
                            <span>{filters.year}</span>
                            <span>{filters.event}</span>
                            <span>{filters.lang}</span>
                        </Filters>

                    </SidePanel>}

        </Wrapper>
    )
}
