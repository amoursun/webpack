/**
 * 系统变量配置
 */
var env = getEnv('NODE_ENV', 'dev');
var dev = /dev/i.test(env);
var https = getEnv('HTTPS', false);
var host = process.env.HOST ? getIpAddress() : 'localhost';
var port = parseInt(getEnv('PORT', 8088));
var prodPort = parseInt(getEnv('PRODPORT', 8118));

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
    VERSION: require('../../package').version,
    PROTOCOL: https ? 'https' : 'http',
    HTTPS: https,
    HOST: host,
    PORT: port,
    PRODPORT: prodPort,
    BASENAME: '', // BrowserRouter 的 basename
    SERVICE_IP: service_ip,
    ENV: env,
    DEV: dev,
    ROUTER: 'BrowserRouter', // react-router 采用的路由
    TARGET: getEnv('TARGET', 'dev'),
    HOT: getEnv('HOT', dev),
    INLINE: getEnv('INLINE', dev),
    PATH: {},
    ROOT: npath.join(__dirname, '../..')
};

config.CLIENT = `${config.PROTOCOL}://${config.HOST}:${config.PORT}/`;

// 源代码类路径
config.PATH.root = config.ROOT;
config.PATH.static = utils.p(config.ROOT + '/static/');
config.PATH.src = utils.p(config.ROOT + '/src/');
config.PATH.config = utils.p(config.ROOT + '/config/');
config.PATH.projectNodeModules = utils.p(config.ROOT + '/node_modules');
config.PATH.srcNodeModules = utils.p(config.PATH.src + '/node_modules');
config.PATH.extra = utils.p(config.PATH.src + '/extra');

config.PATH.dest = utils.p(config.ROOT + '/dest/');

// 构建编译webpackConfig路径
config.PATH.basicConfig = utils.p(config.PATH.config + '/basic-config/');
config.PATH.buildConfig = utils.p(config.PATH.config + '/build-config/');
config.PATH.dllConfig = utils.p(config.PATH.config + '/dll-config/');
config.PATH.templates = utils.p(config.PATH.config + '/templates/');
config.PATH.webpackConfig = utils.p(config.PATH.config + '/webpack-config/');

config.PATH.devEntries = utils.p(config.PATH.dest + '/dev-entries/');
config.PATH.prodEntries = utils.p(config.PATH.dest + '/prod-entries/');

// 构建输出路径
config.PATH.dllDev = utils.p(config.PATH.dest + '/dll-dev/');
config.PATH.dllProd = utils.p(config.PATH.dest + '/dll-prod/');
config.PATH.dev = utils.p(config.PATH.dest + '/dev/');
config.PATH.prod = utils.p(config.PATH.dest + '/prod/');
config.PATH.prodPages = utils.p(config.PATH.prod + '/pages/');
config.PATH.prodDll = utils.p(config.PATH.prod + '/dll/');
config.PATH.prodDist = utils.p(config.PATH.prod + '/dist/');
config.PATH.prodExtra = utils.p(config.PATH.prod + '/extra/');

// webpack 构建的 entry 注册表
config.entries = require('../webpack-config/entries.config')(config);

// backend 服务器
config.PATH.nodemonServer = utils.p(config.PATH.config + '/nodemon-server/');

// 确保所有文件夹都已经创建
for (var pathName in config.PATH) {
  utils.ensurePath(config.PATH[pathName]);
}

// outputConf(config); // 先注释,打印环境变量

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
