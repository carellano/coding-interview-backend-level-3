import { Request, ResponseToolkit } from "@hapi/hapi";
import { ItemService } from "../../application/services/item.service";
import { CreateItemDto } from "../../application/dto/create-item.dto";
import { UpdateItemDto } from "../../application/dto/update-item.dto";

export class ItemController {
  constructor(private itemService: ItemService) {}
  async createItem(request: Request, h: ResponseToolkit) {
    const createItemDto = request.payload as CreateItemDto;
    try {
      // TODO : add validation
      const newItem = await this.itemService.create(createItemDto);
      return h.response(newItem).code(201);
    } catch (error) {
      return h.response({ error: "Failed to create item" }).code(500);
    }
  }
  async getItem(request: Request, h: ResponseToolkit) {
    const id = Number(request.params.id);
    try {
      const item = await this.itemService.findById(id);
      if (!item) {
        return h.response({ error: "Item not found" }).code(404);
      }
      return h.response(item).code(200);
    } catch (error) {
      return h.response({ error: "Failed to fetch item" }).code(500);
    }
  }
  async getAllItems(request: Request, h: ResponseToolkit) {
    try {
      const items = await this.itemService.findAll();
      if (items.length === 0) {
        return h.response([]).code(200);
      }
      return h.response(items).code(200);
    } catch (error) {
      return h.response({ error: "Failed to fetch items" }).code(500);
    }
  }

  async updateItem(request: Request, h: ResponseToolkit) {
    const id = Number(request.params.id);
    const updateItemDto = request.payload as UpdateItemDto;
    try {
      const item = await this.itemService.update(id, updateItemDto);
      return h.response(item).code(200);
    } catch (error) {
      return h.response({ error: "Failed to update item" }).code(500);
    }
  }

  async deleteItem(request: Request, h: ResponseToolkit) {
    const id = Number(request.params.id);
    try {
      await this.itemService.delete(id);
      return h.response().code(204);
    } catch (error) {
      return h.response({ error: "Failed to delete item" }).code(500);
    }
  }
}
