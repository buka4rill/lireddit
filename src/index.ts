// Config file for Typescript - npx tsconfig.json

// Import Reflect-Metadata for TypeGQL
import "reflect-metadata";
// Import MikroOrm
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const main = async () => {
    // Connect to db
    const orm = await MikroORM.init(microConfig);

    // Run Migration in code
    await orm.getMigrator().up();

    // //Create a post
    // const post = orm.em.create(Post, { title: 'My Fourth Post' });
    // // insert to db
    // await orm.em.persistAndFlush(post);

    // Get all posts 
    // const posts = await orm.em.find(Post, {}); 
    // console.log(posts);

    // Express
    const app = express();

    // app.get("/", (_, res)=>{
    //     res.send("Hello from express!");
    // })

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: () => ({ em: orm.em })
    });

    // Create Graphql Endpoint on Express
    apolloServer.applyMiddleware({ app });

    // Listen
    app.listen(4000, () => {
        console.log("Server started on localhost:4000");
    });
}

main().catch(err => {
    console.error(err);
});




console.log("hello there!");