import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-aide',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatDivider],
  templateUrl: './aide.component.html',
  styleUrls: ['./aide.component.scss']
})
export class AideComponent {

}
