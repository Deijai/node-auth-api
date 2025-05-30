import { log } from 'console';
import jwt from 'jsonwebtoken'
import { envs } from './envs';

export class JwtAdapter {
    static async generateToken(payload: Object, duration: number = 60 * 60 * 2): Promise<string | null> {
        return new Promise((resolve) => {
            // todo: seed
            jwt.sign(payload, envs.JWT_SEED, { expiresIn: duration }, (err, token) => {
                if (err) return resolve(null);
                return resolve(token!);
            });
        });
    }

    static async validateJwt<T>(token: string): Promise<T | null> {
        return new Promise((resolve) => {
            jwt.verify(token, envs.JWT_SEED, (err, decoded) => {
                if (err) return resolve(null);
                return resolve(decoded as T);
            });
        });
    }
}