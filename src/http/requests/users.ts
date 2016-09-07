import * as Joi from 'joi';

export const userCreate = Joi.object().keys({
  id: Joi.string().alphanum().min(10).max(50).optional(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  readChannels: Joi.array().default([]),
  writeChannels: Joi.array().default([])
});

export const userUpdate = Joi.object().keys({
  readChannels: Joi.array().default([]),
  writeChannels: Joi.array().default([])
});