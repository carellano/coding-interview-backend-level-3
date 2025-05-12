export class ItemPriceNotNegativeException extends Error {
  constructor(message: string = 'Field "price" cannot be negative') {
    super(message);
  }
}