import { ItemEmptyNameException } from "../exceptions/item-empty-name.exception";
import { ItemPriceNotNegativeException } from "../exceptions/item-price-not-negative.exception";

export class Item {
  readonly id?: number;
  name: string;
  price: number;
  constructor(args: { id?: number; name: string; price: number }) {
    if (args.price < 0) {
      throw new ItemPriceNotNegativeException();
    }
    if (!args.name) {
      throw new ItemEmptyNameException();
    }
    this.id = args.id;
    this.name = args.name;
    this.price = args.price;
  }
}
