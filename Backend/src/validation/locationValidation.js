import Joi from "joi";

export const locationSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().allow(null, ""),
  capacity: Joi.number().min(0).required(),
});