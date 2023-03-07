import { Component, OnInit,ViewChild,ElementRef,ChangeDetectionStrategy, AfterViewInit, OnDestroy } from '@angular/core';
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
import { Observable, fromEvent, Subscription, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, exhaust, exhaustMap, filter, map, switchMap, takeUntil, mapTo, catchError, find } from 'rxjs/operators';
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
  selectedwireobs$: Observable<any>;
  editImage$: Subscription;
  inputImageChange: Observable<any>;
  editBuy$: Subscription;
  

  buys: IBuy[];
  wires: Wire[];
  prices: Price[];
  newbuy: IBuy;
  editbuy: IBuy;
  tempbuy: IBuy;
  selectedwire: Wire;
  selectedfirstcon: Connector;
  selectedsecondcon: Connector;
  selectedcoil: Coil;
  firstconprice: Price;
  secondconprice: Price;
  coilprice: Price;
  tempcost: number;
  image: File;
  selectoritem: any;  

  constructor(
    private buyserv: BuyService,
    private priceserv: PriceService,
    private wireserv: WireService,
    private coilserv: CoilService,
    private conserv: ConnectorService) {

    this.buys = new Array<IBuy>();
    this.wires = new Array<Wire>();
    this.prices = new Array<Price>();
    this.newbuy = this.resetBuy();
    this.editbuy = this.resetBuy();
    this.firstconprice = this.resetPrice();
    this.secondconprice = this.resetPrice();
    this.coilprice = this.resetPrice();
    this.selectedcoil = this.resetCoil();
    this.selectedfirstcon = this.resetConnector();
    this.selectedsecondcon = this.resetConnector();
    this.resetWire();
  }

  ngOnInit() {

    this.getBuys();
    this.getWires();
    this.getPrices();

    this.selectoritem = document.getElementById("selectItem");
    
  }

  ngOnDestroy() {

    this.editBuy$.unsubscribe();
    this.editImage$.unsubscribe();

  }

  ngAfterViewInit() {

    this.upload = this.inputObs(this.fileInput, this.imgFile).pipe(

      exhaustMap((value) => this.submitPostObs(this.submitBut, this.newbuy, value)),
      mapTo('Upload Complete')

    );


    this.selectedwireobs$ = fromEvent(this.selectoritem, 'change').pipe(

      switchMap(() => this.conserv.getConnector(this.selectedwire.firstconn).pipe(

        map(value => { return this.selectedfirstcon = value; }),
        catchError(e => of(e).pipe(

          map(value => { console.log(value); }),
          map(() => this.resetConnector())

          ))

      )),
      exhaustMap((value) => this.findPriceItem(value)),
      map((value) => {

        if (value == undefined) {

          this.alertAboutPrice(this.selectedfirstcon);
          this.fullComponentReset();
          this.fullComponentPriceReset();
          return value;

        }

        return this.setPriceItem(value, cableComponent.firstcon);

      }),
      filter(value=>value!=undefined),

      switchMap(() => this.conserv.getConnector(this.selectedwire.secondconn).pipe(

        map((value) => { return this.selectedsecondcon = value; }),
        catchError(e => of(e).pipe(

          map(value => { console.log(value); }),
          map(() => this.resetConnector())


          ))

      )),
      exhaustMap((value) => this.findPriceItem(value)),
      map((value) => {

        if (value == undefined) {

          this.alertAboutPrice(this.selectedsecondcon);
          this.fullComponentReset();
          this.fullComponentPriceReset();
          return value;

        }

        return this.setPriceItem(value, cableComponent.secondcon);

      }),
      filter(value => value != undefined),

      switchMap(() => this.coilserv.getCoil(this.selectedwire.coil).pipe(

        map(value => { return this.selectedcoil = value; }),
        catchError(e => of(e).pipe(

          map(value => { console.log(value); }),
          map(() => this.resetConnector())


        ))

      )),
      exhaustMap((value) => this.findPriceItem(value)),
      map((value) => {

        if (value == undefined) {

          this.alertAboutPrice(this.selectedcoil);
          this.fullComponentReset();
          this.fullComponentPriceReset();
          return value;

        }

        return this.setPriceItem(value, cableComponent.coil);

      }),
      filter(value => value != undefined),

      exhaustMap(() => this.calculatePrice()),
      map((value) => this.setCost(value)),
      map(() => { this.changeCost(true); }),
      map(() => this.newbuy.item =
        `${this.selectedfirstcon.name},` +
        `${this.selectedfirstcon.type};` +
        `${this.selectedsecondcon.name},` +
        `${this.selectedsecondcon.type};` +
        `${this.selectedcoil.name},` +
        `${this.selectedcoil.type};` +
        `${this.selectedwire.length}`)

    );

    this.selectedwireobs$.subscribe();

    this.editImage$ = this.inputObs(this.editInputButton, this.editImageFile).subscribe();
    
    this.editBuy$ = this.submitPutObs(this.editBuyButton, this.editbuy, this.image).subscribe(data => {

      this.changeBuyAfterPut(data);
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

  getBuy(id: string): IBuy | null {

    let tempbuy: IBuy;

    this.buyserv.getBuy(id).subscribe((data: IBuy) => {

      console.log(data);
      tempbuy = data;

    }, (e) => {

      console.log(e);

    });
    if (tempbuy != undefined) {

      return tempbuy;

    }
    return null;

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
      map(value => this.getBuys()),
      map(() => {
        this.fullComponentReset();
        this.fullComponentPriceReset();
        this.fileInput.value = '';
        this.imgFile.src = "";
      })
      
    );

  }

  private submitPutObs(submit: HTMLButtonElement, buy: IBuy, img: File): Observable<IBuy> {

    console.log('submitputobs');
    return fromEvent(submit, 'click').pipe(
      map(() => { console.log(this.editbuy); }),
      map(() => this.validateBuy(this.editbuy)),
      filter(value => value == true),
      exhaustMap(() => this.checkToPutImage(this.image, this.editbuy)),
      exhaustMap(() => this.putBuyobs(this.editbuy)),
      filter(value => value != null)


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

  private get resetBut(): HTMLElement {

    return this.resetbut.nativeElement;

  }

  private get deleteButton(): HTMLButtonElement {

    return this.deleteBut.nativeElement;

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

        this.test(value);
        return this.firstconprice = value;

      }
      case cableComponent.secondcon: {

        this.test(value);
        return this.secondconprice = value;

      }
      case cableComponent.coil: {

        this.test(value);
        return this.coilprice = value;

      }
    }

  }

  private alertAboutPrice(component:IItem) {

    alert(`This component: ${component.name}-${component.type} doesn't has a price. Use price manager`);

  }

  private setCost(value:number) {

    this.tempcost = value;
    this.test(this.tempcost);
    return value;
  }


  deleteBuy(buy: IBuy, e: Event) {

    e.stopPropagation();

    this.cancelButton.click();

    this.buyserv.deleteBuy(buy._id, buy.image._id).pipe(

      catchError(e => of(e).pipe(

        map(value => {
          console.log(value);
          return null;
        })

      )),
      filter(value=>value!=null),
      map(value => { console.log(value); }),

      exhaustMap(() => of(this.getBuys()))

    ).subscribe();


  }

  editBuy(buy: IBuy) {

    this.editImageFile.src = "";
    this.buyserv.getImage(buy.image._id, buy.image.type).subscribe((data => {

      
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

    this.image = null;
    this.tempbuy = Object.assign({},buy);
    console.log(this.tempbuy.name);
    this.editbuy = buy;
    this.tempcost = this.editbuy.cost / this.editbuy.count;
    this.changeCost(false);

  }

  private resetBuy(): IBuy {

    return {
      _id: "",
      name: "",
      description: "",
      item: "",
      cost: 0,
      count: 1,
      image:null
    }
    

  }

  private resetWire() {

    this.selectedwire = new Wire("", "", "", "", "", 0);

  }

  private resetPrice():Price {

    return new Price("", "", 0, { _id: "", name: "", type: "" });

  }

  private resetCoil(): Coil {

    return new Coil("", "", "", "", 0);

  }

  private resetConnector(): Connector {

    return new Connector("", "", "", 0);

  }

  private fullComponentReset() {

    this.selectedfirstcon = this.resetConnector();
    this.selectedsecondcon = this.resetConnector();
    this.selectedcoil = this.resetCoil();
    this.resetWire();
  }

  private fullComponentPriceReset() {

    this.firstconprice = this.resetPrice();
    this.secondconprice = this.resetPrice();
    this.coilprice = this.resetPrice();
    this.newbuy = this.resetBuy();
    this.editbuy = this.resetBuy();

  }

  changeCost(isNew: boolean) {
    let buy: IBuy;
    if (isNew) {

      buy = this.newbuy;

    }
    else {

      buy = this.editbuy;

    }

    buy.cost = buy.count * this.tempcost;
    console.log(`cost ${this.newbuy.cost}\n count ${this.newbuy.count}`);
    console.log(`editcost ${this.editbuy.cost}\n editcount ${this.editbuy.count}`);

  }

  cancelEdit() {

    if (this.tempbuy != undefined) {

      this.editbuy.name = this.tempbuy.name;
      this.editbuy.description = this.tempbuy.description;
      this.editbuy.cost = this.tempbuy.cost;
      this.editbuy.count = this.tempbuy.count;

      console.log(this.tempbuy.name);
      console.log(this.editbuy.name);
      this.image = null;
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

  private findPriceItem(item: any): Observable<Price|undefined> {

    return of(this.prices.find(p => p.itemofprice._id == item._id));

  }

  private calculatePrice(): Observable<number> {

    return of(this.firstconprice.cost + this.secondconprice.cost + this.coilprice.cost);

  }

  private validateBuy(buy: IBuy): boolean {

    console.log('validate buy');
    this.test(buy);
    if (buy.item!='') {

      return true;

    }

    alert("Задайте все параметры для покупки")
    return false;

  }

  private changeBuyAfterPut(buy: IBuy) {

    let delindex = this.buys.findIndex(b => b._id == buy._id);
    this.buys.splice(delindex, 1, buy);

  }

  test(test:any) {

    console.log(test);

  }

}
