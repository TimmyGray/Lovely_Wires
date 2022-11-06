import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../components/app.component';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../components/home.component';
import { MakeWireComponent } from '../components/makewire.component';
import { HttpClientModule } from '@angular/common/http';
import { MakeCoilComponent } from '../components/makecoil.component';

const appRoutes: Routes = [

  {
    path: '', component: HomeComponent
  },

  {
    path: 'wires', component: MakeWireComponent
  },

  {
    path: 'coils', component: MakeCoilComponent
  }
  
  

]

@NgModule({
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(appRoutes), HttpClientModule],
  declarations: [AppComponent, HomeComponent, MakeWireComponent, MakeCoilComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
