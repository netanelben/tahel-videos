import React from 'react'
import styled from 'styled-components';
import _ from 'lodash'
import Video from 'react-video-renderer';
import {ReactComponent as IcnPlay} from './play.svg'
import {ReactComponent as IcnPause} from './pause.svg'
import Annotation from './Annotation'
import Slider from 'rc-slider';
import { Slider as YearSlider } from 'rsuite';
import { Filter, relationSliderMarks } from '../../pages/index'
import ToggleBtn from '../../components/ToggleBtn'

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
        }
        >div:last-child {
            flex: 1 0 314px;
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
    background-color: #F7F2E6;
    display: inline-block;
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

const VideoQuote = styled.p`
    background-color: #fff;
    font-size: 20px;
    line-height: 120%;
    padding: 28px 22px;
    min-height: 100px;
    height: fit-content;
    display: block;
`;

const Filters = styled.div`
    direction: ltr;

    > div {
        height: 87px;
        padding: 0 10px;
    }

    .icn {
        width: 15px;
        height: 15px;
    }
`;

const formatDuration = (s) => {
    var m = Math.floor(s / 60);
    m = (m >= 10) ? m : "0" + m;
    s = Math.floor(s % 60);
    s = (s >= 10) ? s : "0" + s;
    return m + ":" + s;
}

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
                        <VideoQuote>
                            "{currentVideo.videoQuote}"
                        </VideoQuote>

                        <Filters>

                            <Filter>
                                <YearSlider defaultValue={year} disabled/>
                                {/* <div className="year-slider-labels">
                                    <span>{START_YEAR}</span>
                                    <span>{END_YEAR}</span>
                                </div> */}
                                <label>שנה</label>
                            </Filter>

                            <Filter>
                                <ToggleBtn name="other" current={event} icon="event-other"/>
                                <ToggleBtn name="friday" current={event} icon="friday"/>
                                <ToggleBtn name="bbq" current={event} icon="bbq"/>
                                <ToggleBtn name="holiday" current={event} icon="holiday"/>
                                <ToggleBtn name="bday" current={event} icon="bday"/>
                                <label>אירוע</label>
                            </Filter>

                            <Filter>
                                <ToggleBtn name="English" current={langs} icon="english"/>
                                <ToggleBtn name="Proski" current={langs} icon="ruski"/>
                                <ToggleBtn name="עברית" current={langs} icon="hebrew"/>
                                <label>שפה</label>
                            </Filter>

                            <Filter>
                                <ToggleBtn name="politiks" current={subjects} icon="politiks"/>
                                <ToggleBtn name="text" current={subjects} icon="text"/>
                                <ToggleBtn name="photography" current={subjects} icon="photography"/>
                                <ToggleBtn name="food" current={subjects} icon="food"/>
                                <ToggleBtn name="memory" current={subjects} icon="memory"/>
                                <label>נושא שיחה</label>
                            </Filter>

                            <Filter>
                                <Slider min={0} max={10} defaultValue={relation} marks={relationSliderMarks} disabled/>
                                <label>קרבה</label>
                            </Filter>

                            <Filter>
                                <ToggleBtn name="calm" current={emotions} icon="calm"/>
                                <ToggleBtn name="happy" current={emotions} icon="happy"/>
                                <ToggleBtn name="embarasment" current={emotions} icon="embarasment"/>
                                <ToggleBtn name="anger" current={emotions} icon="anger"/>
                                <ToggleBtn name="laugh" current={emotions} icon="laugh"/>
                                <label>רגש</label>
                            </Filter>

                            <Filter>
                                <ToggleBtn name="alcohol" current={foods} icon="alcohol"/>
                                <ToggleBtn name="food-other" current={foods} icon="food-other"/>
                                <ToggleBtn name="ashkenzi" current={foods} icon="ashkenzi"/>
                                <ToggleBtn name="mizrahi" current={foods} icon="mizrahi"/>
                                <label>אוכל</label>
                            </Filter>

                            <Filter>
                                <ToggleBtn name="communication" current={objects} icon="communication"/>
                                <ToggleBtn name="art" current={objects} icon="art"/>
                                <ToggleBtn name="chairs" current={objects} icon="chairs"/>
                                <ToggleBtn name="light" current={objects} icon="light"/>
                                <ToggleBtn name="tools" current={objects} icon="tools"/>
                                <label>אוביקטים</label>
                            </Filter>

                        </Filters>
                    </SidePanel>}

        </Wrapper>
    )
}
