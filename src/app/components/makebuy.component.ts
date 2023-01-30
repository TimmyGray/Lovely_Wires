import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { IBuy } from './models/IBuy.interface';
import { BuyService } from '../services/buy.service';
import { WireService } from '../services/wire.service';
import { PriceService } from '../services/price.service';
import { CoilService } from '../services/coil.service';
import { ConnectorService } from '../services/connector.service';
import { Wire } from './models/wire';
import { Price } from './models/price';
import { Connector } from './models/connector';
import { Coil } from './models/coil';

@Component({

  selector: 'make-buy',
  templateUrl: `./html/makebuy.component.html`,
  providers: [BuyService, WireService, PriceService, CoilService, ConnectorService]

})

export class MakeBuyComponent implements OnInit {

  buys: IBuy[];
  wires: Wire[];
  prices: Price[];
  newbuy: IBuy;
  selectedwire: Wire;
  selectedfirstcon: Connector;
  selectedsecondcon: Connector;
  selectedcoil: Coil;
  editbuy: IBuy;
  firstconprice: Price;
  secondconprice: Price;
  coilprice: Price;
  tempcost: number;
  tempbuy: IBuy;



  constructor(
    private buyserv: BuyService,
    private priceserv: PriceService,
    private wireserv: WireService,
    private coilserv: CoilService,
    private conserv: ConnectorService) {

    this.buys = new Array<IBuy>();
    this.wires = new Array<Wire>();
    this.prices = new Array<Price>();
    this.newbuy = this.resetBuy();
    this.editbuy = this.resetBuy();
    this.firstconprice = this.resetPrice();
    this.secondconprice = this.resetPrice();
    this.coilprice = this.resetPrice();
    this.selectedcoil = this.resetCoil();
    this.selectedfirstcon = this.resetConnector();
    this.selectedsecondcon = this.resetConnector();
    this.resetWire();
  }

  ngOnInit() {

    this.getBuys();
    this.getWires();
    this.getPrices();

  }

  getBuys() {

    this.buyserv.getBuys().subscribe((data) => {

      this.buys = data;
      console.log(this.buys);

    }, (e) => {

      console.log(e);

    });

  }

  getWires() {

    this.wireserv.getWires().subscribe((data) => {

      this.wires = data;
      console.log(this.wires);

    }, (e) => {

      console.log(e);

    });

  }

  getPrices() {

    this.priceserv.getPrices().subscribe((data) => {

      this.prices = data;
      console.log(this.prices);

    }, (e) => {

      console.log(e);

    });

  }

  getBuy(id: string): IBuy | null {

    let tempbuy: IBuy;

    this.buyserv.getBuy(id).subscribe((data: IBuy) => {

      console.log(data);
      tempbuy = data;

    }, (e) => {

      console.log(e);

    });
    if (tempbuy != undefined) {

      return tempbuy;

    }
    return null;

  }

  postBuy() {

    console.log(this.newbuy);

    if (this.newbuy.name != "" && this.newbuy.item != "" && this.newbuy.description != "") {
      let tempBuy: IBuy;
      this.buyserv.postBuy(this.newbuy as IBuy).subscribe((data:IBuy) => {

        console.log(data);

        this.buys.push(data);

      }, (e) => {

        console.log(e);

      });

    }
    else {

      alert("Заполните все необходимые поля");
      console.log("Заполните все необходимые поля");

    }

  }

  putBuy() {

    console.log(this.editbuy);
    this.buyserv.putBuy(this.editbuy as IBuy).subscribe((data: IBuy) => {

      this.editbuy = data;
      console.log(data);

    },(e) => {

      console.log(e);

    });

    
  }

  deleteBuy(id: string, e: Event) {

    e.stopPropagation();

    document.getElementById("cancelEdit").click();

    this.buyserv.deleteBuy(id).subscribe((data) => {

      console.log(data);

    }, (e) => {

      return console.log(e);

    })

    this.getBuys();


  }

  async getConnector(id: string, first: boolean) {


    let connector: Connector = await this.conserv.getConnector(id).toPromise();
  
    console.log(connector);

    return connector;
    //await this.conserv.getConnector(id).subscribe((data: Connector) => {

    //  console.log(data);
    //  if (first) {

    //    this.selectedfirstcon = data;

    //  }
    //  else {

    //    this.selectedsecondcon = data;

    //  }

    //}, (e) => {

    //  console.log(e);
      
    //});

    
  }

  async getCoil(id: string){

    let coil = this.coilserv.getCoil(id).toPromise();

    console.log(coil);

    return coil;

    //this.coilserv.getCoil(id).subscribe((data: Coil) => {

    //  console.log(data);
    //  this.selectedcoil = data;

    //}, (e) => {

    //  console.log(e);

    //});


  }

  async selectItem() {

    this.firstconprice = this.prices.find(p => p.itemofprice._id == this.selectedwire.firstconn);
    this.secondconprice = this.prices.find(p => p.itemofprice._id == this.selectedwire.secondconn);
    this.coilprice = this.prices.find(p => p.itemofprice._id == this.selectedwire.coil);

    this.selectedfirstcon = await this.getConnector(this.selectedwire.firstconn, true);
    this.selectedsecondcon = await this.getConnector(this.selectedwire.secondconn, false);
    this.selectedcoil = await this.getCoil(this.selectedwire.coil);

    this.tempcost = this.firstconprice.cost + this.secondconprice.cost + (this.coilprice.cost * this.selectedwire.length);

    if (this.firstconprice == undefined || this.secondconprice == undefined || this.coilprice == undefined) {
      if (this.firstconprice == undefined) {
        this.firstconprice = this.resetPrice();
      }
      if (this.secondconprice == undefined) {
        this.secondconprice = this.resetPrice();
      }
      if (this.coilprice == undefined) {
        this.coilprice = this.resetPrice();
      }
      alert("Не все цены на компоненты установлены, используйте Price Manager");
      return console.log("Не все цены на компоненты установлены");
    }

    console.log(this.firstconprice);
    console.log(this.secondconprice);
    console.log(this.coilprice);

    console.log(`firstconprice:${this.firstconprice.cost}`);
    console.log(`secondconprice:${this.secondconprice.cost}`);
    console.log(`coilconprice:${this.coilprice.cost}`);
    console.log(this.selectedfirstcon);
    this.changeCost(true);
    this.newbuy.item = `${this.selectedfirstcon.name},${this.selectedfirstcon.type};${this.selectedsecondcon.name},${this.selectedsecondcon.type};${this.selectedcoil.name},${this.selectedcoil.type};${this.selectedwire.length}`;

    console.log(this.newbuy.item);

  }


  editBuy(buy: IBuy) {
    this.tempbuy = Object.assign({},buy);
    console.log(this.tempbuy.name);
    this.editbuy = buy;
    this.tempcost = this.editbuy.cost / this.editbuy.count;
    this.changeCost(false);
  }

  resetBuy(): IBuy {

    return {
      _id: "",
      name: "",
      description: "",
      item: "",
      cost: 0,
      count: 1
    }
    

  }

  resetWire() {

    this.selectedwire = new Wire("", "", "", "", "", 0);

  }

  resetPrice():Price {

    return new Price("", "", 0, { _id: "", name: "", type: "" });

  }

  resetCoil(): Coil {

    return new Coil("", "", "", "", 0);

  }

  resetConnector(): Connector {

    return new Connector("", "", "", 0);

  }

  changeCost(isNew: boolean) {
    let buy: IBuy;
    if (isNew) {

      buy = this.newbuy;
      //this.newbuy.cost =this.newbuy.count * this.tempcost;

    }
    else {
      buy = this.editbuy;
      //this.editbuy.cost = this.editbuy.count * this.tempcost;

    }

    buy.cost = buy.count * this.tempcost;
    console.log(`cost ${this.newbuy.cost}\n count ${this.newbuy.count}`);
    console.log(`editcost ${this.editbuy.cost}\n editcount ${this.editbuy.count}`);

  }

  cancelEdit() {

    this.editbuy.name = this.tempbuy.name;
    this.editbuy.description = this.tempbuy.description;
    this.editbuy.cost = this.tempbuy.cost;
    this.editbuy.count = this.tempbuy.count;
    console.log(this.tempbuy.name);
    console.log(this.editbuy.name);

  }

  saveEdit() {
    
      
    this.putBuy();
 

  }

}
