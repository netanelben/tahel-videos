import React, { useState } from 'react'
import classnames from 'classnames';
import styled from 'styled-components';
import _ from 'lodash'
import Video from 'react-video-renderer';
import {ReactComponent as IcnPlay} from './play.svg'
import {ReactComponent as IcnPause} from './pause.svg'
import Annotation from './Annotation'
import { formatDuration, hostingPath } from '../../utils'
import { LANG_TEXT, EVENT_TEXT } from '../../config'

const Wrapper = styled.div`
    background-color: white;
    width: 370px;
    margin-left: auto;
    display: flex;
    justify-content: space-between;
    direction: rtl;
    transition: .3s ease all;
    transform-origin: bottom right;
    height: 20%;
    position: absolute;
    right:0;
    bottom: 0;
    z-index:2;

    &.wide {
        height: 80%;
        max-height: 100vh;
        width: 100%;
        z-index:1;

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

    outline: ${props => props.isHover && '1px solid #000'};

    video {
        object-fit: ${props => props.isCrop && 'cover'};
    }
`;

const SmallVideoPreview = styled.div`
    width: 100%;
    height: 100%;
    background-color: #fff;
    box-sizing: border-box;
    position: relative;

    .plus-sign {
        display: block;
        background: url('./assets/plus-sign.svg') no-repeat center / contain;
        width: 33px;
        height: 33px;
        margin: -16px;
    }
`;

const Controls = styled.div`
    width: 100%;
    height: 70px;
    position: absolute;
    left: 0;
    bottom: 8px;
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
    z-index: 0;
    opacity: 0.5;
`;

const Timing = styled.div`
    width: 55px;
    text-align: center;
    margin-left: 20px;
    font-weight: bold;
`;

const PlayPauseBtn = styled.div`
    width: 35px;
    height: 35px;
    margin-right: 15px;
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
    justify-content: flex-start;
    position: relative;
    opacity: ${props => props.darkMode && '0.1'};

    p {
        max-height: 60px;
        overflow: hidden;
        font-size: 17px;
    }
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

    &:hover {
        background-image: url('./assets/arrow-on.png');
    }
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

    &:hover {
        background-image: url('./assets/arrow-on.png');
    }
`;

const VideoText = styled.div`
    font-size: 18px;
    line-height: 28px;
    padding: 20px 30px 0 30px;
    display: block;
    max-height: 110px;
    overflow: hidden;
    margin-bottom: 40px;
    font-weight: ${props => props.bold && 'bold'};
`;

const InfoText = styled.div`
    font-size: 18px;
    line-height: 28px;
    padding: 20px 30px 0 30px;
    display: block;
`;

const BottomText = styled.div`
    font-size: 18px;
    line-height: 28px;
    padding: 50px 30px 20px 30px;
    display: block;

    li {
        font-size: 17px;
        line-height: 26px;
    }
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
    position: absolute;
    bottom: 6px;
    right: 0;
    width: 100%;
    z-index: 1;

    >div {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        max-width: 75%;
        margin: 0 auto;
    }

    span {
        font-size: 16px;
        line-height: 28px;
        &.event {
            text-align: center;
        }
    }

    .icn {
        width: 70px;
        height: 70px;
        margin-top: 10px;
    }

    .year-line {
        width: 100%;
        height: 26px;
        >div {
            width: 3px;
            height: 100%;
            background-color: #000;
            margin: 15px auto 0;
        }
    }
`;

const MuteButton = styled.div`
    background: url('./assets/mute.svg') no-repeat center / contain;
    width: 45px;
    height: 40px;
    margin-right: 20px;
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
    currentVideo = null, previousVideo, nextVideo, previewVideo,
    darkMode, setDarkMode, isIpadView
}) {
    const videoPath = hostingPath(_.get(currentVideo, 'videoFileName'))

    const classNames = classnames({
        'wide': currentVideo !== null,
        'ipad-wide': isIpadView
    })

    const [isHover, setIsHover] = useState(false)

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
                            <VideoWrapper isHover={isHover} isCrop={currentVideo.isCrop ? false : true}>
                                {video}
                            </VideoWrapper>

                            <Controls>
                                <ControlsWrapper>
                                    {!isIpadView &&
                                        <DarkModeButton darkMode={darkMode} onClick={() => setDarkMode(!darkMode)}/>}

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

                                        <Annotation duration={state.duration}
                                            shouldInvertIcons={currentVideo.isCrop}
                                            videoData={currentVideo} navigate={actions.navigate}/>
                                    </ProgBarWrapper>

                                    <Timing>{formatDuration(state.currentTime)}</Timing>

                                </ControlsWrapper>
                            </Controls>

                            <PrevVideoButton onClick={previousVideo}
                                onMouseEnter={()=>setIsHover(true)}
                                onMouseLeave={()=>setIsHover(false)}/>
                            <NextVideoButton onClick={nextVideo}
                                onMouseEnter={()=>setIsHover(true)}
                                onMouseLeave={()=>setIsHover(false)}/>

                        </InnerWrapper>
                    )}

                </Video>
                :
                <SmallVideoPreview>
                    <div className="plus-sign"/>
                    {previewVideo &&
                        <Video src={hostingPath(previewVideo.videoFileName)}>
                            {(video) => (
                                <div id="preview-video">{video}</div>
                            )}
                        </Video>}
                </SmallVideoPreview>
                }

                {currentVideo && !isIpadView &&
                    <SidePanel darkMode={darkMode}>
                        <VideoText bold>
                            {currentVideo.videoDesc}
                        </VideoText>

                        <InfoText>
                            <SmallTitle>
                                <img src="./assets/dot 1.png"/>
                                יחסי הורים וילדים
                            </SmallTitle>
                            <p>{currentVideo.childrenAndParents}</p>
                        </InfoText>

                        <InfoText>
                            <SmallTitle>
                                <img src="./assets/dot 2.png"/>
                                יחסי גברים נשים
                            </SmallTitle>
                            <p>{currentVideo.menAndWomen}</p>
                        </InfoText>

                        <BottomText>
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
                        </BottomText>

                        <Filters>
                            <div>
                            <span>
                                {currentVideo.year}
                                <div className="year-line"><div/></div>
                            </span>
                            <span className="event">
                                {EVENT_TEXT[currentVideo.event]}
                                <div className={`icn icn-info-${currentVideo.event} no-hover side-panel-icn`}/>
                            </span>
                            <span>{LANG_TEXT[currentVideo.lang.split(',')[0]]}</span>
                            </div>
                        </Filters>

                    </SidePanel>}

        </Wrapper>
    )
}
