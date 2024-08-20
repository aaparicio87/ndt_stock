

type TSignIn = {
    email: string,
    password:string,
}

type TSignUp = {
    name: string,
    lastName: string,
    email: string,
    password?:string,
}

type TRole = 'ADMINISTRATOR' | 'DATA_MANAGER' | 'USER'
type TToastStatus = 'success' | 'error' | 'warning' | 'info'
type TWorkState = "Completed"| "In progress" | "Published" | "Unpublished"

type TStock = {
    uid?:string
    typeEquipment: string
    tradeMark: string
    model: string
    serialNumber: string
    store: string
    calibrationDate: string
    qualityOfService: string
    remarks: string
}

type TWorkHour = {
    uid?:string
    date: string
    client: TCustomer
    location: string
    ndtMethods?: TCertificates[]
    startTime: string
    endTime: string
    note?: string
    traveling:boolean
    distance?:number
    travelFrom?:string
    travelTo?:string
    carPlate?:string
}

type TStaff = TSignUp & {
    uid?:string
    degree?:string
    photoUrl?:string
    roles:TRole[]
    certificates?:TCertificates[]
    createdAt?:string
    wHours?: TWorkHour[]
}

type UserResponse = {
    user: TStaff | undefined
    token: string | null
}

interface ILocation {
    latitude:number
    longitude: number
}

type TCertificates = {
    uid?: string
    name: string
    description?:string
}

type TCustomer = {
    uid: string
    name: string
}

type TWork = {
    uid?:string
    name:string
    location?:ILocation
    customer: TCustomer | undefined
    description: string
    startDate:string
    endDate: string
    address: string
    typeWork: TCertificates[]
    workers: TStaff[]
    reportNumber: string
    needToDeliver: boolean
    invoiceNumber: string
    films?:number
    cans?:number
    documentationTime?:number
    reportPlace?:string
    billed?: string
    maxWorkedHours: number
    traveling:boolean
    distance?:number
    travelFrom?:string
    travelTo?:string
    carPlate?:string
    startTimeTravel?:string 
    stopTimeTravel?:string
}

type TOptions = {
    label: string;
    value: string;
}

