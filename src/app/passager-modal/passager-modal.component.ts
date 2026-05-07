
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Passager } from '../models/passager.model';
import { Trajet } from '../models/trajet.model';

interface PassagerModalData {
  passagers: Passager[];
  trajet?: Trajet;
}

@Component({
  selector: 'app-passager-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './passager-modal.component.html',
  styleUrl: './passager-modal.component.scss'
})
export class PassagerModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: PassagerModalData) {}

  get hasPassagers(): boolean {
    return this.data.passagers.length > 0;
  }

  get trajetRoute(): string {
    const trajet = this.data?.trajet;
    if (!trajet?.axe) {
      return '-';
    }

    const route = [
      this.getLocaliteLabel(trajet.axe.depart),
      ...(trajet.axe.itineraire?.map(localite => this.getLocaliteLabel(localite)) ?? []),
      this.getLocaliteLabel(trajet.axe.arrive)
    ].filter(label => label && label !== '-');

    return route.length > 0 ? route.join(' - ') : trajet.axe.libelle;
  }

  getLocaliteLabel(localite: any): string {
    return localite?.libelle ?? localite?.nomLocalite ?? '-';
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) {
      return '-';
    }

    return new Intl.DateTimeFormat('fr-FR').format(new Date(date));
  }

  exportExcel() {
    const rows = [
      ['Date trajet', this.formatDate(this.data.trajet?.dateDepart)],
      ['Heure trajet', this.data.trajet?.heureDepart ?? '-'],
      ['Vehicule', this.data.trajet?.vehicule?.immatriculation ?? '-'],
      ['Localites axe', this.trajetRoute],
      [],
      ['N°', 'Identifiant', 'Nom', 'Prenom', 'Depart', 'Destination']
    ];

    this.data.passagers.forEach((passager, index) => {
      rows.push([
        String(index + 1),
        passager.personne?.numero ?? '-',
        passager.personne?.nom ?? '-',
        passager.personne?.prenom ?? '-',
        this.getLocaliteLabel(passager.depart),
        this.getLocaliteLabel(passager.destination)
      ]);
    });

    const csvContent = rows
      .map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(';'))
      .join('\n');

    this.downloadFile(`\uFEFF${csvContent}`, 'liste-passagers.xls', 'application/vnd.ms-excel;charset=utf-8;');
  }

  exportPdf() {
    const trajet = this.data.trajet;
    const windowRef = window.open('', '_blank', 'width=900,height=700');
    if (!windowRef) {
      return;
    }

    const rows = this.data.passagers.map((passager, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${passager.personne?.numero ?? '-'}</td>
        <td>${passager.personne?.nom ?? '-'}</td>
        <td>${passager.personne?.prenom ?? '-'}</td>
        <td>${this.getLocaliteLabel(passager.depart)}</td>
        <td>${this.getLocaliteLabel(passager.destination)}</td>
      </tr>
    `).join('');

    windowRef.document.write(`
      <html>
        <head>
          <title>Liste des passagers</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            h1 { margin-bottom: 8px; }
            .meta { margin-bottom: 20px; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
            .meta p { margin: 4px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #dbe4ef; padding: 10px; text-align: left; }
            th { background: #0f766e; color: white; }
          </style>
        </head>
        <body>
          <h1>Liste des passagers</h1>
          <div class="meta">
            <p><strong>Date :</strong> ${this.formatDate(trajet?.dateDepart)}</p>
            <p><strong>Heure :</strong> ${trajet?.heureDepart ?? '-'}</p>
            <p><strong>Vehicule :</strong> ${trajet?.vehicule?.immatriculation ?? '-'}</p>
            <p><strong>Localites de l'axe :</strong> ${this.trajetRoute}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>N°</th>
                <th>Identifiant</th>
                <th>Nom</th>
                <th>Prenom</th>
                <th>Depart</th>
                <th>Destination</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `);
    windowRef.document.close();
    windowRef.focus();
    windowRef.print();
  }

  private downloadFile(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}

