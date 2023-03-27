import { Component, TemplateRef, OnInit, ViewChild,ElementRef } from '@angular/core';
import { Wire } from './models/wire';
import { WireService } from '../services/wire.service';
import { NgModel } from '@angular/forms';
import { CoilService } from '../services/coil.service';
import { Coil } from './models/coil';
import { Connector } from './models/connector';
import { ConnectorService } from '../services/connector.service';

@Component({
  selector: 'make-wire',
  templateUrl: './html/makewire.component.html',
  styleUrls: ['../styles/my-styles.css'],
  providers: [WireService, CoilService, ConnectorService]
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



  wires: Wire[];
  coils: Coil[];
  connectors: Connector[];
  editWire: Wire  = null;
  newWire: Wire  = null;
  coilname: string = "";
  coillength: number = 0;
  connector: Connector;
  secondconnector: string = "";
  firstcon: Connector[];
  secondcon: Connector[];
  coil: Coil;
  availablelength: number = 0;
  previosnumber: number=0;
  status: string;
  orderfirst: number = 1;
  ordersecond: number = 1;
  orderlength: number = 1;
  percent: number;

  ngOnInit() {

    this.getWires();
    this.getCoils();
    this.getConnectors();

  }

  constructor(
    private wireserv: WireService,
    private coilserv: CoilService,
    private conserv: ConnectorService) {

    this.wires = this.initArray<Wire>();
    this.coils = this.initArray<Coil>();
    this.coil = new Coil("", "", "", "", 0);
    this.newWire = new Wire("", "", this.initArray<Connector>(), this.initArray<Connector>(), "", 0, 0);
    this.firstcon = this.initArray<Connector>();
    this.secondcon = this.initArray<Connector>();
    this.connectors = this.initArray<Connector>();

  }

  private getWires() {

    this.wireserv.getWires().subscribe((data: Wire[]) => {

      this.wires = data;

    });

  }

  private getCoils() {

    this.coilserv.getCoils().subscribe((data: Coil[]) => {

      this.coils = data;

    });

  }

  private getConnectors() {

    this.conserv.getConnectors().subscribe((data: Connector[]) => {

      this.connectors = data;

    }, (e) => {

      console.log(e);

    });

  }

  ProgresChange() {

    this.percent = this.availablelength / this.coil.length * 100;

    this.progressbar.nativeElement.style.width = `${this.percent}%`;

  }

  LoadTemplate(wire: Wire) {

    if (this.editWire != null && this.editWire._id == wire._id) {

      return this.editabletemp;

    }

    return this.readonlytemp;

  }



  EditWire(wire: Wire) {

    this.editWire = new Wire(wire._id, wire.name, wire.firstconn, wire.secondconn, wire.coil, wire.length,wire.numberofconnectors);

  }



  PutWire() {

    this.wireserv.editWire(this.editWire as Wire).subscribe((data:Wire) => {

      let index: number = this.wires.findIndex(w => w._id == data._id);
      this.wires.splice(index, 1, data);
      this.status = "Успешно отредактировано";
      this.editWire = null;

    }, (e) => {

      console.log(e);

    });

  }

  PostWire() {

    if (this.newWire.coil != ""
      && this.newWire.name != ""
      && this.newWire.firstconn.length != 0
      && this.newWire.secondconn.length != 0
      && this.newWire.length != 0) {

      this.wireserv.postWire(this.newWire as Wire).subscribe((data: Wire) => {

        this.wires.push(data);
        this.status = `Кабель ${this.newWire.name} успешно создан`;

      }, (e) => {

        console.log(e);


      });

    }
    else {

      console.log('Есть пустые поля, которые нужно заполнить');

    }

  }


  DeleteWire(delwire: Wire) {

    this.wireserv.deleteWire(delwire._id).subscribe((data:Wire) => {

      let index: number = this.wires.findIndex(w => w._id == data._id);
      this.wires.splice(index, 1);
      this.status = "Успешно удалено";
      

    }, (e) => {

      console.log(e);

    });

  }

  CancelEdit() {

    this.editWire = null;

  }

  //setConnector(isFirst: boolean) {

  //  if (isFirst) {

  //    const nameandtype = this.firstconnector.split('-');

  //    this.firstcon = this.connectors.find(c => c.name == nameandtype[0] && c.type == nameandtype[1]);

  //    this.newWire.firstconn = this.firstcon._id;

  //    console.log(`first connector is ${this.firstcon.name}`);
  //  }

  //  else {

  //    const nameandtype = this.secondconnector.split('-');

  //    this.secondcon = this.connectors.find(c => c.name == nameandtype[0] && c.type == nameandtype[1]);

  //    this.newWire.secondconn = this.secondcon._id;

  //    console.log(`second connector is ${this.secondcon.name}`);
  //  }

  //}

  CheckLengthNew(length: NgModel) {

    if (length.value < 0) {
      length.reset();
    }
    else {

      this.newWire.length = length.value;

      this.availablelength = this.coil.length - length.value;

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

      this.newWire.coil = this.coil._id;

      this.availablelength = this.coil.length;

      this.coillength = this.coil.length;

      this.ProgresChange();

    } catch (e) {

      console.log(e);

    }


  }

  //getConnectorName(id: string): string {

  //  const conn: Connector = this.connectors.find(c => c._id == id);

  //  return conn.type;

  //}

  private initConnector(): Connector {

    return new Connector("", "", "", 0);

  }

  private initArray<T>(): T[] {

    return new Array<T>();

  }

  changeConnector(conn: Connector) {

    conn.count = 1;

    conn = Object.assign({}, conn);

    console.log(conn.count);
  }

  changeCountOfConnectors(isEdit: boolean) {

    let wire: Wire;
   

    if(isEdit) {

      wire = this.editWire;
    }
    else {

      wire = this.newWire;
    }

    let count = this.previosnumber - wire.numberofconnectors;
    if (this.previosnumber > wire.numberofconnectors) {

      while (count > 0) {

        wire.firstconn.pop();
        wire.secondconn.pop();

        count--;
      }

    }
    if (this.previosnumber < wire.numberofconnectors) {

      while (count < 0) {

        wire.firstconn.push(this.initConnector());
        wire.secondconn.push(this.initConnector());

        count++;
      }
      
    }

    this.previosnumber = wire.numberofconnectors;

  }

  Sorting(event: any) {


    const group: string = event.target.textContent;
    const correctgroup: string = group.toLowerCase().split(" ").toString().replace(",", "");
    switch (correctgroup) {
      case "firstconnector":
        {
          if (this.orderfirst==1) {

            this.wireserv.getOrderWires(this.orderfirst, correctgroup).subscribe((data: Array<Wire>) => {

              this.wires = data;

            }, (err) => {

              console.log(err);


            });

            this.orderfirst = -1;

          }
          else {

            this.wireserv.getOrderWires(this.orderfirst, correctgroup).subscribe((data: Array<Wire>) => {

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

            this.wireserv.getOrderWires(this.orderlength, correctgroup).subscribe((data: Array<Wire>) => {

              this.wires = data;

            }, (err) => {

              console.log(err);


            });

            this.orderlength = -1;

          }
          else {

            this.wireserv.getOrderWires(this.orderlength, correctgroup).subscribe((data: Array<Wire>) => {

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

            this.wireserv.getOrderWires(this.ordersecond, correctgroup).subscribe((data: Array<Wire>) => {

              this.wires = data;

            }, (err) => {

              console.log(err);

            });

            this.ordersecond = -1;

          }
          else {

            this.wireserv.getOrderWires(this.ordersecond, correctgroup).subscribe((data: Array<Wire>) => {

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
