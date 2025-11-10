import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

export type ErrorType = 'not-found' | 'server-error' | 'network-error' | 'generic';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
  @Input() type: ErrorType = 'generic';
  @Input() title?: string;
  @Input() message?: string;
  @Input() showHomeButton = true;
  @Input() showBrowseButton = true;

  get errorTitle(): string {
    if (this.title) return this.title;

    switch (this.type) {
      case 'not-found':
        return 'Not Found';
      case 'server-error':
        return 'Server Error';
      case 'network-error':
        return 'Connection Error';
      default:
        return 'Something Went Wrong';
    }
  }

  get errorMessage(): string {
    if (this.message) return this.message;

    switch (this.type) {
      case 'not-found':
        return 'The resource you\'re looking for doesn\'t exist.';
      case 'server-error':
        return 'We\'re experiencing technical difficulties. Please try again later.';
      case 'network-error':
        return 'Unable to connect to the server. Please check your internet connection.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  get errorIcon(): string {
    switch (this.type) {
      case 'not-found':
        return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
      case 'server-error':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
      case 'network-error':
        return 'M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414';
      default:
        return 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }
}
