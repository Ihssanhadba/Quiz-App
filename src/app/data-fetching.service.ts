import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Questions } from './questions';
@Injectable({
  providedIn: 'root'
})
export class DataFetchingService {
  private dataUrl = './assets/data.json';
  private apiUrl = 'https://quizapi.io/api/v1/questions';
  private apiKey = 'm89dyev4mZmBzNbiCaTzcl4zGGAPlP0qn91KnaCQ';
  private all_data: Questions[] = [];
  private addedQuestion: BehaviorSubject<Questions[]> = new BehaviorSubject<Questions[]>(this.all_data);
  public sendAddedQuestion$: Observable<Questions[]> = this.addedQuestion.asObservable();
  private selectedCategory: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public sendSelectedCategory$: Observable<string> = this.selectedCategory.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAllData();
  }

  initializeAllData() {
    if (typeof sessionStorage !== 'undefined') {
      const storedData = sessionStorage.getItem('question');
      this.all_data = storedData ? JSON.parse(storedData) : [];
      this.addedQuestion.next(this.all_data);
    }
  }

  setSelectedCategory(selectedCategory: string) {
    this.selectedCategory.next(selectedCategory);
  }

  setAddedQuestion(addedQuestion: Questions[]) {
    const currentQuestions: Questions[] = this.addedQuestion.getValue();
    const categoryOrderMap: { [key: string]: number } = {};
    let order = 0;
    currentQuestions.forEach(question => {
      if (!categoryOrderMap.hasOwnProperty(question.category))
        categoryOrderMap[question.category] = order++;
    });
    addedQuestion.forEach(question => {
      if (!categoryOrderMap.hasOwnProperty(question.category))
        categoryOrderMap[question.category] = order++;
    });
    const addedQuestions = [...currentQuestions, ...addedQuestion];
    addedQuestions.sort((a, b) => {
      return categoryOrderMap[a.category] - categoryOrderMap[b.category];
    });
    this.addedQuestion.next(addedQuestions);
  }

  setUpdatedQuestion(addedQuestion: Questions[]) {
    const updatedQuestions = [...addedQuestion];
    this.addedQuestion.next(updatedQuestions);
  }

  deleteAllAddedQuestions() {
    this.addedQuestion.next([]);
  }

  deleteAddedQuestion(index: number) {
    const currentQuestions = this.addedQuestion.getValue();
    if (index > -1 && index < currentQuestions.length) {
      const updatedQuestions = currentQuestions.filter((_, i) => i !== index);
      this.addedQuestion.next(updatedQuestions);
    }
  }

  getQuizCategory(): Observable<any> {
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
