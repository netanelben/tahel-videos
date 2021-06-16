import _ from 'lodash';

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
           _.includes(langs, v.lang) ||

           v.relation == relation ||
           v.event == event ||
           _.includes(subjects, v.subjects) ||
           _.includes(emotions, v.emotions) ||
           _.includes(objects, v.objects) ||
           _.includes(foods, v.foodAndDrink)

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