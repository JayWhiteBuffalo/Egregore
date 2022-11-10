const {Schema, model, Types} = require('mongoose');
const dateFormat = require('../utils/dateFormat');

//Create ReactionSchema. 
//This will be nested within Thought Schema property 'reactions'
//Also called a 'subdocument'
const ReactionSchema = new Schema(
    {
        //set cust id to avoid confusion with parent thought_id
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody:{
            type: String,
            required: true,
            //Set VarChar 280 max
        },
        username:{
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    }
)

const ThoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        //must be between 1 and 280 char
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    username: {
        type: String,
        required: true
    },
    reactions: [ReactionSchema]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    //id: false
}
);
//get total count of reactions on retrieval 
ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});
//Create Thought model
const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;
