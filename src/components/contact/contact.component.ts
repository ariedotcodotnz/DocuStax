import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  formSubmitted = signal(false);
  
  submitForm(event: Event) {
    event.preventDefault();
    // In a real app, you'd handle form submission here.
    // Since this is a static site, we'll just show a message.
    this.formSubmitted.set(true);
  }
}
