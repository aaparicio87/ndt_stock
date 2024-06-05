import { REGEX_PASSWORD } from './constants'
import { z } from "zod";

const USER_INPUT_FORGOT_VALIDATION_SCHEMA = z.object({
    email: z.string().min(1, "E-mail is required").email({ message: "Invalid email address" })
})

const LOGIN_VALIDATION_SCHEMA = z.object({
    email: z.string()
            .min(1, "E-mail is required")
            .email({ message: "Invalid email address" }), 
            
    password: z.string()
               .min(1,"Password is required")
               .regex(REGEX_PASSWORD, 'Password must contain Upper case, lower case, special character and min length 6') 
})

const RESET_PASSWORD_VALIDATION_SCHEMA = z.object({
    code: z.string().min(6, 'Code must be of 6 digits'),

    password: z.string()
               .min(1, 'Password is required')
              .regex(REGEX_PASSWORD, 'Password must contain Upper case, lower case, special character and min length 6'),

    confirm: z
          .string()
          .min(1, 'Confirm password is required')
  }).refine((data) => data.password === data.confirm, {
    message: "Passwords must match",
    path:["confirm"]
  })


const SIGN_UP_VALIDATION_SCHEMA = z.object({
  

  name:z.string()
  .min(1, "Name is required"),

  lastName:z.string()
  .min(1, "Last name is required"),

  email: z.string()
  .min(1, "E-mail is required")
  .email({ message: "Invalid email address" }),

  password: z.string()
                .min(1, 'Password is required')
              .regex(REGEX_PASSWORD, 'Password must contain Upper case, lower case, special character and min length 6'),

  confirm: z
          .string()
          .min(1, 'Confirm password is required')
  }).refine((data) => data.password === data.confirm, {
    message: "Passwords must match",
    path:["confirm"]
  })
 
const STOCK_VALIDATION_SCHEMA = z.object({
  serialNumber: z.string().min(1, "Serial number is required"),
  model: z.string().min(1, "Model is required"),
  typeEquipment: z.string().min(1, "Required field"),
  tradeMark: z.string().min(1,"Trademark is required"),
  store: z.string().min(1, "Store is required"),
  calibrationDate: z.string().min(1, "Calibration is required"),
  qualityOfService: z.string().min(1, "QoS is required"),
  remarks: z.string(),
})  

const STAFF_VALIDATION_SCHEMA = z.object({
  name:z.string()
  .min(1, "Name is required"),

  lastName:z.string()
  .min(1, "Last name is required"),

  email: z.string()
  .min(1, "E-mail is required")
  .email({ message: "Invalid email address" }),

  degree: z.string().min(1, "Degree is required"),

  cerificates: z.string().array().nonempty({
    message: "Can't be empty!",
  }),

  roles: z.string().array().nonempty({
    message: "Can't be empty!",
  })
})  


export {
    USER_INPUT_FORGOT_VALIDATION_SCHEMA,
    LOGIN_VALIDATION_SCHEMA,
    RESET_PASSWORD_VALIDATION_SCHEMA,
    SIGN_UP_VALIDATION_SCHEMA,
    STOCK_VALIDATION_SCHEMA,
    STAFF_VALIDATION_SCHEMA
}