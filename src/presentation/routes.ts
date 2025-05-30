import { Router } from "express";
import { AuthRoutes } from "./auth/routes";

export class AppRoutes {
    public constructor() {}

    static get routes(): Router {
        const router = Router();

        // rotas principais
        router.use('/api/auth', AuthRoutes.routes)
        // router.use('/api/user')
        // router.use('/api/products')
        // router.use('/api/clients')
        // router.use('/api/orders')
        return router;
    }
}