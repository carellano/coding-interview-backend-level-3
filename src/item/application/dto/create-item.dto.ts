import Joi from "joi";

export const ItemCreateSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": 'Field "name" is required',
    "string.base": 'Field "name" must be a string',
    "string.empty": 'Field "name" is required',
  }),
  price: Joi.number().min(0).required().messages({
    "number.min": 'Field "price" cannot be negative',
    "any.required": 'Field "price" is required',
    "number.base": 'Field "price" must be a number',
  }),
})
  .messages({
    "object.base": 'All fields ("name" and "price") must be provided',
    "object.missing": 'All fields ("name" and "price") must be provided',
  });

export interface CreateItemDto {
  name: string;
  price: number;
}
