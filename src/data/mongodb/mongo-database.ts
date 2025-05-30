import { log } from "console";
import mongoose from "mongoose";

interface Options {
    mongoUrl: string;
    dbName: string;
}

export class MongoDatabase {
    static async connect(options: Options) {
        log(options)
        const { dbName, mongoUrl } = options;
        try {
            await mongoose.connect(mongoUrl, {
                dbName: dbName,
            });
            console.log(`Mongo connected...`)
            return true;
        } catch (error) {
            console.log(`ERROR DATABASE: ${error}`)
            throw error;
        }
    }
}