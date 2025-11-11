import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './people.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleComponent {
  private documentService = inject(DocumentService);
  isLoaded = this.documentService.isLoaded;
  people = computed(() => {
    const allPeople = this.documentService.getAllPeople();
    // Sort by lastname, then firstname
    return allPeople.sort((a, b) => {
      const lastNameCompare = a.lastname.localeCompare(b.lastname);
      if (lastNameCompare !== 0) return lastNameCompare;
      return a.firstname.localeCompare(b.firstname);
    });
  });
}
