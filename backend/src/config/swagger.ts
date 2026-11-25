import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "FlowDesk API",
      version: "1.0.0",
      description: "FlowDesk Backend API",
    },
    servers: [
      {
        url: "http://localhost:5001/api",
      },
    ],
  },

  apis: [
    path.join(__dirname, "../modules/**/*.ts"),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

console.log(JSON.stringify(swaggerSpec, null, 2));

export default swaggerSpec;