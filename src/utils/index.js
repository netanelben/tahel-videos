import _ from 'lodash';

const testFilter = (itemsA, itemsB) =>
    _.intersectionWith(itemsA, itemsB, (a, b) => b.trim().indexOf(a.trim()) !== -1).length > 0

export const filterVideos = (videos, filters, all = false) => _.map(videos, (v) => {
    if (all) {
        return ({
            ...v,
            isVisible: true
        })
    }

    const {year, event, langs, subjects, relation, emotions, foods, objects} = filters

    if (
           v.year == year ||
           testFilter(langs, v.lang.split(',')) ||

           v.relation == relation ||
           v.event == event ||

           testFilter(subjects, v.subjects.split(',')) ||
           testFilter(emotions, v.emotions.split(',')) ||
           testFilter(objects, v.objects.split(',')) ||
           testFilter(foods, v.foodAndDrink.split(','))

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
