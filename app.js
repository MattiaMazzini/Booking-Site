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
        host: 'localhost'
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
            { plugin: './modules/rooms' }
        ]
    }
}

//options for glue plugin
const options = {
    relativeTo: __dirname + '/lib'
}

const startServer = async function () {
    try {
        const server = await Glue.compose(manifest, options);
        //definizione path delle view
        server.views({
            engines: { html: Handlebars },
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