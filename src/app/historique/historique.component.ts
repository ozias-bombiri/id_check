import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PersonneCardComponent } from '../personne-card/personne-card.component';
import { VerificationService, VerificationApiResponse } from '../services/verification.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { HistoriqueDetailComponent } from './historique-detail.component';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule, MatListModule, MatProgressSpinnerModule, PersonneCardComponent, MatDialogModule, MatButtonModule, MatPaginatorModule, HistoriqueDetailComponent],
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.scss']
})
export class HistoriqueComponent implements OnInit {
  loading = false;
  items: VerificationApiResponse[] = [];
  error?: string;
  // pagination
  pageSize = 10;
  pageIndex = 0;
  pagedItems: VerificationApiResponse[] = [];

  constructor(private verificationService: VerificationService, private dialog: MatDialog) {}

  openDetails(item: VerificationApiResponse) {
    this.dialog.open(HistoriqueDetailComponent, { data: item, width: '760px' });
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.error = undefined;
    const list = await this.verificationService.getHistory();
    this.loading = false;
    if (!list) {
      this.error = 'Impossible de charger l\'historique.';
      return;
    }
    this.items = list;
    this.updatePagedItems();
  }

  updatePagedItems() {
    const start = this.pageIndex * this.pageSize;
    this.pagedItems = this.items.slice(start, start + this.pageSize);
  }

  onPage(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.updatePagedItems();
  }

}
