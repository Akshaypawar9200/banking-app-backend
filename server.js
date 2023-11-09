require('dotenv').config();
const UUID = require('uuid');
const cors = require('cors');
const http = require('http');
const util = require('util');
const Multer = require('multer');
const helmet = require('helmet');
const { get } = require('lodash');
const express = require('express');
const errors = require('throw.js');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDocs = require('swagger-jsdoc');
const { StatusCodes } = require("http-status-codes")
const SettingsConfig = require('./app/configs/settings/settings-config');
const settingsConfig = new SettingsConfig();
const routeConfig = require('./app/configs/route-config');
require('dotenv').config()
var cookieParser = require('cookie-parser')

const {
    initLogger
} = require('./app/utils/logger');
//   console.log(get(settingsConfig, 'settings.logger.level', null))
const Logger = initLogger(get(settingsConfig, 'settings.logger.level', null));
const application = express();
function configureApplication(app) {
    const whitelist = [
        "http://localhost:3000",
        'http://localhost:20200',
    ];

    const corsOptions = {
        origin(origin, callback) {
            // A lack of Origin header means you're on the same origin as the current request.
            if (!origin || whitelist.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback('Bad Request');
            }
        },
        exposedHeaders: ['X-Total-Count'],
    };
    app.use(cors(corsOptions));
    app.use(cookieParser())
    
    app.use((req, res, next) => {
        res.set('Access-Control-Allow-Origin', '*'); // replace 3000 with your frontend port
        res.set(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept',
        );
        next();
    });
    app.use(express.json({ limit: '50mb', extended: true })); // support json encoded bodies
    app.use(
        express.urlencoded({
            extended: true,
        }),
    ); // support encoded bodies

    app.use((req, res, next) => {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        res.type('application/json');
        next();
    });
    app.use((req, res, next) => {
        req.id = UUID.v4();
        settingsConfig.logger = Logger.child({
            requestId: req.id
        });

        next();
    });

}
function configureErrorHandler(app) {
    app.use((req, res, next) => {
        next(new errors.NotFound(errorMessages.ERR_API_NOT_FOUND));
    });
    app.use((_err, req, res, _) => {
        const err = _err;
        const log = Logger.child({
            requestId: req.id
        });

        if (err) {
            log.error(
                '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Error for Request<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',
            );
            log.error(`requested API : ${req.url}`);
            log.error(`method : ${req.method}`);
            log.error('request body : ');
            log.error(
                util.inspect(req.body, {
                    showHidden: false,
                    depth: 2,
                    breakLength: Infinity,
                }),
            );
            log.error(`request Authorization  header:  ${req.get('Authorization')}`);
            log.error(
                '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Error stack<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',
            );
            log.error(err);
            log.error(
                '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>End of error<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',
            );

            const errorStatusCode = err.statusCode || err.status || StatusCodes.INTERNAL_SERVER_ERROR;
            const errorJson = {
                message: err.message
            }

            if (
                settingsConfig.settings.environment === 'local'
            ) {
                // deletes the stack if it is prod or beta environment.
                // As stack is just for local purpose.
                errorJson.stack = err.stack;
            }
            res.status(errorStatusCode).json(errorJson);
        }
    });
}

function configureRoutes(app) {
    routeConfig.registerRoutes(app, settingsConfig);
}
function startServer(app) {
    const log = Logger;
  
    const server = http.createServer(app);
  
    server.listen(settingsConfig.settings.thisNode.port, () => {
      log.info(
        'listening at http://%s:%s',
        settingsConfig.settings.thisNode.hostName,
        settingsConfig.settings.thisNode.port,
      );
    });
  }
  function configureWorker(app) {
    configureApplication(app);
    configureRoutes(app);
    configureErrorHandler(app);
    startServer(app);
  }
configureWorker(application);
