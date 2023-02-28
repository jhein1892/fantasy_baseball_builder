const https = require('https');
const fs = require('fs');

module.exports = function(app) {
  app.use(
    '/api',
    (req, res, next) => {
      res.setHeader('Content-Security-Policy', "script-src 'self'");
      next();
    },
    (req, res, next) => {
      const certOptions = {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem'),
      };
      https.createServer(certOptions, app).listen(3000, () => {
        console.log('HTTPS server running on port 3000');
        next();
      });
    }
  );
};
