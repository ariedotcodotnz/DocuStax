import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './person-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonListComponent {
  private documentService = inject(DocumentService);
  private route = inject(ActivatedRoute);

  private paramMap = toSignal(this.route.paramMap);
  firstname = computed(() => this.paramMap()?.get('firstname') ?? '');
  lastname = computed(() => this.paramMap()?.get('lastname') ?? '');

  documents = computed(() => {
    const firstname = this.firstname();
    const lastname = this.lastname();
    if (firstname && lastname) {
      return this.documentService.getDocumentsByPerson(firstname, lastname);
    }
    return [];
  });
}
