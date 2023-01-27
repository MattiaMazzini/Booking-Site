module.exports = async function (request, h) {

    const id = request.params.id;

    const room = await request.mongo.db.collection('listingsAndReviews')
    .findOne({_id:id}, {projection:{name:1,summary:1,price:1,images:1}});
    
    return h.view('room', {
        item: room
    });
}