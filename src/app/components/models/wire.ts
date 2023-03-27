import { Connector } from './connector';

export class Wire {

  constructor(

    public _id: string,
    public name: string,
    public firstconn: Connector[],
    public secondconn: Connector[],
    public coil: string,
    public length: number,
    public numberofconnectors: number

  ) { }

}
