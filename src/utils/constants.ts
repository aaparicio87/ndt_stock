const AUTH_SLICE_NAME = 'auth'
const STAFF = 'staff'
const STOCK = 'stock'
const WORKS = 'works'
const CERTIFICATE = 'certificates'
const CLIENT = 'clients'

const ROUTES = {
    STOCK: '/',
    USERS: 'users',
    WORKS: 'works',
    WORKED_HOURS: 'whours',
};
const NAMES = {
    STOCK: 'Stock',
    USERS: 'Users',
    WORKS: 'Works',
    WORKED_HOURS: 'Worked Hours',
};

//const REGEX_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
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

const ROLES: TRole[]  = [
    "ADMINISTRATOR",
    "DATA_MANAGER",
    "USER"
]

const COLORS_DEGREE: Record<string, string> = {
    'Technical': 'red',
    'Engineer': 'green',
}

export {
    AUTH_SLICE_NAME,
    STAFF,
    //REGEX_EMAIL,
    REGEX_PASSWORD,
    STOCK,
    TYPE_EQUIPMENTS,
    TRADEMARK,
    QOS,
    DEGREES,
    ROLES,
    WORKS,
    CERTIFICATE,
    CLIENT,
    ROUTES,
    NAMES,
    COLORS_DEGREE
}
