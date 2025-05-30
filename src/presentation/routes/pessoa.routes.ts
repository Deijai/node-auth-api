// presentation/routes/pessoa.routes.ts
import { Router } from "express";
import { PessoaController } from "../controllers/pessoa.controller";
import { PessoaRepositoryImpl } from "../../infrastructure/repositories/pessoa.repository.impl";
import { PessoaDatasourceImpl } from "../../infrastructure/datasources/pessoa.datasource.impl";
import { TenantMiddleware } from "../middlewares/tenant.middleware";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class PessoaRoutes {
    static get routes(): Router {
        const router = Router();
        
        const pessoaDatasource = new PessoaDatasourceImpl();
        const pessoaRepository = new PessoaRepositoryImpl(pessoaDatasource);
        const controller = new PessoaController(pessoaRepository);

        // Middlewares
        router.use(TenantMiddleware.validateTenant);
        router.use(AuthMiddleware.validateJWT);

        // Rotas
        router.post('/', controller.criarPessoa);
        router.get('/', controller.buscarPessoas);
        router.get('/:id', controller.buscarPessoaPorId);
        router.get('/cpf/:cpf', controller.buscarPessoaPorCpf);
        router.put('/:id', controller.atualizarPessoa);
        router.delete('/:id', controller.deletarPessoa);

        return router;
    }
}