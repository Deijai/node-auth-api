import { Router } from "express";
import { AuthController } from "./controller";
import { AuthRepositoryImpl, AuthDatasouceImpl } from '../../infrastructure';
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class AuthRoutes {
    public constructor() { }

    static get routes(): Router {
        const router = Router();
        const authDatasource = new AuthDatasouceImpl();

        const authRepository = new AuthRepositoryImpl(authDatasource);

        const controller = new AuthController(authRepository);

        router.post('/login', controller.loginUser);
        router.post('/register', controller.registerUser);

        router.get('/', AuthMiddleware.validateJWT, controller.getUsers);
        return router;
    }
}
