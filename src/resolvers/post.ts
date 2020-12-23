import { Post } from '../entities/Post';
import { MyContext } from '../types';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';


/**
    *  Decorate the Resolver class with @Resolver()
    *  Query is for getting data
    *  Mutation is for updatating, inserting, deleting data


 */


@Resolver()
export class PostResolver {
    // Query returns Array of Posts
    @Query(() => [Post]) // Convert Entity to Graphql type; this line shows the return value
    posts( @Ctx() ctx: MyContext ): Promise<Post[]> {
        // Return an array of Posts
        return ctx.em.find(Post, {});
    }

    // Get Post By ID
    @Query(() => Post, { nullable: true }) 
    post( 
        @Arg('id', () => Int) id: number,
        @Ctx() { em }: MyContext ): Promise<Post | null> {
        // Return an array of Posts
        return em.findOne(Post, { id });
    }

    // Create Post
    @Mutation(() => Post) 
    async createPost( 
        @Arg('title') title: string, // Graphql would figure out the type
        @Ctx() { em }: MyContext ): Promise<Post> {
        const post = await em.create(Post, { title });
        
        // Persist to DB
        await em.persistAndFlush(post);
        
        // Return Post
        return post;
    }   

    // Update a Post
    @Mutation(() => Post) 
    async updatePost( 
        @Arg('id') id: number, 
        @Arg('title', () => String, { nullable: true }) title: string, // Title could be nullable 
        @Ctx() { em }: MyContext ): Promise<Post | null> {
        // Fetch Post
        const post = await em.findOne(Post, { id });
        
        // Check if post exists
        if (!post) {
            return null;
        }

        // Post found? Check that title isn't blank
        if (typeof title !== 'undefined'){
            // Update title
            post.title = title;

            // Persist to DB
            await em.persistAndFlush(post);
        }
        
        return post;
    } 
    
    // Delete a Post
    @Mutation(() => Boolean) 
    async deletePost( 
        @Arg('id') id: number, 
        @Ctx() { em }: MyContext ): Promise<Boolean> {
        await em.nativeDelete(Post, { id })

        return true;
    }
}