import { hashSync, compareSync } from 'bcryptjs';

export class BcryptAdapter {
    static hash(passaword: string): string {
        return hashSync(passaword);
    }

    static compare(password: string, hash: string): boolean {
        return compareSync(password, hash);
    }
}