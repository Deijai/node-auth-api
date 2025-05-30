import { JwtAdapter } from '../../../config';
import { RegisterUserDto } from '../../dtos/auth/register-user.dto';
import { CustomError } from '../../errors/custom.error';
import { AuthRepository } from '../../repositories/auth.repository';
import { LoginUserDto } from '../../dtos/auth/login-user.dto';

interface UserToken {
    token: string;
    user: {
        id: string,
        name: string,
        email: string
    }
}

type SignToken = (payload: Object, duration?: number) => Promise<string | null>;

interface LoginUserUseCase {
    execute(registerUserDto: RegisterUserDto): Promise<UserToken>;
}

export class LoginUser implements LoginUserUseCase {
    constructor(private readonly authRepository: AuthRepository, private readonly signToken: SignToken = JwtAdapter.generateToken) { }

    async execute(loginUserDto: LoginUserDto): Promise<UserToken> {

        const user = await this.authRepository.login(loginUserDto);
        const token = await this.signToken({ id: user.id }, 60 * 60 * 2);

        if (!token) throw CustomError.internalServerError('Error generating token');

        return {
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        }
    }

}