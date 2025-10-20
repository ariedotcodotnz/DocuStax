import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="bg-gray-800 text-white shadow-md">
      <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
        <a routerLink="/" class="text-2xl font-bold hover:text-gray-300">
          DocuStax
        </a>
        <div class="hidden md:flex items-center space-x-6">
          <a routerLink="/" routerLinkActive="text-yellow-400" [routerLinkActiveOptions]="{exact: true}" class="hover:text-yellow-400 transition-colors">Home</a>
          <a routerLink="/archive" routerLinkActive="text-yellow-400" class="hover:text-yellow-400 transition-colors">Archive</a>
          <a routerLink="/faq" routerLinkActive="text-yellow-400" class="hover:text-yellow-400 transition-colors">FAQ</a>
          <a routerLink="/about" routerLinkActive="text-yellow-400" class="hover:text-yellow-400 transition-colors">About</a>
          <a routerLink="/contact" routerLinkActive="text-yellow-400" class="hover:text-yellow-400 transition-colors">Contact</a>
        </div>
        <!-- Mobile menu button -->
        <div class="md:hidden">
            <button (click)="toggleMobileMenu()" class="text-white focus:outline-none">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
        </div>
      </nav>
      <!-- Mobile menu -->
      @if (isMobileMenuOpen()) {
        <div class="md:hidden bg-gray-800">
            <a routerLink="/" routerLinkActive="text-yellow-400" [routerLinkActiveOptions]="{exact: true}" class="block py-2 px-4 text-sm hover:bg-gray-700" (click)="toggleMobileMenu()">Home</a>
            <a routerLink="/archive" routerLinkActive="text-yellow-400" class="block py-2 px-4 text-sm hover:bg-gray-700" (click)="toggleMobileMenu()">Archive</a>
            <a routerLink="/faq" routerLinkActive="text-yellow-400" class="block py-2 px-4 text-sm hover:bg-gray-700" (click)="toggleMobileMenu()">FAQ</a>
            <a routerLink="/about" routerLinkActive="text-yellow-400" class="block py-2 px-4 text-sm hover:bg-gray-700" (click)="toggleMobileMenu()">About</a>
            <a routerLink="/contact" routerLinkActive="text-yellow-400" class="block py-2 px-4 text-sm hover:bg-gray-700" (click)="toggleMobileMenu()">Contact</a>
        </div>
      }
    </header>

    <main class="container mx-auto px-6 py-8">
      <router-outlet></router-outlet>
    </main>

    <footer class="bg-gray-800 text-white mt-12">
      <div class="container mx-auto px-6 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-6 md:mb-0">
            <h3 class="text-xl font-bold">DocuStax</h3>
            <p class="text-gray-400">Your static documentation hub.</p>
          </div>
          <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <div class="flex flex-col space-y-2">
              <span class="font-bold">Navigate</span>
              <a routerLink="/" class="text-gray-400 hover:text-white">Home</a>
              <a routerLink="/archive" class="text-gray-400 hover:text-white">Archive</a>
              <a routerLink="/about" class="text-gray-400 hover:text-white">About Us</a>
            </div>
            <div class="flex flex-col space-y-2">
              <span class="font-bold">Legal</span>
              <a routerLink="/legal" class="text-gray-400 hover:text-white">Privacy Policy</a>
              <a routerLink="/legal" class="text-gray-400 hover:text-white">Terms of Service</a>
            </div>
            <div class="flex flex-col space-y-2">
              <span class="font-bold">Connect</span>
              <a routerLink="/contact" class="text-gray-400 hover:text-white">Contact</a>
            </div>
          </div>
        </div>
        <div class="mt-8 border-t border-gray-700 pt-6 text-center text-gray-500">
          &copy; {{ currentYear }} DocuStax. All rights reserved.
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  currentYear = new Date().getFullYear();
  isMobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }
}
