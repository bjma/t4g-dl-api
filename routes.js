/**
 * Filename: routes.js
 * 
 * Contains all endpoints that our API offers.
 * Each route support their listed methods.
 */

 /* Modules */
const express = require('express');
const router = express.Router();

/* Default API response */
router.get('/', (req, res) => {
    res.json({
        status: "OK",
        message: "API endpoint is currently working.",
    })
});

/* Routes to image datasets for Project 1 */
const imageController = require('./controllers/proj1/imageController');
router.route('/datasets/proj1')
    .get((req, res) => {
        res.json({
            message: "This endpoint is deprecated."
        });
    });

/* Routes to text dataset for Project 2 */ 
const textController = require('./controllers/proj2/textController');
router.route('/datasets/proj2')
    .get(textController.index)
    .post(textController.new);

/* Routes for API functionality demo */
const textControllerDemo = require('./controllers/demos/textController.demo');
router.route('/demos/nlp')
    .get(textControllerDemo.index)
    .post(textControllerDemo.new);

/* Routes for the frontend interface used to upload scraped data.
    This is specifically for Project 2. */
router.route('/post/proj2')
    .get((req, res) => {
        res.render('text-post');
    });

/* Routes for error handling */
router.get('/errors', (req, res) => {
    res.json({
        status: "ERROR",
        message: "Oops! Something went wrong, probably a bad request."
    });
});

/* Export routes to other files */
module.exports = router;