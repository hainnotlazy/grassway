export interface User {
  id: number
  username: string
  password?: string
  fullname: string
  dob: Date
  gender: string
  avatar: string
  phone: string
  bio: string
  email: string
  github: string
  slack: string
  facebook: string
  is_active?: boolean
  is_email_verified?: boolean
  email_verification_code?: number
  next_email_verification_time?: Date
  created_at?: Date
  updated_at?: Date
}
