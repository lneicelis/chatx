import * as Joi from 'joi';

export const channelCreate = Joi.object().keys({
  id: Joi.string().alphanum().min(10).max(50).optional(),
  title: Joi.string().required()
});

export const channelUpdate = Joi.object().keys({
  title: Joi.string().required()
});