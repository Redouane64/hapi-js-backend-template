import { CreateUser, UserDto } from '../src/database/user'

export const createUser = (data: UserDto): UserDto => ({
  id: '8B00C7C9-BD42-4918-8850-D98C0A8DE17D',
  ...data
})

export const isUniqueEmailAddress = (data: string): boolean => true

export const getUser = (data: CreateUser): Pick<UserDto, 'id' | 'email' | 'password'> => ({
  id: '8B00C7C9-BD42-4918-8850-D98C0A8DE17D',
  ...data
})

export const createToken = (): unknown => ({
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJwdXJwb3NlIjoiYWNjZXNzIiwiaWF0IjoxNTE2MjM5MDIyfQ.H3v3qDH1S7jC4Hlz28UZ1044OUeMwNwuA-i91p25x48',
  refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJwdXJwb3NlIjoiYWNjZXNzIiwiaWF0IjoxNTE2MjM5MDIyfQ.H3v3qDH1S7jC4Hlz28UZ1044OUeMwNwuA-i91p25x48'
})
