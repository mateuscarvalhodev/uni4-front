import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { UiService } from './ui.service';

@Component({
  standalone: true,
  selector: 'app-toasts',
  imports: [NgFor],
  template: `
    <div class="toasts">
      <div
        class="toast"
        *ngFor="let t of ui.toasts()"
        [class.ok]="t.type === 'success'"
        [class.err]="t.type === 'error'"
        [class.info]="t.type === 'info'"
      >
        <span>{{ t.text }}</span>
        <button (click)="ui.dismiss(t.id)">×</button>
      </div>
    </div>
  `,
  styles: [
    `
      .toasts {
        position: fixed;
        right: 12px;
        bottom: 12px;
        display: grid;
        gap: 8px;
        z-index: 1000;
      }
      .toast {
        display: flex;
        gap: 8px;
        align-items: center;
        background: #1c1c1c;
        border: 1px solid #2a2a2a;
        border-radius: 10px;
        padding: 10px 12px;
      }
      .toast.ok {
        border-color: #16a34a;
      }
      .toast.err {
        border-color: #ef4444;
      }
      .toast.info {
        border-color: #0ea5e9;
      }
      .toast button {
        background: transparent;
        border: 0;
        color: #aaa;
        font-size: 16px;
        cursor: pointer;
      }
    `,
  ],
})
export class ToastsComponent {
  ui = inject(UiService);
}
