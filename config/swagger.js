// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Basic metadata for your API documentation
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "FarmBors API",
    version: "1.0.0",
    description: "API documentation for the Ecommerce Backend",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local server",
    },
  ],
  // Add the bearer authentication configuration
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT", // Optional: JWT specific formatting
      },
    },
  },
  // Apply bearerAuth globally (optional)
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Options for swagger-jsdoc - pointing to your route files with JSDoc comments
const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Adjust the path as needed to where your API routes are located
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
