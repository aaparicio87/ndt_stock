export type User = {
    first_name: string
    last_name: string
}

export type UserResponse = {
    user: User
    token: string
}
  
export type LoginRequest = {
  username: string
  password: string
}

export type TStock = {
  typeEquipment: string
  tradeMark: string
  model: string
  serialNumber: string
  store: string
  calibrationDate: string
  qualityOfService: string
  remarks: string
}
  