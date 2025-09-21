import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoursesService, Course } from '../../core/services/courses.service';
import { SemestersService, Semester } from '../../core/services/semesters.service';
import { DisciplinesService, Discipline } from '../../core/services/disciplines.service';
import { CurriculumService, SemesterWithDisciplines } from '../../core/services/curriculum.service';

@Component({
  standalone: true,
  selector: 'app-curriculum-builder',
  imports: [CommonModule, RouterLink],
  templateUrl: './curriculum-builder.html',
  styleUrls: ['./curriculum-builder.scss'],
})
export class CurriculumBuilder implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private coursesSvc = inject(CoursesService);
  private semestersSvc = inject(SemestersService);
  private disciplinesSvc = inject(DisciplinesService);
  private curriculumSvc = inject(CurriculumService);

  courses = signal<Course[]>([]);
  disciplines = signal<Discipline[]>([]);
  courseId = signal<number | null>(null);
  semesters = signal<Semester[]>([]);
  items = signal<SemesterWithDisciplines[]>([]);
  selection = signal<Record<number, number | null>>({});

  ngOnInit() {
    this.coursesSvc.list().subscribe((cs) => this.courses.set(cs));
    this.disciplinesSvc.list().subscribe((ds) => this.disciplines.set(ds));

    const param = this.route.snapshot.paramMap.get('courseId');
    if (param) this.courseId.set(Number(param));

    this.loadCourseData();
  }

  private loadCourseData() {
    const id = this.courseId();
    if (!id) {
      this.semesters.set([]);
      this.items.set([]);
      return;
    }

    this.semestersSvc.byCourse(id).subscribe((sem) => {
      this.semesters.set(sem);
      const mapSel: Record<number, number | null> = {};
      sem.forEach((s) => (mapSel[s.id] = null));
      this.selection.set(mapSel);

      this.curriculumSvc.list().subscribe((allItems) => {
        const ds = this.disciplines();
        const semVM: SemesterWithDisciplines[] = sem.map((s) => ({
          ...s,
          disciplines: allItems
            .filter((ci) => ci.semesterId === s.id)
            .map((ci) => ({
              itemId: ci.id,
              discipline: ds.find((d) => d.id === ci.disciplineId)!,
            }))
            .filter((x) => !!x.discipline),
        }));
        this.items.set(semVM);
      });
    });
  }

  onCourseChange(value: string) {
    const id = value ? Number(value) : NaN;
    const next = isNaN(id) ? null : id;
    this.courseId.set(next);
    if (next) this.router.navigate(['/app/matriz', next]);
    else this.router.navigate(['/app/matriz']);
    this.loadCourseData();
  }

  onSelectDiscipline(semesterId: number, value: string) {
    const num = value ? Number(value) : NaN;
    const current = { ...this.selection() };
    current[semesterId] = isNaN(num) ? null : num;
    this.selection.set(current);
  }

  add(semesterId: number) {
    const discId = this.selection()[semesterId];
    if (!discId) return;
    this.curriculumSvc.add(semesterId, discId).subscribe(() => this.loadCourseData());
  }

  remove(itemId: number) {
    if (confirm('Remover disciplina deste semestre?')) {
      this.curriculumSvc.remove(itemId).subscribe(() => this.loadCourseData());
    }
  }

  trackBySem = (_: number, s: SemesterWithDisciplines) => s.id;
}
