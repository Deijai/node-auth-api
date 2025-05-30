import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";

export class AuthMiddleware {
    static validateJWT = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const authorization = req.header('Authorization');

        if (!req.body) req.body = {};
        if (!authorization) return res.status(400).json({ error: 'No token provider' });
        if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid bearer token' });

        const token = authorization.split(' ').at(1) || '';

        try {
            const payload = await JwtAdapter.validateJwt<{ id: string }>(token);
            if (!payload) return res.status(401).json({ error: 'Invalid token' });

            const user = await UserModel.findById(payload.id);
            if(!user) return res.status(401).json({error: 'Invalid token User not found'});
            req.body.user = user;

            next();
        } catch (error) {
            console.error(error);
            res.json({ error: 'Internal Server Error' });
        }
    }
}