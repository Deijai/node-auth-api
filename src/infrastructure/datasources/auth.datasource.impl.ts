import { UserMapper } from "..";
import { BcryptAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";
import { AuthDatasouce, RegisterUserDto, UserEntity, CustomError } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";

type HashFunction = (passaword: string) => string;
type CompareFunction = (password: string, hash: string) => boolean;

export class AuthDatasouceImpl implements AuthDatasouce {
    constructor(
        private readonly hashPassword: HashFunction = BcryptAdapter.hash,
        private readonly comparePassword: CompareFunction = BcryptAdapter.compare,
    ) { }


    async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        const { email, password } = loginUserDto;

        try {
            const user = await UserModel.findOne({ email: email });

            if (!user) throw CustomError.badRequest('Email or password invalid');
            if (!this.comparePassword(password, user.password)) throw CustomError.badRequest('Email or password invalid');

            return UserMapper.userEntityFromObject(user);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }

            throw CustomError.internalServerError();
        }
    }

    async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        const { name, email, password } = registerUserDto;

        try {

            const exists = await UserModel.findOne({ email: email });

            if (exists) throw CustomError.badRequest('User already exists');

            const user = await UserModel.create({
                name: name,
                email: email,
                password: this.hashPassword(password),
            });

            await user.save();
            return UserMapper.userEntityFromObject(user);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }

            throw CustomError.internalServerError();
        }
    }
}