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


export {
    USER_INPUT_FORGOT_VALIDATION_SCHEMA,
    LOGIN_VALIDATION_SCHEMA,
    RESET_PASSWORD_VALIDATION_SCHEMA,
    SIGN_UP_VALIDATION_SCHEMA,
}