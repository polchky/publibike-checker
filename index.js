const Koa = require('koa');
const axios = require('axios');
const fs = require('fs');
const moment = require('moment-timezone');

const app = new Koa();

const data = fs.readFileSync('stations.json');
const stations = JSON.parse(data);

const baseUrl = 'https://api.publibike.ch/v1/public/';
const eBikeId = 2;

const getStationEBikes = async (id) => {
    const res = await axios.get(`${baseUrl}stations/${id}`);
    let eBikes = 0;
    for (let i = 0; i < res.data.vehicles.length; i += 1) {
        if (res.data.vehicles[i].type.id === eBikeId) eBikes += 1;
    }
    return eBikes;
}

app.use(async (ctx) => {
    try {
        const promises = [];
        for (let i = 0; i < stations.length; i += 1) {
            promises.push(getStationEBikes(stations[i].id));
        }
        const eBikes = await Promise.all(promises);
        let res = '';
        for (let i = 0; i < stations.length; i += 1) {
            res += `${stations[i].name} : ${eBikes[i]}\n`;
        }
        const date = moment().tz('Europe/Zurich').format();

        res += date.slice(11, 19);
        ctx.body = res;

    } catch (err) {
        ctx.body = err;
    }
});

app.listen(3000);
