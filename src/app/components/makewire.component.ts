import { Component, TemplateRef, OnInit, ViewChild,ElementRef } from '@angular/core';
import { Wire } from './models/wire';
import { WireService } from '../services/wire.service';
import { Connectors } from './models/connector';
import { NgModel } from '@angular/forms';
import { CoilService } from '../services/coil.service';
import { Coil } from './models/coil';

@Component({
  selector: 'make-wire',
  templateUrl: './html/makewire.component.html',
  styleUrls: ['../styles/my-styles.css'],
  providers: [WireService, CoilService]
})



export class MakeWireComponent implements OnInit {

  @ViewChild('readonlytemp', { static: false })
  readonlytemp: TemplateRef<any> | undefined;

  @ViewChild('editabletemp', { static: false })
  editabletemp: TemplateRef<any> | undefined;

  @ViewChild('progresstest', { static: false })
  progressbar: ElementRef | undefined;

  @ViewChild('firstconth', { static: false })
  firstconn: ElementRef | undefined

  @ViewChild('lengthth', { static: false })
  length: ElementRef | undefined

  @ViewChild('secondconnth', { static: false })
  secondconn: ElementRef | undefined



  wires: Array<Wire>;

  coils: Array<Coil>;

  connectors: Array<string>;

  editWire: Wire | null = null;

  newWire: Wire | null = null;

  coilname: string = "";

  coillength: number = 0;

  availablelength: number = 0;

  status: string;

  orderfirst: number = 1;
  ordersecond: number = 1;
  orderlength: number = 1;

  percent: number;

  ngOnInit() {

    this.LoadWires();
    this.LoadCoils();

  }

  constructor(private serv: WireService, private service: CoilService) {

    this.wires = new Array<Wire>();

    this.coils = new Array<Coil>();

    this.newWire = new Wire("", "", "", "", null, 0);

    this.connectors = Connectors;

  }

  private LoadWires() {

    this.serv.getWires().subscribe((data: Array<Wire>) => {

      this.wires = data;

    });

  }

  private LoadCoils() {

    this.service.getCoils().subscribe((data: Array<Coil>) => {

      data.forEach(c => {

        this.coils.push(c);

      });

    });

  }

  ProgresChange() {

    this.percent = this.availablelength / this.newWire.coil.length * 100;

    this.progressbar.nativeElement.style.width = `${this.percent}%`;

  }

  LoadTemplate(wire: Wire) {

    if (this.editWire != null && this.editWire._id == wire._id) {

      return this.editabletemp;

    }

    return this.readonlytemp;

  }



  EditWire(wire: Wire) {

    this.editWire = new Wire(wire._id, wire.name, wire.firstconn, wire.secondconn, null, wire.length);

  }



  PutWire() {

    this.serv.editWire(this.editWire as Wire).subscribe(_ => {

      this.LoadWires();
      this.status = "Успешно отредактировано";
      this.editWire = null;

    })

  }

  PostWire() {

    this.newWire.coil.length = this.availablelength;
    this.serv.postWire(this.newWire as Wire).subscribe(_ => {

      this.LoadWires();
      this.status = `Кабель ${this.newWire.name} успешно создан, его характеристики: ${this.newWire.firstconn}-${this.newWire.secondconn},${this.newWire.length}м`;

    });

    this.service.editCoil(this.newWire.coil as Coil).subscribe(_ => {
      this.LoadCoils();
    });

  }


  DeleteWire(delwire: Wire) {

    this.serv.deleteWire(delwire._id).subscribe(_ => {

      this.status = "Успешно удалено";
      this.LoadWires();

    })

  }

  CancelEdit() {

    this.editWire = null;

  }

  CheckLengthNew(length: NgModel) {

    if (length.value < 0) {
      length.reset();
    }
    else {
      this.newWire.length = length.value;
      this.availablelength = this.newWire.coil.length - length.value;
      if (this.availablelength < 0) {
        this.availablelength = 0;

      }
      this.ProgresChange();
    }

  }

  CheckLengthEdit(length: NgModel) {

    if (length.value < 0) {
      length.reset();
    }
    else {
      this.editWire.length = length.value;
    }

  }

  SetCoil() {

    try {

      this.newWire.coil = this.coils.find(c => c.name == this.coilname);

      this.availablelength = this.newWire.coil.length;

      this.coillength = this.newWire.coil.length;

      this.ProgresChange();

    } catch (e) { }


  }


  Sorting(event: any) {


    const group: string = event.target.textContent;
    const correctgroup: string = group.toLowerCase().split(" ").toString().replace(",", "");
    switch (correctgroup) {
      case "firstconnector":
        {
          if (this.orderfirst==1) {

            this.serv.getOrderWires(this.orderfirst, correctgroup).subscribe((data: Array<Wire>) => {

              this.wires = data;

            }, (err) => {

              console.log(err);


            });

            this.orderfirst = -1;

          }
          else {

            this.serv.getOrderWires(this.orderfirst, correctgroup).subscribe((data: Array<Wire>) => {

              this.wires = data;

            }, (err) => {

              console.log(err);


            });

            this.orderfirst = 1;

          }

          break;

        }
      case "length":
        {
          if (this.orderlength==1) {

            this.serv.getOrderWires(this.orderlength, correctgroup).subscribe((data: Array<Wire>) => {

              this.wires = data;

            }, (err) => {

              console.log(err);


            });

            this.orderlength = -1;

          }
          else {

            this.serv.getOrderWires(this.orderlength, correctgroup).subscribe((data: Array<Wire>) => {

              this.wires = data;

            }, (err) => {

              console.log(err);


            });

            this.orderlength = 1;

          }

          break;

        }

      case "secondconnector":
        {

          if (this.ordersecond==1) {

            this.serv.getOrderWires(this.ordersecond, correctgroup).subscribe((data: Array<Wire>) => {

              this.wires = data;

            }, (err) => {

              console.log(err);

            });

            this.ordersecond = -1;

          }
          else {

            this.serv.getOrderWires(this.ordersecond, correctgroup).subscribe((data: Array<Wire>) => {

              this.wires = data;

            }, (err) => {

              console.log(err);


            });


            this.ordersecond = 1;

          }

          break;

        }

    }


  }
}
