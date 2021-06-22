import _ from 'lodash';

const testFilter = (itemsA, itemsB) =>
    _.intersectionWith(
        itemsA, itemsB && itemsB.split(','),
            (a, b) => b.trim().indexOf(a.trim()) !== -1
    ).length > 0

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
           testFilter(langs, v.lang) ||

           v.relation == relation ||
           v.event == events ||

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
