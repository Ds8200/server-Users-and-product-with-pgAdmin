import { User, UserJWT } from "../users/interfaces/UserInterface";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

// Load configuration from the .env file
dotenv.config();

// List of active refresh tokens
let refreshTokens: string[] = [];

// Verify by token and env
const verifyByTokenAndEnv = (res: Response, token: string, env: any): UserJWT | undefined => {
    let userFromVerify: UserJWT | undefined;
    if (env) {
        jwt.verify(token, env, (err: any, user: any) => {
            if (err) {
                // Handle token verification error appropriately.
                res.json({ error: "Authorization (token) is invalid!!!"});
                res.status(403)
                return;
            }
            userFromVerify = user;
        })
    }
    return userFromVerify;
}

// Token management class
export default class JwtToken {
    // Generate an access token
    static generateAccessToken = (user: User) => {
        if (process.env.ACCESS_TOKEN_SECRET) {
            return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
        }
    }

    // Generate a refresh token
    static generateRefreshToken = (res: Response, user: User): string | void => {
        if (process.env.REFRESH_TOKEN_SECRET) {
            // Create a refresh token
            const refreshToken: string = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

            // Remove expired refresh tokens
            refreshTokens = refreshTokens.filter((token) => {
                const userFromRefresh: UserJWT | undefined = verifyByTokenAndEnv(res, token, process.env.REFRESH_TOKEN_SECRET);
                console.log("userFromRefresh: ", userFromRefresh);
                console.log("user: ", user);
                return userFromRefresh?.id !== user.id && userFromRefresh?.email !== user.email;
            });

            // Add the new refresh token to the list
            refreshTokens.push(refreshToken);

            console.log("Refresh Tokens array: ", refreshTokens);

            return refreshToken;
        }
    }

    // Verify a token
    static verifyToken = (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            // Handle missing token appropriately.
            res.json({error: "Authorization (token) not provided!!!"});
            res.status(401);
            return;
        }

        if (process.env.ACCESS_TOKEN_SECRET) {
            const userFromVerify: UserJWT | undefined = verifyByTokenAndEnv(res, token, process.env.ACCESS_TOKEN_SECRET);

            if (!userFromVerify) return;

            req.user = userFromVerify;
            console.log("User from access token: ", userFromVerify);
            next();
        }
    }

    // Generate a new access token using a refresh token
    static newToken = (req: Request, res: Response) => {
        const refreshToken = req.body["refreshToken"];

        if (!refreshToken) {
            // Handle missing refresh token appropriately.
            res.json({error: "Authorization (Refresh token) not provided!!!"})
            res.status(401);
            return;
        }

        if (!refreshTokens.includes(refreshToken)) {
            // Handle invalid or expired refresh token appropriately.
            return res.sendStatus(403);
        }

        if (process.env.REFRESH_TOKEN_SECRET) {
            const userFromVerify: UserJWT | undefined = verifyByTokenAndEnv(res, refreshToken, process.env.REFRESH_TOKEN_SECRET);

            if (!userFromVerify) return;

            console.log("User from refresh: ", userFromVerify);

            const accessTokenNew = JwtToken.generateAccessToken({ id: userFromVerify.id, email: userFromVerify.email });
            console.log("New token:", accessTokenNew);

            res.json({ accessToken: accessTokenNew });
        }
    };

    // Logout and delete a refresh token
    static logoutDeleteRefreshToken = (req: Request, res: Response) => {
        const refreshToken = req.body["refreshToken"];

        if (!refreshToken) {
            // Handle missing refresh token appropriately.
            res.json({error: "Authorization (Refresh token) not provided!!!"});
            res.status(401);
            return;
        }

        if (!refreshTokens.includes(refreshToken)) {
            // Handle invalid or expired refresh token appropriately.
            return res.sendStatus(403);
        }

        console.log("Before removal: ", refreshTokens);

        // Remove the used refresh token from the list
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

        console.log("After removal: ", refreshTokens);
        res.json({ massege: "Refresh token removed successfully!" });
        res.status(204);
    };
}
