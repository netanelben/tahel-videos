import React, { useState } from 'react'
import _ from 'lodash';
import styled from 'styled-components';
import Slider from 'rc-slider';
import ToggleBtn from '../components/ToggleBtn'
import VideoPlayer from '../components/VideoPlayer'
import { APP_SIDEPANEL_TEXT, YEARS_MARKS, videosStubData } from '../config'

import 'rc-slider/assets/index.css';

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-around;
`;

const GridLayout = styled.div`
    display: flex;
    flex-flow: row wrap;
    place-content: flex-start;
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
    width: 120px;
    height: 300px;
    margin: 20px;
    background-image: url('./assets/logo.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
`;

const DescPar = styled.p`
    text-align: right;
    font-size: 18px;
    line-height: 28px;
    padding: 20px;
    direction: rtl;
`;

const BottomPanel = styled.div`
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
  padding: 0 30px;
  flex: 1;
  text-align: right;
  border-left: 1px solid #000;
    border-bottom: 1px solid #000;

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

const marks = {
    0: <img src="./assets/heart.png" width="14"/>,
    10: <img src="./assets/heart-filled.png" width="14"/>
};

export default function MainPage() {
    const items = Array.apply(null, Array(12 * 7)).map(function (x, i) { return i; })
    
    const [year, setYear] = useState(null);
    const [lang, setLang] = useState(null);
    const [relation, setRelation] = useState(0);
    const [food, setFood] = useState(null);
    const [event, setEvent] = useState(null);
    
    const [currentVideo, setCurrentVideo] = useState(null);

    const filteredVideos = _.map(videosStubData, (v) => {
        if (v.relation === relation) {
            return ({
                ...v,
                isVisible: true
            })
        } else {
            return v;
        }
    })

    return (
        <>
            
            <Wrapper>

                <GridLayout>
                    {items.map((x) => {

                        if (filteredVideos[x] && filteredVideos[x].isVisible) {
                            const { videoFileName } = filteredVideos[x]
                            const videoPath = `./videos/${videoFileName}`
                            
                            return (
                                <VideoObject key={x} onClick={() => setCurrentVideo(filteredVideos[x])}>
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
                            <VideoPlaceholder key={x}/>
                        )
                    })}
                </GridLayout>
                        
                <SidePanel>
                    <Logo/>

                    {_.isEmpty(currentVideo) ? <DescPar>
                        {APP_SIDEPANEL_TEXT}
                    </DescPar> : <>
                        <VideoTitle>
                            {currentVideo.videoName}
                        </VideoTitle>
                        <VideoDesc>
                            {currentVideo.videoDesc}
                        </VideoDesc>
                    </>}

                </SidePanel>

            </Wrapper>
            
            <BottomPanel>
                <Filters>

                    <Filter>
                        <Slider marks={YEARS_MARKS} step={null} onChange={setYear}/>
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
                        <ToggleBtn name="event1" onClick={setEvent} current={event}/>
                        <ToggleBtn name="event2" onClick={setEvent} current={event}/>
                        <ToggleBtn name="event3" onClick={setEvent} current={event}/>
                        <label>רגש</label>
                    </Filter>

                    <Filter>
                        <ToggleBtn name="event1" onClick={setEvent} current={event}/>
                        <ToggleBtn name="event2" onClick={setEvent} current={event}/>
                        <ToggleBtn name="event3" onClick={setEvent} current={event}/>
                        <label>אוביקטים</label>
                    </Filter>


                </Filters>

            </BottomPanel>

            <VideoPlayer currentVideo={currentVideo}/>
        </>
    )
}
