var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var async = require('async');
var _ = require('lodash');
var queue = require('../active-citizen/workers/queue');
const moment = require('moment');

router.post('/:post_id/:type_index', auth.can('rate post'), function(req, res) {
  var post;

  models.Rating.find({
    where: {
      post_id: req.params.post_id,
      type_index: req.params.type_index,
      user_id: req.user.id
    },
    include: [
      {
        model: models.Post,
        attributes: ['id','group_id','public_data']
      }
    ]
  }).then(function(rating) {
    let oldRatingValue;
    if (rating) {
      oldRatingValue = rating.value;
      rating.value = req.body.value;
      post = rating.Post;
    } else {
      rating = models.Rating.build({
        post_id: req.params.post_id,
        type_index: req.params.type_index,
        value: req.body.value,
        user_id: req.user.id,
        user_agent: req.useragent.source,
        ip_address: req.clientIp
      })
    }
    rating.save().then(function() {
      log.info('Rating Created', { rating: toJson(rating), context: 'create', user: toJson(req.user) });
      async.series([
        function (seriesCallback) {
          if (post) {
            seriesCallback();
          } else {
            models.Post.find( {
              where: { id: rating.post_id },
              attributes: ['id','group_id','public_data']
            }).then(function (results) {
              if (results) {
                post = results;
                seriesCallback();
              } else {
                seriesCallback("Can't find post")
              }
            });
          }
        },
        function (seriesCallback) {
          if (!post.public_data)
            post.set('public_data', {});
          if (!post.public_data.ratings)
            post.set('public_data.ratings', {});
          if (!post.public_data.ratings[rating.type_index]) {
            post.set('public_data.ratings.'+rating.type_index, {
              count: 1,
              sum: rating.value,
              averageRating: rating.value
            });
          } else {
            let count = post.public_data.ratings[rating.type_index].count+1;
            let sum = post.public_data.ratings[rating.type_index].sum+rating.value;
            if (oldRatingValue) {
              count -= 1;
              sum -= oldRatingValue;
            }
            post.set('public_data.ratings.'+rating.type_index, {
              count: count,
              sum: sum,
              averageRating: sum/count
            });
          }
          post.save().then(function () {
            seriesCallback();
          }).catch(function (error) {
            log.error("Ratings Error - Cant save ratings", {
              context: 'create',
              rating: toJson(rating),
              err: error,
              user: toJson(req.user)
            });
            seriesCallback();
          });
        },
        function (seriesCallback) {
          models.AcActivity.createActivity({
            type: 'activity.post.rating.new',
            userId: rating.user_id,
            domainId: req.ypDomain.id,
            groupId : post.group_id,
            postId : post.id,
            access: models.AcActivity.ACCESS_PRIVATE
          }, function (error) {
            seriesCallback(error);
          });
        }
      ], function (error) {
        if (error) {
          log.error("Ratings Error", { context: 'create', rating: toJson(rating), user: toJson(req.user),
            err: error, errorStatus: 500 });
          res.sendStatus(500);
        } else {
          res.send({ rating: rating, post });
        }
      });

    });
  }).catch(function(error) {
    log.error("Ratings Error", { context: 'create', post: req.params.id, user: toJson(req.user),
      err: error, errorStatus: 500 });
    res.sendStatus(500);
  });
});

router.delete('/:post_id/:type_index', auth.can('rate post'), function(req, res) {
  models.Rating.find({
    where: {
      post_id: req.params.post_id,
      type_index: req.params.type_index,
      user_id: req.user.id
    },
    include: [
      {
        model: models.Post,
        attributes: ['id','group_id','public_data'],
        required: true
      }
    ]
  }).then(function(rating) {
    if (rating) {
      rating.deleted = true;
      rating.save().then(function() {
        const count = rating.Post.public_data.ratings[rating.type_index].count-1;
        const sum = rating.Post.public_data.ratings[rating.type_index].sum-rating.value;
        rating.Post.set('public_data.ratings.'+rating.type_index, {
          count: count,
          sum: sum,
          averageRating: sum/count
        });
        rating.Post.save().then(function () {
          res.sendStatus(200);
        }).catch(function (error) {
          log.error("Ratings Error - Cant save ratings", {
            context: 'create',
            rating: toJson(rating),
            err: error,
            user: toJson(req.user)
          });
          res.sendStatus(500);
        });
      });
    } else {
      log.error("Rating Not found", { context: 'delete', post: req.params.id, user: toJson(req.user),
        err: "Rating not found", errorStatus: 404 });
      res.sendStatus(404);
    }
  }).catch(function(error) {
    log.error("Ratings Error", { context: 'delete', post: req.params.id, user: toJson(req.user),
      err: error, errorStatus: 500 });
    res.sendStatus(500);
  });
});

module.exports = router;
