import { IItem } from './IItem.interface';

export class Connector implements IItem {

  constructor(
    public _id: string,
    public name: string,
    public type: string,
    public count: number) { }

}
