const { User, Thought } = require('../Models');

const thoughtController = {
    //get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .sort({ createdAt: -1 })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    //get single thought by its _id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.thoughtId })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No Thought found with this id.'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    //post to create a new thought
    //Need to debug. Will add Thought but still throws 404.////This was fixed by correcting routes in thought-routes.js  
    addThought(req , res) {
        Thought.create(req.body)
            .then((dbThoughtData) => {
                //push the created thoughts _id to the associated user's thoughts array field
                return User.findOneAndUpdate(
                    //This Id is returning as undefined////This was fixed by correcting routes in thought-routes.js 
                    { _id: req.body.userId },
                    { $push: { thoughts: dbThoughtData._id } },
                    {new: true}
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User found with this id.'});
                    return;
                }

                res.json({ message: "Thought creation sucessfull"});
            })
            .catch(err => res.json(err));
    },
    

    //put to update a thought by its _id
    updateThought({ params, body }, res){
        Thought.findOneAndUpdate(
            {_id: params.thoughtId },
            { $set: {thoughts: body} },
            { runValidators: true, new: true}
        )
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({ message: "No thought with this id"});
                return
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {console.log(err);
        res.status(500).json(err);
        });
    },
    //delete to remove a thought by _id
    //This route is crashing the server//not liking 'params.thoughtid'//This was fixed by correcting routes in thought-routes.js 
    removeThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
          .then(deletedThought => {
            if (!deletedThought) {
              return res.status(404).json({ message: 'No Thought with this id!' });
            }
            return User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            );
          })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No User found with this id!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
      },
    //add Reaction
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$addToSet: {reactions: req.body}},
            {new: true, runValidators: true}
    )
          .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No User found with this id!'});
                return;
            }
            res.json(dbUserData);
        })
            .catch(err => res.json(err));    
    },
    //remove Reaction
    removeReaction( req, res) {
        // Thought.findOneAndDelete({
        //     _id: req.params.reactionId})
        // .then((dbThoughtData) => 
        // !dbThoughtData
        //     ? res.status(404).json({ message: 'No reaction with this id!'})
        // :
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$pull: { reactions: {reactionId : req.params.reactionId}}},
            {new: true, runValidators: true}
        )
        //)
            .then((dbThoughtData) => {
                if(!dbThoughtData) {
                    res.status(404).json({ message: "No thought with this id."});
                    return;
                }
            res.json(dbThoughtData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
    });
   },

};

module.exports = thoughtController;