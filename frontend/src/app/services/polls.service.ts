import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PollsService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<any[]>(`${this.api}/polls`); }
  getOne(id: string) { return this.http.get<any>(`${this.api}/polls/${id}`); }

  getResults(id: string, state?: string) {
    let params = new HttpParams();
    if (state) params = params.set('state', state);
    return this.http.get<any[]>(`${this.api}/polls/${id}/results`, { params });
  }

  create(data: any) { return this.http.post<any>(`${this.api}/polls`, data); }
  update(id: string, data: any) { return this.http.put<any>(`${this.api}/polls/${id}`, data); }
  delete(id: string) { return this.http.delete(`${this.api}/polls/${id}`); }

  castVote(pollId: string, optionId: string) {
    return this.http.post(`${this.api}/votes`, { pollId, optionId });
  }

  getMyVote(pollId: string) {
    return this.http.get<any>(`${this.api}/votes/poll/${pollId}/my-vote`);
  }

  getProfile() { return this.http.get<any>(`${this.api}/users/me`); }
}
