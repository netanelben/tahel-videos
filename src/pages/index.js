import React, { useState } from 'react'
import _ from 'lodash';
import styled from 'styled-components';
import Slider from 'rc-slider';
import { Slider as YearSlider } from 'rsuite';
import ToggleBtn from '../components/ToggleBtn'
import VideoPlayer from '../components/VideoPlayer'
import { VIDEOS_AMOUNT, START_YEAR, END_YEAR, videosStubData, APP_SIDEPANEL_TEXT } from '../config'
import { filterVideos } from '../utils'
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
    background: #DEC9943D;
  }
`;

const GridLayout = styled.div`
    display: flex;
    flex-flow: row wrap;
    place-content: flex-start;

    /* display: grid;
    grid-gap: 4px;
    grid-template-columns: repeat(12, 0fr);
    grid-template-rows: repeat(auto-fit, auto-fit);
    width: 100%; */

    position: relative;
    z-index: 2;
    overflow: hidden;

    &.tiny {
        width: 20%;
        height: 100%;
        min-height: 100%;
        transition: .400s ease-in-out all;
        background: #F7F2E6;
        /* justify-content: center; */
        cursor: pointer;

        .videos-wrapper {
            width: 20px;
            height: 20px;
            flex: 1 0 20px;
            flex-grow: 0;
            margin: 1px;

            video {
                visibility: hidden;
            }
        }

        .plus-sign {
            display: block;
        }

        &:hover {
            outline: 1px solid #fff;

            .plus-sign {
                display: none;
            }
            .arrow-sign {
                display: block;
            }
        }
    }
`;

const VideoPlaceholder = styled.div`
    width: 7.14285714286%;
    height: 14.2857142857%;
    flex: 0 0 7.14285714286%;
    /* margin: 4px; */
`;

const VideoObject = styled.div`
    background-color: ${props => props.isSelected ? '#f7f2e6' : '#fff'};
    outline: ${props => props.isSelected && '1px solid #000'};
    width: 7.14285714286%;
    height: 14.2857142857%;
    flex: 0 0 7.14285714286%;
    /* margin: 4px; */
    cursor: pointer;

    &>div {
        height: 100%;
        width: 100%;
        padding: 3px;
        box-sizing: border-box;
    }

    video {
        object-fit: cover;
        display: ${props => props.isSelected && 'none'};
    }
`;

const SidePanel = styled.div`
  flex: 1 0 300px;
  padding: 20px;
  box-sizing: border-box;
`;

const Logo = styled.div`
    width: 100%;
    height: 150px;
    background-image: url('./assets/logo.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;

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
    padding: 20px;
    direction: rtl;
`;

const BottomPanel = styled.div`
    background: #DEC9943D;
    width: calc(100% - 300px);
    display: inline-block;
`;

const Filters = styled.div`
    flex: 1;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    flex-direction: row-reverse;
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
    border-bottom: 1px solid #000;
    position: relative;
    overflow: hidden;

    &:last-of-type {
        border-left: 0;
    }

    label {
        margin-left: 6px;
        font-weight: 700;
        font-size: 20px;
    }

    &.langs {
        .icn  {
            background-position-y: 38px;
        }
    }
`;

const VideoTitle = styled.div`
    font-weight: bold;
    font-size: 22px;
    line-height: 36px;
    text-align: right;
    margin-bottom: 10px;
`;

const VideoDesc = styled.div`
    font-size: 18px;
    line-height: 28px;
    text-align: right;
    direction: rtl;
`;

const VideoHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    direction: rtl;
    padding: 0 20px;

    .title {
        font-weight: bold;
        font-size: 50px;
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
    const [event, setEvent] = useState(null);

    const [langs, setLang] = useState([]);
    const [foods, setFood] = useState([]);
    const [subjects, setSubject] = useState([]);
    const [emotions, setEmotions] = useState([]);
    const [objects, setObject] = useState([]);

    const [currentVideoIdx, setCurrentVideoIdx] = useState(null);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [previewVideo, setPreviewVideo] = useState(null);

    const shouldFilter = year !== null || relation !== null || event !== null || !_.isEmpty(langs || foods || subjects || emotions || objects);
    const filters = {year, event, langs, subjects, relation, emotions, foods, objects}

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
        setPreviewVideo(filteredVideos[videoIdx])

        try {
            setTimeout(() => {
                const vidCont = document.querySelector('#preview-video')
                vidCont && vidCont.children && vidCont.children[0].play()
            }, 500)
        } catch (error) {
            console.error(error);
        }
    }
    const handleMouseLeave = () => {
        setPreviewVideo(null)
    }

    return (
        <>
            <Wrapper className={wrapperClassname} style={currentVideo ? { height: '20vh' } : { height: '80vh' }}>

                <GridLayout className={gridClassNames} onClick={ tinyGridClick }>
                    {items.map((x) => {

                        if (filteredVideos[x] && filteredVideos[x].isVisible) {
                            const { videoFileName } = filteredVideos[x]
                            const videoPath = `./videos/${videoFileName}.mp4`

                            return (
                                <VideoObject className="videos-wrapper" key={x}
                                    isSelected={currentVideoIdx === x}
                                    onClick={() => { setCurrentVideoIdx(x); setCurrentVideo(filteredVideos[x]) }}>
                                    <div>
                                        <video controls={false} width="100%" height="100%"
                                            onMouseEnter={()=>handleMouseEnter(x)}
                                            onMouseLeave={()=>handleMouseLeave(x)}
                                            autoPlay={filteredVideos[x].isAutoPlay}
                                            >
                                            <source src={videoPath} type="video/mp4"/>
                                        </video>
                                    </div>
                                </VideoObject>
                            )
                        }

                        return (
                            <VideoPlaceholder className="videos-wrapper" key={x}/>
                        )
                    })}

                    {/* <div className="plus-sign"/> */}
                    <div className="arrow-sign"/>

                </GridLayout>

                {currentVideo &&
                    <VideoHeader>
                        <Logo className="float-right"/>
                        <div className="title">{currentVideo.videoName}</div>
                    </VideoHeader>
                }

                {!currentVideo && <SidePanel>
                    <Logo/>

                    {_.isEmpty(currentVideo)
                        ? <DescPar dangerouslySetInnerHTML={{ __html: APP_SIDEPANEL_TEXT }}/>
                        : <>
                            <VideoTitle>
                                {currentVideo.videoName}
                            </VideoTitle>
                            <VideoDesc>
                                {currentVideo.videoDesc}
                            </VideoDesc>
                    </>}
                </SidePanel>}

            </Wrapper>

            <div className="flex" style={currentVideo ? { height: '80vh' } : { height: '20vh' }}>
                {!currentVideo && <BottomPanel>

                    <Filters>
                        <Filter>
                            <YearSlider defaultValue={START_YEAR} min={START_YEAR} step={1} max={END_YEAR} onChange={setYear} graduated />
                            <div className="year-slider-labels">
                                <span>{START_YEAR}</span>
                                <span>{END_YEAR}</span>
                            </div>
                            <label>שנה</label>
                        </Filter>

                        <Filter className="langs">

                            <ToggleBtn name="Español" onClick={handleLangFilter} current={langs} icon="espanol" handle="espanol"/>
                            <ToggleBtn name="Proski" onClick={handleLangFilter} current={langs} icon="ruski" />
                            <ToggleBtn name="English" onClick={handleLangFilter} current={langs} icon="english" />
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

                    <Filters>
                        <Filter>
                            <ToggleBtn name="other" onClick={setEvent} current={event} icon="event-other"/>
                            <ToggleBtn name="friday" onClick={setEvent} current={event} icon="friday"/>
                            <ToggleBtn name="holiday" onClick={setEvent} current={event} icon="holiday"/>
                            <ToggleBtn name="bbq" onClick={setEvent} current={event} icon="bbq"/>
                            <ToggleBtn name="bday" onClick={setEvent} current={event} icon="bday"/>
                            <label>אירוע</label>
                        </Filter>

                        <Filter>
                            <ToggleBtn name="photography" onClick={handleSubjectFilter} current={subjects} icon="photography"/>
                            <ToggleBtn name="politiks" onClick={handleSubjectFilter} current={subjects} icon="politiks"/>
                            <ToggleBtn name="text" onClick={handleSubjectFilter} current={subjects} icon="text"/>
                            <ToggleBtn name="food" onClick={handleSubjectFilter} current={subjects} icon="food"/>
                            <ToggleBtn name="memory" onClick={handleSubjectFilter} current={subjects} icon="memory"/>
                            <label>נושא שיחה</label>
                        </Filter>

                        <Filter>
                            <ToggleBtn name="calm" onClick={handleEmotionFilter} current={emotions} icon="calm"/>
                            <ToggleBtn name="laugh" onClick={handleEmotionFilter} current={emotions} icon="laugh"/>
                            <ToggleBtn name="embarasment" onClick={handleEmotionFilter} current={emotions} icon="embarasment"/>
                            <ToggleBtn name="anger" onClick={handleEmotionFilter} current={emotions} icon="anger"/>
                            <ToggleBtn name="happy" onClick={handleEmotionFilter} current={emotions} icon="happy"/>
                            <label>רגש</label>
                        </Filter>

                        <Filter>
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
                    handlePreviousVideo={handlePreviousVideo}
                    nextVideo={handleNextVideo} filters={filters}/>
            </div>
        </>
    )
}
