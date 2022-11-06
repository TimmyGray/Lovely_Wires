import { Component, TemplateRef, OnInit, ViewChild } from '@angular/core';
import { Wire } from './models/wire';
import { WireService } from '../services/wire.service';
import { Connectors } from './models/connector';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'make-wire',
  templateUrl: './html/makewire.component.html',
  providers: [WireService]
})

export class MakeWireComponent implements OnInit {

  @ViewChild('readonlytemp', { static: false })
  readonlytemp: TemplateRef<any> | undefined;

  @ViewChild('editabletemp', { static: false })
  editabletemp: TemplateRef<any> | undefined;

  ngOnInit() {
    this.LoadWires();
  }

  wires: Array<Wire>;


  connectors: Array<string>;

  
  editWire: Wire | null=null;

  newWire: Wire | null=null;

  status: string;

  constructor(private serv: WireService) {

    this.wires = new Array<Wire>();

    this.newWire = new Wire("", "", "", "", 0);

    this.connectors = Connectors;

  }

  LoadTemplate(wire: Wire) {

    if (this.editWire != null && this.editWire._id == wire._id) {

      return this.editabletemp;

    }
    return this.readonlytemp;

  }

  private LoadWires() {
    this.serv.getWires().subscribe((data: Array<Wire>) => {
      this.wires = data;
    })
  }

  

  EditWire(wire: Wire) {

    this.editWire = new Wire(wire._id, wire.name, wire.firstconn, wire.secondconn, wire.length);

  }



  PutWire() {

    this.serv.editWire(this.editWire as Wire).subscribe(_ => {

      this.LoadWires();
      this.status = "Успешно отредактировано";
      this.editWire = null;


    })

  }

  PostWire() {

    this.serv.postWire(this.newWire as Wire).subscribe(_ => {
      this.LoadWires();
      this.status = `Кабель ${this.newWire.name} успешно создан, его характеристики: ${this.newWire.firstconn}-${this.newWire.secondconn},${this.newWire.length}м`;

    })
    
    

  }


  DeleteWire(delwire:Wire) {

    this.serv.deleteWire(delwire._id).subscribe(_ => {

      this.status = "Успешно удалено";
      this.LoadWires();

    })

  }

  CancelEdit() {

    this.editWire = null;

  }

  MinusCancelNew(length: NgModel) {

    if (length.value < 0) {
      length.reset();
    }
    else {
      this.newWire.length = length.value;
    }

  }

  MinusCancelEdit(length: NgModel) {

    if (length.value < 0) {
      length.reset();
    }
    else {
      this.editWire.length = length.value;
    }

  }

}
