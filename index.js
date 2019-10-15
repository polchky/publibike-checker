const Koa = require('koa');
const axios = require('axios');

const app = new Koa();

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
        const stations = ctx.request.query;
        const names = Object.keys(stations);

        const promises = [];
        for (let i = 0; i < names.length; i += 1) {
            promises.push(getStationEBikes(stations[names[i]]));
        }
        const eBikes = await Promise.all(promises);
        let res = '';
        for (let i = 0; i < names.length; i += 1) {
            res += `${names[i]} : ${eBikes[i]}\n`;
        }
        ctx.body = res;

    } catch (err) {
        ctx.body = err;
    }
});

app.listen(3000);
