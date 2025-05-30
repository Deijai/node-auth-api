// presentation/routes/documento.routes.ts
import { Router } from "express";
import { DocumentoController } from "../controllers/documento.controller";
import { DocumentoRepositoryImpl } from "../../infrastructure/repositories/documento.repository.impl";
import { DocumentoDatasourceImpl } from "../../infrastructure/datasources/documento.datasource.impl";
import { PessoaRepositoryImpl } from "../../infrastructure/repositories/pessoa.repository.impl";
import { PessoaDatasourceImpl } from "../../infrastructure/datasources/pessoa.datasource.impl";
import { TenantMiddleware } from "../middlewares/tenant.middleware";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { PermissionMiddleware } from "../middlewares/permission.middleware";

export class DocumentoRoutes {
    static get routes(): Router {
        const router = Router();
        
        // Dependências
        const pessoaDatasource = new PessoaDatasourceImpl();
        const pessoaRepository = new PessoaRepositoryImpl(pessoaDatasource);
        
        const documentoDatasource = new DocumentoDatasourceImpl();
        const documentoRepository = new DocumentoRepositoryImpl(documentoDatasource);
        
        const controller = new DocumentoController(documentoRepository, pessoaRepository);

        // Middlewares
        router.use(TenantMiddleware.validateTenant);
        router.use(AuthMiddleware.validateJWT);

        // Rotas
        router.post('/', 
            PermissionMiddleware.checkPermissions(['CADASTRAR_PACIENTE', 'EDITAR_PACIENTE']),
            controller.criarDocumento
        );
        
        router.get('/', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_PACIENTE']),
            controller.buscarDocumentos
        );
        
        router.get('/vencendo', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_PACIENTE']),
            controller.buscarDocumentosVencendo
        );
        
        router.get('/pessoa/:pessoaId', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_PACIENTE']),
            controller.buscarDocumentosPorPessoa
        );
        
        router.get('/:id', 
            PermissionMiddleware.checkPermissions(['VISUALIZAR_PACIENTE']),
            controller.buscarDocumentoPorId
        );
        
        router.put('/:id', 
            PermissionMiddleware.checkPermissions(['EDITAR_PACIENTE']),
            controller.atualizarDocumento
        );
        
        router.put('/:id/verificar', 
            PermissionMiddleware.checkPermissions(['EDITAR_PACIENTE']),
            controller.verificarDocumento
        );
        
        router.delete('/:id', 
            PermissionMiddleware.checkPermissions(['DELETAR_PACIENTE']),
            controller.deletarDocumento
        );

        return router;
    }
}