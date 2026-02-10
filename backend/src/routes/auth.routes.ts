import { Router } from 'express';
import bcrypt from "bcrypt"
import { UserRepo } from '../repo/user.repo';
import { BadRequestError, ConflictError, UnauthorizedError } from '../utils/error';
import { signJWT } from '../utils/jwt';
import { success } from '../utils/success';
import { authSchema } from '../validations/auth.validation';
const authRoutes = Router();

authRoutes.post('/login', async (req, res) => {
  const { data, error } = authSchema.safeParse(req.body)
  if (error) {
    throw new BadRequestError(JSON.parse(error.message)[0].message)
  }
  const { username, password } = data
  const userExists = await UserRepo.findUserByUserName(username);

  if (!userExists) {
    throw new UnauthorizedError("Invalid credentials")
  }
  const hashedPassword = await bcrypt.hash(password, 12)

  const isPasswordMatch = await bcrypt.compare(password, hashedPassword)
  if (!isPasswordMatch) {
    throw new UnauthorizedError("Invalid credentials")
  }
  const token = signJWT({
    username: userExists.username,
    userId: userExists.id
  })
  success(res, "Logged in successfully", 200, { token })
})
authRoutes.post('/register', async (req, res) => {
  const { data, error } = authSchema.safeParse(req.body)
  if (error) {
    throw new BadRequestError(JSON.parse(error.message)[0].message)
  }
  const { username, password } = data
  const userExists = await UserRepo.findUserByUserName(username);
  if (userExists) {
    throw new ConflictError("User with that username already exists. Try different username")
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await UserRepo.createUser(username, hashedPassword)

  const token = signJWT({
    username,
    userId: user.id
  })

  success(res, "user created", 201, { token })
})
export default authRoutes
