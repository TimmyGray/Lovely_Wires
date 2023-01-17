import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Observable } from 'rxjs';
import { Price } from './models/price';
import { Coil } from './models/coil';
import { Connector } from './models/connector';
import { PriceService } from '../services/price.service';
import { CoilService } from '../services/coil.service';
import { ConnectorService } from '../services/connector.service';
import { IItem } from './models/IItem.interface';

@Component({
  selector: 'make-price',
  templateUrl: './html/makeprice.component.html',
  providers: [PriceService, CoilService, ConnectorService]

})
export class MakePriceComponent implements OnInit {

  prices: Price[];
  newPrice: Price;
  editPrice: Price=null!;
  listOfItems: IItem[];
  selectitem: string = "";
  edit: boolean = true;

  constructor(private priceservice: PriceService, private coilservice: CoilService, private connservice: ConnectorService) {

    this.prices = new Array<Price>();
    this.newPrice = new Price("", "", 0, null);
    this.listOfItems = new Array<IItem>();
    

  }


  ngOnInit() {

    this.getPrices();
    this.getItems();

  }

  getPrices() {

    this.priceservice.getPrices().subscribe((data: Array<Price>) => {

      this.prices = data;
      console.log(data);

    },(e) => {

      console.log(e);

    });

  }

  postPrice() {

    console.log(`post price: ${this.newPrice}`);

    this.priceservice.postPrice(this.newPrice).subscribe((data) => {
      const temp = data as Price;
      if (temp.name != null) {

        this.prices.push(data);
        this.newPrice = new Price("", "", 0, null);


      }
      else {

        this.getPrices();

      }

    }, (e) => {

      console.log(e);

    });    

    this.newPrice = new Price("", "", 0, null);


  }

  setItem(){

    const nameandtype = this.selectitem.split('-');
    const item: IItem = this.listOfItems.find(i => i.name == nameandtype[0] && i.type == nameandtype[1]);
    this.newPrice.itemofprice = item;
    console.log(item);
    const edit = this.prices.find(p => p.itemofprice._id == item._id);
    console.log(`editprice: ${edit}`);
    if (edit != undefined) {
      this.newPrice._id = edit._id;
      console.log(`newpriceid:${this.newPrice._id}`);
      this.edit = false;
    }
    else {

      this.edit = true;

    }

  }


  getItems() {
    
    const uniqitems: Set<IItem> = new Set<IItem>();
    
    this.coilservice.getCoils().subscribe((data: Array<Coil>) => {


      data.forEach(coil => {

        uniqitems.add(coil);

      });

    }, (e) => {

      console.log(e);

    });

    this.connservice.getConnectors().subscribe((data: Array<Connector>) => {

      data.forEach(t => {
        uniqitems.add(t);
      });

      console.log(uniqitems);

      this.listOfItems = Array.from(uniqitems);

      console.log(this.listOfItems);


    }, (e) => {

      console.log(e);

    });


  }

  putPrice() {

    console.log(`put price: ${this.newPrice}`);

    this.priceservice.putPrice(this.newPrice).subscribe((data) => {

        this.getPrices();

    },(e) => {

      console.log(e);

    });

  }

  deletePrice(id: string) {

    this.priceservice.deletePrice(id).subscribe((data) => {

      this.getPrices();

    }, (e) => {

      console.log(e);

    });

  }

}
