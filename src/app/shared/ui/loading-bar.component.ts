import { Component, computed, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { UiService } from './ui.service';

@Component({
  standalone: true,
  selector: 'app-loading-bar',
  imports: [NgIf],
  template: ` <div *ngIf="isLoading()" class="loading"></div> `,
  styles: [
    `
      .loading {
        height: 3px;
        background: linear-gradient(90deg, #0ea5e9, #22d3ee);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 999;
        animation: move 1.1s linear infinite;
      }
      @keyframes move {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
    `,
  ],
})
export class LoadingBarComponent {
  private ui = inject(UiService);
  isLoading = computed(() => this.ui.loading());
}
