import React, { useState } from 'react'
import styled from 'styled-components';
import Slider from 'rc-slider';
import ToggleBtn from '../components/ToggleBtn'
import VideoPlayer from '../components/VideoPlayer'
import { YEARS_MARKS } from '../config'

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

const VideoObject = styled.div`
  background-color: blanchedalmond;
  width: 101px;
  height: 101px;
  flex: 1 0 101px;
  margin: 4px;
`;

const SidePanel = styled.div`
  flex: 1 0 300px;
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
    padding: 50px 43px;
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
    padding: 10px 20px;
`;

const Filter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 25%;
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

const marks = {
    0: <img src="./assets/heart.png" width="14"/>,
    10: <img src="./assets/heart-filled.png" width="14"/>
};

export default function MainPage() {
    const items = Array.apply(null, Array(20 * 2)).map(function (x, i) { return i; })
    
    const [year, setYear] = useState(null);
    const [lang, setLang] = useState(null);
    const [relation, setRelation] = useState(null);
    const [food, setFood] = useState(null);
    const [event, setEvent] = useState(null);

    return (
        <>
            
            <Wrapper>

                <GridLayout>
                    {items.map(x => (
                        <VideoObject key={x}>
                            
                        </VideoObject>
                    ))}
                </GridLayout>
                        
                <SidePanel>
                    <Logo/>
                    <DescPar>
                    תילארשיה הרבחה תא הגיצמה הירפס
                    תוחורא לש םייתיב ואדיו יטרס ךרד
                    .תויתחפשמ

                    ייחב הצוענ תילארשיה תואיצמה
                    .םוי-םויה
                    הפשו םיטרפ לש קוריפו תוננובתה
                    תויטילופ ,תויתרבח תונבהל םיאיבמ
                    תודוקנ לע ךתוח טבמו ,תויתוברתו
                    .ינושהו ןוימדה

                    לכ םינוטרסה תא תוארל רשפא
                    ,חוליפ יעצמא ךרד וא ,דרפנב דחא
                    טבמ תדוקנ ןתונ םהמ דחא לכ רשא
                    .תילארשיה הרבחה לע הנוש
                    </DescPar>
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

            <VideoPlayer/>
        </>
    )
}
