import { Post } from '../entities/Post';
import { MyContext } from '../types';
import { Arg, Ctx, Int, Query, Resolver } from 'type-graphql';


// Decorate the Resolver class with @Resolver()
@Resolver()
export class PostResolver {
    // Query returns Array of Posts
    @Query(() => [Post]) // Convert Entity to Graphql type
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
}