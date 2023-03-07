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
  tempconn: Connector;
  tempcount: number;
  tempindex: number;
  editOn: boolean[];
  editBut: boolean = false;

  constructor(private connservice: ConnectorService) {

    this.connectors = new Array<Connector>();
    this.newConn = this.initConnector();
    this.tempconn = this.initConnector();

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

      let sameconn: Connector = this.connectors.find(
        c => c.name == this.newConn.name
          && c.type == this.newConn.type);

      if (sameconn != undefined) {
        alert("Такой разьем уже есть, если хотите изменить его - нажмите Edit в таблице");
        return console.log("Такой разьем уже есть, если хотите изменить его - нажмите Edit в таблице");
      }
      this.connservice.postConnector(this.newConn).subscribe((data: Connector) => {

        this.connectors.push(data);
        this.editOn.push(true);
        this.resetConnector();

        }, (e) => {

          console.log(e);

        });

    }
    else {

      console.log("Empty fields");

    }

  }

  private initConnector(): Connector {

    return new Connector("", "", "", 1);

  }

  resetConnector() {

    this.newConn = this.initConnector();

  }

  edit(conn: Connector, index: number) {

    if (!this.editBut) {

      this.tempindex = index;
      this.editOn[index] = true;
      this.newConn = conn;
      this.tempconn = Object.assign({}, conn);

      for (var i = 0; i < this.editOn.length; i++) {

        if (i != index) {

          this.editOn[i] = false;

        }
      }
      
      this.editBut = true;
    }
    else {

      this.connectors[index] = this.tempconn;

      for (var i = 0; i < this.editOn.length; i++) {

        this.editOn[i] = true;
        
        
      }

      this.resetConnector();
      this.editBut = false;
      this.tempindex = 0;
    }



  }

  deleteConn(id: string, index: number) {

    this.connservice.deleteConnector(id).subscribe((data: Connector) => {

      this.connectors.splice(index, 1);

    }, (e) => {

      console.log(e);

    });

  }

  putConnector() {

    this.connservice.putConnector(this.newConn).subscribe((data:Connector) => {

      this.connectors.splice(this.tempindex, 1, data);

      for (var i = 0; i < this.editOn.length; i++) {

        this.editOn[i] = true;


      }

      this.resetConnector();
      this.editBut = false;

    }, (e) => {

      console.log(e);
     
    });

  }

}
