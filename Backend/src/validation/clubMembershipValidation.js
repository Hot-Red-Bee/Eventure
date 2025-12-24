import Joi from "joi";

export const createClubMembershipSchema = Joi.object({
  userId: Joi.number().integer().required(),
  clubId: Joi.number().integer().required(),
  role: Joi.string().valid("MEMBER", "ADMIN", "PRESIDENT").default("MEMBER"),
});

export const updateClubMembershipSchema = Joi.object({
  role: Joi.string().valid("MEMBER", "ADMIN", "PRESIDENT"),
});
