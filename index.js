"use strict";

const Hapi = require("@hapi/hapi");
const Mongoose = require("mongoose");
const Joi = require("joi");

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost"
  });
  // routes hello wolrd
  server.route({
    method: "GET",
    path: "/",
    handler: (req, h) => {
      return "hello world";
    }
  });

  // routes profile

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
