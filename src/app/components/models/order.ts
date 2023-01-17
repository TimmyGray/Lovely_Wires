import { IBuy } from "./IBuy.interface";
import { OrderStatus } from './enums';
import { Client } from "./client";

export class Order {

  constructor(
    public _id: string,
    public name: string,
    public client: Client,
    public created: Date,
    public listofbuys: IBuy[],
    public status: OrderStatus) {
  }

}
