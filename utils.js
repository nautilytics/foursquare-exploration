const rp = require("request-promise");

module.exports.createTag = async (url, token, tag) => {
    return await rp({
        method: 'PUT',
        uri: `${url}/route/tags/${tag}`,
        body: {
            active: true,
        },
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${token}`
        },
        json: true
    });
}

module.exports.addFeature = async (url, token, feature) => {
    return await rp({
        method: 'POST',
        uri: `${url}/route/features`,
        body: {
            ...feature,
        },
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${token}`
        },
        json: true
    })
}

module.exports.getFeatures = async (url, token, tag) => {
    return await rp({
        method: 'GET',
        uri: `${url}/route/${tag}/features`,
        qs: {onlyActive: true},
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${token}`
        },
        json: true
    })
}

module.exports.getFeature = (venue, tag) => {
    const {name, geocodes} = venue;
    const {latitude, longitude} = geocodes?.main;
    return {
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: [
                [Number(longitude), Number(latitude)],
                [Number(longitude), Number(latitude)],
            ]
        },
        properties: {
            dataset: 'route',
            status: 'ACTIVE',
            tags: [tag],
            name
        }
    }
}

module.exports.getFeatureForPortal = (venue) => {
    const {name, geocodes} = venue;
    const {latitude, longitude} = geocodes?.main;
    return {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [
                Number(longitude),
                Number(latitude),
            ]
        },
        properties: {
            name
        }
    }
}

module.exports.getFeatureFromRouteTag = (feature) => {
    let geometry = {
        type: 'Point',
        coordinates: [
            feature.geometry.coordinates[0][0],
            feature.geometry.coordinates[0][1],
        ]
    };
    const {name} = feature.properties;
    return {
        geometry,
        properties: {
            name
        },
        type: "Feature"
    };
}
