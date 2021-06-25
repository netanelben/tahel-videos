import _ from 'lodash';

const trimThisTerribleString = (string = "") => {
    const splitted = string.split(',')
    const perfectArray = splitted.map(arr => arr.split('-')[0].trim())
    return perfectArray;
}

const isInArray = (items = [], arr = []) => {
    if (arr.length > 1) {
        return _.isEqual(items, arr)
    } else {
        return _.some(_.map(items, (item) => arr.includes(item)))
    }
}

export const filterVideos = (videos, filters, all = false) => {
    if (all) {
        return videos.map(video => ({
            ...video,
            isVisible: true
        }))
    }

    let filterFuncs = {};

    if (filters.year)     filterFuncs['year'] = year => year == filters.year
    if (filters.relation) filterFuncs['relation'] = relation => relation == filters.relation
    if (filters.events)   filterFuncs['event'] = event => event == filters.events

    if (!_.isEmpty(filters.emotions)) filterFuncs['emotions'] = emotions => isInArray(trimThisTerribleString(emotions), filters.emotions)
    if (!_.isEmpty(filters.subjects)) filterFuncs['subjects'] = subjects => isInArray(trimThisTerribleString(subjects), filters.subjects)
    if (!_.isEmpty(filters.objects))  filterFuncs['objects'] = objects => isInArray(trimThisTerribleString(objects), filters.objects)
    if (!_.isEmpty(filters.foods))    filterFuncs['foodAndDrink'] = foods => isInArray(trimThisTerribleString(foods), filters.foods)
    if (!_.isEmpty(filters.langs))    filterFuncs['lang'] = lang => isInArray(trimThisTerribleString(lang), filters.langs)

    const filteredItems = filterArray(videos, filterFuncs)

    return _.map(videos, (video) => {

        if (_.findIndex(filteredItems, (fv) => fv.videoName == video.videoName) !== -1) {
            return ({
                ...video,
                isVisible: true
            })
        } else {
            return ({
                ...video,
                isVisible: false
            })
        }
    })
}

function filterArray(array, filters) {
    const filterKeys = Object.keys(filters);

    return array.filter(item => {
        return filterKeys.every(key => {
            if (typeof filters[key] !== 'function') return true;

            return filters[key](item[key]);
        });
    });
}

export const formatDuration = (s) => {
    var m = Math.floor(s / 60);
    m = (m >= 10) ? m : "0" + m;
    s = Math.floor(s % 60);
    s = (s >= 10) ? s : "0" + s;
    return m + ":" + s;
}

export const hostingPath = (videoFileName) =>
    `https://storage.googleapis.com/vidzthl.appspot.com/${videoFileName}.mp4`;
