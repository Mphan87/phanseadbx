"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const { ensureLoggedIn } = require("../middleware/auth");


const Fish = require("../models/saltwaterfish");

const router = express.Router({ mergeParams: true });
const createswfish = require("../schemas/createswfish.json");



router.get("/", async function (req, res, next) {
  const q = req.query;
  const fishes = await Fish.findAll(q);
  return res.json({ fishes });

});


router.post("/" , async function (req, res, next) {

  try {
    const validator = jsonschema.validate(req.body, createswfish);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

  let swfish = await Fish.create(
    req.body.handle,
    req.body.name,
    req.body.taxonomy, 
    req.body.image, 
    req.body.reefsafe,
    req.body.description,
    req.body.maxsize,
    req.body.type);
    return res.status(201).json(swfish);

  } catch (err) {
    return next(err);
  }
});


// router.post("/", async function (req, res, next) {
//   try {
//     const validator = jsonschema.validate(req.body, createswfish);
//     if (!validator.valid) {
//       const errs = validator.errors.map(e => e.stack);
//       throw new BadRequestError(errs);
//     }

//     const fishcreate = await Fish.create(req.body);
//     return res.status(201).json({fishcreate});
//   } catch (err) {
//     return next(err);
//   }
// });


router.get("/:handle", async function (req, res, next) {
  try {
    const fish = await Fish.get(req.params.handle);
    return res.json({ fish });
  } catch (err) {
    return next(err);
  }
});


router.get("/type/:type", async function (req, res, next) {
  try {
    const fish = await Fish.gettype(req.params.type);
    return res.json({ fish });
  } catch (err) {
    return next(err);
  }
});


router.delete("/:handle", async function (req, res, next) {
  try {
    await Fish.remove(req.params.handle);
    return res.json({ deleted: req.params.handle });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
