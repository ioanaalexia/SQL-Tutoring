const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SQL-Two API',
            version: '1.0.0',
            description: 'API pentru aplicația SQL-Two',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
            },
        ],
    },
    apis: ['./routes/*.js'], // Specifică calea către fișierele tale de rute
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
