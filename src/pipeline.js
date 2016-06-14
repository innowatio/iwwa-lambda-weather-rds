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

    if (!rawReading ||
        !rawReading.sensorId ||
        !rawReading.measurements ||
        !rawReading.measurements.find(x => x.type == "weather-humidity") ||
        !rawReading.measurements.find(x => x.type == "weather-cloudeness") ||
        !rawReading.measurements.find(x => x.type == "weather-temperature") ||
        !rawReading.measurements.find(x => x.type == "weather-id")
    ) {
        return null;
    }

    insertWeather(rawReading);
}