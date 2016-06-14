import chai, {expect} from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import {getEventFromObject} from "../mocks";
import {handler} from "index";
import getDb from "services/db";

describe("Save weather events on RDS", () => {

    const context = {
        succeed: sinon.spy(),
        fail: sinon.spy()
    };

    const db = getDb();

    sinon.useFakeTimers();

    before(async () => {
        await db.query({
            text: "DELETE FROM weather"
        });
    });

    after(async () => {
        await db.query({
            text: "DELETE FROM weather"
        });
    });

    afterEach(() => {
        context.succeed.reset();
        context.fail.reset();
    });

    it("Skip event [CASE 0]", async () => {
        const weatherEvent = {
            id: "eventId",
            data: {
                element: {
                    sensorId: "IT-sondrio",
                    date: new Date()
                },
                id: "weather-01"
            },
            type: "element inserted in collection readings"
        };
        await handler(getEventFromObject(weatherEvent), context);
        expect(context.succeed).to.have.been.callCount(1);
        expect(context.fail).to.have.been.callCount(0);

        const result = await db.rows("SELECT * from weather");
        expect(result.length).to.be.equal(0);
    });

    it("Skip event [CASE 1]", async () => {
        const weatherEvent = {
            id: "eventId",
            data: {
                element: {
                    sensorId: "IT-sondrio",
                    date: new Date(),
                    measurements: [{
                        type: "activeEnergy",
                        value: 10,
                        unitOfMeasurement: ""
                    }]
                },
                id: "weather-01"
            },
            type: "element inserted in collection readings"
        };
        await handler(getEventFromObject(weatherEvent), context);
        expect(context.succeed).to.have.been.callCount(1);
        expect(context.fail).to.have.been.callCount(0);

        const result = await db.rows("SELECT * from weather");
        expect(result.length).to.be.equal(0);
    });

    it("Save Sondrio weatherEvent e2e", async () => {
        const weatherEvent = {
            id: "eventId",
            data: {
                element: {
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
                },
                id: "weather-01"
            },
            type: "element inserted in collection readings"
        };
        await handler(getEventFromObject(weatherEvent), context);

        expect(context.succeed).to.have.been.callCount(1);
        expect(context.fail).to.have.been.callCount(0);

        const result = await db.rows("SELECT * from weather");
        expect(result.length).to.be.equal(1);
    });

});