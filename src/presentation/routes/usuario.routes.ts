// ===================================
// CORREÇÃO DA ORDEM DOS MIDDLEWARES
// presentation/routes/usuario.routes.ts
// ===================================
import { Router } from "express";
import { UsuarioController } from "../controllers/usuario.controller";
import { UsuarioRepositoryImpl } from "../../infrastructure/repositories/usuario.repository.impl";
import { UsuarioDatasourceImpl } from "../../infrastructure/datasources/usuario.datasource.impl";
import { PessoaRepositoryImpl } from "../../infrastructure/repositories/pessoa.repository.impl";
import { PessoaDatasourceImpl } from "../../infrastructure/datasources/pessoa.datasource.impl";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { TenantMiddleware } from "../middlewares/tenant.middleware";
import { PermissionMiddleware } from "../middlewares/permission.middleware";

export class UsuarioRoutes {
    static get routes(): Router {
        const router = Router();
        
        // Dependências
        const pessoaDatasource = new PessoaDatasourceImpl();
        const pessoaRepository = new PessoaRepositoryImpl(pessoaDatasource);
        
        const usuarioDatasource = new UsuarioDatasourceImpl();
        const usuarioRepository = new UsuarioRepositoryImpl(usuarioDatasource);
        
        const controller = new UsuarioController(usuarioRepository, pessoaRepository);

        // ===================================
        // ORDEM CORRETA: TENANT PRIMEIRO
        // ===================================
        router.use(TenantMiddleware.validateTenant);

        // ===================================
        // ROTAS SEM AUTENTICAÇÃO (PÚBLICAS)
        // ===================================
        
        // LOGIN - NÃO PRECISA DE TOKEN!
        router.post('/login', controller.loginUsuario);
        
        // CRIAR PRIMEIRO USUÁRIO - APENAS SE NÃO EXISTIR NENHUM
        router.post('/setup', controller.criarPrimeiroUsuario);

        // ===================================
        // APLICAR AUTENTICAÇÃO PARA OUTRAS ROTAS
        // ===================================
        router.use(AuthMiddleware.validateJWT);

        // ===================================
        // ROTAS PROTEGIDAS (COM TOKEN)
        // ===================================
        
        router.post('/', 
            PermissionMiddleware.checkPermissions(['GERENCIAR_USUARIOS']),
            controller.criarUsuario
        );
        
        router.get('/', 
            PermissionMiddleware.checkPermissions(['GERENCIAR_USUARIOS']),
            controller.buscarUsuarios
        );
        
        // Perfil do próprio usuário (sem permissão especial)
        router.get('/perfil', controller.obterPerfilUsuario);
        
        router.get('/:id', 
            PermissionMiddleware.checkPermissions(['GERENCIAR_USUARIOS']),
            controller.buscarUsuarioPorId
        );
        
        router.put('/:id', 
            PermissionMiddleware.checkPermissions(['GERENCIAR_USUARIOS']),
            controller.atualizarUsuario
        );
        
        // Alterar própria senha (sem permissão especial)
        router.put('/:id/senha', controller.alterarSenha);
        
        router.put('/:id/bloquear', 
            PermissionMiddleware.checkPermissions(['GERENCIAR_USUARIOS']),
            controller.bloquearUsuario
        );
        
        router.put('/:id/desbloquear', 
            PermissionMiddleware.checkPermissions(['GERENCIAR_USUARIOS']),
            controller.desbloquearUsuario
        );
        
        router.delete('/:id', 
            PermissionMiddleware.checkPermissions(['GERENCIAR_USUARIOS']),
            controller.deletarUsuario
        );

        return router;
    }
}