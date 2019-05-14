/**
 * 系统变量配置
 */
const env = getEnv('NODE_ENV', 'dev');
const dev = /dev/i.test(env);
const https = getEnv('HTTPS', false);
const host = process.env.HOST ? getIpAddress() : 'localhost';
const port = parseInt(getEnv('PORT', 8088));

var npath = require('path');
var _ = require('lodash');
var utils = require('./utils');

let service_ip;
if (env.toLowerCase().indexOf('dev') > -1) {
    service_ip = 'localhost';
} else if (env.toLowerCase().indexOf('pro') > -1) {
    service_ip = 'localhost';
}

const config = {
    VERSION: require('../package').version,
    PROTOCOL: https ? 'https' : 'http',
    HTTPS: https,
    HOST: host,
    PORT: port,
    BASENAME: '', // BrowserRouter 的 basename
    SERVICE_IP: service_ip,
    ENV: env,
    DEV: dev,
    ROUTER: 'BrowserRouter', // react-router 采用的路由
    TARGET: getEnv('TARGET', 'dev'),
    HOT: getEnv('HOT', dev),
    INLINE: getEnv('INLINE', dev),
    PATH: {},
    ROOT: npath.join(__dirname, '..')
};

config.CLIENT = `${config.PROTOCOL}://${config.HOST}:${config.PORT}/`;

// 源代码类路径
config.PATH.root = config.ROOT;
config.PATH.src = utils.p(config.ROOT + '/src');
config.PATH.projectNodeModules = utils.p(config.ROOT + '/node_modules');
config.PATH.srcNodeModules = utils.p(config.PATH.src + '/node_modules');

// 构建输出路径
config.PATH.dest = utils.p(config.ROOT + '/dest/');
config.PATH.dll = utils.p(config.PATH.dest + '/dll/');
config.PATH.dev = utils.p(config.PATH.dest + '/dev/');
config.PATH.prod = utils.p(config.PATH.dest + '/prod/');


outputConf(config);

module.exports = config;

function getEnv(key, defaultValue) {
    return process.env[key.toUpperCase()] || process.env[key.toLowerCase()] || defaultValue;
}

function outputConf(conf) {
    const KEYS = Object.keys(conf);
    const MAX_LENGTH = Math.max(...KEYS.map(k => k.length)) + 2;

    console.log('\r\n\x1b[36m==================== 环境变量 ======================\x1b[0m');
    Object.keys(conf).forEach(k => {
        const color = conf[k] === true ? '\x1b[35m' : '';
    const len = k.length;
    const prefix = len < MAX_LENGTH ? ' '.repeat(MAX_LENGTH - k.length) : '';
    console.log('%s%s: %j\x1b[0m', color, prefix + k, conf[k]);
});
    console.log('\x1b[36m===================================================\x1b[0m\r\n');
}

function getIpAddress() {
    const interfaces = require('os').networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}
