const Hapi = require("@hapi/hapi");
const Handlebars = require('handlebars');
const Vision = require("@hapi/vision");
const Mongo = require('hapi-mongodb');
const Inert = require('@hapi/inert');
const Path = require('path');

//plugin used to simplify backend structure
const Glue = require("@hapi/glue");

const manifest = {
    //server options
    server: {
        port:3000,
        host: 'localhost',
        //l'impostazione della cache modificata dal plugin glue
        cache: '@hapi/catbox-memory'
    },
    //plugin registration
    register: {
        plugins: [
            //hapi-mongodb plugin (necessary for db communication)
            {
                plugin: Mongo,
                options: {
                    url: 'mongodb+srv://mazzini2:C_1_c_c_1_o@cluster0.qneqpdk.mongodb.net/sample_airbnb?retryWrites=true&w=majority',
                    settings : {
                    useUnifiedTopology: true
                    },
                    decorate: true
                }
            },
            {plugin: Inert},
            //vision plugin (necessary for view rendering via handlebars)
            { plugin: Vision },
            //routes relative to rooms packed in a user made plugin
            { plugin: './rooms' }
        ]
    }
}

//options for glue plugin
const options = {
    relativeTo: __dirname + '/lib/modules',
    preRegister: async function (server) {

        const dbData = async function (db, offset, limit) {
            const rooms = await db.collection('listingsAndReviews').find({}).skip(offset).limit(limit).toArray();
            rooms.forEach( function(room) {
                room.price = room.price.toString();
            });

            return rooms;
        }

        server.method('data', dbData, {
            
                cache: {
                    segment: 'views', // name of the segment where were are storing values
                    expiresIn: 10 * 1000, // milliseconds
                    generateTimeout: 1000 * 30,
                    getDecoratedValue: true
                },
                generateKey: (db, offset, limit) => ''+offset+limit
                
            }
        );

    }
}


const startServer = async function () {
    try {
        const server = await Glue.compose(manifest, options);

         //definizione path delle view
         server.views({
            engines: { html: require('handlebars') },
            relativeTo: __dirname,
            path: './lib/templates',
            layout: true,
            layoutPath: './lib/templates/layout'
        });
        
        //definiziona path per i file
        await server.start();
        console.log('Server running at: ' + server.info.uri);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};

startServer();



/*

______________________ OLD CODE ______________________


const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    //mongoDB plugin registration
    await server.register({
        plugin: require('hapi-mongodb'),
        options: {
          url: 'mongodb+srv://mazzini2:C_1_c_c_1_o@cluster0.qneqpdk.mongodb.net/sample_airbnb?retryWrites=true&w=majority',
          settings : {
            useUnifiedTopology: true
          },
          decorate: true
        }
    });

    //ROUTES


    await server.start();
    console.log('Server running on port 3000');

}

init();

*/