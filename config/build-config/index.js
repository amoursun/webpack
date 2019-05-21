if (process.env.NODE_ENV === 'prod') {
    module.exports = require('./webpack.config.prod');
} else if (process.env.NODE_ENV === 'dev') {
    module.exports = require('./webpack.config.dev');
}
