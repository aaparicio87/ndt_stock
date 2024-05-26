
type TSignIn = {
    email: string,
    password:string,
}

type TSignUp = TSignIn & {
    name: string,
    lastName: string,
}

type TRole = 'ADMINISTRATOR' | 'DATA_MANAGER' | 'USER'
type TToastStatus = 'success' | 'error' | 'warning' | 'info'

type TStock = {
    typeEquipment: string
    tradeMark: string
    model: string
    serialNumber: string
    store: string
    calibrationDate: string
    qualityOfService: string
    remarks: string
}

type TStaff = TSignUp & {
    degree?:string
    greenCard?:boolean
    blueCard?:boolean
    master?:boolean
    others?:string[]
    photoUrl?:string
    roles:TRole[]
}

type UserResponse = {
    user: TStaff | undefined
    token: string | null
}

    