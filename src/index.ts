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

// Connect Redis for Sessions saving
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from "./types";

// Cors
import cors from 'cors';


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

    // Session middleware
    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    // Cors
    app.use(cors({
        origin: "http://localhost:3000",
        credentials: true
    }))

    app.use(
        session({
            name: 'qid', // Name of cookie
            store: new RedisStore({ 
                client: redisClient,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true, // Can't access cookie in FE code
                secure: __prod__, // Cookie only works in https
                sameSite: 'lax', // csrf
                // secure: false // Cookie only works in https (false)
            },
            saveUninitialized: false,
            secret: 'verystrongsecretpassword',
            resave: false,
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
    });

    // Create Graphql Endpoint on Express
    // Set CORS globally with Express middleware - yarn add cors (and types)
    apolloServer.applyMiddleware({ 
        app, 
        // cors: { origin: "http://localhost:3000"} 
        cors: false,
    });

    // Listen
    app.listen(4000, () => {
        console.log("Server started on localhost:4000");
    });
}

main().catch(err => {
    console.error(err);
});




console.log("hello there!");