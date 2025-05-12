export class ItemNotFoundException extends Error {
  constructor(message: string = 'Item not found') {
    super(message);
  }
}