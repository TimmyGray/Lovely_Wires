import { Coil } from "./coil";

export class Wire {

  constructor(public _id: string, public wirename: string, public wirefirstconn: string, public wiresecondconn: string, public wirecoil: Coil, public wirelength: number) {}

}
