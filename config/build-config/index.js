if (process.env.NODE_ENV === 'prod') {
    module.exports = require('./config.prod.server')({});
} else if (process.env.NODE_ENV === 'dev') {
    module.exports = require('./config.dev.server')({});
}