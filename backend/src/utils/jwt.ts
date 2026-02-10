import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/env"
import { UpdatedJWTPayload } from "../types/jwt"
export const signJWT = (data: any) => {
  const token = jwt.sign(data, JWT_SECRET)
  return token

}
export const verifyJWT = (token: string): UpdatedJWTPayload | string => {
  try {
    const data = jwt.verify(token, JWT_SECRET) as UpdatedJWTPayload
    return data
  } catch {
    return ""
  }
}
