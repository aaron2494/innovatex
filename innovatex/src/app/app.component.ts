import { PlanesComponent } from './components/planes/planes.component';
import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { ServicesComponent } from './components/services/services.component';
import { AboutComponent } from './components/about/about.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { TestimoniosComponent } from './components/testimonios/testimonios.component';
import { ButtomComponent } from "./components/buttom/buttom.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { PagoExitosoComponent } from "./components/pago-exitoso/pago-exitoso.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    NavbarComponent,
    HeroComponent,
    ServicesComponent,
    AboutComponent,
    ProjectsComponent,
    FooterComponent,
    PlanesComponent,
    TestimoniosComponent,
    ButtomComponent,
    DashboardComponent,

],
  template: `
    <app-navbar></app-navbar>
    <app-hero></app-hero>
    <app-services></app-services>
    <app-about></app-about>
    <app-projects></app-projects>
    <app-planes/>
    <app-dashboard/>
    <app-testimonios/>
    <app-buttom/>
    <app-footer></app-footer>
    <router-outlet/>
  `,
})
export class AppComponent {}
