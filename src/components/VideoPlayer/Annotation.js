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
    width: 5px;
    background-color: red;
    position: absolute;
    left: ${props => props.left && `${props.left}%`};

    .anot-icon {
        width: 30px;
        height: 30px;
        display: block;
        margin: -40px -12px;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
    }
`;

const convertTimestamp = (v, total) => (v * 100) / total;

export default function Annotation({ videoData, duration }) {
    const { emotions, objects, subjects } = videoData;
    const emotionList = emotions.split(',')
    const objectList = objects.split(',')
    const subjectList = subjects.split(',')

    const annotations = _.merge(
        emotionList,
        objectList,
        subjectList
    );

    return (
        <Wrapper>

            {annotations.map(emot => {
                const icon = emot.split('-')[0]
                const offset = convertTimestamp(emot.split('-')[1], duration)

                return (
                    <Anot left={offset}>
                        <div className={`anot-icon icn-${icon}`}/>
                    </Anot>
                )
            })}

        </Wrapper>
    )
}

// Percent | Time
// -----------------------
// 100     -> 5.32 (Total)
// X       -> 2.66  (Desire time)

// Example:
// X = (2.66 * 100) / 5.32
// X = 50;
