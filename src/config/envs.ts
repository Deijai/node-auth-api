import { get } from 'env-var'

import dotenv from 'dotenv';
dotenv.config();




export const envs = {
    PORT: get('PORT').default('3000').required().asPortNumber(),
    MONGO_URL: get('MONGO_URL').default('mongodb://mongo-user:123456@127.0.0.1:27017').required().asString(),
    MONGO_DB_NAME: get('MONGO_DB_NAME').default('mystore').required().asString(),
    JWT_SEED: get('JWT_SEED').default('SEED').required().asString()
}