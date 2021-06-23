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
import {ReactComponent as IconDot1} from "./assets/dot 1.svg";
import {ReactComponent as IconDot2} from "./assets/dot 2.svg";
import {ReactComponent as IconV} from "./assets/v.svg";

const Wrapper = styled.div`
    background-color: white;
    width: 370px;
    margin-left: auto;
    display: flex;
    justify-content: space-between;
    direction: rtl;
    transition: 500ms ease all;
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
    z-index: 1;
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
    position: relative;
    left: 3px;
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
    font-size: 20px;
    text-align: center;
    margin-left: 20px;
    position: relative;
    top: -2px;
    left: 3px;
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

    svg {
        width:12px;
        height:12px;
        position: absolute;
        right: -24px;
        top: 8px;
        z-index: 1;
    }
`;

const DarkModeButton = styled.div`
    width: 26px;
    height: 26px;
    margin-right: 30px;
    position: relative;
    top: -2px;
    cursor: pointer;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;

    &:hover {
        background-image: url('./assets/dark mode-hover.svg');
    }

    background-image: ${props => props.darkMode
        ? "url('./assets/dark mode-on.svg')"
        : "url('./assets/dark mode-off.svg')"
    };
`;

const PlayPauseBtn = styled.div`
    width: 26px;
    height: 26px;
    margin-right: 15px;
    cursor: pointer;

    svg {
        width: 84%;
        height: 84%;
    }
`;

const MuteButton = styled.div`
    background: no-repeat center / contain;
    background-image: ${props =>
        props.isMuted ? "url('./assets/mute.svg')" : "url('./assets/mute-on.svg')"};
    width: 33px;
    height: 33px;
    margin-right: 20px;
    cursor: pointer;
    position: relative;
    top: -2px;

    svg {
        width: 100%;
        height: 100%;
    }
`;

const Filters = styled.div`
    position: absolute;
    bottom: 41px;
    right: 0;
    width: 100%;
    z-index: 1;

    >div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 auto;
    }

    .bottom {
        position: relative;

        &>div {
            flex: 1 0 33%;
        }
    }

    .titles {
        font-size: 16px;
        line-height: 28px;
        text-align: center;
        flex: 1 0 33%;
        position: relative;

        .second-lang {
            position: absolute;
            top: 30px;
            width: 100%;
            left: 0;
        }
    }

    .icn {
        width: 60px;
        height: 60px;
        margin-top: 20px;
        background-position: center;
    }

    .year-line {
        width: 100%;
        height: 60px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;

        >div {
            width: 3px;
            height: 26px;
            background-color: #000;
            margin: 0 auto -6px;
        }
    }
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
    const langOne = currentVideo && currentVideo.lang.split(',')[0]
    const langTwo = currentVideo && currentVideo.lang.split(',')[1]

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
                                        <DarkModeButton darkMode={darkMode} onClick={() => setDarkMode(!darkMode)}
                                            style={{ position: 'relative', left: '-8px', top: '-1px' }}/>}

                                    <PlayPauseBtn onClick={() => handlePlayPauseBtn(state, actions)} style={{ position: 'relative', left: '-8px', top: '-1px' }}>
                                        {state.status === 'playing'
                                            ? <IcnPause/>
                                            : <IcnPlay/>}
                                    </PlayPauseBtn>

                                    <MuteButton isMuted={state.isMuted} onClick={state.isMuted ? actions.unmute : actions.mute}
                                        style={{ position: 'relative', left: '-5px', top: '-1px' }}/>

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
                                <IconDot1/>
                                יחסי הורים וילדים
                            </SmallTitle>
                            <p>{currentVideo.childrenAndParents}</p>
                        </InfoText>

                        <InfoText>
                            <SmallTitle>
                                <IconDot2/>
                                יחסי גברים נשים
                            </SmallTitle>
                            <p>{currentVideo.menAndWomen}</p>
                        </InfoText>

                        <BottomText>
                            <SmallTitle>
                                <IconV/>
                                נתוני יוטיוב
                            </SmallTitle>
                            <ul>
                                <li>
                                    תיאור: &nbsp;
                                    {infoList[0].split('-')[1]}
                                </li>
                                <li>
                                    צפיות: &nbsp;
                                    {infoList[1].split('-')[1]}
                                </li>
                                <li>
                                    שם משתמש: &nbsp;
                                    {infoList[2].split('-')[1]}
                                </li>
                                <li>
                                    עוקבים: &nbsp;
                                    {infoList[3].split('-')[1]}
                                </li>
                            </ul>
                        </BottomText>

                        <Filters>
                            <div>
                                <div className="titles">{currentVideo.year}</div>
                                <div className="titles">{EVENT_TEXT[currentVideo.event]}</div>
                                <div className="titles">
                                    {LANG_TEXT[langOne]}<br/>
                                    {langTwo && <span className="second-lang">{LANG_TEXT[langTwo.trim()]}</span>}
                                </div>
                            </div>

                            <div className="bottom">
                                <div className="year-line"><div/></div>
                                <div className={`icn icn-info-${currentVideo.event} no-hover side-panel-icn`}/>
                                <div/>
                            </div>
                        </Filters>

                    </SidePanel>}

        </Wrapper>
    )
}
