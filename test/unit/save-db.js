import "babel-polyfill";

import {expect} from "chai";
import sinon from "sinon";

import getDb from "services/db";

import {insertWeather} from "steps/save-db";

describe("Save weather into DB", () => {

    const db = getDb();

    sinon.useFakeTimers();

    beforeEach(async () => {
        await db.query({
            text: "DELETE FROM weather"
        });
    });

    afterEach(async () => {
        await db.query({
            text: "DELETE FROM weather"
        });
    });

    it("Save Sondrio weatherEvent", async () => {
        const weatherEvent = {
            sensorId: "IT-sondrio",
            date: new Date(),
            measurements: [{
                type: "weather-cloudeness",
                value: 10,
                unitOfMeasurement: "%"
            }, {
                type: "weather-humidity",
                value: 15,
                unitOfMeasurement: "%"
            }, {
                type: "weather-temperature",
                value: 24,
                unitOfMeasurement: "°C"
            }, {
                type: "weather-id",
                value: 800,
                unitOfMeasurement: "id"
            }]
        };

        await insertWeather(weatherEvent);

        const sequence = await db.row("SELECT last_value FROM weather_id_seq");

        const result = await db.rows("SELECT * from weather");
        expect(result).to.deep.equal([{
            province_id: 91,
            cloudeness: 10,
            humidity: 15,
            id: parseInt(sequence.last_value),
            temperature: 24,
            date: new Date()
        }]);
    });
});