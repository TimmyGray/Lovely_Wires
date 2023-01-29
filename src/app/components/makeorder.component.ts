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
import { Client } from './models/client';
import { arrayBuffer } from 'node:stream/consumers';
import { escape } from 'node:querystring';

@Component({

  selector: 'make-order',
  templateUrl: `./html/makeorder.component.html`,
  providers: [OrderService, WireService, BuyService, CoilService, ConnectorService]

})

export class MakeOrderComponent implements OnInit {

  orders: Order[];
  stats: string[];
  editorder: Order;
  listofbuys: IBuy[];
  templistofcounts: number[];
  tempstatus: string = "";
  accept: boolean[];
  comment: string = "";

  constructor(
    private orderserv: OrderService,
    private wireserv: WireService,
    private buyserv: BuyService,
    private connserv: ConnectorService,
    private coilserv: CoilService) {

    this.orders = new Array<Order>();
    this.stats = statuses;
    this.listofbuys = new Array<IBuy>();
    this.templistofcounts = new Array<number>();
    this.editorder = this.initOrder();
    this.accept = new Array<boolean>();
  }

  ngOnInit(): void {

    this.getOrders();
    //this.getBuys();

  }

  getOrders() {
    
    this.orderserv.getOrders().subscribe((data: Order[]) => {

      console.log(data);
      this.orders = data;

    }, (e) => {

      console.log(e);

    });

   

  }

  getBuys() {

    this.buyserv.getBuys().subscribe((data: IBuy[]) => {

      console.log(data);
      this.listofbuys = data;

    }, (e) => {

      console.log(e);

    });

  }
  

  async startEdit(curorder: Order) {


    this.editorder = curorder;
    this.listofbuys = this.editorder.listofbuys;
    this.listofbuys.forEach(b => {

      this.templistofcounts.push(b.count);
      this.accept.push(false);

    });

    await this.checkAvailable();
    

  }

  putOrder() {

    if (this.editorder._id != null && this.editorder._id != '' && this.tempstatus != '') {

      if (this.accept.includes(false)) {

        if (this.tempstatus == this.stats[OrderStatus.canceled] && this.comment!="") {

          this.editorder.status = OrderStatus[this.tempstatus];

          this.orderserv.putOrder(this.editorder).subscribe((data: Order) => {

            this.orders.find(o => o._id == data._id).status = data.status;

          }, (e) => {

            console.log(e);

          });


        }
        else {

          console.log("Не все позиции утверждены или не написан комментарий к отказу");

        }

      }
      else {

        this.editorder.status = OrderStatus[this.tempstatus];

        this.orderserv.putOrder(this.editorder).subscribe((data: Order) => {

          this.orders.find(o => o._id == data._id).status = data.status;

          for (var i = 0; i < this.listofbuys.length; i++) {

            this.listofbuys[i].count = this.templistofcounts[i] - this.listofbuys[i].count;

            this.buyserv.putBuy(this.listofbuys[i]).subscribe((data: IBuy) => {

              console.log(data);

            }, (e) => {

              console.log(e);

            });

          }

        }, (e) => {

          console.log(e);

        });

        this.cancelEdit();

      }

    }
    else {

      console.log("Что-то пошло не так=(");

    }

  

  }

  cancelEdit() {

    this.tempstatus = "";
    this.editorder = this.initOrder();
    this.listofbuys = new Array<IBuy>();
    this.comment = "";

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

  async checkAvailable(){

    for (var i = 0; i < this.listofbuys.length; i++) {

      await this.buyserv.getBuy(this.listofbuys[i]._id).toPromise()
        .then((data: IBuy) => {

          this.templistofcounts[i] = data.count

        })
        .catch((e) => {

          console.log(e);
          this.templistofcounts[i] = -999;

      });

    }

  }

  putBuys(buy: IBuy) {

    this.buyserv.putBuy(buy).subscribe((data: IBuy) => {



    }, (e) => {

      console.log(e);

    });

  }

  initOrder():Order {

    return new Order(
      "",
      "",
      new Client("", "", ""),
      new Date(),
      new Array<IBuy>(),
      OrderStatus.under_consideration
    );

  }

  statusToString(numb: number): string {

    return OrderStatus[numb];

  }

  checkUncheck(e, i: number) {


    this.accept[i] = e.target.checked;

  }

}
