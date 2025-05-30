// ===================================
// SCRIPT PARA CRIAR USUÁRIO SUPER ADMIN DO TENANT
// scripts/create-super-admin-tenant.ts
// ===================================
import { MongoDatabase } from "../src/data/mongodb";
import { UsuarioModel } from "../src/data/mongodb";
import { BcryptAdapter } from "../src/config";
import { envs } from "../src/config";

async function createSuperAdminTenant() {
    try {
        // Conectar ao banco
        await MongoDatabase.connect({
            dbName: envs.MONGO_DB_NAME,
            mongoUrl: envs.MONGO_URL
        });

        // SEU TENANT ID (pegar do MongoDB ou da requisição)
        const tenantId = "6839f07bc6cde62adf98a2ab"; 

        console.log('Criando super admin para tenant:', tenantId);

        // Verificar se já existe
        const existingAdmin = await UsuarioModel.findOne({ 
            usuario: 'superadmin',
            tenant_id: tenantId
        });

        if (existingAdmin) {
            console.log('❌ Super admin já existe:', existingAdmin.usuario);
            console.log('🆔 ID:', existingAdmin._id);
            console.log('🔑 Para testar, use a senha: Admin@2024');
            return;
        }

        // Criar super admin do tenant
        const superAdmin = new UsuarioModel({
            tenant_id: tenantId,
            usuario: 'superadmin',
            senha: BcryptAdapter.hash('Admin@2024'),
            papel: 'ADMIN',
            ativo: true,
            permissoes: [
                'ADMIN_SISTEMA',
                'GERENCIAR_USUARIOS', 
                'CONFIGURAR_SISTEMA',
                'GERAR_RELATORIOS',
                'GERENCIAR_UNIDADES',
                'CADASTRAR_PACIENTE',
                'EDITAR_PACIENTE',
                'VISUALIZAR_PACIENTE',
                'CADASTRAR_MEDICO',
                'EDITAR_MEDICO',
                'VISUALIZAR_MEDICO',
                'AGENDAR_CONSULTA',
                'REALIZAR_ATENDIMENTO'
            ],
            unidades_acesso: [], // Acesso a todas as unidades
            created_at: new Date(),
            updated_at: new Date()
        });

        await superAdmin.save();

        console.log('✅ Super Admin do tenant criado com sucesso!');
        console.log('👤 Usuário: superadmin');
        console.log('🔑 Senha: Admin@2024');
        console.log('🏢 Tenant ID:', tenantId);
        console.log('🆔 User ID:', superAdmin._id);
        console.log('🎯 Papel:', superAdmin.papel);
        console.log('🔐 Permissões:', superAdmin.permissoes.length, 'permissões');

    } catch (error) {
        console.error('❌ Erro ao criar super admin:', error);
    } finally {
        process.exit(0);
    }
}

createSuperAdminTenant();