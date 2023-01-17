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



  wires: Array<Wire>;

  coils: Array<Coil>;

  connectors: Array<Connector>;

  editWire: Wire | null = null;

  newWire: Wire | null = null;

  coilname: string = "";

  coillength: number = 0;

  firstconnector: string = "";

  secondconnector: string = "";

  firstcon: Connector;

  secondcon: Connector;

  coil: Coil;

  availablelength: number = 0;

  status: string;

  orderfirst: number = 1;
  ordersecond: number = 1;
  orderlength: number = 1;

  percent: number;

  ngOnInit() {

    this.LoadWires();
    this.LoadCoils();
    this.LoadConnectors();

  }

  constructor(private wireserv: WireService, private coilserv: CoilService, private conserv: ConnectorService) {

    this.wires = new Array<Wire>();

    this.coils = new Array<Coil>();

    this.coil = new Coil("", "", "", "", 0);

    this.newWire = new Wire("", "", "", "", "", 0);

    this.firstcon = new Connector("", "", "", 0);

    this.secondcon = new Connector("", "", "", 0);

    this.connectors = new Array<Connector>();

  }

  private LoadWires() {

    this.wireserv.getWires().subscribe((data: Array<Wire>) => {

      this.wires = data;

    });

  }

  private LoadCoils() {

    this.coilserv.getCoils().subscribe((data: Array<Coil>) => {

      this.coils = data;

    });

  }

  private LoadConnectors() {

    this.conserv.getConnectors().subscribe((data: Array<Connector>) => {

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

    this.editWire = new Wire(wire._id, wire.name, wire.firstconn, wire.secondconn, wire.coil, wire.length);

  }



  PutWire() {

    this.wireserv.editWire(this.editWire as Wire).subscribe((data) => {

      this.LoadWires();
      this.status = "Успешно отредактировано";
      this.editWire = null;

    }, (e) => {

      console.log(e);

    });

  }

  PostWire() {

    if (this.newWire.coil != ""
      && this.newWire.name != ""
      && this.newWire.firstconn != ""
      && this.newWire.secondconn != ""
      && this.newWire.length != 0) {

      let enougth: boolean;

      if (this.firstcon._id == this.secondcon._id) {

        enougth = 0 <= this.firstcon.count - 2;

      }
      else {

        enougth = 0 <= (this.firstcon.count - 1 && this.secondcon.count - 1);

      }

      if (enougth) {

        this.coil.length = this.availablelength;
        this.wireserv.postWire(this.newWire as Wire).subscribe((data) => {

          this.LoadWires();
          this.status = `Кабель ${this.newWire.name} успешно создан, его характеристики: ${this.firstcon.type}-${this.secondcon.type},${this.newWire.length}м`;

        }, (e) => {

          return console.log(e);
          

        });

        this.firstcon.count--;
        this.secondcon.count--;

        this.conserv.putConnector(this.firstcon as Connector).subscribe((data) => {



        }, (e) => {

          return console.log(e);

        });

        this.conserv.putConnector(this.secondcon as Connector).subscribe((data) => {

          this.LoadConnectors();

        }, (e) => {

          return console.log(e);

        });

        this.coilserv.editCoil(this.coil as Coil).subscribe(_ => {
          this.LoadCoils();
        });

      }
      else {

        console.log("Недостаточно разъемов");

      }


    }
    else {

      console.log('Есть пустые поля, которые нужно заполнить');

    }

  }


  DeleteWire(delwire: Wire) {

    this.wireserv.deleteWire(delwire._id).subscribe((data) => {

      this.status = "Успешно удалено";
      this.LoadWires();

    }, (e) => {

      console.log(e);

    });

  }

  CancelEdit() {

    this.editWire = null;

  }

  setConnector(isFirst: boolean) {

    if (isFirst) {

      const nameandtype = this.firstconnector.split('-');

      this.firstcon = this.connectors.find(c => c.name == nameandtype[0] && c.type == nameandtype[1]);

      this.newWire.firstconn = this.firstcon._id;

      console.log(`first connector is ${this.firstcon.name}`);
    }

    else {

      const nameandtype = this.secondconnector.split('-');

      this.secondcon = this.connectors.find(c => c.name == nameandtype[0] && c.type == nameandtype[1]);

      this.newWire.secondconn = this.secondcon._id;

      console.log(`second connector is ${this.secondcon.name}`);
    }

  }

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

      this.coil = this.coils.find(c => c.name == this.coilname);

      this.newWire.coil = this.coil._id;

      this.availablelength = this.coil.length;

      this.coillength = this.coil.length;

      this.ProgresChange();

    } catch (e) {

      console.log(e);

    }


  }

  getConnectorName(id: string): string {

    const conn: Connector = this.connectors.find(c => c._id == id);

    return conn.type;

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
