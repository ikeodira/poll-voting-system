import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PollsService } from '../../../services/polls.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  polls: any[] = [];
  loading = true;
  submitting = false;
  editingPoll: any = null;
  formError = '';
  formSuccess = '';

  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    status: ['active'],
    options: this.fb.array([
      this.fb.control('', Validators.required),
      this.fb.control('', Validators.required),
    ]),
  });

  constructor(private fb: FormBuilder, private pollsService: PollsService) {}

  get optionsArray() { return this.form.get('options') as FormArray; }

  ngOnInit() { this.loadPolls(); }

  loadPolls() {
    this.loading = true;
    this.pollsService.getAll().subscribe({
      next: (p) => { this.polls = p; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  addOption() {
    if (this.optionsArray.length < 4)
      this.optionsArray.push(this.fb.control('', Validators.required));
  }

  removeOption(i: number) { this.optionsArray.removeAt(i); }

  submitForm() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    this.formError = '';
    this.formSuccess = '';

    if (this.editingPoll) {
      this.pollsService.update(this.editingPoll.id, {
        title: this.form.value.title,
        description: this.form.value.description,
        status: this.form.value.status as any,
      }).subscribe({
        next: () => {
          this.formSuccess = 'Poll updated!';
          this.submitting = false;
          this.cancelEdit();
          this.loadPolls();
        },
        error: (err) => { this.formError = err.error?.message || 'Update failed'; this.submitting = false; },
      });
    } else {
      const options = this.optionsArray.value.filter((o: string) => o?.trim());
      this.pollsService.create({ ...this.form.value, options }).subscribe({
        next: () => {
          this.formSuccess = 'Poll created!';
          this.form.reset({ status: 'active' });
          while (this.optionsArray.length > 2) this.optionsArray.removeAt(2);
          this.optionsArray.controls.forEach(c => c.setValue(''));
          this.submitting = false;
          this.loadPolls();
        },
        error: (err) => { this.formError = err.error?.message || 'Creation failed'; this.submitting = false; },
      });
    }
  }

  startEdit(poll: any) {
    this.editingPoll = poll;
    this.form.patchValue({ title: poll.title, description: poll.description, status: poll.status });
    this.formError = '';
    this.formSuccess = '';
  }

  cancelEdit() {
    this.editingPoll = null;
    this.form.reset({ status: 'active' });
  }

  deletePoll(id: string) {
    if (!confirm('Delete this poll and all its votes?')) return;
    this.pollsService.delete(id).subscribe({
      next: () => this.loadPolls(),
      error: () => alert('Delete failed'),
    });
  }
}
