import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PersonneCardComponent } from '../personne-card/personne-card.component';
import { VerificationApiResponse } from '../services/verification.service';

@Component({
  selector: 'app-historique-detail',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, PersonneCardComponent],
  template: `
    <div class="detail-dialog">
      <header class="hd">
        <div class="title">Détails de la vérification</div>
        <div class="meta">Numéro: {{ data.numero }} • {{ data.createdAt ? (data.createdAt | date:'yyyy-MM-dd HH:mm:ss') : '-' }}</div>
      </header>

      <section class="body">
        <div *ngIf="data.personne; else noPerson">
          <app-personne-card [personne]="data.personne"></app-personne-card>
        </div>
        <ng-template #noPerson>
          <div class="no-person">Aucune personne associée à cette vérification.</div>
        </ng-template>
      </section>

      <footer class="ft">
        <button mat-stroked-button (click)="close()">Fermer</button>
      </footer>
    </div>
  `,
  styles: [
    `
      .detail-dialog { width: 100%; max-width: 820px; }
      .hd { margin-bottom: 12px; }
      .title { font-weight: 800; font-size: 1.1rem; }
      .meta { color: #6b7280; font-size: 0.9rem; }
      .body { margin-bottom: 12px; }
      .no-person { padding: 18px; color: #6b7280; border: 1px dashed rgba(15,23,42,0.06); border-radius: 8px; }
      .ft { text-align: right; }
    `
  ]
})
export class HistoriqueDetailComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: VerificationApiResponse,
    private dialogRef: MatDialogRef<HistoriqueDetailComponent>
  ) {}

  close() { this.dialogRef.close(); }
}
