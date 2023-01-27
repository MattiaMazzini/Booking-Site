module.exports = async function (request, h) {

    const offset = Number(request.query.offset) || 0;
    const limit = Number(request.query.limit) || 10;

    const rooms = await request.mongo.db.collection('listingsAndReviews')
    .find({}).skip(offset).limit(limit).toArray();

    return h.view('rooms', {
        item: rooms,
        start: offset,
        stop: offset + limit,
        previous: (offset-limit > 0) || 0,
        limit: limit
    });
}