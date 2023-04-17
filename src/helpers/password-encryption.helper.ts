import * as bcrypt from 'bcrypt';
const saltOrRounds = 10;

export async function encryptPassword(password: any) {
    const hash = await bcrypt.hash(password, saltOrRounds);
    // const salt = await bcrypt.genSalt();
    return hash;
}

export async function validatePassword(password: any, hash: any) {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
}