/*
Author : Anurag Tiwari
promoRouter.js
*/

// Imported Modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Promotions = require('../models/promotions');
var authenticate = require('../authenticate');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

// Methods for http://localhost:3000/promotions/ API end point
promoRouter.route('/')
.get((req,res,next) => {
    Promotions.find({})
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.create(req.body)
    .then((promotion) => {
        console.log('Promtion Created ', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

// Methods for http://localhost:3000/promotions/:promoId API end point
promoRouter.route('/:promoId')
.get((req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then((promotion) => {
        if(promotion != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        }
        else {
            err = new Error('Promotion ' + req.params.promoId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, { new: true })
    .then((promotion) => {
        if(promotion != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        }
        else {
            err = new Error('Promotion ' + req.params.promoId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp) => {
        if(resp != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }
        else {
            err = new Error('Promotion ' + req.params.promoId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = promoRouter;