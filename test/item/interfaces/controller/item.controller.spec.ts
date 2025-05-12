import { Request, ResponseToolkit } from "@hapi/hapi";
import { ItemController } from "../../../../src/item/interfaces/controller/item.controller";
import { ItemService } from "../../../../src/item/application/services/item.service";
import { CreateItemDto } from "../../../../src/item/application/dto/create-item.dto";
import { UpdateItemDto } from "../../../../src/item/application/dto/update-item.dto";
import { Item } from "../../../../src/item/domain/entities/item.entity";

// Mock the ItemService
const mockItemService = {
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// Helper to create a mock ResponseToolkit that supports chaining
const createMockResponseToolkit = () => {
  const responseMock = {
    code: jest.fn().mockReturnThis(), 
  };
  const hMock = {
    response: jest.fn(() => responseMock),
  };
  return hMock as unknown as ResponseToolkit & { response: jest.Mock }; // Cast and expose the mock
};


describe('ItemController', () => {
  let itemController: ItemController;
  let itemService: ItemService;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Cast the mock object to the ItemService type
    itemService = mockItemService as unknown as ItemService;
    itemController = new ItemController(itemService);
  });

  describe('createItem', () => {
    it('should create an item and return 201', async () => {
      const createItemDto: CreateItemDto = { name: 'Test Item', price: 100 };
      const newItem: Item = { id: 1, name: 'Test Item', price: 100 };

      // Mock the service method to return the new item
      mockItemService.create.mockResolvedValue(newItem);

      // Mock Hapi request and response toolkit
      const mockRequest = {
        payload: createItemDto,
      } as Request;

      const mockResponseToolkit = createMockResponseToolkit();

      // Call the controller method
      await itemController.createItem(mockRequest, mockResponseToolkit);

      // Assertions
      expect(mockItemService.create).toHaveBeenCalledWith(createItemDto);
      expect(mockResponseToolkit.response).toHaveBeenCalledWith(newItem);
      // Get the response object returned by the first call to response()
      const responseResult = mockResponseToolkit.response.mock.results[0].value;
      expect(responseResult.code).toHaveBeenCalledWith(201);
    });

    it('should return 500 if item creation fails', async () => {
      const createItemDto: CreateItemDto = { name: 'Test Item', price: 100 };
      const errorMessage = 'Failed to create item';

      // Mock the service method to throw an error
      mockItemService.create.mockRejectedValue(new Error(errorMessage));

      // Mock Hapi request and response toolkit
      const mockRequest = {
        payload: createItemDto,
      } as Request;

      const mockResponseToolkit = createMockResponseToolkit();

      // Call the controller method
      await itemController.createItem(mockRequest, mockResponseToolkit);

      // Assertions
      expect(mockItemService.create).toHaveBeenCalledWith(createItemDto);
      expect(mockResponseToolkit.response).toHaveBeenCalledWith({ error: errorMessage });
      // Get the response object returned by the first call to response()
      const responseResult = mockResponseToolkit.response.mock.results[0].value;
      expect(responseResult.code).toHaveBeenCalledWith(500);
    });
  });

  describe('getItem', () => {
    it('should return an item and return 200', async () => {
      const itemId = 1;
      const foundItem: Item = { id: itemId, name: 'Found Item', price: 200 };

      // Mock the service method to return the item
      mockItemService.findById.mockResolvedValue(foundItem);

      // Mock Hapi request and response toolkit
      const mockRequest = {
        params: { id: itemId.toString() }, // Hapi params are strings
      } as unknown as Request; // Cast to Request type

      const mockResponseToolkit = createMockResponseToolkit();

      // Call the controller method
      await itemController.getItem(mockRequest, mockResponseToolkit);

      // Assertions
      expect(mockItemService.findById).toHaveBeenCalledWith(itemId);
      expect(mockResponseToolkit.response).toHaveBeenCalledWith(foundItem);
      // Get the response object returned by the first call to response()
      const responseResult = mockResponseToolkit.response.mock.results[0].value;
      expect(responseResult.code).toHaveBeenCalledWith(200);
    });

    it('should return 404 if item is not found', async () => {
      const itemId = 99; // Assuming this ID won't be found

      // Mock the service method to return null (item not found)
      mockItemService.findById.mockResolvedValue(null);

      // Mock Hapi request and response toolkit
      const mockRequest = {
        params: { id: itemId.toString() },
      } as unknown as Request;

      const mockResponseToolkit = createMockResponseToolkit();

      // Call the controller method
      await itemController.getItem(mockRequest, mockResponseToolkit);

      // Assertions
      expect(mockItemService.findById).toHaveBeenCalledWith(itemId);
      expect(mockResponseToolkit.response).toHaveBeenCalledWith({ error: "Item not found" });
      // Get the response object returned by the first call to response()
      const responseResult = mockResponseToolkit.response.mock.results[0].value;
      expect(responseResult.code).toHaveBeenCalledWith(404);
    });

    it('should return 500 if fetching item fails', async () => {
      const itemId = 1;
      const errorMessage = 'Failed to fetch item';

      // Mock the service method to throw an error
      mockItemService.findById.mockRejectedValue(new Error(errorMessage));

      // Mock Hapi request and response toolkit
      const mockRequest = {
        params: { id: itemId.toString() },
      } as unknown as Request;

      const mockResponseToolkit = createMockResponseToolkit();

      // Call the controller method
      await itemController.getItem(mockRequest, mockResponseToolkit);

      // Assertions
      expect(mockItemService.findById).toHaveBeenCalledWith(itemId);
      expect(mockResponseToolkit.response).toHaveBeenCalledWith({ error: errorMessage });
      // Get the response object returned by the first call to response()
      const responseResult = mockResponseToolkit.response.mock.results[0].value;
      expect(responseResult.code).toHaveBeenCalledWith(500);
    });
  });

  describe('getAllItems', () => {
    it('should return all items and return 200', async () => {
      const items: Item[] = [
        { id: 1, name: 'Item 1', price: 10 },
        { id: 2, name: 'Item 2', price: 20 },
      ];

      // Mock the service method to return the list of items
      mockItemService.findAll.mockResolvedValue(items);

      // Mock Hapi request and response toolkit
      const mockRequest = {} as Request;
      const mockResponseToolkit = createMockResponseToolkit();

      // Call the controller method
      await itemController.getAllItems(mockRequest, mockResponseToolkit);

      // Assertions
      expect(mockItemService.findAll).toHaveBeenCalled();
      expect(mockResponseToolkit.response).toHaveBeenCalledWith(items);
      // Get the response object returned by the first call to response()
      const responseResult = mockResponseToolkit.response.mock.results[0].value;
      expect(responseResult.code).toHaveBeenCalledWith(200);
    });

    it('should return an empty array and return 200 if no items are found', async () => {
      const items: Item[] = [];

      // Mock the service method to return an empty array
      mockItemService.findAll.mockResolvedValue(items);

      // Mock Hapi request and response toolkit
      const mockRequest = {} as Request;
      const mockResponseToolkit = createMockResponseToolkit();

      // Call the controller method
      await itemController.getAllItems(mockRequest, mockResponseToolkit);

      // Assertions
      expect(mockItemService.findAll).toHaveBeenCalled();
      expect(mockResponseToolkit.response).toHaveBeenCalledWith(items);
      // Get the response object returned by the first call to response()
      const responseResult = mockResponseToolkit.response.mock.results[0].value;
      expect(responseResult.code).toHaveBeenCalledWith(200);
    });

    it('should return 500 if fetching all items fails', async () => {
      const errorMessage = 'Failed to fetch items';

      // Mock the service method to throw an error
      mockItemService.findAll.mockRejectedValue(new Error(errorMessage));

      // Mock Hapi request and response toolkit
      const mockRequest = {} as Request;
      const mockResponseToolkit = createMockResponseToolkit();

      // Call the controller method
      await itemController.getAllItems(mockRequest, mockResponseToolkit);

      // Assertions
      expect(mockItemService.findAll).toHaveBeenCalled();
      expect(mockResponseToolkit.response).toHaveBeenCalledWith({ error: errorMessage });
      // Get the response object returned by the first call to response()
      const responseResult = mockResponseToolkit.response.mock.results[0].value;
      expect(responseResult.code).toHaveBeenCalledWith(500);
    });
  });

  describe('updateItem', () => {
    it('should update an item and return 200', async () => {
      const itemId = 1;
      const updateItemDto: UpdateItemDto = { name: 'Updated Item', price: 250 };
      const updatedItem: Item = { id: itemId, name: 'Updated Item', price: 250 };

      // Mock the service method to return the updated item
      mockItemService.update.mockResolvedValue(updatedItem);

      // Mock Hapi request and response toolkit
      const mockRequest = {
        params: { id: itemId.toString() },
        payload: updateItemDto,
      } as unknown as Request;

      const mockResponseToolkit = createMockResponseToolkit();

      // Call the controller method
      await itemController.updateItem(mockRequest, mockResponseToolkit);

      // Assertions
      expect(mockItemService.update).toHaveBeenCalledWith(itemId, updateItemDto);
      expect(mockResponseToolkit.response).toHaveBeenCalledWith(updatedItem);
      // Get the response object returned by the first call to response()
      const responseResult = mockResponseToolkit.response.mock.results[0].value;
      expect(responseResult.code).toHaveBeenCalledWith(200);
    });

    it('should return 500 if item update fails', async () => {
      const itemId = 1;
      const updateItemDto: UpdateItemDto = { name: 'Updated Item', price: 250 };
      const errorMessage = 'Failed to update item';

      // Mock the service method to throw an error
      mockItemService.update.mockRejectedValue(new Error(errorMessage));

      // Mock Hapi request and response toolkit
      const mockRequest = {
        params: { id: itemId.toString() },
        payload: updateItemDto,
      } as unknown as Request;

      const mockResponseToolkit = createMockResponseToolkit();

      // Call the controller method
      await itemController.updateItem(mockRequest, mockResponseToolkit);

      // Assertions
      expect(mockItemService.update).toHaveBeenCalledWith(itemId, updateItemDto);
      expect(mockResponseToolkit.response).toHaveBeenCalledWith({ error: errorMessage });
      // Get the response object returned by the first call to response()
      const responseResult = mockResponseToolkit.response.mock.results[0].value;
      expect(responseResult.code).toHaveBeenCalledWith(500);
    });
  });

  describe('deleteItem', () => {
    it('should delete an item and return 204', async () => {
      const itemId = 1;

      // Mock the service method to resolve successfully
      mockItemService.delete.mockResolvedValue(undefined); // delete doesn't return a value

      // Mock Hapi request and response toolkit
      const mockRequest = {
        params: { id: itemId.toString() },
      } as unknown as Request;

      const mockResponseToolkit = createMockResponseToolkit();

      // Call the controller method
      await itemController.deleteItem(mockRequest, mockResponseToolkit);

      // Assertions
      expect(mockItemService.delete).toHaveBeenCalledWith(itemId);
      // For 204, response() is called without arguments
      expect(mockResponseToolkit.response).toHaveBeenCalledWith();
      // Get the response object returned by the first call to response()
      const responseResult = mockResponseToolkit.response.mock.results[0].value;
      expect(responseResult.code).toHaveBeenCalledWith(204);
    });

    it('should return 500 if item deletion fails', async () => {
      const itemId = 1;
      const errorMessage = 'Failed to delete item';

      // Mock the service method to throw an error
      mockItemService.delete.mockRejectedValue(new Error(errorMessage));

      // Mock Hapi request and response toolkit
      const mockRequest = {
        params: { id: itemId.toString() },
      } as unknown as Request;

      const mockResponseToolkit = createMockResponseToolkit();

      // Call the controller method
      await itemController.deleteItem(mockRequest, mockResponseToolkit);

      // Assertions
      expect(mockItemService.delete).toHaveBeenCalledWith(itemId);
      expect(mockResponseToolkit.response).toHaveBeenCalledWith({ error: errorMessage });
      // Get the response object returned by the first call to response()
      const responseResult = mockResponseToolkit.response.mock.results[0].value;
      expect(responseResult.code).toHaveBeenCalledWith(500);
    });
  });
});
