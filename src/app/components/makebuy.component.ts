import { Component, OnInit,ViewChild,ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { IBuy } from './models/IBuy.interface';
import { BuyService } from '../services/buy.service';
import { WireService } from '../services/wire.service';
import { PriceService } from '../services/price.service';
import { CoilService } from '../services/coil.service';
import { ConnectorService } from '../services/connector.service';
import { Wire } from './models/wire';
import { Price } from './models/price';
import { Connector } from './models/connector';
import { Coil } from './models/coil';
import { Observable, fromEvent, Subscription, Subject, of, from } from 'rxjs';
import { debounceTime, distinctUntilChanged, exhaustMap, filter, map, switchMap, takeUntil, mapTo, catchError, concatMap, exhaust } from 'rxjs/operators';
import { IImage } from './models/IImage.interface';
import { cableComponent } from './models/enums';
import { IItem } from './models/IItem.interface';

@Component({

  selector: 'make-buy',
  templateUrl: `./html/makebuy.component.html`,
  providers: [BuyService, WireService, PriceService, CoilService, ConnectorService],

})

export class MakeBuyComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('imagedata', { static: false })
  input: ElementRef;

  @ViewChild('submitbut', { static:false })
  submitbut: ElementRef;

  @ViewChild('resetbut', { static: false })
  resetbut: ElementRef;

  @ViewChild('img', { static: false })
  img: ElementRef;

  @ViewChild('deleteBut', { static: false })
  deleteBut: ElementRef;

  @ViewChild('cancelBut', { static: false })
  cancelBut: ElementRef;

  @ViewChild('editImage', { static: false })
  editImage: ElementRef;

  @ViewChild('editImageInput', { static: false })
  editImageInput: ElementRef;

  @ViewChild('editBuyBt', { static: false })
  editBuyBt: ElementRef;

  @ViewChild('closeEditBut', { static: false })
  closeEditBut: ElementRef;

  upload: Observable<any>;
  selectedwireobs$: Subscription;
  editImage$: Subscription;
  editBuy$: Subscription;
  buys: IBuy[];
  wires: Wire[];
  prices: Price[];
  connectors: Connector[];
  firstconprice: Price[];
  secondconprice: Price[];
  sameconnectors: Connector[];

  newbuy: IBuy;
  editbuy: IBuy;
  tempbuy: IBuy;
  selectedwire: Wire;
  selectedcoil: Coil;
  coilprice: Price;
  tempcoillength: number;
  image: File;
  selectoritem: any;
  tempcountbuy: number;

  constructor(
    private buyserv: BuyService,
    private priceserv: PriceService,
    private wireserv: WireService,
    private coilserv: CoilService,
    private conserv: ConnectorService) {

    this.buys = new Array<IBuy>();
    this.wires = new Array<Wire>();
    this.prices = new Array<Price>();
    this.firstconprice = new Array<Price>();
    this.secondconprice = new Array<Price>();
    this.connectors = new Array<Connector>();
    this.newbuy = this.resetBuy();
    this.editbuy = this.resetBuy();
    this.tempbuy = this.resetBuy();
    this.coilprice = this.resetPrice();
    this.selectedcoil = this.resetCoil();
    this.tempcoillength = 0;
    this.tempcountbuy = 0;
    this.resetWire();
  }

  ngOnInit() {

    this.getBuys();
    this.getWires();
    this.getPrices();
    this.getConnectors();

    this.selectoritem = document.getElementById("selectItem");
    
  }

  ngOnDestroy() {

    this.editBuy$.unsubscribe();
    this.editImage$.unsubscribe();
    this.selectedwireobs$.unsubscribe();

  }

  ngAfterViewInit() {

    this.upload = this.inputObs(this.fileInput, this.imgFile).pipe(

      exhaustMap((value) => this.submitPostObs(this.submitBut, this.newbuy, value)),
      mapTo('Upload Complete')

    );

    this.selectedwireobs$ = fromEvent(this.selectoritem, 'change').pipe(

      map(() => {

        this.fullComponentPriceReset();
        this.tempcountbuy = 0;
        let sumconnectors: Connector[] = new Array <Connector>();
        this.sameconnectors = new Array<Connector>();
        sumconnectors = this.selectedwire.firstconn.concat(this.selectedwire.secondconn);
        sumconnectors.forEach(con => {

          if (!this.FindEqual(con, this.sameconnectors)) {

            this.sameconnectors.push(con);

          }
         
        });

        this.sameconnectors.forEach(c => {

          c.count = this.connectors.find(con => con._id == c._id).count;

        });

        console.log(this.sameconnectors);

      }),
      switchMap(() => this.setConnectorPrice(this.selectedwire.firstconn).pipe(

        map(value => {

          value.forEach(p => {

            this.setPriceItem(p, cableComponent.firstcon)

          })
        }),
        map(() => {

          if (this.firstconprice.find(p => p.cost == 0))
          {
            this.alertAboutPrice(cableComponent.firstcon);
            return false;
          }
          else {
            return true;
          }
          
        })

      )),
      filter(value => value == true),
      switchMap(() => this.setConnectorPrice(this.selectedwire.secondconn).pipe(

        map(value => {
          value.forEach(p => {

            this.setPriceItem(p, cableComponent.secondcon)

          });
        }),
        map(() => {

          if (this.secondconprice.find(p => p.cost == 0)) {
            this.alertAboutPrice(cableComponent.secondcon);
            return false;
          }
          else {
            return true;
          }

        })

      )),
      filter(value=>value==true),
      switchMap(() => this.setCoilPrice(this.selectedwire).pipe(

        map(value => this.setPriceItem(value, cableComponent.coil)),
        map(() => {

          if (this.coilprice.cost == 0) {
            this.alertAboutPrice(cableComponent.coil);
            return false;
          }
          else {
            return true;
          }

        })

      )),
      filter(value=>value==true),
     
      map(() => {

        this.newbuy.cost = this.calculatePrice(this.firstconprice, this.secondconprice, this.coilprice, this.selectedwire);
        this.changeCount(true);
        this.newbuy.itemid = this.selectedwire._id;
        this.newbuy.item = this.makeItemBuy(this.selectedwire, this.selectedcoil);
         
      }),

    ).subscribe(() => { }, (e) => { console.error(e); });

    this.editImage$ = this.inputObs(this.editInputButton, this.editImageFile).subscribe();
    
    this.editBuy$ = this.submitPutObs(this.editBuyButton, this.image).subscribe(() => {

      this.closeEditBut.nativeElement.click();

    });

  }

  getBuys() {

    this.buyserv.getBuys().subscribe((data: IBuy[]) => {

      this.buys = data;
      console.log(this.buys);

    }, (e) => {

      console.log(e);

    });

  }

  getWires() {

    this.wireserv.getWires().subscribe((data: Wire[]) => {

      this.wires = data;
      console.log(this.wires);

    }, (e) => {

      console.log(e);

    });

  }

  getPrices() {

    this.priceserv.getPrices().subscribe((data: Price[]) => {

      this.prices = data;
      console.log(this.prices);

    }, (e) => {

      console.log(e);

    });

  }

  getConnectors() {

    this.conserv.getConnectors().subscribe((data: Connector[]) => {

      console.log(data);
      this.connectors = data;

    }, (e) => {

      console.error(e);

    });

  }

  private inputObs(inputelement: HTMLInputElement, imageelement: HTMLImageElement): Observable<File> {

    console.log('inputobs');
    return fromEvent(inputelement, 'change').pipe(

      map(() => inputelement.files[0]),
      filter(file => file.type == `image/png` || file.type == `image/jpeg` || file.type == `image/jpg` && !!file),
      map((value) => this.displayImage(value, imageelement))

      );

  }

  private submitPostObs(submitbut: HTMLButtonElement, buy: IBuy, img: File): Observable<any> {

    console.log('submitpostobs');
    return fromEvent(submitbut, 'click').pipe(

      map(() => this.validateBuy(buy)),
      filter(value => value == true),
      exhaustMap(() => this.postImgObs(img)),
      filter(value => value != null),
      map(value => this.addImageToBuy(value, buy)),
      exhaustMap(value => this.postBuyObs(value)),
      filter(value => value != null),
      map(() => {

        this.selectedcoil.length = this.tempcoillength;

      }),
      exhaustMap(() => this.coilserv.editCoil(this.selectedcoil)),
      exhaustMap(() => this.conserv.putArrayOfConnectors(this.sameconnectors).pipe(

        map(value => {

          value.forEach(con => {

            let conn: Connector = this.connectors.find(c => c._id == con._id);
            conn.count = con.count;

          });

        })

      )),
      map(() => {

        this.getBuys();
        this.fullComponentReset();
        this.fullComponentPriceReset();
        this.newbuy = this.resetBuy();
        
        this.tempcoillength = 0;
        this.sameconnectors = new Array();
        this.fileInput.value = '';
        this.imgFile.src = "";
      })
      
    );

  }

  private submitPutObs(submit: HTMLButtonElement, img: File): Observable<any> {

    console.log('submitputobs');

    return fromEvent(submit, 'click').pipe(
      map(() => { console.log(this.editbuy); }),
      map(() => this.validateBuy(this.editbuy)),
      filter(value => value == true),
      exhaustMap(() => this.checkToPutImage(img, this.editbuy)),
      exhaustMap(() => this.putBuyobs(this.editbuy)),
      filter(value => value != null),
      map(() => {

        this.selectedcoil.length = this.tempcoillength;

      }),

      exhaustMap(() => this.conserv.putArrayOfConnectors(this.sameconnectors).pipe(

        map(value => {

          value.forEach(con => {

            let conn: Connector = this.connectors.find(c => c._id == con._id);
            conn.count = con.count;

          });

        })

      )),
      exhaustMap(() => this.coilserv.editCoil(this.selectedcoil)),

      map(() => this.changeBuyAfterPut(this.editbuy))

    );

  }

  private postImgObs(img: File): Observable<IImage> {

    console.log('postimgobs');
    return this.buyserv.postImage(img).pipe(

      catchError(e => of(e).pipe(

        map(e => {
          console.error(e);
          alert(e);
          return null;
        })

      ))

     );

  }

  private putImgObs(img: File, buy: IBuy): Observable<IImage> {

    console.log('putimgobs');
    if (img == null) {
      return null;
    }
    return this.buyserv.putImage(img, buy.image._id).pipe(

      catchError(e => of(e).pipe(

        map(e => {

          console.error(e);
          alert(e);
          return null;

        })

      ))

    );

  }

  private putBuyobs(buy: IBuy): Observable<IBuy> {

    console.log('putbuyobs');
    return this.buyserv.putBuy(buy).pipe(

      catchError(e => of(e).pipe(

        map(e => {

          console.error(e);
          alert(e);
          return null;

        })

      ))

    );

  }

  private postBuyObs(buy: IBuy): Observable<IBuy> {

    console.log('postbuyobs');
    return this.buyserv.postBuy(buy).pipe(

      catchError(e => of(e).pipe(

        map(e => {
          console.error(e);
          alert(e);
          return null;
        })

      ))

    );

  }

  private checkToPutImage(img: File, buy: IBuy): Observable<any> {

    if (img != null) {

      return this.putImgObs(img, buy).pipe(


        filter(value => value != null),
        map(value => this.addImageToBuy(value, this.editbuy))

      );

    }

    return of(console.log('The image stay the same'));

  }

  private get fileInput(): HTMLInputElement {

    return this.input.nativeElement;

  }

  private get imgFile(): HTMLImageElement {

    return this.img.nativeElement;

  }

  private get submitBut(): HTMLButtonElement {

    return this.submitbut.nativeElement;

  }

  private get cancelButton(): HTMLButtonElement {

    return this.cancelBut.nativeElement;

  }

  private get editInputButton(): HTMLInputElement {

    return this.editImageInput.nativeElement;

  }

  private get editImageFile(): HTMLImageElement {

    return this.editImage.nativeElement;

  }

  private get editBuyButton(): HTMLButtonElement {

    return this.editBuyBt.nativeElement;

  }

  private setPriceItem(value: Price, component: cableComponent) {

    switch (component) {
      case cableComponent.firstcon: {

        console.log('set price for first connector');
        this.test(value);
        this.firstconprice.push(value);
        break;

      }
      case cableComponent.secondcon: {

        console.log("set price for second connector ");
        this.test(value);
        this.secondconprice.push(value);
        break;

      }
      case cableComponent.coil: {

        console.log("set price for coil connector");
        this.test(value);
        this.coilprice = value;
        break;

      }
    }

  }

  private alertAboutPrice(component: cableComponent) {

    alert(`This component: ${cableComponent[component]} doesn't has a price. Use price manager`);

  }

  deleteBuy(buy: IBuy, e: Event) {

    e.stopPropagation();

    this.cancelButton.click();

    this.buyserv.deleteBuy(buy._id, buy.image._id).subscribe((data: IBuy) => {

      let index: number = this.buys.findIndex(b => b._id == data._id || b.item == data.item);
      this.buys.splice(index, 1);

    }, (e) => {

      console.log(e);

    });


  }

  editBuy(buy: IBuy) {

    this.editImageFile.src = "";
    this.buyserv.getImage(buy.image._id, buy.image.type).subscribe(((data:Blob) => {

      
      let reader = new FileReader();

      reader.addEventListener('load', () => {

        this.editImageFile.src = reader.result as string;

      });

      if (data) {

        reader.readAsDataURL(data);

      }

    }), e => {

      console.error(e);

    });

    this.wireserv.getWire(buy.itemid).pipe(

      map(value => this.selectedwire = value),
      switchMap(value => this.coilserv.getCoil(value.coil).pipe(

        map(value => this.selectedcoil = value)

      )),
      map(() => this.getConnectors())
      

    ).subscribe(() => {

      this.tempcoillength = this.selectedcoil.length;
      this.tempbuy = Object.assign({}, buy);

      console.log(this.tempbuy.name);

      this.editbuy = buy;
      this.tempcountbuy = this.editbuy.count;
      let sumconnectors: Connector[] = new Array<Connector>();
      this.sameconnectors = new Array<Connector>();
      sumconnectors = this.selectedwire.firstconn.concat(this.selectedwire.secondconn);
      sumconnectors.forEach(con => {

        if (!this.FindEqual(con, this.sameconnectors)) {

          con = Object.assign({}, this.connectors.find(c => c._id == con._id));
          this.sameconnectors.push(con);

        }

      });

    }, (e) => { console.log(e); });


    this.image = null;

  }

  private resetBuy(): IBuy {

    return {
      _id: "",
      name: "",
      description: "",
      item: "",
      itemid:"",
      cost: 0,
      count: 0,
      image:null
    }
    

  }

  private resetWire() {

    let array: Connector[] = new Array<Connector>();
    this.selectedwire = new Wire("", "", array, array, "", 0, 0);

  }

  private resetPrice():Price {

    return new Price("", "", 0, { _id: "", name: "", type: "" });

  }

  private resetCoil(): Coil {

    return new Coil("", "", "","", 0);

  }

  private fullComponentReset() {

    this.selectedcoil = this.resetCoil();
    this.resetWire();
  }

  private fullComponentPriceReset() {

    this.firstconprice = new Array<Price>();
    this.secondconprice = new Array<Price>();
    this.coilprice = this.resetPrice();
    this.newbuy.cost = 0;
    this.editbuy.cost = 0;

  }

  changeCount(isNew: boolean) {

    let buy: IBuy;
    if (isNew) {

      buy = this.newbuy;

    }
    else {

      buy = this.editbuy;

    }

    this.sameconnectors = this.changeConnectorCount(this.selectedwire.firstconn, this.sameconnectors, buy.count, this.tempcountbuy);
    this.sameconnectors = this.changeConnectorCount(this.selectedwire.secondconn, this.sameconnectors, buy.count, this.tempcountbuy);
    this.tempcoillength = this.changeCoilLength(this.tempcoillength, this.selectedwire, buy.count, this.tempcountbuy);

    this.tempcountbuy = buy.count;
  }

  cancelEdit() {

    if (this.tempbuy != undefined) {

      this.editbuy = Object.assign({}, this.tempbuy);
      this.tempcoillength = 0;
      this.image = null;
      this.tempbuy = this.resetBuy();
      this.newbuy = this.resetBuy();
      this.resetWire();
      this.sameconnectors = new Array();
      this.fullComponentReset();
      this.fullComponentPriceReset();

    }

  }

  private displayImage(img: File, imageelement: HTMLImageElement) {

    console.log('display image');
    imageelement.src = URL.createObjectURL(img);
    this.test(imageelement.src);
    return this.image = img;

  }


  private addImageToBuy(img: IImage, buy: IBuy): IBuy {

    console.log('addimagetobuy');
    buy.image = img;
    return buy;

  }

  private calculatePrice(firstconnectorprice: Price[], secondconnectorprice: Price[], coilprice: Price, wire: Wire): number {

    let firstconncost: number = 0;
    let secondconncost: number = 0;
    let sum: number = 0;

    for (let price of firstconnectorprice) {

      firstconncost += price.cost;

    }
    
    for (let price of secondconnectorprice) {

      secondconncost += price.cost;

    }

    sum = firstconncost + secondconncost + (coilprice.cost * wire.length);

    return sum;

  }

  private validateBuy(buy: IBuy): boolean {

    console.log('validate buy');
    this.test(buy);
    if (buy.item=='') {

      alert("Задайте все параметры для покупки")
      return false;


    }
    if (this.tempcoillength<0) {
      alert("Не хватает длины выбранного кабеля");
      return false;
    }

    let badcount: boolean = true;

    for (let con of this.sameconnectors) {

      if (con.count < 0) {
        badcount = false;
        break;
      }

    }

    if (!badcount) {

      alert("Не хватает коннекторов для выбранного кабеля");
      return false;

    }

    console.log("Validation successful");
    return true;

  }

  private setConnectorPrice(connectors: Connector[]): Observable<Price[]> {

    console.log("setconnector");

    let arrayofids: string[] = new Array<string>();

    for (let con of connectors) {

      arrayofids.push(con._id);

    }

    return this.priceserv.getArrayOfPrices(arrayofids);

  }

  private setCoilPrice(wire: Wire): Observable<Price> {

    return this.coilserv.getCoil(wire.coil).pipe(

      map(value => {

        this.tempcoillength = value.length;
        return this.selectedcoil = value;

      }),
      switchMap(value => this.priceserv.getPrice(value._id).pipe(

        catchError(e => of(e).pipe(

          map(value => {

            console.log(value);
            this.fullComponentPriceReset();
            this.fullComponentReset();
            return value = new Price("", "", 0, { _id: "", name: "", type: "" });

          })

        )),

      ))

    );

  }

  private changeBuyAfterPut(buy: IBuy){

    this.tempbuy = buy;
    let delindex = this.buys.findIndex(b => b._id == buy._id || b.item == buy.item);
    this.buys.splice(delindex, 1, buy);

  }

  private changeCoilLength(coillength:number, wire: Wire, curcount: number, previoscount: number): number {

    let count: number = previoscount;

    if (curcount > previoscount) {

      while (curcount > count) {

        coillength -= wire.length;
        count++;

      }

    }
    else if (curcount < previoscount) {

      coillength += wire.length;
      count--;
    }

    console.log(`Change coil length: ${coillength}`)
    return coillength;

  }

  private changeConnectorCount(connectors: Connector[], sameconnectors: Connector[], curcount: number, prevcount: number): Connector[] {

    let count: number = curcount;
    let tempcon: Connector;
    if (count > prevcount) {

      while (count > prevcount) {

        for (let con of connectors) {

          tempcon = sameconnectors.find(c => c._id == con._id);
          tempcon.count--;
          console.log(`${sameconnectors.find(c => c._id == con._id).count}`);
        }
        count--;
      }
     
    }
    else if (count < prevcount) {

      while (count < prevcount) {

        for (let con of connectors) {

          tempcon = sameconnectors.find(c => c._id == con._id);
          tempcon.count++;
          console.log(`${sameconnectors.find(c => c._id == con._id).count}`);
        }

        count++;
      }

      
    }
    console.log('avalilable connectors');
    console.log(sameconnectors);
    return sameconnectors;
    
  }

  test(test:any) {

    console.log(test);

  }

  private FindEqual(value: Connector, array: Connector[]): boolean {

    if (array.length == 0) {
      return false;

    }

    if (array.find(c => c._id == value._id) != undefined || array.find(c => c._id == value._id)!=null) {

      return true;

    }

    return false;

  }

  resetClick() {

    this.fullComponentPriceReset();
    this.fullComponentReset();
    this.newbuy = this.resetBuy();
    this.editbuy = this.resetBuy();
    this.tempbuy = this.resetBuy();
    this.sameconnectors = new Array();
    this.tempcoillength = 0;
  }

  private makeItemBuy(wire: Wire, coil: Coil): string {

    let item: string;

    let array1: string[] = new Array<string>();
    let array2: string[] = new Array<string>();
    wire.firstconn.forEach(con => {

      array1.push(`${con.name}-${con.type}`);

    });
    wire.secondconn.forEach(con => {

      array2.push(`${con.name}-${con.type}`);

    });

    item = array1.toString() + ";" + array2.toString() + ";" + `${coil.name}-${coil.type};` + `${wire.length}`;

    console.log(item);


    return item;

  }

}
