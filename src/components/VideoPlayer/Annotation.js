import React from 'react'
import _ from 'lodash'
import styled from 'styled-components';

const Wrapper = styled.div`
    width: 100%;
    position: absolute;
    top: 3px;
    left: 0;
`;

const Anot = styled.div`
    display: block;
    height: 30px;
    width: 3px;
    background-color: #fff;
    position: absolute;
    left: ${props => props.left && `${props.left}%`};
    cursor: pointer;

    .anot-icon {
        display: block;
        width: 80px;
        height: 80px;
        margin: -85px -37px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }
`;

const convertTimestamp = (time, duration) => (time * 100) / duration;

export default function Annotation({ videoData, duration, navigate }) {
    const { emotions, objects, subjects, foodAndDrink } = videoData;
    const emotionList = emotions ? emotions.split(',') : []
    const objectList = objects ? objects.split(',') : []
    const subjectList = subjects ? subjects.split(',') : []
    const foodAndDrinkList = foodAndDrink ? foodAndDrink.split(',') : []

    const annotations = _.compact([
        ...emotionList,
        ...objectList,
        ...subjectList,
        ...foodAndDrinkList
    ])

    return (
        <Wrapper>

            {annotations.map((emot, key) => {
                const icon = emot.split('-')[0].trim()
                const second = emot.split('-')[1]
                const offset = convertTimestamp(second, duration)

                return (
                    <Anot left={offset} key={key} onClick={() => navigate(second)}>
                        <div className={`anot-icon icn-timeline-${icon}`}/>
                    </Anot>
                )
            })}

        </Wrapper>
    )
}

// Percent | Time (Seconds)
// -----------------------
// 100     -> 45  (Total)
// X       -> 25  (Desire time)

// Example:
// X = (25 * 100) / 45
// X = 55.55;

// mizrahi-25    <-  25 seconds !
