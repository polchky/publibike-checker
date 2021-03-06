const Koa = require('koa');
const axios = require('axios');
const fs = require('fs').promises;

const app = new Koa();
const url = 'https://api.publibike.ch/v1/public/stations/';

const getStationBikes = async (id, type, battery) => {
    let maxLevel = 0;
    let maxBike = null;
    const res = await axios.get(`${url}${id}`);
    let bikes = 0;
    for (let i = 0; i < res.data.vehicles.length; i += 1) {
        const bike = res.data.vehicles[i];
        if (type === undefined || bike.type.name === type) {
            bikes += 1;
            if (battery && bike.type.name === 'E-Bike' && bike.ebike_battery_level > maxLevel) {
                maxBike = bike.name;
                maxLevel = bike.ebike_battery_level;
            } 
        }
    }
    return { bikes, maxBike };
}

app.use(async (ctx) => {
    try {
        const type = ctx.request.query.type;
        delete ctx.request.query.type;

        let battery = ctx.request.query.battery;
        delete ctx.request.query.battery;
        if (battery === 'false') battery = false;

        const stations = ctx.request.query;
        const names = Object.keys(stations);

        const promises = [];
        for (let i = 0; i < names.length; i += 1) {
            promises.push(getStationBikes(stations[names[i]], type, battery));
        }
        const bikes = await Promise.all(promises);
        let res = '';
        for (let i = 0; i < names.length; i += 1) {
            res += `${names[i]} : ${bikes[i].bikes}\n`;
            if (battery) res += `${bikes[i].maxBike || '-'}\n`;
        }
        ctx.body = res;

    } catch (err) {
        ctx.body = 'error';
        const message = { error: err.stack, request: ctx.request };
        fs.writeFile('error.log', JSON.stringify(message, null, 2));
    }
});

app.listen(3000);
