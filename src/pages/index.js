import React, { useState } from 'react'
import styled from 'styled-components';
import Slider from 'rc-slider';
import ToggleBtn from '../components/ToggleBtn'
import { YEARS_MARKS } from '../config'

import 'rc-slider/assets/index.css';

const Wrapper = styled.div`
 background: #DEC9943D;
  height: 100%;
  display: flex;
  justify-content: space-around;
`;

const GridLayout = styled.div`
  display: flex;
  flex-wrap: wrap;
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
  display: flex;
  justify-content: space-between;
`;

const Filters = styled.div`
    flex: 1;
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    flex-direction: row-reverse;
    padding: 10px 20px;
`;

const Filter = styled.div`
    background-color: peachpuff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 330px;
  height: 100px;
  padding: 0 20px;
  flex: 1;
  text-align: right;
  border: 1px solid #000;

  label {
      margin-left: 30px;
  }
`;

const VideoPlayer = styled.div`
    background-color: white;
    width: 300px;
    flex: 0 0 300px;
    height: 213px;
`;

export default function MainPage() {
    const items = Array.apply(null, Array(13.5 * 8)).map(function (x, i) { return i; })
    
    const [lang, setLang] = useState(null);

    return (
        <>
            
            <Wrapper>

                <GridLayout>
                    {items.map(x => (
                        <VideoObject key={x}>x</VideoObject>
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
                        <Slider marks={YEARS_MARKS} step={null} />
                        <label>שנה</label>
                    </Filter>

                    <Filter>
                        <ToggleBtn name="English" onClick={setLang} lang={lang}/>
                        <ToggleBtn name="Proski" onClick={setLang} lang={lang}/>
                        <ToggleBtn name="עברית" onClick={setLang} lang={lang}/>
                        
                        <label>שפה</label>
                    </Filter>

                    <Filter>
                        <Slider min={0} max={10} defaultValue={0} />
                        <label>קרבה</label>
                    </Filter>

                    <Filter>
                        <ToggleBtn name="English"/>
                        <label>אוכל ושתייה</label>
                    </Filter>

                </Filters>

                <VideoPlayer/>

            </BottomPanel>

        </>
    )
}
