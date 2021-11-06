const {gql} = require("apollo-server-express");

const typeDefs = gql` 
    scalar Upload
    ##datos que devuelve la peticion
    type User {
        id: ID
        name: String
        username: String
        email:String
        avatar:String
        siteWeb:String
        description:String
        password:String
        createAt:String    
    }
    type Token{
        token:String
    }
    type UpdateAvatar{
        status: Boolean
        urlAvatar: String
    }
    type Publish{
        status:Boolean
        urlFile:String
    }
    type Publication{
        id: ID
        idUser: ID
        file:String
        typeFile:String
        createAt:String
    }
    type FeedPublication{
        id: ID
        idUser: User
        file:String
        typeFile:String
        createAt:String
    }
    type Comment{
        idPublication:ID
        idUser: User
        comment:String
        createAt:String
    }
    ##datos que enviamos a una accion 
    input UserInput{
    ## (!) obligatorio
        name: String!
        username: String!
        email:String!
        password:String!
    }
    input LoginInput{
    ## (!) obligatorio
        email:String!
        password:String!
    }
    input UserUpdateInput{
    ## (!) obligatorio
        name:String
        email:String
        currentPass:String
        newPass:String
        siteWeb: String
        description: String
    }
    input CommentInput{
    ## (!) obligatorio
        idPublication:ID
        comment:String
    }

    type Query{
        #User
        getUser( id: ID, username: String ) : User
        search(search:String):[User]
        #Follow
        isFollow(username:String!):Boolean
        getFollowers(username:String!):[User]
        getFollows(username:String!):[User]
        #Publication
        getPublications(username:String!):[Publication]
        getPublicationsFollows:[FeedPublication]
        #Comment
        getComments(idPublication:ID!):[Comment]
    }
    type Mutation{
        #User ##input por que se reciben muchos datos ## devuelve un objeto de tipo User (:User)
        register(input: UserInput): User
        login(input:LoginInput): Token
        updateAvatar( file: Upload! ): UpdateAvatar
        deleteAvatar: Boolean
        updateUser(input: UserUpdateInput):Boolean
        # Follow
        follow(username:String!):Boolean
        unFollow(username:String!):Boolean

        #Publication
        
        publish(file:Upload!):Publish

        #Comments
        
        addComment(input:CommentInput):Comment
    }
`;

module.exports = typeDefs;