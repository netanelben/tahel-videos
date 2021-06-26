import React, { useEffect, useState } from 'react'
import _ from 'lodash';
import styled, {css} from 'styled-components';
import Slider from 'rc-slider';
import { Slider as YearSlider } from 'rsuite';
import ToggleBtn from '../components/ToggleBtn'
import VideoPlayer from '../components/VideoPlayer'
import { VIDEOS_AMOUNT, START_YEAR, END_YEAR, videosStubData,
    APP_SIDEPANEL_TEXT, PREVIEW_VID_WIDTH, VID_WIDTH, VID_HEIGHT, HAS_INTRO } from '../config'
import { filterVideos, hostingPath } from '../utils'
import IpadView from '../IpadView';

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
    /* transition: all 0ms ease 0ms; */

    &.tiny {
        width: 16%;
        height: 16vh;
        background: #F7F2E6;
        cursor: pointer;
        /* transition: all 2.6383ms ease 0ms !important;
        transform-origin: top left; */

        &:hover {
            outline: 1px solid #000;
        }

        .videos-wrapper {
            width: ${VID_WIDTH};
            flex: 0 0 ${VID_WIDTH};
            height: ${VID_HEIGHT};
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
                right: 0px;
                bottom: 0px;
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
    width: ${VID_WIDTH};
    flex: 0 0 ${VID_WIDTH};
    height: ${VID_HEIGHT};
`;

const VideoObject = styled.div`
    background-color: ${props => props.isSelected ? '#f7f2e6' : '#fff'};
    box-shadow: ${props => props.isSelected && 'inset 0px 0px 0px 2px #000'};
    width: ${VID_WIDTH};
    flex: 0 0 ${VID_WIDTH};
    height: ${VID_HEIGHT};
    cursor: pointer;

    &>div {
        height: 100%;
        width: 100%;
        padding: 4px;
        box-sizing: border-box;
    }

    video {
        display: ${props => props.isSelected && 'none'};
    }
`;

const SidePanel = styled.div`
    flex: 1 0 ${PREVIEW_VID_WIDTH};
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    background-color: ${props => props.isBgAlt ? '#F7F2E6' : '#fff'};

    &.bg-white {
        background-color: #fff;
    }
`;

const IntroLogo = styled.div`
    width: 250px;
    height: 150px;
    background-image: url('./assets/logo.png');
    background-repeat: no-repeat;
    background-position: right;
    background-size: contain;
    z-index: 22212312312;
    position: fixed;
    top: 0;
    right: 0;
    margin: 20px 30px;
`;

const Logo = styled.div`
    width: 100%;
    height: 150px;
    background-image: url('./assets/logo.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    cursor: pointer;
    position: absolute;
    top: 34px;
    right: 0;
    z-index: 1;

    &.float-right {
        float: right;
        width: 200px;
        height: 130px;
    }
`;

const DescPar = styled.p`
    text-align: right;
    font-size: 18px;
    line-height: 26px;
    direction: rtl;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 1;
    padding: ${props => props.title ? '28px 30px':'40px 40px'};
`;

const BottomPanel = styled.div`
    background: #F7F2E6;
    width: calc(100% - ${PREVIEW_VID_WIDTH});
    display: inline-block;
    position: absolute;
    bottom: 0;
    z-index: 1;
`;

const Filters = styled.div`
    flex: 1;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    flex-direction: row-reverse;
    position: relative;
    top: 5px;

    top: ${props => props.bottom && '4px'};
`;

const Filter = styled.div`
    height: 112px;

    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    padding: 0 19px 0 3px;
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

    &.langs {
        .icn {
            margin-top: 17px;
        }
    }
`;

const IconsFilter = styled.div`
    height: 112px;

    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    padding: 0 19px 0 3px;
    text-align: right;
    border-left: 1px solid #000;
    position: relative;
    overflow: hidden;
    border-bottom: ${props => !props.noBorder && '1px solid #000'};

    label {
        width: 25%;
        font-weight: 700;
        font-size: 18px;
        word-break: break-word;
        line-height: 115%;
    }

    .icons-filter-wrapper {
        padding-left: 10px;
        width: 75%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        left: -4px;

        &>div {
            width: 20%;
            flex: 1 0 20%;
        }
    }

    &:last-of-type {
        border-left: 0;
    }
`;

const LangsWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 0 10px;
    position: relative;
    top: 4px;

    &>div {
        width: 25%;
        flex: 1 0 25%;
    }
`;

const VideoTitle = styled.div`
    font-weight: bold;
    font-size: 24px;
    line-height: 30px;
    margin: 0;
`;

const VideoSubTitle = styled.div`
    font-size: 18px;
    line-height: 1;
    margin-top: 4px;
`;

const VideoHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    direction: rtl;
    padding: 0 20px;
    position: relative;
    width: 70%;
    opacity: ${props => props.darkMode && '0.1'};
    pointer-events: ${props => props.darkMode && 'none'};
    user-select: ${props => props.darkMode && 'none'};

    .desc {
        max-width: 300px;
        font-size: 18px;
        line-height: 28px;
    }
`;

const TitlesWrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    right: 370px;
    z-index: 1;

    ${props => props.single ?
        css`
            position: absolute;
            right: 368px;
            top: 67px;
            z-index: 1;
        `:css`
            position: absolute;
            right: 368px;
            top: 51px;
            z-index: 1;
        `
    }

    .title {
        font-weight: bold;
        font-size: 44px;
        line-height: 100%;
    }

    .sub-title {
        font-size: 22px;
        line-height: 100%;
        margin-top: 9px;
    }
`;

const SliderWrapper = styled.div`
    width: 100%;
    padding: 0 27px;
`;

export const relationSliderMarks = {
    1: <img src="./assets/heart.png" width="14"/>,
    3: <img src="./assets/heart-filled.png" width="14"/>
};

export default function MainPage({ isIpadView }) {
    const items = Array.apply(null, Array(VIDEOS_AMOUNT)).map(function (x, i) { return i; })

    const [appStage, setAppStage] = useState(HAS_INTRO);

    const [year, setYear] = useState(null);
    const [altYear, setAltYear] = useState(null);
    const [altRelation, setAltRelation] = useState(null);

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

    const resetFilters = () => {
        setYear(null)
        setRelation(null)
        setEvent(null)
        setLang([])
        setFood([])
        setSubject([])
        setEmotions([])
        setObject([])
    }

    const shouldFilter = year !== null || relation !== null || events !== null || !_.isEmpty(langs)
        || !_.isEmpty(foods) || !_.isEmpty(subjects) || !_.isEmpty(emotions) || !_.isEmpty(objects);

    const filters = {year, events, langs, subjects, relation, emotions, foods, objects}

    useEffect(() => {
        if (appStage !== 3) return;

        setTimeout(() => {
            const grid = document.querySelector('#videos-grid')
            if (grid) grid.style['pointerEvents'] = 'all'
        }, 1000)

    }, [appStage])

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
    const onlyFilteredVideos = _.filter(filteredVideos, (v => v.isVisible))

    const wrapperClassname = `appstage-${appStage}`
    const gridClassNames = currentVideo === null ? '' : 'tiny'

    const handlePreviousVideo = () => {
        if (currentVideoIdx === 0) {
            const vid = onlyFilteredVideos[onlyFilteredVideos.length - 1];
            setCurrentVideo(vid)
            setCurrentVideoIdx(onlyFilteredVideos.length - 1)
        } else {
            const vid = onlyFilteredVideos[currentVideoIdx - 1]
            setCurrentVideo(vid)
            setCurrentVideoIdx(currentVideoIdx - 1)
        }

    }
    const handleNextVideo = () => {
        if (currentVideoIdx < onlyFilteredVideos.length - 1) {
            const vid = onlyFilteredVideos[currentVideoIdx + 1];
            setCurrentVideo(vid)
            setCurrentVideoIdx(currentVideoIdx + 1)
        } else {
            setCurrentVideo(_.first(onlyFilteredVideos))
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
                setDarkMode(false)
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

        handlePreviewFilterToggle(videoIdx)

    }

    const handleMouseLeave = () => {
        setPreviewVideo(null)
        handlePreviewFilterOff()
    }

    const handleIntroClicks = () => {
        setAppStage(2)
        console.log(appStage);

        window.requestAnimationFrame(() => {
            setTimeout(()=>{
                setAppStage(1)
            },1000)
        })

        setTimeout(()=>{
            const styleElm = document.querySelector('#intro-animations');
            styleElm && styleElm.remove()
        },3000)
    }

    const handlePreviewFilterToggle = (videoIdx) => {
        const relation = _.get(filteredVideos[videoIdx], 'relation')
        const year = _.get(filteredVideos[videoIdx], 'year')
        const langs = _.get(filteredVideos[videoIdx], 'lang')
        const event = _.get(filteredVideos[videoIdx], 'event')
        const subjects = _.get(filteredVideos[videoIdx], 'subjects')
        const emotions = _.get(filteredVideos[videoIdx], 'emotions')
        const objects = _.get(filteredVideos[videoIdx], 'objects')
        const foodAndDrinks = _.get(filteredVideos[videoIdx], 'foodAndDrink')

        const serArray = (arr) => arr.map(i => i.split('-')[0].trim())

        const langArray = serArray(langs.split(','))
        const subjectArray = serArray(subjects.split(','))
        const emotionsArray = serArray(emotions.split(','))
        const objectsArray = serArray(objects.split(','))
        const foodArray = serArray(foodAndDrinks.split(','))

        const allFilters = [event, ...subjectArray, ...emotionsArray, ...objectsArray, ...langArray, ...foodArray]

        _.each(allFilters, (filterName) => {
            const filterElm = document.querySelector(`.icn-home-${filterName}`)
            filterElm && filterElm.classList.add('on')
        })

        const slider1 = document.querySelector('.rs-slider')
        const slider2 = document.querySelector('.rc-slider')

        slider1 && slider1.classList.add('on')
        slider2 && slider2.classList.add('on')

        setAltYear(Number(year))
        setAltRelation(Number(relation))

    }

    const handlePreviewFilterOff = () => {
        Array.from(document.querySelectorAll('div.icn.on:not(.filter-on)'))
            .map((item) => {
                item.classList.remove('on')
            })

        const slider1 = document.querySelector('.rs-slider')
        const slider2 = document.querySelector('.rc-slider')

        slider1 && slider1.classList.remove('on')
        slider2 && slider2.classList.remove('on')

        setAltYear(null)
        setAltRelation(null)
    }

    const resetYearSlider = (event) => {
        if (event.target.className.includes('slider')) return;
        setYear(null)
    }
    const resetRelationSlider = (event) => {
        if (event.target.className.includes('slider')) return;
        setRelation(null)
    }

    if (isIpadView) {
        return (
            <IpadView filteredVideos={filteredVideos} setCurrentVideo={setCurrentVideo}>
                <VideoPlayer currentVideo={currentVideo}
                    previewVideo={previewVideo}
                    previousVideo={handlePreviousVideo}
                    nextVideo={handleNextVideo} filters={filters}
                    isIpadView={isIpadView}
                    />
            </IpadView>
        );
    }

    const handleLogoClick = () => {
        setShouldShowDesc(true);
        tinyGridClick();
        resetFilters()
    }

    const videoSubTitleText = _.get(previewVideo, 'videoSubTitle');

    return (
        <>
            {appStage < 3 && <IntroLogo/>}
            <Wrapper onClick={handleIntroClicks}
                className={wrapperClassname} style={currentVideo ? { height: '20vh' } : { height: '80vh' }}>

                <GridLayout className={gridClassNames} onClick={tinyGridClick} darkMode={darkMode} id="videos-grid">
                    {items.map((x) => {

                        if (filteredVideos[x] && filteredVideos[x].isVisible) {
                            const { videoFileName } = filteredVideos[x]
                            const videoPath = hostingPath(videoFileName)

                            return (
                                <VideoObject className="videos-wrapper" key={x}
                                    isSelected={currentVideo && currentVideo.id === filteredVideos[x].id}
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
                        <Logo className="float-right"
                            onClick={handleLogoClick}/>

                        {currentVideo.videoSubTitle ?
                            <TitlesWrapper>
                                <div className="title">{currentVideo.videoName}</div>
                                <div className="sub-title">{currentVideo.videoSubTitle}</div>
                            </TitlesWrapper>
                            :
                            <TitlesWrapper single>
                                <div className="title">{currentVideo.videoName}</div>
                            </TitlesWrapper>}
                    </VideoHeader>
                }

                {!currentVideo && <SidePanel isBgAlt={shouldShowDesc}>
                    <Logo onClick={handleLogoClick}/>

                    {_.isEmpty(currentVideo) && shouldShowDesc
                        ? <DescPar dangerouslySetInnerHTML={{ __html: APP_SIDEPANEL_TEXT }}/>
                        : <DescPar title>
                            <VideoTitle>
                                {_.get(previewVideo, 'videoName')}
                            </VideoTitle>

                            {videoSubTitleText && <VideoSubTitle>
                                {videoSubTitleText}
                            </VideoSubTitle>}
                        </DescPar>
                    }
                </SidePanel>}

            </Wrapper>

            <div className="flex bg-beige" style={currentVideo ? { height: '84vh' } : { height: '16vh' }}>
                {!currentVideo && <BottomPanel>

                    <Filters>
                        <Filter onClick={resetYearSlider}>
                            <div style={{ position: 'relative', width: '100%', top: '4px', maxWidth: '75%', margin: 'auto' }}>

                                <YearSlider value={altYear || year}
                                    min={START_YEAR} className={year !== null ? 'on' : ''}
                                    step={1} max={END_YEAR} onChange={setYear}
                                    graduated/>

                                <div className="year-slider-labels">
                                    <span>{START_YEAR}</span>
                                    <span>{END_YEAR}</span>
                                </div>
                            </div>
                            <label>שנה</label>
                        </Filter>

                        <Filter className="langs">
                            <LangsWrapper>
                                <ToggleBtn name="Español" onClick={handleLangFilter} current={langs} icon="espanol" handle="espanol"/>
                                <ToggleBtn name="Proski" onClick={handleLangFilter} current={langs} icon="ruski" handle="ruski"/>
                                <ToggleBtn name="English" onClick={handleLangFilter} current={langs} icon="english" handle="english"/>
                                <ToggleBtn name="עברית" onClick={handleLangFilter} current={langs} icon="hebrew" handle="hebrew"/>
                            </LangsWrapper>
                            <label>שפה</label>
                        </Filter>

                        <Filter onClick={resetRelationSlider}>
                            <SliderWrapper>
                            <Slider
                                value={altRelation || relation || 1}
                                className={relation !== null ? 'on' : ''}
                                min={1} max={3}
                                marks={relationSliderMarks} onChange={setRelation}/>
                            </SliderWrapper>
                            <label>קרבה</label>
                        </Filter>

                        <IconsFilter>
                            <div className="icons-filter-wrapper">
                            <ToggleBtn name="alcohol" onClick={handleFoodFilter} current={foods} icon="alcohol"/>
                            <ToggleBtn name="dessert" onClick={handleFoodFilter} current={foods} icon="dessert"/>
                            <ToggleBtn name="mizrahi" onClick={handleFoodFilter} current={foods} icon="mizrahi"/>
                            <ToggleBtn name="ashkenazi" onClick={handleFoodFilter} current={foods} icon="ashkenazi"/>
                            <ToggleBtn name="bread" onClick={handleFoodFilter} current={foods} icon="bread"/>
                            </div>
                            <label>אוכל ושתיה</label>
                        </IconsFilter>

                    </Filters>

                    <Filters bottom>
                        <IconsFilter noBorder>
                            <div className="icons-filter-wrapper" className="icons-filter-wrapper" style={{ width: '85%' }}>
                            <ToggleBtn name="other" onClick={handleEventFilter} current={events} icon="other"/>
                            <ToggleBtn name="friday" onClick={handleEventFilter} current={events} icon="friday"/>
                            <ToggleBtn name="holiday" onClick={handleEventFilter} current={events} icon="holiday"/>
                            <ToggleBtn name="bbq" onClick={handleEventFilter} current={events} icon="bbq"/>
                            <ToggleBtn name="bday" onClick={handleEventFilter} current={events} icon="bday"/>
                            </div>
                            <label style={{ width: '15%' }}>אירוע</label>
                        </IconsFilter>

                        <IconsFilter noBorder>
                            <div className="icons-filter-wrapper" className="icons-filter-wrapper" style={{ width: '85%' }}>
                            <ToggleBtn name="photography" onClick={handleSubjectFilter} current={subjects} icon="photography"/>
                            <ToggleBtn name="politiks" onClick={handleSubjectFilter} current={subjects} icon="politiks"/>
                            <ToggleBtn name="text" onClick={handleSubjectFilter} current={subjects} icon="text"/>
                            <ToggleBtn name="food" onClick={handleSubjectFilter} current={subjects} icon="food"/>
                            <ToggleBtn name="memory" onClick={handleSubjectFilter} current={subjects} icon="memory"/>
                            </div>
                            <label style={{ width: '15%' }}>נושא שיחה</label>
                        </IconsFilter>

                        <IconsFilter noBorder>
                            <div className="icons-filter-wrapper" style={{ width: '85%' }}>
                            <ToggleBtn name="calm" onClick={handleEmotionFilter} current={emotions} icon="calm"/>
                            <ToggleBtn name="laugh" onClick={handleEmotionFilter} current={emotions} icon="laugh"/>
                            <ToggleBtn name="embarrassment" onClick={handleEmotionFilter} current={emotions} icon="embarrassment"/>
                            <ToggleBtn name="anger" onClick={handleEmotionFilter} current={emotions} icon="anger"/>
                            <ToggleBtn name="happy" onClick={handleEmotionFilter} current={emotions} icon="happy"/>
                            </div>
                            <label style={{ width: '15%' }}>רגש</label>
                        </IconsFilter>

                        <IconsFilter noBorder>
                            <div className="icons-filter-wrapper">
                                <ToggleBtn name="communication" onClick={handleObjectFilter} current={objects} icon="communication"/>
                                <ToggleBtn name="light" onClick={handleObjectFilter} current={objects} icon="light"/>
                                <ToggleBtn name="art" onClick={handleObjectFilter} current={objects} icon="art"/>
                                <ToggleBtn name="tools" onClick={handleObjectFilter} current={objects} icon="tools"/>
                                <ToggleBtn name="chairs" onClick={handleObjectFilter} current={objects} icon="chairs"/>
                            </div>
                            <label>אוביקטים</label>
                        </IconsFilter>
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
