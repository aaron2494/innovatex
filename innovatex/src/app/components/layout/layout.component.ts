import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { HeroComponent } from "../hero/hero.component";
import { ServicesComponent } from "../services/services.component";
import { PlanesComponent } from "../planes/planes.component";

import { TestimoniosComponent } from "../testimonios/testimonios.component";
import { ButtomComponent } from "../buttom/buttom.component";

@Component({
  selector: 'app-layout',
  imports: [NavbarComponent, FooterComponent, HeroComponent, ServicesComponent, PlanesComponent, TestimoniosComponent, ButtomComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
