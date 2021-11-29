import jwt from 'jsonwebtoken'

const accessSecret = process.env.JWT_ACCESS_SECRET ?? ''
const refreshSecret = process.env.JWT_REFRESH_SECRET ?? ''

export interface accountPayload {
  id: string,
  accessGroups: string[]
}

class TokenService {
  generateTokens(payload: accountPayload) {
    const accessToken = jwt.sign(payload, accessSecret, {
      expiresIn: '30m',
    })
    const refreshToken = jwt.sign(payload, refreshSecret, {
      expiresIn: '30d',
    })
    return {
      accessToken,
      refreshToken,
    }
  }

  validateAccessToken(token: string) {
    try {
      return jwt.verify(token, accessSecret)
    } catch (e) {
      console.log(e)
      return null
    }
  }

  validateRefreshToken(token: string) {
    try {
      return jwt.verify(token, refreshSecret)
    } catch (e) {
      return null
    }
  }

  // async saveToken(userId: string, refreshToken: string) {
  //   const tokenData = await tokenModel.findOne({ user: userId })
  //   if (tokenData) {
  //     tokenData.refreshToken = refreshToken
  //     return tokenData.save()
  //   }
  //   return await tokenModel.create({ user: userId, refreshToken })
  // }
  //
  // async findToken(refreshToken) {
  //   return tokenModel.findOne({ refreshToken })
  // }
}

export default new TokenService()
