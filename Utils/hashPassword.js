import bcrypt from "bcrypt"

export const hashedPassword = async (plainpass) => {
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(plainpass, salt)
    return hashed
}

export const comparePassword = async (plainpass, hashedpass) => {
    return await bcrypt.compare(plainpass, hashedpass)
}