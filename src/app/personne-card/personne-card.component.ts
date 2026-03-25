import { Component, Input } from '@angular/core';
import { Personne } from '../models/Personne';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-personne-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatDividerModule, CommonModule],
  templateUrl: './personne-card.component.html',
  styleUrls: ['./personne-card.component.scss']
})
export class PersonneCardComponent {

  @Input() personne!: Personne;

  get photoBase64(): string {
    const raw = this.personne?.photo;
    if (!raw) {
      return 'assets/images/default_avatar.jpeg'; // image par défaut optionnelle
    }

    const trimmed = raw.trim();

    // If already a data URL, return as-is
    if (trimmed.startsWith('data:')) {
      return trimmed;
    }

    // If it's an absolute URL, return it directly
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }

    // Clean whitespace/newlines from base64 payload
    const cleaned = trimmed.replace(/\s+/g, '');

    // Try to guess mime type from base64 signature
    let mime = 'image/jpeg';
    if (cleaned.startsWith('/9j')) {
      mime = 'image/jpeg';
    } else if (cleaned.startsWith('iVBOR')) {
      mime = 'image/png';
    } else if (cleaned.startsWith('R0lG')) {
      mime = 'image/gif';
    }

    return `data:${mime};base64,${cleaned}`;
  }

}



