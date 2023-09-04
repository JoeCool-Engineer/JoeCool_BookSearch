const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (_, { username }, context) => {
            if (context.user) {
                return await User.findOne({ _id: context.user._id }).populate('savedBooks')
            }    
        }
    },

    Mutation: {
        addUser: async (_, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user }
        },
        login: async (_, { username, email, password }) => {
            const user = await User.findOne({ email })

            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }

            const correctPw = await user.isCorrectPassword(password)

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials')
            }

            const token = signToken(user);
            
            return { token, user };
        },
        removeBook: async (_, { bookId }, context) => {
            if (context.user) {
                return User.findOneAndUpdate({ _id: context.user._id }, { $pull: { savedBooks: { bookId } } }, { new: true })
            }
        },

        saveBook: async (_, { bookData }, context) => {
            // console.log(bookData)
            if (context.user) {
                return User.findOneAndUpdate({ _id: context.user._id }, { $push: { savedBooks: { ...bookData } }}, { new: true })
            }
        }
    }
}

module.exports = resolvers