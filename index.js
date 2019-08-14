"use strict";

const Hapi = require("@hapi/hapi");
const Mongoose = require("mongoose");
const Joi = require("joi");

Mongoose.connect("mongodb://localhost/matrikulasi", { useNewUrlParser: true });

const ProfileModel = Mongoose.model("profile", {
  nama: String,
  nim: String,
  alamat: String,
  nomorTelp: String
});

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

  // 1 routes create profile
  server.route({
    method: "POST",
    path: "/profile",
    options: {
      validate: {
        payload: {
          nama: Joi.string().required(),
          nim: Joi.string().required(),
          alamat: Joi.string().required(),
          nomorTelp: Joi.string().required()
        },
        failAction: (request, h, error) => {
          return error.isJoi
            ? h.response(error.details[0]).takeover()
            : h.response(error).takeover();
        }
      }
    },
    handler: async (request, h) => {
      try {
        var profile = new ProfileModel(request.payload);
        var result = await profile.save();
        return h.response(result);
      } catch (error) {
        return h.response(error).code(500);
      }
    }
  });

  // 2 routes get all profile
  server.route({
    method: "GET",
    path: "/profile",
    handler: async (request, h) => {
      try {
        var profile = await ProfileModel.find().exec();
        return h.response(profile);
      } catch (error) {
        return h.response(error).code(500);
      }
    }
  });

  // 3 routes get one profile
  server.route({
    method: "GET",
    path: "/profile/{id}",
    handler: async (request, h) => {
      try {
        var profile = await ProfileModel.findById(request.params.id).exec();
        return h.response(profile);
      } catch (error) {
        return h.response(error).code(500);
      }
    }
  });

  // 4 routes update one profile
  server.route({
    method: "PUT",
    path: "/profile/{id}",
    options: {
      validate: {
        payload: {
          nama: Joi.string().optional(),
          nim: Joi.string().optional(),
          alamat: Joi.string().optional(),
          nomorTelp: Joi.string().optional()
        },
        failAction: (request, h, error) => {
          return error.isJoi
            ? h.response(error.details[0]).takeover()
            : h.response(error).takeover();
        }
      }
    },
    handler: async (request, h) => {
      try {
        var profile = await ProfileModel.findByIdAndUpdate(
          request.params.id,
          request.payload,
          { new: true }
        );
        return h.response(profile);
      } catch (error) {
        return h.response(error).code(500);
      }
    }
  });

  // 5 routes delete all profile
  server.route({
    method: "DELETE",
    path: "/profile",
    handler: async (request, h) => {
      try {
        var profile = await ProfileModel.deleteMany();
        return h.response(profile);
      } catch (error) {
        return h.response(error).code(500);
      }
    }
  });

  // 6 routes delete one profile
  server.route({
    method: "DELETE",
    path: "/profile/{id}",
    handler: async (request, h) => {
      try {
        var profile = await ProfileModel.findByIdAndDelete(request.params.id);
        return h.response(profile);
      } catch (error) {
        return h.response(error).code(500);
      }
    }
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
