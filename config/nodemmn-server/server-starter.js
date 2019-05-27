
var express = require('express')

var config = require('../basic-config/env.config')
var utils = require('../basic-config/utils')

/**
 *
 * @type {{start: backendServer.start}}
 */
var backendServer = {
    start: function(opts) {
        opts = opts || {}

        var app = opts.app || express()

        app.all('/api/something', function(req, res) {
            res.send({hello: 'world'});
        })

        if (!opts.app) {
            app.listen(config.PORT, function (err) {
                if (err) {
                    utils.log(['error: 启动后端服务器出现错误', err, err.stack])
                    return;
                }

                utils.log(['info: 后端服务器启动成功, http://localhost:' + config.PORT]);
            });
        }
    }
}

module.exports = backendServer;
