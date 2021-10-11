const httpProxy = require('http-proxy');

class StuzoProxy {
    
    constructor() {
     this.proxy = httpProxy.createProxyServer({});
     this.configureProxyBodyParser();
    }

    configureProxyBodyParser() {
        this.proxy.on('proxyReq', function(proxyReq, req, res, options) {
            if(req.body) {
              let bodyData = JSON.stringify(req.body);
              proxyReq.setHeader('Content-Type','application/json');
              proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
              proxyReq.write(bodyData);
            }
          });
    }

    proxyAddress(req, res) {
        this.proxy.web(req, res,{ target: 'http://localhost:4000/graphql'})
    }
}

module.exports = StuzoProxy;
