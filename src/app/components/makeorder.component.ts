import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OrderStatus, statuses } from './models/enums';
import { Order } from './models/order';
import { Wire } from './models/wire';
import { IBuy } from './models/IBuy.interface';
import { Connector } from './models/connector';
import { Coil } from './models/coil';
import { OrderService } from '../services/order.service';
import { WireService } from '../services/wire.service';
import { BuyService } from '../services/buy.service';
import { ConnectorService } from '../services/connector.service';
import { CoilService } from '../services/coil.service';

@Component({

  selector: 'make-order',
  templateUrl: `./html/makeorder.component.html`,
  providers: [OrderService, WireService,BuyService]

})

export class MakeOrderComponent implements OnInit {

  orders: Order[];
  stats: string[];
  editorder: Order;
  listofbuys: IBuy[];
  tempstatus: string = "";

  constructor(
    private orderserv: OrderService,
    private wireserv: WireService,
    private buyserv: BuyService,
    private connserv: ConnectorService,
    private coilserv: CoilService) {

    this.orders = new Array<Order>();
    this.stats = statuses;
    this.listofbuys = new Array<IBuy>();

  }

  ngOnInit(): void {

    this.getOrders();

  }

  getOrders() {
    
    this.orderserv.getOrders().subscribe((data: Order[]) => {

      this.orders = data;

    }, (e) => {

      console.log(e);

    });

   

  }

  

  startEdit(curorder: Order) {


    this.editorder = curorder;
    this.listofbuys = this.editorder.listofbuys;
    

  }

  putOrder() {

    if (this.editorder._id != null && this.editorder._id != '' && this.tempstatus!='') {

      this.editorder.status = OrderStatus[this.tempstatus];

      this.orderserv.putOrder(this.editorder as Order).subscribe((data: Order) => {

        this.orders.find(o => o._id == data._id).status = data.status;

        console.log(data.status);
        console.log(this.orders.find(o => o._id == data._id).status);

      }, (e) => {

        return console.log(e);

      });

      this.cancelEdit();

    }
    else {

      console.log("Что-то пошло не так=(");

    }

  }

  cancelEdit() {

    this.tempstatus = "";
    this.editorder = null;
    this.listofbuys = new Array<IBuy>();

  }

  //parseToItem(itemtoparse:string) {

  //  let arrayitem: string[] = itemtoparse.split(';');

  //  let item: Wire;
  //  let firstconn: Connector;
  //  let secondconn: Connector;
  //  let coil: Coil;

  //  arrayitem.forEach(i => {

  //    this.parseToField(i);

  //  });

  //  for (var i = 0; i < arrayitem.length; i++) {

  //    let field: string[] = this.parseToField(arrayitem[i]);

  //    switch (i) {

  //      case 0:

  //        this.connserv.getConnectorByNameAndType(field[0], field[1]).subscribe((data: Connector) => {

  //          console.log(data);
  //          firstconn = data;

  //        }, (e) => {

  //          return console.log(e);

  //        });

  //        break;
  //      case 1:

  //        this.connserv.getConnectorByNameAndType(field[0], field[1]).subscribe((data: Connector) => {

  //          console.log(data);
  //          secondconn = data;

  //        }, (e) => {

  //          return console.log(e);

  //        });

  //        break;
  //      case 2:

  //        this.coilserv.getCoilByNameAndType(field[0], field[1]).subscribe((data: Coil) => {

  //          console.log(data);
  //          coil = data;

  //        }, (e) => {

  //          return console.log(e);

  //        });

  //        break;

  //    }

  //  }

  //}

  //parseToField(itemtoparse: string):string[] {

  //  let field: string[] = itemtoparse.split(",");

  //  return field;
  //}

  checkAvailabale(orderbuy: IBuy): number | string {


    this.buyserv.getBuy(orderbuy._id).subscribe((data: IBuy) => {

      let buy: IBuy = data;

      let difference: number = buy.count - orderbuy.count; 

      return difference;

    }, (e) => {

      console.log(e);

    });

    return 'Not Available';


  }

}
