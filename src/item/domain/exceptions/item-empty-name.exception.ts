export class ItemEmptyNameException extends Error {
  constructor(message: string = 'Field "name" is required') {
    super(message);
  }
}