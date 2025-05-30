// domain/use-cases/unidade/criar-unidade.use-case.ts
import { UnidadeRepository } from '../../repositories/unidade.repository';
import { UsuarioRepository } from '../../repositories/usuario.repository';
import { CriarUnidadeDto } from '../../dtos/unidade/criar-unidade.dto';
import { UnidadeEntity } from '../../entities/unidade.entity';
import { CustomError } from '../../errors/custom.error';

interface CriarUnidadeUseCase {
    execute(criarUnidadeDto: CriarUnidadeDto, tenantId: string, userId: string): Promise<UnidadeEntity>;
}

export class CriarUnidade implements CriarUnidadeUseCase {
    constructor(
        private readonly unidadeRepository: UnidadeRepository,
        private readonly usuarioRepository: UsuarioRepository
    ) {}

    async execute(criarUnidadeDto: CriarUnidadeDto, tenantId: string, userId: string): Promise<UnidadeEntity> {
        // Verificar se CNES já existe (se fornecido)
        if (criarUnidadeDto.cnes) {
            const unidadeExistente = await this.unidadeRepository.buscarPorCnes(criarUnidadeDto.cnes, tenantId);
            if (unidadeExistente) {
                throw CustomError.badRequest('CNES já cadastrado neste município');
            }
        }

        // Verificar se gestor responsável existe (se fornecido)
        if (criarUnidadeDto.gestor_responsavel) {
            const gestor = await this.usuarioRepository.buscarPorId(criarUnidadeDto.gestor_responsavel, tenantId);
            if (!gestor) {
                throw CustomError.badRequest('Gestor responsável não encontrado');
            }
        }

        return await this.unidadeRepository.criar(criarUnidadeDto, tenantId, userId);
    }
}