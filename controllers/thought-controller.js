const { User, Thought } = require('../Models');

const thoughtController = {
    //get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    //get single thought by its _id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
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
    addThought({params, body }, res) {
        console.log(body);
        Thought.create(body)
            .then(({ _id }) => {
                //push the created thoughts _id to the associated user's thoughts array field
                return User.findOneAndUpdate(
                    //This Id is returning as undefined////This was fixed by correcting routes in thought-routes.js 
                    { _id: params.userId },
                    { $push: { thoughts: _id } },
                    {new: true}
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User found with this id.'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },
    

    //put to update a thought by its _id

    //delete to remove a thought by _id
    //This route is crashing the server//not liking 'params.thoughtid'//This was fixed by correcting routes in thought-routes.js 
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
          .then(deletedThought => {
            if (!deletedThought) {
              return res.status(404).json({ message: 'No Thought with this id!' });
            }
            return User.findOneAndUpdate(
              { _id: params.userId },
              { $pull: { thoughts: params.thoughtId } },
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
    addReaction({params, body}, res) {
        Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            {$push: {replies: body}},
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
    removeReaction({params}, res) {
        Thought.findOneAndDelete(
            {_id: params.thoughtId},
            {$pull: {replies: {reactionId: params.reactionId}}},
            {new: true}
        )
            .then(dbUserData = res.json(dbUserData))
            .catch(err => res.json(err));
    },

};

module.exports = thoughtController;