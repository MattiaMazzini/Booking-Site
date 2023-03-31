module.exports = async function (request, h) {

        const offset = Number(request.query.offset) || 0;
        const limit = Number(request.query.limit) || 10;

        const startTime = Date.now();
        const data = await request.server.methods.data(request.mongo.db, offset, limit);
        const endTime = Date.now();
        const rooms = data.value;

        //time to fetch from cache or generate from db
        const time = (endTime - startTime);

        //response view with params
        const res = h.view('rooms', {
            item: rooms,
            start: offset,
            stop: offset + limit,
            previous: (offset-limit > 0) || 0,
            limit: limit
        });

        //set Server-Timing header for testing purposes
        res.header('Server-Timing', 'db;dur=' + time);
    
        return res;

}