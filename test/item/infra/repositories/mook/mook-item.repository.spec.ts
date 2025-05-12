import { MockItemRepository } from '../../../../../src/item/infra/repositories/mook/mook-item.repository';
import { Item } from '../../../../../src/item/domain/entities/item.entity';
import { CreateItemDto } from '../../../../../src/item/application/dto/create-item.dto';
import { UpdateItemDto } from '../../../../../src/item/application/dto/update-item.dto';
import { ItemNotFoundException } from '../../../../../src/item/domain/exceptions/item-not-fount.exception';

describe('MockItemRepository', () => {
  let repository: MockItemRepository;

  beforeEach(() => {
    // Create a new instance before each test to ensure isolation
    repository = new MockItemRepository();
    // Manually reset the internal state if necessary (though new instance should handle this)
    repository.clear();
  });

  describe('create', () => {
    it('should create and return a new item with an incrementing ID', async () => {
      const createItemDto: CreateItemDto = { name: 'New Item', price: 10 };
      const createdItem = await repository.create(createItemDto);

      expect(createdItem).toBeInstanceOf(Item);
      expect(createdItem.id).toBe(1);
      expect(createdItem.name).toBe('New Item');
      expect(createdItem.price).toBe(10);

      const allItems = await repository.findAll();
      expect(allItems).toHaveLength(1);
      expect(allItems[0]).toBe(createdItem);

      const anotherCreateItemDto: CreateItemDto = { name: 'Another Item', price: 20 };
      const anotherCreatedItem = await repository.create(anotherCreateItemDto);
      expect(anotherCreatedItem.id).toBe(2);
    });
  });

  describe('update', () => {
    it('should update an existing item and return the updated item', async () => {
      const initialItem = await repository.create({ name: 'Original', price: 10 });
      const updateItemDto: UpdateItemDto = { name: 'Updated', price: 20 };
      const updatedItem = await repository.update(initialItem.id as number, updateItemDto);

      expect(updatedItem.id).toBe(initialItem.id);
      expect(updatedItem.name).toBe('Updated');
      expect(updatedItem.price).toBe(20);

      const foundItem = await repository.findById(initialItem.id as number);
      expect(foundItem?.name).toBe('Updated');
      expect(foundItem?.price).toBe(20);
    });

    it('should only update specified fields', async () => {
      const initialItem = await repository.create({ name: 'Original', price: 10 });
      const updateItemDto: UpdateItemDto = { name: 'Updated Name Only' };
      const updatedItem = await repository.update(initialItem.id as number, updateItemDto);

      expect(updatedItem.id).toBe(initialItem.id);
      expect(updatedItem.name).toBe('Updated Name Only');
      expect(updatedItem.price).toBe(10); // Price should remain unchanged

      const updateItemDtoPriceOnly: UpdateItemDto = { price: 30 };
      const updatedItemPrice = await repository.update(initialItem.id as number, updateItemDtoPriceOnly);

      expect(updatedItemPrice.id).toBe(initialItem.id);
      expect(updatedItemPrice.name).toBe('Updated Name Only'); // Name should remain unchanged
      expect(updatedItemPrice.price).toBe(30);
    });


    it('should throw ItemNotFoundException if item to update is not found', async () => {
      const updateItemDto: UpdateItemDto = { name: 'Updated', price: 20 };
      await expect(repository.update(999, updateItemDto)).rejects.toThrow(ItemNotFoundException);
    });
  });

  describe('findById', () => {
    it('should return the item if found by ID', async () => {
      const item1 = await repository.create({ name: 'Item 1', price: 10 });
      const item2 = await repository.create({ name: 'Item 2', price: 20 });

      const foundItem = await repository.findById(item1.id as number);
      expect(foundItem).toBe(item1);
    });

    it('should return null if item is not found by ID', async () => {
      await repository.create({ name: 'Item 1', price: 10 });
      const foundItem = await repository.findById(999);
      expect(foundItem).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return an empty array if no items exist', async () => {
      const allItems = await repository.findAll();
      expect(allItems).toEqual([]);
    });

    it('should return all items', async () => {
      const item1 = await repository.create({ name: 'Item 1', price: 10 });
      const item2 = await repository.create({ name: 'Item 2', price: 20 });

      const allItems = await repository.findAll();
      expect(allItems).toHaveLength(2);
      expect(allItems).toEqual([item1, item2]);
    });
  });

  describe('delete', () => {
    it('should delete an item by ID', async () => {
      const item1 = await repository.create({ name: 'Item 1', price: 10 });
      const item2 = await repository.create({ name: 'Item 2', price: 20 });

      await repository.delete(item1.id as number);

      const allItems = await repository.findAll();
      expect(allItems).toHaveLength(1);
      expect(allItems).toEqual([item2]);

      const foundItem = await repository.findById(item1.id as number);
      expect(foundItem).toBeNull();
    });

    it('should throw ItemNotFoundException if item to delete is not found', async () => {
      await repository.create({ name: 'Item 1', price: 10 });
      await expect(repository.delete(999)).rejects.toThrow(ItemNotFoundException);
    });
  });
});
