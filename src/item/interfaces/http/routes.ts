import { Server, Request, ResponseToolkit } from "@hapi/hapi";
import { PrismaClient } from "@prisma/client";

import { ItemService } from "../../application/services/item.service";
import { ItemRepositoryPrisma } from "../../infra/repositories/prisma/prisma-item.repository";
import {
  CreateItemDto,
  ItemCreateSchema,
} from "../../application/dto/create-item.dto";
import {
  ItemUpdateSchema,
  UpdateItemDto,
} from "../../application/dto/update-item.dto";
import { ValidationExceptionParser } from "../../../shared/validation-exception.parser";
import { ItemController } from "../controller/item.controller";

const prisma = new PrismaClient();

export function registerItemRoutes(server: Server) {
  const itemRepository = new ItemRepositoryPrisma(prisma);
  const itemService = new ItemService(itemRepository);
  const itemController = new ItemController(itemService);
  server.route([
    {
      method: "GET",
      path: "/items",
      handler: itemController.getAllItems.bind(itemController),
    },
    {
      method: "GET",
      path: "/items/{id}",
      handler: itemController.getItem.bind(itemController),
    },
    {
      method: "POST",
      path: "/items",
      handler: itemController.createItem.bind(itemController),
      options: {
        validate: {
          payload: ItemCreateSchema,
          failAction: ValidationExceptionParser,
        },
      },
    },
    {
      method: "PUT",
      path: "/items/{id}",
      handler: itemController.updateItem.bind(itemController),
      options: {
        validate: {
          payload: ItemUpdateSchema,
          failAction: ValidationExceptionParser,
        },
      },
    },
    {
      method: "DELETE",
      path: "/items/{id}",
      handler: itemController.deleteItem.bind(itemController),
    },
  ]);
}
