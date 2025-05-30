import { LoginUserDto, RegisterUserDto, UserEntity } from '../index';

export abstract class AuthDatasouce {
    abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;
    abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;
}