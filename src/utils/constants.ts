const AUTH_SLICE_NAME = 'auth'
const STAFF = 'staff'
const STOCK = 'stock'

const REGEX_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const REGEX_PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,64}$/

const TYPE_EQUIPMENTS = [
    "Printer",
    "Laptop",
    "Control table",
    "X-Ray unit"
]

const TRADEMARK = [
    "Lenovo",
    "HP",
    "DELL",
]

const QOS = [
    "Good",
    "Regular",
    "Bad",
]

const DEGREES = [
    'Technical',
    'Engineer'
]

const CERTIFICATES: TCertificates[] = [
    "Green card",
    "Blue card",
    "Master",
    "Other",
]

const ROLES: TRole[]  = [
    "ADMINISTRATOR",
    "DATA_MANAGER",
    "USER"
]

export {
    AUTH_SLICE_NAME,
    STAFF,
    REGEX_EMAIL,
    REGEX_PASSWORD,
    STOCK,
    TYPE_EQUIPMENTS,
    TRADEMARK,
    QOS,
    DEGREES,
    CERTIFICATES,
    ROLES
}