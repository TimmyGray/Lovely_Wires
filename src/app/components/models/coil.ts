import { IItem } from './IItem.interface';

export class Coil implements IItem {

  constructor(
    public _id: string,
    public name: string,
    public type: string,
    public typeofsignal: string,
    public length: number) { }

}
