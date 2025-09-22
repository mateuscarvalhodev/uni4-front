import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DisciplinesService, Discipline } from '../../core/services/disciplines.service';

@Component({
  standalone: true,
  selector: 'app-disciplines-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './disciplines-list.html',
  styleUrls: ['./disciplines-list.scss'],
})
export class DisciplinesList implements OnInit {
  private svc = inject(DisciplinesService);
  private rows = signal<Discipline[]>([]);
  vm = computed(() => this.rows());

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.svc.list().subscribe((d) => this.rows.set(d));
  }

  remove(id: number) {
    if (confirm('Excluir disciplina?')) {
      this.svc.remove(id).subscribe(() => this.reload());
    }
  }
}
