const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Gourmandise API',
            version: '1.0.0',
            description: 'Documentation de l\'API Gourmandise',
        },
    },
    apis: ['./routes/**/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;