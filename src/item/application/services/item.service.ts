import { Item } from "../../domain/entities/item.entity";
import { ItemNotFoundException } from "../../domain/exceptions/item-not-fount.exception";
import { ItemRepository } from "../../domain/repositories/item.repository";
import { CreateItemDto } from "../dto/create-item.dto";
import { UpdateItemDto } from "../dto/update-item.dto";

export class ItemService {
  constructor(private itemRepository: ItemRepository) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const item = new Item(createItemDto);
    return this.itemRepository.create(item);
  }

  async findAll(): Promise<Item[]> {
    return this.itemRepository.findAll();
  }

  async findById(id: number): Promise<Item | null> {
    return this.itemRepository.findById(id);
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.findById(id);
    if (!item) throw new ItemNotFoundException();

    if (updateItemDto.name !== undefined) {
      item.name = updateItemDto.name;
    }
    if (updateItemDto.price !== undefined) {
      item.price = updateItemDto.price;
    }
    return this.itemRepository.update(id, item); 
  }

  async delete(id: number): Promise<void> {
    const item = await this.findById(id);
    if (!item) throw new ItemNotFoundException();
    return this.itemRepository.delete(id);
  }
}
