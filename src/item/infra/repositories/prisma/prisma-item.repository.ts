import { PrismaClient } from "@prisma/client";
import { ItemRepository } from "../../../domain/repositories/item.repository";
import { Item } from "../../../domain/entities/item.entity";
import { ItemNotFoundException } from "../../../domain/exceptions/item-not-fount.exception";

export class ItemRepositoryPrisma implements ItemRepository {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async create(item: Item): Promise<Item> {
    const createdItem = await this.prisma.item.create({
      data: {
        name: item.name,
        price: item.price,
      },
    });
    return new Item(createdItem);
  }

  async findAll(): Promise<Item[]> {
    const items = await this.prisma.item.findMany();
    return items.map((item) => new Item(item));
  }

  async findById(id: number): Promise<Item | null> {
    const item = await this.prisma.item.findUnique({
      where: { id },
    });
    if (!item) return null;
    return new Item(item);
  }

  async update(id: number, item: Item): Promise<Item> {
    const existingItem = await this.prisma.item.findUnique({ where: { id } });
    if (!existingItem) throw new ItemNotFoundException();

    const updatedItem = await this.prisma.item.update({
      where: { id },
      data: {
        name: item.name,
        price: item.price,
      },
    });
    return new Item(updatedItem);
  }

  async delete(id: number): Promise<void> {
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item) throw new ItemNotFoundException();
    await this.prisma.item.delete({
      where: { id },
    });
  }
}
