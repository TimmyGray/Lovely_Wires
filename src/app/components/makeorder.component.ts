import { Component, OnInit,OnDestroy,ElementRef, ViewChild,AfterViewInit } from '@angular/core';
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
import { filter, fromEvent, from,of, Observable, Subscription } from 'rxjs';
import { catchError, exhaust, exhaustMap, map, switchMap } from 'rxjs/operators';

@Component({

  selector: 'make-order',
  templateUrl: `./html/makeorder.component.html`,
  providers: [OrderService, WireService, BuyService, CoilService, ConnectorService]

})

export class MakeOrderComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild("closeBut", { static: false })
  closeBut: ElementRef;

  @ViewChild("cancelBut", { static: false })
  cancelBut: ElementRef;

  @ViewChild("editBut", { static: false })
  editBut: ElementRef;

  @ViewChild("orderClick", { static: false })
  orderClick: ElementRef;

  orderchange$: Subscription;

  orders: Order[];
  stats: string[];
  listofbuys: IBuy[];
  templistofbuys: IBuy[];
  templistofcounts: number[];
  accept: boolean[];
  editorder: Order;
  tempstatus: string = "";
  currentstatus_number: number=-1;
  comment: string = "";
  beforestatus: OrderStatus;

  constructor(
    private orderserv: OrderService,
    private wireserv: WireService,
    private buyserv: BuyService,
    private connserv: ConnectorService,
    private coilserv: CoilService) {

    this.orders = this.initArray<Order>();
    this.stats = statuses;
    this.listofbuys = this.initArray<IBuy>();
    this.templistofbuys = this.initArray<IBuy>();
    this.templistofcounts = this.initArray<number>();
    this.editorder = this.initOrder();
    this.accept = this.initArray<boolean>();
  }

  ngOnInit(): void {

    this.getOrders();
  }

  ngAfterViewInit() {

    this.orderchange$ = fromEvent(this.editButton, 'click').pipe(

      map(() => this.validateOrder()),
      map(value => { console.log(value); return value }),
      filter(value => value == true),

      exhaustMap(() => {

        this.editorder.status = OrderStatus[this.tempstatus];
        return this.orderserv.putOrder(this.editorder, this.comment).pipe(

          map(value => this.ChangeBuysCount(value))

        )
      }),

      filter(value => value.length != 0),

      exhaustMap(value => this.buyserv.putArrayOfBuys(value).pipe(

        map(value => {

          value.forEach(b => {

            this.afterPutBuy(b);

          });
        })

      ))

    ).subscribe(() => {
     
      console.log('Changes order successful');
      alert('Changes order successful');
      this.closeButton.click();

    }, (e) => {

      console.error(e);

    });



  }


  ngOnDestroy():void {

    this.orderchange$.unsubscribe();

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

  private get closeButton(): HTMLButtonElement {

    return this.closeBut.nativeElement;

  }

  private get cancelButton(): HTMLButtonElement {

    return this.cancelBut.nativeElement;

  }

  private get editButton(): HTMLButtonElement {

    return this.editBut.nativeElement;

  }

  private get clickOnCurOrder(): HTMLElement {

    return this.orderClick.nativeElement;

  }

  startEdit(curorder: Order) {


    this.editorder = curorder;
    this.currentstatus_number = curorder.status;
    this.listofbuys = this.editorder.listofbuys;
    let arrayofbuys: string[] = new Array<string>();

    from(this.listofbuys).subscribe((data: IBuy) => {

      console.log(data);
      this.accept.push(false);
      arrayofbuys.push(data.item);

    });

    this.buyserv.getArrayOfBuys(arrayofbuys).pipe(

      switchMap(value => from(value))

    ).subscribe((data: IBuy) => {

      this.templistofcounts.push(data.count);

    }, (e) => {

      console.log(e);

    });
    

  }


  private validateOrder(): boolean {

    if ((this.tempstatus == '')
      || this.editorder.status == OrderStatus[this.tempstatus]) {

      console.log('Please, select correct order status');
      alert('Please, select correct order status');
      return false;

    }
    else {

      if (this.editorder.status == OrderStatus.done) {

        console.log('Done order cant be changed!');
        alert('Done order cant be changed!');
        return false;

      }

      if ((OrderStatus.agree == OrderStatus[this.tempstatus] && !this.accept.includes(false))
        || OrderStatus.under_consideration == OrderStatus[this.tempstatus]
        || OrderStatus.done == OrderStatus[this.tempstatus]) {

        return true;

      }
      else {

        if (OrderStatus.canceled == OrderStatus[this.tempstatus] && this.comment != '') {

          return true;

        }

        console.log('Please, check status or avaibale buys. Something wrong!');
        alert('Please, check status or avaibale buys. Something wrong!');
        return false;

      }

    }    

  }

  private ChangeBuysCount(afterputorder: Order): IBuy[] {

    console.log(`The order status was changed to ${afterputorder.status}`);


    if (this.currentstatus_number == 1
      && (afterputorder.status == 0
      || afterputorder.status == 3)) {

      console.log("return buys to storage");
      for (var i = 0; i < this.listofbuys.length; i++) {

        let buytoput: IBuy = Object.assign({}, this.listofbuys[i]);
        buytoput.count += this.templistofcounts[i];
        console.log(`first way buy to put ${buytoput.item}, current count: ${buytoput.count}`);
        this.templistofbuys.push(buytoput);

      }

    }
    else if (afterputorder.status == 1) {

      console.log("take buys from storage");
      for (var i = 0; i < this.listofbuys.length; i++) {

        let buytoput: IBuy = Object.assign({}, this.listofbuys[i]);
        buytoput.count = this.templistofcounts[i] - buytoput.count;
        console.log(`second way buy to put ${buytoput.item}, current count: ${buytoput.count}`);

        this.templistofbuys.push(buytoput);

      }

    }

    console.log(this.templistofbuys);

    return this.templistofbuys;

  }

  private afterPutBuy(buy: IBuy) {

    console.log(`For now, ${buy.item}:${buy.count} in storage`);

  }

  private initArray<T>(): Array<T> {

    return new Array<T>();

  }

  cancelEdit() {

    this.tempstatus = "";
    this.editorder = this.initOrder();
    this.listofbuys = this.initArray<IBuy>();
    this.templistofcounts = this.initArray<number>();
    this.comment = "";
    this.currentstatus_number = -1;

  }
  

  private initOrder():Order {

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
    this.accept.forEach(a => {

      console.log(a);

    });
  }

  deleteOrder(e: Event, id: string) {

    e.stopPropagation();
    this.cancelButton.click();

    this.orderserv.deleteOrder(id).subscribe((data: Order) => {

      let index: number = this.orders.findIndex(o => o._id == data._id);
      this.orders.splice(index, 1);

    }, (e) => {

      console.log(e);

    });

  }

}
