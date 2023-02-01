

exports.plugin = {
    pkg: require('./package.json'),
    register: async function (server, options) {

        //default route
        server.route({
            method: 'GET',
            path: '/',
            handler: async (request, h) => {

                const offset = Number(request.query.offset) || 0;
                const limit = Number(request.query.limit) || 10;

                const rooms = await server.methods.data(request.mongo.db, offset, limit);
            
                return h.view('rooms', {
                    item: rooms,
                    start: offset,
                    stop: offset + limit,
                    previous: (offset-limit > 0) || 0,
                    limit: limit
                });
            }
        });

        //CRUD operations
        //get all rooms
        server.route({
            method: 'GET',
            path: '/rooms',
            handler: require("./rooms.js")
        });

        //get a single room
        server.route({
            method: 'GET',
            path: '/rooms/{id}',
            handler: require('./room.js')
        });

        //search for a room
        server.route({
            method: 'GET',
            path: '/search',
            handler: require("./search.js")
        });

        server.route({
            method: 'GET',
            path: '/modifiers.css',
            handler: async (request, h) => {
                return h.file('./lib/templates/layout/modifiers.css');
            }
        });

         /* ALTRE OPERAZIONI DI CRUD

        //add room to db
        server.route({
            method: 'POST',
            path: '/rooms',
            handler: async (request, h) => {

                const payload = request.payload;

                const status = await request.mongo.db.collection('listingsAndReviews')
                .insertOne(payload);

                return status;
            }
        });

        //update a room
        server.route({
            method: 'PUT',
            path: '/rooms/{id}',
            handler: (request, h) => {

                return 'Update a single room';
            }
        });

        //delete a room from db
        server.route({
            method: 'DELETE',
            path: '/rooms/{id}',
            handler: (request, h) => {

                return 'Delete a room';
            }
        });
        */

    }
}