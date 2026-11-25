import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "FlowDesk API",
    description: "FlowDesk Backend API",
  },

  host: "localhost:5001",

  schemes: ["http"],

  basePath: "/api",
};

const outputFile = "./swagger-output.json";

const endpointsFiles = [
  "./src/app.ts",
];

swaggerAutogen()(outputFile, endpointsFiles, doc);