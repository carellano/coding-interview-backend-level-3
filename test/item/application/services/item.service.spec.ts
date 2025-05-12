import { ItemService } from "../../../../src/item/application/services/item.service";
import { ItemRepository } from "../../../../src/item/domain/repositories/item.repository";
import { Item } from "../../../../src/item/domain/entities/item.entity";
import { CreateItemDto } from "../../../../src/item/application/dto/create-item.dto";
import { UpdateItemDto } from "../../../../src/item/application/dto/update-item.dto";
import { ItemNotFoundException } from "../../../../src/item/domain/exceptions/item-not-fount.exception";

describe("ItemService", () => {
  let itemService: ItemService;
  let itemRepositoryMock: jest.Mocked<ItemRepository>;

  beforeEach(() => {
    // Create a mock for the ItemRepository
    itemRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    // Instantiate the service with the mock repository
    itemService = new ItemService(itemRepositoryMock);
  });

  // Test case for creating an item
  describe("create Item", () => {
    it("should create an item successfully", async () => {
      const createItemDto: CreateItemDto = { name: "Test Item", price: 100 };
      const createdItem = new Item({ id: 1, ...createItemDto });
      itemRepositoryMock.create.mockResolvedValue(createdItem);

      const result = await itemService.create(createItemDto);

      expect(itemRepositoryMock.create).toHaveBeenCalledWith(createItemDto);
      expect(result).toBe(createdItem);
    });
  });

  // Test case for finding an item by ID
  describe("get Item By Id", () => {
    it("should return an item if found", async () => {
      const itemId = 1;
      const foundItem = new Item({ id: itemId, name: "Item", price: 200 });
      itemRepositoryMock.findById.mockResolvedValue(foundItem);

      const result = await itemService.findById(itemId);

      expect(itemRepositoryMock.findById).toHaveBeenCalledWith(itemId);
      expect(result).toBe(foundItem);
    });

    it("should null if item is not found", async () => {
      const itemId = 0;
      itemRepositoryMock.findById.mockResolvedValue(null);

      await expect(itemService.findById(itemId)).resolves.toBe(null);
      expect(itemRepositoryMock.findById).toHaveBeenCalledWith(itemId);
    });
  });

  // Test case for finding all items
  describe("get All Items", () => {
    it("should return an array of items", async () => {
      const items = [
        new Item({ id: 1, name: "Item 1", price: 10 }),
        new Item({ id: 2, name: "Item 2", price: 20 }),
      ];
      itemRepositoryMock.findAll.mockResolvedValue(items);

      const result = await itemService.findAll();

      expect(itemRepositoryMock.findAll).toHaveBeenCalled();
      expect(result).toBe(items);
    });
  });

  // Test case for updating an item
  describe("update Item", () => {
    it("should update an item successfully", async () => {
      const itemId = 1;
      const updateItemDto: UpdateItemDto = { name: "Updated Item", price: 150 };
      const existingItem = new Item({
        id: itemId,
        name: "Original Item",
        price: 100,
      });
      const updatedItem = new Item({
        id: itemId,
        name: "Updated Item",
        price: 150,
      });

      itemRepositoryMock.findById.mockResolvedValue(existingItem);
      itemRepositoryMock.update.mockResolvedValue(updatedItem);

      const result = await itemService.update(itemId, updateItemDto);

      expect(itemRepositoryMock.findById).toHaveBeenCalledWith(itemId);
      expect(itemRepositoryMock.update).toHaveBeenCalledWith(itemId, {
        id: itemId,
        ...updateItemDto,
      });
      expect(result).toBe(updatedItem);
    });

    it("should throw ItemNotFoundException if item to update is not found", async () => {
      const itemId = 0;
      const updateItemDto: UpdateItemDto = { name: "Updated Item", price: 150 };
      itemRepositoryMock.findById.mockResolvedValue(null);

      await expect(itemService.update(itemId, updateItemDto)).rejects.toThrow(
        ItemNotFoundException
      );
      expect(itemRepositoryMock.findById).toHaveBeenCalledWith(itemId);
      expect(itemRepositoryMock.update).not.toHaveBeenCalled();
    });
  });

  // Test case for deleting an item
  describe("delete Item", () => {
    it("should delete an item successfully", async () => {
      const itemId = 1;
      const itemToDelete = new Item({
        id: itemId,
        name: "Item to Delete",
        price: 50,
      });
      itemRepositoryMock.findById.mockResolvedValue(itemToDelete);
      itemRepositoryMock.delete.mockResolvedValue();

      await itemService.delete(itemId);

      expect(itemRepositoryMock.findById).toHaveBeenCalledWith(itemId);
      expect(itemRepositoryMock.delete).toHaveBeenCalledWith(itemId);
    });

    it("should throw ItemNotFoundException if item to delete is not found", async () => {
      const itemId = 0;
      itemRepositoryMock.findById.mockResolvedValue(null);

      await expect(itemService.delete(itemId)).rejects.toThrow(
        ItemNotFoundException
      );
      expect(itemRepositoryMock.findById).toHaveBeenCalledWith(itemId);
      expect(itemRepositoryMock.delete).not.toHaveBeenCalled();
    });
  });
});
