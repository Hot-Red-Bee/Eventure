// validations/eventValidation.js
import Joi from "joi";

export const eventSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().allow(null, ""),
  date: Joi.date().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  seatLimit: Joi.number().min(0).required(),
  categoryId: Joi.number().required(),
  locationId: Joi.number().required(),
  clubId: Joi.number().allow(null),
  bannerImage: Joi.string().uri().allow(null),
});
