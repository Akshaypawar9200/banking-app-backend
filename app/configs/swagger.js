const options = {
  definition: {
    swagger: '2.0',
    info: {
      title: 'market-sizing-api',
      version: '0.0.0',
      description:
        'Market Sizing API on API Gateway with a Cloud Run backend',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'nexsales',
        url: 'https://nexsales.com',
        email: 'innovation@nexsales.com',
      },
    },
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        scheme: "bearer",
        bearerFormat: 'JWT',
        name: "authorization"
      },
    },
    basePath: '/api/v1',
  },
  apis: [
    './app/controllers/v1/**/*.js',
    './app/controllers/v1/**/**/*.js',
    './app/components/**/controllers/*.js',
    //  './apiDocsComponent/*.yaml'
  ],
};
/**
 * 
 * 
 * 
 * 
 * "schemes": [
    "https",
    "http"
  ],
  "x-google-backend": {
    "address": "https://backend-api-ymghawfbjq-uc.a.run.app/api/v1"
  }
 * 
 * 
 * 
 * 
*/
module.exports = options;
