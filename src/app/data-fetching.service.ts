import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Questions } from './questions';
@Injectable({
  providedIn: 'root'
})
export class DataFetchingService {
  private dataUrl = './assets/data.json';
  private apiUrl = 'https://quizapi.io/api/v1/questions';
  private apiKey = 'm89dyev4mZmBzNbiCaTzcl4zGGAPlP0qn91KnaCQ'; 

  constructor(private http: HttpClient) { }

  getQuestions(): Observable<Questions> {
    return this.http.get<Questions>(this.dataUrl);
  }
  getQuestionsByCategory(limit: number, category: string): Observable<Questions> {
    const params = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('limit', limit.toString())
      .set('category', category);

    return this.http.get<Questions>(this.apiUrl, { params });
  }
  getAllQuestions(): Observable<Questions> {
    const params = new HttpParams()
      .set('apiKey', this.apiKey)

    return this.http.get<Questions>(this.apiUrl, { params });
  }
}
