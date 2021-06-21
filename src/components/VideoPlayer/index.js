import React from 'react'
import styled from 'styled-components';
import _ from 'lodash'
import Video from 'react-video-renderer';
import {ReactComponent as IcnPlay} from './play.svg'
import {ReactComponent as IcnPause} from './pause.svg'
import Annotation from './Annotation'
import { formatDuration } from '../../utils'
import { LANG_TEXT, EVENT_TEXT } from '../../config'

const Wrapper = styled.div`
    background-color: white;
    width: 370px;
    margin-left: auto;
    display: flex;
    justify-content: space-between;
    direction: rtl;
    transition: .300s ease all;

    &.wide {
        max-height: 100vh;
        width: 100%;

        >div:first-of-type {
            flex: 1 0 80%;
            max-width: 80%;
        }
        >div:last-child {
            flex: 1 0 20%;
            max-width: 20%;
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
    height: 100%; // Fix the origin to be bottom-right
    position: relative;
`;

const SmallVideoPreview = styled.div`
    width: 100%;
    height: 100%;
    background-color: white;
    box-sizing: border-box;
    position: relative;

    .plus-sign {
        display: block;
        width: 22px;
        height: 22px;
        margin: -10px;
    }
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
    max-width: 85%;
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
    box-sizing: border-box;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    opacity: ${props => props.darkMode && '0.1'};
`;

const ProgBarWrapper = styled.div`
    position: relative;
    width: 100%;
`;

const PrevVideoButton = styled.button`
    background: url('./assets/arrow-right.png') no-repeat center / 90%;
    width: 60px;
    height: 60px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%) rotate(180deg);
    left: 40px;
    bottom: 0;
    z-index: 1;
`;
const NextVideoButton = styled.button`
    background: url('./assets/arrow-right.png') no-repeat center / 90%;
    width: 60px;
    height: 60px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 40px;
    bottom: 0;
    z-index: 1;
`;

const VideoText = styled.div`
    font-size: 18px;
    line-height: 28px;
    padding: 20px 30px 20px 50px;
    display: block;
    font-weight: ${props => props.bold && 'bold'};
`;

const SmallTitle = styled.div`
    font-weight: bold;
    position: relative;

    img {
        width:10px;
        height:10px;
        transform: scale(10);
        position: absolute;
        right: -18px;
        top: 12px;
        z-index: 1;
    }
`;

const Filters = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 28px;

    span {
        font-size: 18px;
        line-height: 28px;
    }

    .icn {
        width: 50px;
        height: 50px;
        margin-top: 10px;
    }
`;

const MuteButton = styled.div`
    background: url('./assets/mute.svg') no-repeat center / contain;
    width: 45px;
    height: 40px;
    margin-right: 30px;
    cursor: pointer;
    position: relative;
    top: -2px;
`;

const DarkModeButton = styled.div`
    width: 33px;
    height: 27px;
    margin-right: 30px;
    position: relative;
    top: -2px;
    cursor: pointer;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;

    &:hover {
        background-image: url('./assets/dark mode-hover.png');
    }

    background-image: ${props => props.darkMode
        ? "url('./assets/dark mode-on.png')"
        : "url('./assets/dark mode-off.png')"
    };
`;

export default function VideoPlayer({
    currentVideo = null, handlePreviousVideo, nextVideo, previewVideo,
    darkMode, setDarkMode
}) {
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

    const infoList = currentVideo && currentVideo.videoInformation.split(',')

    return (
        <Wrapper className={classNames} id="video-main-wrapper">

            {currentVideo
                ? <Video src={videoPath} autoPlay>
                    {(video, state, actions) => (
                        <InnerWrapper>
                            <VideoWrapper>
                                {video}
                            </VideoWrapper>

                            <Controls>
                                <ControlsWrapper>
                                    <DarkModeButton darkMode={darkMode} onClick={() => setDarkMode(!darkMode)}/>

                                    <PlayPauseBtn onClick={() => handlePlayPauseBtn(state, actions)}>
                                        {state.status === 'playing'
                                            ? <IcnPause/>
                                            : <IcnPlay/>}
                                    </PlayPauseBtn>

                                    <MuteButton onClick={state.isMuted ? actions.unmute : actions.mute} />

                                    <ProgBarWrapper>
                                        <ProgBar type="range" step="0.0001"
                                            min="0" value={state.currentTime} max={state.duration}
                                            onChange={(t) => navigate(t, actions)}/>

                                        <Annotation duration={state.duration} videoData={currentVideo} navigate={actions.navigate}/>
                                    </ProgBarWrapper>

                                    <Timing>{formatDuration(state.currentTime)}</Timing>

                                </ControlsWrapper>
                            </Controls>

                            <PrevVideoButton onClick={handlePreviousVideo}/>
                            <NextVideoButton onClick={nextVideo}/>

                        </InnerWrapper>
                    )}

                </Video>
                :
                <SmallVideoPreview>
                    <div className="plus-sign"/>
                    <Video src={`./videos/${previewVideo && previewVideo.videoFileName}.mp4`}>
                        {(video) => (
                            <div id="preview-video">{video}</div>
                        )}
                    </Video>
                </SmallVideoPreview>
                }

                {currentVideo &&
                    <SidePanel darkMode={darkMode}>
                        <VideoText bold>
                            {currentVideo.videoDesc}
                        </VideoText>

                        <VideoText>
                            <SmallTitle>
                                <img src="./assets/dot 1.png"/>
                                יחסי הורים וילדים
                            </SmallTitle>
                            {currentVideo.childrenAndParents}
                        </VideoText>

                        <VideoText>
                            <SmallTitle>
                                <img src="./assets/dot 2.png"/>
                                יחסי גברים נשים
                            </SmallTitle>
                            {currentVideo.menAndWomen}
                        </VideoText>

                        <VideoText>
                            <SmallTitle>
                                <img src="./assets/v.png"/>
                                נתוני יוטיוב
                            </SmallTitle>
                            <ul>
                                <li>
                                    תיאור -&nbsp;
                                    {infoList[0].split('-')[1]}
                                </li>
                                <li>
                                    צפיות -&nbsp;
                                    {infoList[1].split('-')[1]}
                                </li>
                                <li>
                                    שם משתמש -&nbsp;
                                    {infoList[2].split('-')[1]}
                                </li>
                                <li>
                                    עוקבים -&nbsp;
                                    {infoList[3].split('-')[1]}
                                </li>
                            </ul>
                        </VideoText>

                        <Filters>
                            <span>{currentVideo.year}</span>
                            <span>
                                {EVENT_TEXT[currentVideo.event]}
                                <div className={`icn icn-home-${currentVideo.event} no-hover`}/>
                            </span>
                            <span>{LANG_TEXT[currentVideo.lang.split(',')[0]]}</span>
                        </Filters>

                    </SidePanel>}

        </Wrapper>
    )
}
