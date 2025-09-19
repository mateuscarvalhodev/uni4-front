import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

@Injectable({ providedIn: 'root' })
export class UiService {
  private _loading = signal(false);
  loading = () => this._loading();
  showLoading() {
    this._loading.set(true);
  }
  hideLoading() {
    this._loading.set(false);
  }

  private _toasts = signal<{ id: number; type: ToastType; text: string }[]>([]);
  toasts = () => this._toasts();
  private id = 0;

  toast(type: ToastType, text: string, ms = 3000) {
    const id = ++this.id;
    this._toasts.set([...this._toasts(), { id, type, text }]);
    setTimeout(() => this.dismiss(id), ms);
  }

  dismiss(id: number) {
    this._toasts.set(this._toasts().filter((t) => t.id !== id));
  }
}
