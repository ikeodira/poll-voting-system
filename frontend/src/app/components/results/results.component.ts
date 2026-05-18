import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PollsService } from '../../services/polls.service';

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
  'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa',
  'Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba',
  'Yobe','Zamfara',
];

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent implements OnInit {
  poll: any = null;
  results: any[] = [];
  states = NIGERIAN_STATES;
  selectedState = '';
  pollId = '';
  loading = true;

  constructor(private route: ActivatedRoute, private pollsService: PollsService) {}

  ngOnInit() {
    this.pollId = this.route.snapshot.paramMap.get('id')!;
    this.pollsService.getOne(this.pollId).subscribe({
      next: (p) => { this.poll = p; this.loadResults(); },
      error: () => { this.loading = false; },
    });
  }

  loadResults() {
    this.loading = true;
    this.pollsService.getResults(this.pollId, this.selectedState || undefined).subscribe({
      next: (r) => { this.results = r; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  get totalVotes(): number {
    return this.results.reduce((sum, r) => sum + Number(r.voteCount), 0);
  }

  getPercent(count: number): number {
    if (!this.totalVotes) return 0;
    return Math.round((Number(count) / this.totalVotes) * 100);
  }
}
