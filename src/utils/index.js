import _ from 'lodash';

const testFilter = (array1 = [], array2 = "") => {
    // second array comes as string, with more irrelevant data;
    // gam ve gam!!
    const arr2 = array2.split(',')
    const arrSerlz = arr2.map(arr => arr.split('-')[0].trim())

    const isEqual = _.isEqual(array1, arrSerlz)
    const isContains = !!array1.filter(item => arrSerlz.includes(item)).length
    return isEqual || isContains
}

export const filterVideos = (videos, filters, all = false) => _.map(videos, (v) => {
    if (all) {
        return ({
            ...v,
            isVisible: true
        })
    }

    const {year, events, langs, subjects, relation, emotions, foods, objects} = filters

    if (
           v.year == year ||
           v.relation == relation ||
           _.isEqual(v.event, events) ||

           testFilter(langs, v.lang) ||
           testFilter(subjects, v.subjects) ||
           testFilter(emotions, v.emotions) ||
           testFilter(objects, v.objects) ||
           testFilter(foods, v.foodAndDrink)

    ) {
        return ({
            ...v,
            isVisible: true
        })
    } else {
        return v;
    }
})

export const formatDuration = (s) => {
    var m = Math.floor(s / 60);
    m = (m >= 10) ? m : "0" + m;
    s = Math.floor(s % 60);
    s = (s >= 10) ? s : "0" + s;
    return m + ":" + s;
}

export const hostingPath = (videoFileName) =>
    `https://storage.googleapis.com/vidzthl.appspot.com/${videoFileName}.mp4`;
