// validations/attendanceValidation.js
import Joi from "joi";

export const attendanceSchema = Joi.object({
  eventId: Joi.string().uuid().required(),
  userId: Joi.string().uuid().required(),
  status: Joi.string().valid("PRESENT", "ABSENT").default("PRESENT"),
});
