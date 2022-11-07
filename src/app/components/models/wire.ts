import { Coil } from "./coil";

export class Wire {

  constructor(public _id: string, public name: string, public firstconn: string, public secondconn: string, public coil: Coil, public length: number) {}

}
