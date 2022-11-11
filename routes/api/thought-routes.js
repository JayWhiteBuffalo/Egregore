const router = require('express').Router();

const {getAllThoughts, getThoughtById, addThought, updateThought, removeThought, addReaction, removeReaction } = require ('../../controllers/thought-controller');

//Set up GET all thoughts at /api/thoughts
router
    .route('/')
    .get(getAllThoughts);
// Set up Post thoughts at /api/thoughts/<userId>
router
    .route('/:userId')
    .post(addThought);

router
    .route('/:id')
    .get(getThoughtById)

    //Need to debug this. Removing thoughts, however returning undefined userId and throwing error
router
    .route('/:thoughtId')
    .delete(removeThought);

router
    .route('/:thoughtId/reactions')
    .post(addReaction);
router
    .route('/:thoughtId/reactions/:reactionId')
    .delete(removeReaction);

    module.exports = router;