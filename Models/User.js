const {Schema, model} = require('mongoose');
const { isEmail } = require ('validator');

 const UserSchema = new Schema ({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        //email validation here
        validate: [ isEmail, 'invalid email']
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thoughts'
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    }
}
);
//get total count of friends on retrieval 
UserSchema.virtual('friendCount').get(function() {
    return this.friends.length
});

//Create the User model using UserSchema
const User = model('User', UserSchema);

//export the User Model
module.exports = User;