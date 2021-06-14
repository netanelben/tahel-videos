import React, { useState } from 'react'
import _ from 'lodash';
import styled from 'styled-components';
import Slider from 'rc-slider';
import { Slider as YearSlider } from 'rsuite';
import ToggleBtn from '../components/ToggleBtn'
import VideoPlayer from '../components/VideoPlayer'
import { APP_SIDEPANEL_TEXT, START_YEAR, END_YEAR, videosStubData } from '../config'

import 'rc-slider/assets/index.css';

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;

  &.bg-white {
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
    position: relative;
    z-index: 2;

    &.tiny {
        height: fit-content;
        width: 15%;
        transition: .400s ease-in-out all;
        cursor: pointer;
        background: #F7F2E6;
        overflow: hidden;
        justify-content: center;

        .videos-wrapper {
            background-color: #FFFFFF;
            width: 20px;
            height: 20px;
            flex: 1 0 20px;
            margin: 1px;
            flex-grow: 0;
        }
    }
`;

const VideoPlaceholder = styled.div`
    background-color: #ccc;
  width: 101px;
  height: 101px;
  flex: 1 0 101px;
  margin: 4px;
`;

const VideoObject = styled.div`
  background-color: #ccc;
  width: 101px;
  height: 101px;
  flex: 1 0 101px;
  margin: 4px;
  cursor: pointer;
`;

const SidePanel = styled.div`
  flex: 1 0 300px;
  padding: 20px;
  box-sizing: border-box;
`;

const Logo = styled.div`
    width: 100%;
    height: 300px;
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
    padding: 0 20px;
`;

const Filter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1px;
  height: 100px;
  padding: 0 20px;
  flex: 1;
  text-align: right;
  border-left: 1px solid #000;
    border-bottom: 1px solid #000;
    position: relative;

  &:last-of-type {
      border-left: 0;
  }

  label {
      margin-left: 30px;
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
    padding: 20px 0;
    direction: rtl;

    .title {
        font-size: 20px;
        margin: 10px 0;
    }

    .desc {
        max-width: 300px;
        font-size: 18px;
        line-height: 28px;
    }
`;

const marks = {
    0: <img src="./assets/heart.png" width="14"/>,
    10: <img src="./assets/heart-filled.png" width="14"/>
};

export default function MainPage() {
    const items = Array.apply(null, Array(12 * 7)).map(function (x, i) { return i; })
    
    const [year, setYear] = useState(START_YEAR);
    const [lang, setLang] = useState(null);
    const [relation, setRelation] = useState(0);
    const [food, setFood] = useState(null);
    const [event, manageEvents] = useState([]);
    
    const [emotions, setEmotions] = useState([]);
    
    const [currentVideo, setCurrentVideo] = useState(null);

    const setEvent = ({ target }) => {
        const { name } = target;
        console.log(name);
    }

    const handleFilter = (emotion) => {

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

    const filteredVideos = _.map(videosStubData, (v) => {
    if (v.relation === relation || v.year === year) {
            return ({
                ...v,
                isVisible: true
            })
        } else {
            return v;
        }
    })

    const wrapperClassname = currentVideo !== null ? 'bg-white' : 'bg-beige'
    const gridClassNames = currentVideo === null ? '' : 'tiny'

    return (
        <>
            
            <Wrapper className={wrapperClassname}>

                <GridLayout className={gridClassNames} onClick={ currentVideo ? () => setCurrentVideo(null) : null }>
                    {items.map((x) => {

                        if (filteredVideos[x] && filteredVideos[x].isVisible) {
                            const { videoFileName } = filteredVideos[x]
                            const videoPath = `./videos/${videoFileName}`
                            
                            return (
                                <VideoObject className="videos-wrapper" key={x} onClick={() => setCurrentVideo(filteredVideos[x])}>
                                    <video controls={false} width="100%" height="100%"
                                        onMouseEnter={({ target }) => target.play()}
                                        onMouseLeave={({ target }) => target.pause()}
                                        >
                                        <source src={videoPath} type="video/mp4"/>
                                    </video>
                                </VideoObject>
                            )
                        }

                        return (
                            <VideoPlaceholder className="videos-wrapper" key={x}/>
                        )
                    })}
                </GridLayout>

                {currentVideo && <VideoHeader>
                    
                    <Logo className="float-right"/>

                    <div className="flex-col">
                        <span className="title">{currentVideo.videoName}</span>
                        <span className="desc">{currentVideo.videoDesc}</span>
                    </div>

                    </VideoHeader>}
                        
                {!currentVideo && <SidePanel>
                    <Logo/>

                    {_.isEmpty(currentVideo) ? <DescPar>
                        {/* {APP_SIDEPANEL_TEXT} */}
                    </DescPar> : <>
                        <VideoTitle>
                            {currentVideo.videoName}
                        </VideoTitle>
                        <VideoDesc>
                            {currentVideo.videoDesc}
                        </VideoDesc>
                    </>}
                </SidePanel>}

            </Wrapper>
            
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

                    <Filter>
                        <ToggleBtn name="English" onClick={setLang} current={lang}/>
                        <ToggleBtn name="Proski" onClick={setLang} current={lang}/>
                        <ToggleBtn name="עברית" onClick={setLang} current={lang}/>
                        
                        <label>שפה</label>
                    </Filter>

                    <Filter>
                        <Slider min={0} max={10} defaultValue={0} marks={marks} onChange={setRelation}/>
                        <label>קרבה</label>
                    </Filter>

                    <Filter>
                        <ToggleBtn name="food1" onClick={setFood} current={food}/>
                        <ToggleBtn name="food2" onClick={setFood} current={food}/>
                        <ToggleBtn name="food3" onClick={setFood} current={food}/>
                        <label>אוכל ושתייה</label>
                    </Filter>

                </Filters>

                <Filters>
                    <Filter>
                        <ToggleBtn name="event1" onClick={setEvent} current={event}/>
                        <ToggleBtn name="event2" onClick={setEvent} current={event}/>
                        <ToggleBtn name="event3" onClick={setEvent} current={event}/>
                        <label>אירוע</label>
                    </Filter>

                    <Filter>
                        <ToggleBtn name="event1" onClick={setEvent} current={event}/>
                        <ToggleBtn name="event2" onClick={setEvent} current={event}/>
                        <ToggleBtn name="event3" onClick={setEvent} current={event}/>
                        <label>נושא שיחה</label>
                    </Filter>

                    <Filter>
                        <ToggleBtn name="calm" onClick={handleFilter} current={emotions} icon="calm"/>
                        <ToggleBtn name="happy" onClick={handleFilter} current={emotions} icon="happy"/>
                        <ToggleBtn name="shy" onClick={handleFilter} current={emotions} icon="shy"/>
                        <ToggleBtn name="anger" onClick={handleFilter} current={emotions} icon="anger"/>
                        <ToggleBtn name="laugh" onClick={handleFilter} current={emotions} icon="laugh"/>
                        <label>רגש</label>
                    </Filter>

                    <Filter>
                        <ToggleBtn name="event1" onClick={setEvent} current={event}/>
                        <ToggleBtn name="event2" onClick={setEvent} current={event}/>
                        <ToggleBtn name="event3" onClick={setEvent} current={event}/>
                        <label>אוביקטים</label>
                    </Filter>
                </Filters>

            </BottomPanel>}

            <VideoPlayer currentVideo={currentVideo}/>
        </>
    )
}
