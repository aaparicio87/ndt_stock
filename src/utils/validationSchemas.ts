import { REGEX_NAME, REGEX_PASSWORD, REGEX_SERIAL } from "./constants";
import { z } from "zod";
import { timeToMinutes } from "./functions.ts";

const USER_INPUT_FORGOT_VALIDATION_SCHEMA = z.object({
  email: z
    .string()
    .min(1, "E-mail is required")
    .email({ message: "Invalid email address" }),
});

const LOGIN_VALIDATION_SCHEMA = z.object({
  email: z
    .string()
    .min(1, "E-mail is required")
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(1, "Password is required")
    .regex(
      REGEX_PASSWORD,
      "Password must contain Upper case, lower case, special character and min length 6",
    ),
});

const RESET_PASSWORD_VALIDATION_SCHEMA = z
  .object({
    code: z.string().min(6, "Code must be of 6 digits"),

    password: z
      .string()
      .min(1, "Password is required")
      .regex(
        REGEX_PASSWORD,
        "Password must contain Upper case, lower case, special character and min length 6",
      ),

    confirm: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords must match",
    path: ["confirm"],
  });

const SIGN_UP_VALIDATION_SCHEMA = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .regex(REGEX_NAME, "Name can only contain letters"),

    lastName: z
      .string()
      .min(1, "Last name is required")
      .regex(REGEX_NAME, "Last name can only contain letters"),

    email: z
      .string()
      .min(1, "E-mail is required")
      .email({ message: "Invalid email address" }),

    password: z
      .string()
      .min(1, "Password is required")
      .regex(
        REGEX_PASSWORD,
        "Password must contain Upper case, lower case, special character and min length 6",
      ),

    confirm: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords must match",
    path: ["confirm"],
  });

const STOCK_VALIDATION_SCHEMA = z
  .object({
    serialNumber: z
      .string()
      .min(1, "Serial number is required")
      .regex(REGEX_SERIAL, "Only numbers, letters, and ().- allowed"),
    model: z
      .string()
      .min(1, "Model is required")
      .regex(REGEX_SERIAL, "Only numbers, letters, and ().- allowed"),
    typeEquipment: z.string().min(1, "Type of equipment required"),
    tradeMark: z.string().min(1, "Trademark required"),
    store: z
      .string()
      .min(1, "Store is required")
      .regex(REGEX_SERIAL, "Only numbers, letters, and ().- allowed"),
    calibrationDate: z.string(),
    qualityOfService: z.string().min(1, "QoS is required"),
    remarks: z
      .string()
      .optional()
      .refine(
        (value) => {
          if (value) {
            return REGEX_SERIAL.test(value);
          }
          return true;
        },
        {
          message: "Only numbers, letters, and ().- allowed",
        },
      ),
    otherTypeEquipment: z
      .string()
      //.regex(REGEX_SERIAL, "Only numbers, letters, and ().- allowed")
      .optional()
      .refine(
        (other) => {
          if (other) {
            return REGEX_SERIAL.test(other);
          }
          return true;
        },
        {
          message: "Only numbers, letters, and ().- allowed",
        },
      ),
    otherTrademark: z
      .string()
      //.regex(REGEX_SERIAL, "Only numbers, letters, and ().- allowed")
      .optional()
      .refine(
        (other) => {
          if (other) {
            return REGEX_SERIAL.test(other);
          }
          return true;
        },
        {
          message: "Only numbers, letters, and ().- allowed",
        },
      ),
  })
  .refine(
    (data) => {
      if (data.typeEquipment === "others") {
        return data.otherTypeEquipment?.trim() !== "";
      }
      return true;
    },
    {
      message: "Please specify other type equipment",
      path: ["otherTypeEquipment"],
    },
  )
  .refine(
    (data) => {
      if (data.tradeMark === "others") {
        return data.otherTrademark?.trim() !== "";
      }
      return true;
    },
    {
      message: "Please specify other trademark",
      path: ["otherTrademark"],
    },
  );

const LevelCertificatesSchema = z.object({
  name: z.any(),
  uid: z.any(),
});

const userCertificatesSchema = z.object({
  uid: z.string().min(1, "UID is required"),
  levels: z
    .array(LevelCertificatesSchema)
    .nonempty({ message: "Can't be empty!" }),
});

const CertificateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  uid: z.string().min(1, "UID is required"),
  levels: z
    .array(LevelCertificatesSchema)
    .nonempty({ message: "Can't be empty!" }),
});

const CustomerSchema = z.object({
  uid: z.string().min(1, "UID is required"),
  name: z.string().regex(REGEX_NAME, "Only letters").min(1, "Name is required"),
});

const STAFF_VALIDATION_SCHEMA = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(REGEX_NAME, "Name can only contain letters"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .regex(REGEX_NAME, "Name can only contain letters"),

  email: z
    .string()
    .min(1, "E-mail is required")
    .email({ message: "Invalid email address" }),

  degree: z.string().min(1, "Degree is required"),

  certificates: z
    .array(userCertificatesSchema)
    .nonempty({ message: "Can't be empty!" }),

  roles: z.string().array().nonempty({
    message: "Can't be empty!",
  }),
});

const FILTER_STAFF_VALIDATION_SCHEMA = z.object({
  name: z
    .string()
    .regex(REGEX_NAME, "Name can only contain letters")
    .optional(),
  emailFilter: z.string().optional(),
  rolesFilter: z.array(z.string()).optional(),
});

const WORKS_FILTER_VALIDATION_SCHEMA = z
  .object({
    startDate: z.string(),
    endDate: z.string(),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      if (startDate && endDate) {
        return startDate <= endDate;
      }
    },
    {
      message: "Start date must be before end date",
      path: ["startDate"], // you can specify a path to set the error on a specific field
    },
  );

const WORKS_VALIDATION_SCHEMA = z
  .object({
    typeWork: z
      .array(CertificateSchema)
      .nonempty({ message: "Can't be empty!" }),

    workers: z
      .array(STAFF_VALIDATION_SCHEMA)
      .nonempty({ message: "Can't be empty!" }),

    customer: CustomerSchema,

    startDate: z.string().min(1, "Can't be empty!"),

    endDate: z.string().min(1, "Can't be empty!"),

    reportNumber: z.string().min(1, "Can't be empty!"),

    reportPlace: z.string().min(1, "Can't be empty!"),

    invoiceNumber: z.string().min(1, "Can't be empty!"),

    distance: z
      .any()
      .transform((value) => Number(value))
      .optional(),
    travelFrom: z.string().optional(),
    travelTo: z.string().optional(),
    traveling: z.boolean().optional(),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return startDate <= endDate;
    },
    {
      message: "Start date must be before end date",
      path: ["startDate"],
    },
  )
  .refine(
    (value) => {
      if (value.distance) {
        return !isNaN(value.distance);
      }
      return true;
    },
    {
      message: "Distance must be a valid number",
    },
  );

const CHANGE_PASSWORD_SCHEMA = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .regex(
        REGEX_PASSWORD,
        "Password must contain Upper case, lower case, special character and min length 6",
      ),

    confirm: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords must match",
    path: ["confirm"],
  });

const WORK_HOURS_VALIDATION_SCHEMA = z
  .object({
    date: z.string().min(1, "Can't be empty!"),
    client: CustomerSchema,
    location: z.string().min(1, "Can't be empty!"),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "Invalid time format, must be HH:mm",
    }),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "Invalid time format, must be HH:mm",
    }),
    ndtMethods: z.array(CertificateSchema).optional(),
    note: z.string().optional(),
    traveling: z.boolean().optional(),
  })
  .refine(
    (data) => {
      const startMinutes = timeToMinutes(data.startTime);
      let endMinutes = timeToMinutes(data.endTime);

      if (endMinutes <= startMinutes) {
        endMinutes += 1440; // 1440 minutos = 24 horas
      }

      return startMinutes < endMinutes;
    },
    {
      message: "Start time must be before end time",
      path: ["startTime"],
    },
  )
  .refine(
    (data) => {
      if (!data.traveling) {
        if ((!data.ndtMethods || data.ndtMethods.length === 0) && !data.note) {
          return false;
        }
      }
      return true;
    },
    {
      message: "You must provide a description if no exist NDT method",
      path: ["note"],
    },
  );

const PROFILE_VALIDATION_SCHEMA = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(REGEX_NAME, "Name can only contain letters"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .regex(REGEX_NAME, "Last name can only contain letters"),

  degree: z.string().min(1, "Degree is required"),
});

export {
  USER_INPUT_FORGOT_VALIDATION_SCHEMA,
  LOGIN_VALIDATION_SCHEMA,
  RESET_PASSWORD_VALIDATION_SCHEMA,
  SIGN_UP_VALIDATION_SCHEMA,
  STOCK_VALIDATION_SCHEMA,
  STAFF_VALIDATION_SCHEMA,
  WORKS_VALIDATION_SCHEMA,
  CHANGE_PASSWORD_SCHEMA,
  WORK_HOURS_VALIDATION_SCHEMA,
  PROFILE_VALIDATION_SCHEMA,
  WORKS_FILTER_VALIDATION_SCHEMA,
  FILTER_STAFF_VALIDATION_SCHEMA,
};
