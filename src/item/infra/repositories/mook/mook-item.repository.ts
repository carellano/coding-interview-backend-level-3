import { Item } from "../../../domain/entities/item.entity";
import { ItemRepository } from "../../../domain/repositories/item.repository";
import { ItemNotFoundException } from "../../../domain/exceptions/item-not-fount.exception";
import { CreateItemDto } from "../../../application/dto/create-item.dto";
import { UpdateItemDto } from "../../../application/dto/update-item.dto";

export class MockItemRepository implements ItemRepository {
  private _idCounter = 1;
  private _items: Array<Item> = [];

  async clear(): Promise<void> {
    this._idCounter = 1;
    this._items = [];
  }

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const newItem = new Item({
      ...createItemDto,
      id: this._idCounter++,
    });
    this._items.push(newItem);
    return newItem;
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const index = this._items.findIndex((i) => i.id === id);
    if (index === -1) throw new ItemNotFoundException();
    const item = this._items[index];
    if (updateItemDto.name) {
      item.name = updateItemDto.name;
    }
    if (updateItemDto.price) {
      item.price = updateItemDto.price;
    }
    this._items[index] = item;
    return item;
  }

  async findById(id: number): Promise<Item | null> {
    const item = this._items.find((i) => i.id === id);
    return item ?? null;
  }

  async findAll(): Promise<Array<Item>> {
    return this._items;
  }

  async delete(id: number): Promise<void> {
    const index = this._items.findIndex((i) => i.id === id);
    if (index === -1) throw new ItemNotFoundException();
    this._items.splice(index, 1);
  }
}
