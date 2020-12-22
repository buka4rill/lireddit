import { Query, Resolver } from 'type-graphql';


// Decorate the Resolver class with @Resolver()
@Resolver()
export class HelloResolver {

    @Query(() => String) // Query returns string
    hello() {
        return "hello world"
    }
}