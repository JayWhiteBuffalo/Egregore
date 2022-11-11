const { User, Thought } = require('../Models');

const userController = {
    //get all users
    getAllUsers(req, res) {
        User.find({})
          .populate({
            path: 'thoughts',
            select: '-__v'
          })
            .select('-__v')
            .sort({_id: -1})
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    //get single user by _id and populated thought and friend data
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
          .populate({
            path: 'thoughts',
            select: '-__v'
          })
          .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                res.status(404).json({ message: 'No User found with this id.'});
                return;
                }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    //post a new user
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },
    //put to update a user by its _id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({_id: params.id }, body, {new: true})
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User found with this id.'});
                    return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },
    //delete to remove user  by its _id
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id})
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No User found with this id.'});
                return;
        }
        res.json(dbUserData);
    })
    .catch(err => res.status(400).json(err));
    }
};

module.exports = userController;