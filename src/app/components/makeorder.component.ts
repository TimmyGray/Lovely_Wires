import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OrderStatus, statuses } from './models/enums';
import { Order } from './models/order';
import { Wire } from './models/wire';
import { IBuy } from './models/IBuy.interface';
import { OrderService } from '../services/order.service';
import { WireService } from '../services/wire.service';

@Component({

  selector: 'make-order',
  templateUrl: `./html/makeorder.component.html`,
  providers: [OrderService, WireService]

})

export class MakeOrderComponent implements OnInit {

  orders: Order[];
  stats: string[];
  edit: boolean = false;
  editorder: Order;
  listofbuys: IBuy[];
  tempstatus: string = "";

  constructor(private orderserv: OrderService, private wireserv: WireService) {
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
    

  }

  putOrder() {

    if (this.editorder._id != null && this.editorder._id != '' && this.tempstatus!='') {

      this.editorder.status = OrderStatus[this.tempstatus];

      this.orderserv.putOrder(this.editorder as Order).subscribe((data: Order) => {

        this.orders.find(o => o._id == data._id).status = data.status;

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

  }

}
