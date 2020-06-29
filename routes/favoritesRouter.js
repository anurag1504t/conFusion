/*
Author : Anurag Tiwari
favoritesRouter.js
*/

// Imported Modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');

const Favorites = require('../models/favorite');
var authenticate = require('../authenticate');

const favoritesRouter = express.Router();

favoritesRouter.use(bodyParser.json());

// Methods for http://localhost:3000/favorites/ API end point
favoritesRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log(req.body);
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if(favorite != null) {
            for(var i=0; i<req.body.length; i++) {
                if(favorite.dishes.indexOf(req.body[i]._id) < 0) {
                    favorite.dishes.push(req.body[i]);                    
                }
            } 
            favorite.save()
            .then((favorite) => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })            
            }, (err) => next(err));           
        }
        else {
            Favorites.create({user: req.user._id, dishes: req.body})
            .then((favourite) => {
                console.log({user: req.user._id, dishes: req.body});
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })            
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({user: req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

// Methods for http://localhost:3000/favorites/:dishId API end point
favoritesRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if(favorite != null) {
            if (favorite.dishes.indexOf(req.params.dishId) < 0) {
                favorite.dishes.push({_id: req.params.dishId});
                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })            
                }, (err) => next(err));  
            }
            else {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err));   
            }         
        }
        else {
            Favorites.create({user: req.user._id, dishes: [ {_id: req.params.dishId}]})
            .then((favourite) => {
                console.log('Favorite Added ', favorite);
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })            
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if(favorite != null) {
            const index = favorite.dishes.indexOf(req.params.dishId);
            if (index > -1) {
                favorite.dishes.splice(index, 1);
                favorite.save()
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                }, (err) => next(err))
                .catch((err) => next(err));
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' not found in favorites');
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error('No Favorites Found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

module.exports = favoritesRouter;