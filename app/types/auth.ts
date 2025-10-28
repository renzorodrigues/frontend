export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  user_status: 'ACTIVE' | 'PENDING_PROFILE_DATA' | string
}

export interface TokenPayload {
  exp: number
  name: string
  preferred_username: string
}