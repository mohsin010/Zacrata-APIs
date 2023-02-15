const morgan = require('morgan')
const express = require('express')
const config = require('./config/config')
const cors = require('cors')
const mongoose = require('mongoose')
const moment = require('moment-timezone')
const constants = require('./config/constants');

module.exports = () => {
    let server = express(), create, start;

    create = function (config) {
        let routes = require('./routes');

        //Server Settings
        server.set('port', config.port);
        server.set('hostname', config.hostname);

        server.use(express.json());
        server.use(express.urlencoded({ extended: false }))
        
        server.use(morgan('dev'));

        //CORS Handling
        server.use(cors());

        //Accessing Directory for storage of uploads
        server.use('/public/uploads', express.static('public/uploads'));
        server.use('/images', express.static('images'));
        

        //Configuration for Routes
        server.use('/', routes);

        moment.tz.setDefault(constants.timeZone);

        server.use((req, res) => {
            res.status(404).json({error:'not found'});
        })

        server.set('view engine', 'ejs');

    }

    start = () => {
        let hostname = server.get('hostname');
        let port = server.get('port');

        server.on(('home'), (req, res) => {
            res.send('Welcome to Zancart');
        })

        var uri = config.server_database;

        const client = mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        mongoose.set('debug', true);

        mongoose.Promise = global.Promise;
        var db = mongoose.connection;

        db.on(('error'), console.error.bind(console, 'MongoDB connection Error'));
        db.once('open', async () => {
            console.log('DB is successfully connected');
            server.listen(port, () => {
                console.log('Database is connected successfully && server started at = ' + hostname + ':' + port);
            })
        })

        unhandledRoutes = () => {
            server.use((req, res, next) => {
                const error = new Error('No Routes defined for this Endpoint');
                error.status = 404;
                next(error);
            })

            //Response for Error
            server.use((error, req, res, next) => {
                res.status(error.status || 500)
            })
        }
    }
    return { create, start };
}