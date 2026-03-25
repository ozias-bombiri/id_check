import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

}
