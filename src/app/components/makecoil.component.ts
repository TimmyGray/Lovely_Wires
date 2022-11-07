import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Coil } from './models/coil';
import {  Corenumbers } from './models/corenumber';
import { Wiretypes } from './models/wiretype';
import { CoilService } from '../services/coil.service';
import { Console } from 'console';


@Component({

  selector: 'make-coil',
  templateUrl: './html/makecoil.component.html',
  providers: [CoilService]

})

export class MakeCoilComponent implements OnInit {
  @ViewChild('readonlytemp', { static: false })
  readonlytemp: TemplateRef<any> | undefined;
  @ViewChild('editabletemp', { static: false })
  editabletemp: TemplateRef<any> | undefined;

  NewCoil: Coil = null;

  EditCoil: Coil = null;

  wiretypes: Array<string>;

  corenumbers: Array<string>;

  coils: Array<Coil>;


  status: string = "";

  constructor(private service: CoilService) {

    this.coils = new Array<Coil>();
    this.NewCoil = new Coil("", "", "", "", 0);
    this.wiretypes = Wiretypes;
    this.corenumbers = Corenumbers;


  }

  GetAllCoils() {

    this.service.getCoils().subscribe((data: Array<Coil>) => {

      this.coils = data;

    })

  }

  PostCoil() {

    if (this.NewCoil != null) {

      this.service.postCoil(this.NewCoil as Coil).subscribe((_) => {

        this.coils.push(this.NewCoil);
        this.status = `Катушка ${this.NewCoil.name} успешно создана`;
        this.NewCoil = new Coil("", "", "", "", 0);

      }, (err) => {

        console.log(err);
        this.status = `Не получилось добавить - ${err}`;

      });
    }

  }

  PutCoil() {

    if (this.EditCoil != null) {

      this.service.editCoil(this.EditCoil as Coil).subscribe((_) => {

        this.GetAllCoils();
        this.status = `Катушка ${this.EditCoil.name} успешна обновлена`;
        this.EditCoil = null;

      }, (err) => {


        console.log(err);
        this.status = `Не получилось обновить - ${err}`;

      });

    }


  }

  DeleteCoil(deletecoil: Coil) {

    if (deletecoil != null) {

      this.service.deleteCoil(deletecoil._id).subscribe((_) => {

        this.GetAllCoils();
        this.status = `Катушка ${deletecoil.name} успешна удалена`;

      }, (err) => {

        console.log(err);
        this.status = `Не получилось удалить - ${err}`;


      });

    }

  }

  Cancel() {

    this.EditCoil = null;

  }

  Edit(editcoil: Coil) {

    this.EditCoil = editcoil;
    this.NewCoil = new Coil("", "", "", "", 0);

  }

  LoadTemplate(checkcoil:Coil){

    if (this.EditCoil != null && checkcoil._id == this.EditCoil._id) {
      return this.editabletemp
    }

    return this.readonlytemp;


  }



  ngOnInit(): void {

    this.GetAllCoils();

  }

  CancelMinusNew(length: NgModel) {

    if (length.value<0) {

      length.reset();

    }
    else {
      this.NewCoil.length = length.value;
    }

  }

  CancelMinusEdit(length: NgModel) {

    if (length.value < 0) {

      length.reset();

    }
    else {

      this.EditCoil.length = length.value;

    }

  }


}
