import {insertWeather} from "steps/save-db";
import log from "services/logger";

export default async function pipeline(event) {
    log.info(event);
    const rawReading = event.data.element;
    /*
     *   Workaround: some events have been incorrectly generated and thus don't
     *   have an `element` property. When processing said events, just return and
     *   move on without failing, as failures can block the kinesis stream.
     */
    if (!rawReading &&
        !rawReading.sensorId &&
        !rawReading.measurements &&
        (
            rawReading.measurements == "weather-humidity" ||
            rawReading.measurements == "weather-cloudeness" ||
            rawReading.measurements == "weather-temperature" ||
            rawReading.measurements == "weather-id"
        )) {
        return null;
    }
    console.log(987654321);
    insertWeather(rawReading);

    return null;
}