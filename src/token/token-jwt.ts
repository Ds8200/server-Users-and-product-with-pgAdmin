import { User } from "../users/interfaces/UserInterface";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// List of active refresh tokens
const refreshTokens: string[] = [];

// Token management class.
export default class JwtToken {
    // Generate an access token.
    static generateAccessToken = (user: User) => {
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1m' });
    }

    // Function to generate a refresh token.
    static generateRefreshToken = (user: User, refreshTokenOld: string) => {


        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!);
        refreshTokens.push(refreshToken);
        return refreshToken;
    }

    // Verify token.
    static verifyToken = (req: any, res: any, next: any) => {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(' ')[1];
        console.log(token);
        if (!token) {
            res.send("Authorization (token) not provided!!!");
            return res.sendStatus(401);
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, user: any) => {
            if (err) {
                res.send("Authorization (token) is invalid!!!");
                return res.sendStatus(403);
            }
            req.user = user;
            console.log(user);
            next();
        });
    }

    // Refresh a token to get a new access token.
    static newToken = (req: any, res: any) => {
        const refreshToken = req.body["refreshToken"];

        if (!refreshToken) {
            res.send("Authorization (Refresh token) not provided!!!");
            return res.sendStatus(401);
        }

        if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err: any, user: any) => {
            if (err) return res.sendStatus(403);
            console.log(user)

            // Remove the used refresh token from the list
            const index = refreshTokens.indexOf(refreshToken);
            if (index !== -1) {
                refreshTokens.splice(index, 1);
            }

            const accessTokenNew = JwtToken.generateAccessToken(user);
            const refreshTokenNew = JwtToken.generateRefreshToken(user);
            res.json({ accessToken: accessTokenNew, refreshToken: refreshTokenNew });
        });
    };
}
