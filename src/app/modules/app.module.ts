import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../components/app.component';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../components/home.component';
import { MakeWireComponent } from '../components/makewire.component';
import { HttpClientModule } from '@angular/common/http';
import { MakeCoilComponent } from '../components/makecoil.component';
import { MakeConnectorComponent } from '../components/makeconnector.component';
import { MakePriceComponent } from '../components/makeprice.component';
import { MakeOrderComponent } from '../components/makeorder.component';
import { MakeBuyComponent } from '../components/makebuy.component';

const appRoutes: Routes = [

  {
    path: '', component: HomeComponent
  },

  {
    path: 'wires', component: MakeWireComponent
  },

  {
    path: 'coils', component: MakeCoilComponent
  },

  {
    path: 'connectors', component: MakeConnectorComponent
  },

  {
    path: 'prices', component: MakePriceComponent
  },

  {

    path: 'orders', component:MakeOrderComponent

  },

  {

    path: 'buys', component: MakeBuyComponent

  }
  
  

]

@NgModule({
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(appRoutes), HttpClientModule],
  declarations: [
    AppComponent,
    HomeComponent,
    MakeWireComponent,
    MakeCoilComponent,
    MakeConnectorComponent,
    MakePriceComponent,
    MakeOrderComponent,
    MakeBuyComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
