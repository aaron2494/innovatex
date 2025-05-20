import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { HeroComponent } from "../hero/hero.component";
import { ServicesComponent } from "../services/services.component";
import { AboutComponent } from "../about/about.component";
import { ProjectsComponent } from "../projects/projects.component";
import { PlanesComponent } from "../planes/planes.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { TestimoniosComponent } from "../testimonios/testimonios.component";
import { ButtomComponent } from "../buttom/buttom.component";

@Component({
  selector: 'app-layout',
  imports: [NavbarComponent, FooterComponent, HeroComponent, ServicesComponent, AboutComponent, ProjectsComponent, PlanesComponent, DashboardComponent, TestimoniosComponent, ButtomComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
