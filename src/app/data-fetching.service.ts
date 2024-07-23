import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataFetchingService {
  private dataUrl = './assets/data.json';
  private apiUrl = 'https://quizapi.io/api/v1/questions';
  private apiKey = 'm89dyev4mZmBzNbiCaTzcl4zGGAPlP0qn91KnaCQ'; 

  constructor(private http: HttpClient) { }

  getQuestions(): Observable<any> {
    return this.http.get<any>(this.dataUrl);
  }
  getQuestionsByCategory(limit: number, category: string): Observable<any> {
    const params = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('limit', limit.toString())
      .set('category', category);

    return this.http.get<any>(this.apiUrl, { params });
  }
  getAllQuestions(): Observable<any> {
    const params = new HttpParams()
      .set('apiKey', this.apiKey)

    return this.http.get<any>(this.apiUrl, { params });
  }
}
