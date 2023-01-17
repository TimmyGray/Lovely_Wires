import { Component, OnInit,TemplateRef,ViewChild } from "@angular/core";
import { ConnectorService } from '../services/connector.service';
import { Connector } from './models/connector';
import { Observable } from 'rxjs';
import { NgModel } from '@angular/forms';


@Component({

  selector: 'make-con',
  templateUrl: `./html/makeconnector.component.html`,
  providers:[ConnectorService]

})
export class MakeConnectorComponent implements OnInit {

  connectors: Connector[];
  newConn: Connector;
  tempcount: number;
  editOn: boolean[];
  editBut: boolean = false;

  constructor(private connservice: ConnectorService) {

    this.connectors = new Array<Connector>();
    this.newConn = new Connector("", "", "", 1);
    this.editOn = new Array<boolean>();

  }

  ngOnInit() {

    this.getConnectors();


  }

  getConnectors() {

    this.connservice.getConnectors().subscribe((data: Array<Connector>) => {

      this.connectors = data;
      this.connectors.forEach(c => {

        this.editOn.push(true);

      });

    }, (e) => {

      console.log(e);

    });

  }

  postConnector() {

    if (this.newConn.name != "" && this.newConn.type != "" && this.newConn.count != 0) {

      const sameconn: Connector = this.connectors.find(
        c => c.name == this.newConn.name
          && c.type == this.newConn.type);

      if (sameconn == undefined) {
        return console.log("Такой разьем уже есть, если хотите изменить его - нажмите Edit в таблице");
      }
      //let same: boolean = false;

      //for (var i = 0; i < this.connectors.length; i++) {

      //  if (this.connectors[i].type == this.newConn.type && this.connectors[i].name == this.newConn.name) {
      //    same = true;
      //    this.newConn.count = this.connectors[i].count++;
      //    this.newConn._id = this.connectors[i]._id;
      //    break;
      //  }

      //}

      //if (same) {

      //  this.putConnector();

      //}
      //else {
        this.connservice.postConnector(this.newConn).subscribe((data: any) => {

          if ((data as Connector).name != null) {

            this.connectors.push(data);

          }
          else {

            
            console.log(data);
            this.getConnectors();

          }

        }, (e) => {

          console.log(e);

        });
      this.resetConnector();
      //}


    }
    else {

      console.log("Empty fields");

    }

  }

  resetConnector() {

    this.newConn = new Connector("", "", "", 1);

  }

  edit(conn: Connector, index: number) {

    if (!this.editBut) {

      this.editOn[index] = true;
      this.newConn = conn;
      this.tempcount = conn.count;
      for (var i = 0; i < this.editOn.length; i++) {

        if (i != index) {

          this.editOn[i] = false;

        }
      }
      
      this.editBut = true;
    }
    else {

      this.connectors[index].count = this.tempcount; 

      for (var i = 0; i < this.editOn.length; i++) {

        this.editOn[i] = true;
        
        
      }
      this.resetConnector();
      this.editBut = false;
    }



  }

  deleteConn(id: string) {

    this.connservice.deleteConnector(id).subscribe((data) => {

      this.getConnectors();

    }, (e) => {

      console.log(e);

    });

  }

  putConnector() {

    this.connservice.putConnector(this.newConn).subscribe((data) => {

      this.getConnectors();

    }, (e) => {

      console.log(e);
     
    });

    for (var i = 0; i < this.editOn.length; i++) {

      this.editOn[i] = true;


    }
    this.resetConnector();
    this.editBut = false;

  }



}
