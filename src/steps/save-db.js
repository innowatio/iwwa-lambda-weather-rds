import moment from "moment";

import log from "../services/logger";
import getDb from "../services/db";

export async function insertWeather (weatherEvent) {
    const now = moment(weatherEvent.date).valueOf();
    const normalized = moment(now - (now % (1000 * 60 * 60 * 2)));
    const area = weatherEvent.sensorId.split("-")[1];

    const db = getDb();
    const result = await db.row(
        "SELECT id FROM province WHERE LOWER(name) like $1",
        `${area}%`
    );

    const params = [
        normalized.format(),
        getMeasurementFromType(weatherEvent, "weather-temperature"),
        getMeasurementFromType(weatherEvent, "weather-cloudeness"),
        getMeasurementFromType(weatherEvent, "weather-humidity"),
        result.id
    ];
    log.info([...params, area], "insert-db");

    await db.query(
        "INSERT INTO weather (date, temperature, cloudeness, humidity, province_id) VALUES ($1, $2, $3, $4, $5)",
        ...params,
    );
}

function getMeasurementFromType(weatherEvent, measurementType) {
    const measurement = weatherEvent.measurements.find(x => x.type == measurementType);
    return parseInt(measurement.value);
}