import moment from "moment";

import getDb from "../services/db";

export async function insertWeather (weatherEvent) {
    const now = moment(weatherEvent.date).valueOf();
    const normalized = moment(now - (now % (1000 * 60 * 60 * 2)));

    const db = getDb();
    const params = [
        normalized.format(),
        getMeasurementFromType(weatherEvent, "weather-temperature"),
        getMeasurementFromType(weatherEvent, "weather-cloudeness"),
        getMeasurementFromType(weatherEvent, "weather-humidity"),
        weatherEvent.sensorId
    ];
    console.log(params);
    await db.query(
        "INSERT INTO weather (date, temperature, cloudeness, humidity, area) VALUES ($1, $2, $3, $4, $5)",
        ...params,
    );
}

function getMeasurementFromType(weatherEvent, measurementType) {
    const measurement = weatherEvent.measurements.find(x => x.type == measurementType);
    return parseInt(measurement.value);
}