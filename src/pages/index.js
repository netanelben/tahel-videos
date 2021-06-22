import React, { useState } from 'react'
import _ from 'lodash';
import styled from 'styled-components';
import Slider from 'rc-slider';
import { Slider as YearSlider } from 'rsuite';
import ToggleBtn from '../components/ToggleBtn'
import VideoPlayer from '../components/VideoPlayer'
import { VIDEOS_AMOUNT, START_YEAR, END_YEAR, videosStubData, APP_SIDEPANEL_TEXT } from '../config'
import { filterVideos, hostingPath } from '../utils'
import titleBorder from './titleBorder.svg'

import 'rc-slider/assets/index.css';

const Wrapper = styled.div`
  height: 100%;
  min-height: 100%;
  display: flex;
  justify-content: space-between;

  &.bg-white {
      height: 20vh;
      background-color: #fff;
  }

  &.bg-beige {
    background: #F7F2E6;
  }
`;

const GridLayout = styled.div`
    background: #F7F2E6;
    display: flex;
    flex-flow: row wrap;
    place-content: flex-start;
    width: 100%;
    position: relative;
    z-index: 2;
    padding: 2px;

    opacity: ${props => props.darkMode && '0.1'};

    &.tiny {
        width: 20%;
        height: 100%;
        min-height: 100%;
        transition: .400s ease-in-out all;
        background: #F7F2E6;
        cursor: pointer;

        &:hover {
            outline: 1px solid #000;
            transition: .3s ease all;
        }

        .videos-wrapper {
            width: 8.33333333333%;
            flex: 0 0 8.33333333333%;
            height: 14.2857142857%;
            flex-grow: 0;

            &>div {
                border: 1px solid #F7F2E6;
            }
        }

        .arrow-sign {
            display: block;
            background-image: url('./assets/plus-sign.svg');
            width: 33px;
            height: 33px;
            right: -15px;
            bottom: -15px;
        }

        &:hover {
            .arrow-sign {
                display: block;
                background-image: url('./assets/arrow-tiny.svg');
                width: 28px;
                height: 28px;
                right: -2px;
                bottom: -2px;
            }
        }
    }

    &:not(.tiny) {
        overflow: hidden;

        .videos-wrapper {
            background-color: #f7f2e6;

            .inner {
                width: 100%;
                height: 100%;
            }

            &:hover {
                .inner {
                    box-shadow: inset 0px 0px 0px 1px #000;
                }

                video {
                    visibility: hidden;
                }
            }
        }
    }
`;

const VideoPlaceholder = styled.div`
    width: 8.33333333333%;
    flex: 0 0 8.33333333333%;
    height: 14.2857142857%;
`;

const VideoObject = styled.div`
    background-color: ${props => props.isSelected ? '#f7f2e6' : '#fff'};
    box-shadow: ${props => props.isSelected && 'inset 0px 0px 0px 2px #000'};
    width: 8.33333333333%;
    flex: 0 0 8.33333333333%;
    height: 14.2857142857%;
    cursor: pointer;

    &>div {
        height: 100%;
        width: 100%;
        padding: 4px;
        box-sizing: border-box;
    }

    video {
        object-fit: cover;
        display: ${props => props.isSelected && 'none'};
    }
`;

const SidePanel = styled.div`
    flex: 1 0 370px;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    background-color: ${props => props.isBgAlt && '#fff'};

    &.bg-white {
        background-color: #fff;
    }
`;

const Logo = styled.div`
    width: 100%;
    height: 150px;
    background-image: url('./assets/logo.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    cursor: pointer;

    &.float-right {
        float: right;
        width: 200px;
        height: 130px;
    }
`;

const DescPar = styled.p`
    text-align: right;
    font-size: 18px;
    line-height: 28px;
    padding: 20px 30px;
    direction: rtl;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 1;
    max-width: ${props => props.title ? '100%' : '200px'};
`;

const BottomPanel = styled.div`
    background: #F7F2E6;
    width: calc(100% - 370px);
    display: inline-block;
`;

const Filters = styled.div`
    flex: 1;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    flex-direction: row-reverse;
    margin-top: ${props => props.bottom && '-10px'};
`;

export const Filter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100px;
    flex: 1;
    padding: 0 18px 0 3px;
    text-align: right;
    border-left: 1px solid #000;
    position: relative;
    overflow: hidden;
    border-bottom: ${props => !props.noBorder && '1px solid #000'};

    &:last-of-type {
        border-left: 0;
    }

    label {
        margin-left: 6px;
        font-weight: 700;
        font-size: 18px;
    }
`;

const VideoTitle = styled.div`
    font-weight: bold;
    font-size: 24px;
    line-height: 30px;
    margin: 0 0 -4px -4px;
`;

const VideoHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    direction: rtl;
    padding: 0 20px;

    opacity: ${props => props.darkMode && '0.1'};

    .title {
        font-weight: bold;
        font-size: 44px;
        line-height: 100%;
        margin: 0 70px 0 0;

        &:after {
            content: '';
            display: block;
            width: 100%;
            height: 25px;
            background-image: url(${titleBorder});
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            position: relative;
            top: 5px;
        }
    }

    .desc {
        max-width: 300px;
        font-size: 18px;
        line-height: 28px;
    }
`;

export const relationSliderMarks = {
    1: <img src="./assets/heart.png" width="14"/>,
    3: <img src="./assets/heart-filled.png" width="14"/>
};

export default function MainPage() {
    const items = Array.apply(null, Array(VIDEOS_AMOUNT)).map(function (x, i) { return i; })

    const [year, setYear] = useState(null);
    const [relation, setRelation] = useState(null);
    const [events, setEvent] = useState(null);

    const [langs, setLang] = useState([]);
    const [foods, setFood] = useState([]);
    const [subjects, setSubject] = useState([]);
    const [emotions, setEmotions] = useState([]);
    const [objects, setObject] = useState([]);

    const [currentVideoIdx, setCurrentVideoIdx] = useState(null);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [previewVideo, setPreviewVideo] = useState(null);

    const [shouldShowDesc, setShouldShowDesc] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const shouldFilter = year !== null || relation !== null || events !== null || !_.isEmpty(langs)
        || !_.isEmpty(foods) || !_.isEmpty(subjects) || !_.isEmpty(emotions) || !_.isEmpty(objects);

    const filters = {year, events, langs, subjects, relation, emotions, foods, objects}

    const handleEventFilter = (event) => {
        if (_.includes(events, event)) {
            setEvent(null)
        } else {
            setEvent(event)
        }
    }
    const handleEmotionFilter = (emotion) => {
        if (_.includes(emotions, emotion)) {
            setEmotions([
                ...emotions.filter(v => v !== emotion)
            ])
        } else {
            setEmotions([
                ...emotions,
                emotion
            ])
        }
    }
    const handleObjectFilter = (object) => {
        if (_.includes(objects, object)) {
            setObject([
                ...objects.filter(v => v !== object)
            ])
        } else {
            setObject([
                ...objects,
                object
            ])
        }
    }
    const handleSubjectFilter = (subject) => {
        if (_.includes(subjects, subject)) {
            setSubject([
                ...subjects.filter(v => v !== subject)
            ])
        } else {
            setSubject([
                ...subjects,
                subject
            ])
        }
    }
    const handleLangFilter = (lang) => {
        if (_.includes(langs, lang)) {
            setLang([
                ...langs.filter(v => v !== lang)
            ])
        } else {
            setLang([
                ...langs,
                lang
            ])
        }
    }
    const handleFoodFilter = (food) => {
        if (_.includes(foods, food)) {
            setFood([
                ...foods.filter(v => v !== food)
            ])
        } else {
            setFood([
                ...foods,
                food
            ])
        }
    }

    const filteredVideos = shouldFilter ? filterVideos(videosStubData, filters) : filterVideos(videosStubData, filters, true)

    const wrapperClassname = currentVideo !== null ? 'bg-white' : 'bg-beige'
    const gridClassNames = currentVideo === null ? '' : 'tiny'

    const handlePreviousVideo = () => {
        if (currentVideoIdx === 0) {
            setCurrentVideo(filteredVideos[filteredVideos.length - 1])
            setCurrentVideoIdx(filteredVideos.length - 1)
        } else {
            setCurrentVideo(filteredVideos[currentVideoIdx - 1])
            setCurrentVideoIdx(currentVideoIdx - 1)
        }
    }
    const handleNextVideo = () => {
        if (currentVideoIdx < filteredVideos.length - 1) {
            setCurrentVideo(filteredVideos[currentVideoIdx + 1])
            setCurrentVideoIdx(currentVideoIdx + 1)
        } else {
            setCurrentVideo(filteredVideos[0])
            setCurrentVideoIdx(0)
        }
    }

    const tinyGridClick = () => {

        if (currentVideo) {
            const vidMainWrap = document.querySelector('#video-main-wrapper')
            vidMainWrap && vidMainWrap.classList.remove('wide')

            setTimeout(() => {
                setCurrentVideo(null)
                setCurrentVideoIdx(null)
            }, 100)
        }
    }

    const handleMouseEnter = (videoIdx) => {
        setShouldShowDesc(false)
        setPreviewVideo(filteredVideos[videoIdx])

        setTimeout(() => {
            const vidCont = document.querySelector('#preview-video')
            const vidElm = vidCont && vidCont.children && vidCont.children[0];

            if (vidElm) {
                vidElm.muted = true
                vidElm.play()
            }
        }, 500)
    }
    const handleMouseLeave = () => {
        setPreviewVideo(null)
    }

    return (
        <>
            <Wrapper className={wrapperClassname} style={currentVideo ? { height: '20vh' } : { height: '80vh' }}>

                <GridLayout className={gridClassNames} onClick={tinyGridClick} darkMode={darkMode} id="videos-grid">
                    {items.map((x) => {

                        if (filteredVideos[x] && filteredVideos[x].isVisible) {
                            const { videoFileName } = filteredVideos[x]
                            const videoPath = hostingPath(videoFileName)

                            return (
                                <VideoObject className="videos-wrapper" key={x}
                                    isSelected={currentVideoIdx === x}
                                    onMouseEnter={()=>handleMouseEnter(x)}
                                    onMouseLeave={()=>handleMouseLeave(x)}
                                    onClick={() => { if(currentVideo)return; setCurrentVideoIdx(x); setCurrentVideo(filteredVideos[x]) }}>
                                    <div>
                                        <div className="inner">
                                            {!currentVideo &&
                                            <video controls={false} width="100%" height="100%" autoPlay={filteredVideos[x].isAutoPlay} muted>
                                                <source src={videoPath} type="video/mp4"/>
                                            </video>}
                                        </div>
                                    </div>
                                </VideoObject>
                            )
                        }

                        return (
                            <VideoPlaceholder className="videos-wrapper" key={x}><div/></VideoPlaceholder>
                        )
                    })}

                    <div className="arrow-sign"/>

                </GridLayout>

                {currentVideo &&
                    <VideoHeader darkMode={darkMode}>
                        <Logo className="float-right" onClick={()=>window.location.href = '/'}/>
                        <div className="title">{currentVideo.videoName}</div>
                    </VideoHeader>
                }

                {!currentVideo && <SidePanel isBgAlt={!shouldShowDesc}>
                    <Logo/>

                    {_.isEmpty(currentVideo) && shouldShowDesc
                        ? <DescPar dangerouslySetInnerHTML={{ __html: APP_SIDEPANEL_TEXT }}/>
                        : <DescPar title>
                            <VideoTitle>
                                {_.get(previewVideo, 'videoName')}
                            </VideoTitle>
                        </DescPar>
                    }
                </SidePanel>}

            </Wrapper>

            <div className="flex" style={currentVideo ? { height: '80vh' } : { height: '20vh' }}>
                {!currentVideo && <BottomPanel>

                    <Filters>
                        <Filter>
                            <div style={{ position: 'relative', width: '100%' }}>
                                <YearSlider defaultValue={START_YEAR} min={START_YEAR} step={1} max={END_YEAR} onChange={setYear} graduated />
                                <div className="year-slider-labels">
                                    <span>{START_YEAR}</span>
                                    <span>{END_YEAR}</span>
                                </div>
                            </div>
                            <label>שנה</label>
                        </Filter>

                        <Filter className="langs">

                            <ToggleBtn name="Español" onClick={handleLangFilter} current={langs} icon="espanol" handle="espanol"/>
                            <ToggleBtn name="Proski" onClick={handleLangFilter} current={langs} icon="ruski" handle="ruski"/>
                            <ToggleBtn name="English" onClick={handleLangFilter} current={langs} icon="english" handle="english"/>
                            <ToggleBtn name="עברית" onClick={handleLangFilter} current={langs} icon="hebrew" handle="hebrew"/>

                            <label>שפה</label>
                        </Filter>

                        <Filter>
                            <Slider min={1} max={3} defaultValue={1} marks={relationSliderMarks} onChange={setRelation}/>
                            <label>קרבה</label>
                        </Filter>

                        <Filter>
                            <ToggleBtn name="alcohol" onClick={handleFoodFilter} current={foods} icon="alcohol"/>
                            <ToggleBtn name="dessert" onClick={handleFoodFilter} current={foods} icon="dessert"/>
                            <ToggleBtn name="mizrahi" onClick={handleFoodFilter} current={foods} icon="mizrahi"/>
                            <ToggleBtn name="ashkenazi" onClick={handleFoodFilter} current={foods} icon="ashkenazi"/>
                            <ToggleBtn name="bread" onClick={handleFoodFilter} current={foods} icon="bread"/>
                            <label>אוכל ושתיה</label>
                        </Filter>

                    </Filters>

                    <Filters bottom>
                        <Filter noBorder>
                            <ToggleBtn name="other" onClick={handleEventFilter} current={events} icon="other"/>
                            <ToggleBtn name="friday" onClick={handleEventFilter} current={events} icon="friday"/>
                            <ToggleBtn name="holiday" onClick={handleEventFilter} current={events} icon="holiday"/>
                            <ToggleBtn name="bbq" onClick={handleEventFilter} current={events} icon="bbq"/>
                            <ToggleBtn name="bday" onClick={handleEventFilter} current={events} icon="bday"/>
                            <label>אירוע</label>
                        </Filter>

                        <Filter noBorder>
                            <ToggleBtn name="photography" onClick={handleSubjectFilter} current={subjects} icon="photography"/>
                            <ToggleBtn name="politiks" onClick={handleSubjectFilter} current={subjects} icon="politiks"/>
                            <ToggleBtn name="text" onClick={handleSubjectFilter} current={subjects} icon="text"/>
                            <ToggleBtn name="food" onClick={handleSubjectFilter} current={subjects} icon="food"/>
                            <ToggleBtn name="memory" onClick={handleSubjectFilter} current={subjects} icon="memory"/>
                            <label>נושא שיחה</label>
                        </Filter>

                        <Filter noBorder>
                            <ToggleBtn name="calm" onClick={handleEmotionFilter} current={emotions} icon="calm"/>
                            <ToggleBtn name="laugh" onClick={handleEmotionFilter} current={emotions} icon="laugh"/>
                            <ToggleBtn name="embarrassment" onClick={handleEmotionFilter} current={emotions} icon="embarrassment"/>
                            <ToggleBtn name="anger" onClick={handleEmotionFilter} current={emotions} icon="anger"/>
                            <ToggleBtn name="happy" onClick={handleEmotionFilter} current={emotions} icon="happy"/>
                            <label>רגש</label>
                        </Filter>

                        <Filter noBorder>
                            <ToggleBtn name="communication" onClick={handleObjectFilter} current={objects} icon="communication"/>
                            <ToggleBtn name="light" onClick={handleObjectFilter} current={objects} icon="light"/>
                            <ToggleBtn name="art" onClick={handleObjectFilter} current={objects} icon="art"/>
                            <ToggleBtn name="tools" onClick={handleObjectFilter} current={objects} icon="tools"/>
                            <ToggleBtn name="chairs" onClick={handleObjectFilter} current={objects} icon="chairs"/>
                            <label>אוביקטים</label>
                        </Filter>
                    </Filters>

                </BottomPanel>}

                <VideoPlayer currentVideo={currentVideo}
                    previewVideo={previewVideo}
                    previousVideo={handlePreviousVideo}
                    nextVideo={handleNextVideo} filters={filters}
                    darkMode={darkMode} setDarkMode={setDarkMode}
                    />
            </div>
        </>
    )
}
