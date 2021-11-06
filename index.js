const jwt = require("jsonwebtoken");
const {ApolloServer} = require("apollo-server-express");
const mongoose = require('mongoose');
const express = require("express");
const { graphqlUploadExpress } = require("graphql-upload");
const typeDefs = require("./gql/schema");
const resolvers = require("./gql/resolver");
require('dotenv').config({path: '.env'});


mongoose.connect(
    process.env.BBDD,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err,_) => {
        if(err){
            console.log(err);
        }else{
            server();
        }
    }
);

async function server(){
    const serverApollo = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) =>{
            const token = req.headers.authorization;

            if(token){
                try {
                    const user = jwt.verify(
                        token.replace("Bearer ",""),
                        process.env.SECRET_KEY
                    );
                    return {
                        user,
                    };
                } catch (error) {
                    console.log("######## ERROR ##########");
                    console.log(error);
                    throw new Error("Token invalido")
                }
            }
        },
    });
    await serverApollo.start();
    const app = express();
    app.use(graphqlUploadExpress());
    serverApollo.applyMiddleware({ app });
    
    await new Promise( (r) => app.listen( {port: process.env.PORT || 4000},r ));
    console.log('###################################################################');
    console.log(
        `Servidor corriendo en localhost:4000${serverApollo.graphqlPath}`
    );
    console.log('###################################################################');
}

//console.log(process.env.BBDD);