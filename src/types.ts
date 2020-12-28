import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";
import session, { SessionData } from "express-session";

declare module "express-session" {
    interface Session {
        userId: any;
    }
}

export type MyContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
    // req: Request & { session: session.Session & Partial<session.SessionData> };
    req: Request & { session: session.Session & Partial<SessionData> };
    res: Response;
}