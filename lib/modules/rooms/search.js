
module.exports = async function (request, h) {

    const offset = Number(request.query.offset) || 0;
    const query = request.query.term;

    const result = await request.mongo.db.collection("listingsAndReviews")
    .aggregate([
        {
            $search: {
                index: 'projectBnB',
                text: {
                    query: query,
                    path: {
                    'wildcard': '*'
                    }
                }
            }
        },
        {
            $skip: offset
        },
        {
            $limit: 10
        }
    ]).toArray();

    return h.view('rooms', {
        item: result,
        start: offset,
        stop: offset + result.length,
        previous: (offset-result.length > 0) || 0,
        term: query
    });
}