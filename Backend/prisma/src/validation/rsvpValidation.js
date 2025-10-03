// validations/rsvpValidation.js
import Joi from "joi";

export const rsvpSchema = Joi.object({
  eventId: Joi.string().uuid().required(),
  userId: Joi.string().uuid().required(),
  notes: Joi.string().allow(null, ""),
  status: Joi.string().valid("GOING", "INTERESTED", "NOT_GOING").default("GOING"),
});
