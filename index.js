const Koa = require('koa');
const axios = require('axios');

const app = new Koa();

const url = 'https://api.publibike.ch/v1/public/stations/';
const eBikeId = 2;

const getStationBikes = async (id, type) => {
    const res = await axios.get(`${url}${id}`);
    if (type === 'all') return res.data.vehicles.length;
    let bikes = 0;
    for (let i = 0; i < res.data.vehicles.length; i += 1) {
        if (res.data.vehicles[i].type.name === type) bikes += 1;
    }
    return bikes;
}

app.use(async (ctx) => {
    try {
        const type = ctx.request.query.type;
        delete ctx.request.query.type;

        const stations = ctx.request.query;
        const names = Object.keys(stations);

        const promises = [];
        for (let i = 0; i < names.length; i += 1) {
            promises.push(getStationBikes(stations[names[i]], type));
        }
        const bikes = await Promise.all(promises);
        let res = '';
        for (let i = 0; i < names.length; i += 1) {
            res += `${names[i]} : ${bikes[i]}\n`;
        }
        ctx.body = res;

    } catch (err) {
        ctx.body = err;
    }
});

app.listen(3000);
