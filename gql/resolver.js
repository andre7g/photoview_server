const userController = require("../controllers/userController");
const followController = require("../controllers/followController");
const publicationController = require("../controllers/publicationController");
const commentController = require("../controllers/commentController");
const { GraphQLUpload } = require("graphql-upload");

const resolvers = {
    Upload: GraphQLUpload,
    Query:{
        //User
        getUser: (_,{ id,username }) => userController.getUser(id,username),
        search: (_,{ search }) => userController.search(search),
        //Follow
        isFollow: (_,{ username },ctx) => followController.isFollow(username,ctx),
        getFollowers: (_,{ username }) => followController.getFollowers(username),
        getFollows: (_,{ username }) => followController.getFollows(username),
        //Publications
        getPublications: (_,{ username }) => publicationController.getPublications(username),
        getPublicationsFollows: (_,{},ctx) => publicationController.getPublicationsFollows(ctx),
        //Comment
        getComments: (_,{idPublication}) => commentController.getComments(idPublication),
    },
    Mutation:{
        //User
        register: (_,{ input }) => userController.register(input),
        login: (_,{ input }) => userController.login(input),
        updateAvatar: (_,{ file },ctx) => userController.updateAvatar(file,ctx),
        deleteAvatar: (_,{},ctx) => userController.deleteAvatar(ctx),
        updateUser: (_,{ input },ctx) => userController.updateUser(input,ctx),
        // Follow
        follow: (_,{ username },ctx) => followController.follow(username,ctx),
        unFollow: (_,{ username },ctx) => followController.unFollow(username,ctx),
        //Publication
        publish: (_,{ file },ctx) => publicationController.publish(file,ctx),
        //Comment
        addComment: (_,{ input },ctx) => commentController.addComment(input,ctx),
    },
};

module.exports = resolvers;