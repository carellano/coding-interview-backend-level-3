import Joi from "joi";

export const ItemUpdateSchema = Joi.object({
  name: Joi.string().messages({
    "string.base": 'Field "name" must be a string',
  }),
  price: Joi.number().positive().messages({
    "number.positive": 'Field "price" cannot be negative',
  }),
})
  .or("name", "price")
  .messages({
    "object.missing": 'At least one field ("name" or "price") must be provided',
  });

export interface UpdateItemDto {
  name?: string;
  price?: number;
}
