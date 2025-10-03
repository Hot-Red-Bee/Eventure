import Joi from "joi";

export const clubSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().allow(null, ""),
  contactEmail: Joi.string().email().allow(null),
  logo: Joi.string().uri().allow(null),
});