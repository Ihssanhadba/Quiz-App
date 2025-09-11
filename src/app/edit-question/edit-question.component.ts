import { Component, OnDestroy } from '@angular/core';
import { DataFetchingService } from '../data-fetching.service';
import { SessionService } from '../session.service';
import { Questions } from '../questions';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

declare var bootstrap: any;
@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrl: './edit-question.component.scss',
})
export class EditQuestionComponent {
  requiredQuestion: boolean = false;
  shortQuestion: boolean = false;
  requiredAnswer1: boolean = false;
  requiredAnswer2: boolean = false;
  requiredRadio: boolean = false;
  correctAnswerIndex: number = -1;
  updatedQuestion!: Questions;
  updatedQuestionArray: Questions[] = [];
  categories: string[] = [];
  selectedCategory!: string;
  all_data!: Questions[];
  filteredQuestions!: Questions[];
  correctData: boolean = true;

  constructor(
    private datafetchingservice: DataFetchingService,
    private sessionservice: SessionService,
    private router: Router
  ) { }

  ngOnInit() {
    this.datafetchingservice.sendAddedQuestion$.subscribe((questions) => {
      this.all_data = questions;
      this.filteredQuestions = questions;
    });
    this.datafetchingservice.getAllQuestions().subscribe((data) => {
      this.fillCategArray(data);
    });
  }

  fillCategArray(data: any) {
    data.forEach(element => {
      if (element.category.length > 0 && !this.categories.includes(element.category))
        this.categories.push(element.category)
    });
  }

  onCategorySelected() {
    this.filteredQuestions = this.all_data.filter(question => question.category === this.selectedCategory);
  }

  addQuestion() {
    this.datafetchingservice.setSelectedCategory(this.selectedCategory);
    this.router.navigate(['/add']);
  }

  shouldDisplayCategory(category: string, index: number): boolean {
    return this.filteredQuestions.findIndex((q) => q.category === category) === index;
  }

  trackByFn(index) {
    return index;
  }

  deleteAll() {
    sessionStorage.clear();
    this.datafetchingservice.deleteAllAddedQuestions();
  }

  delete(index: number) {
    this.datafetchingservice.deleteAddedQuestion(index);
    this.sessionservice.deleteFromSession(index);
  }

  checkCorrectAnswer(questId: number, answerIndex: number): void {
    this.all_data[questId].correctAnswersIndex = answerIndex;
  }

  addAnswer(questId: number) {
    if (!this.all_data[questId].answers[2])
      this.all_data[questId].answers[2] = 'all options are true';
    else if (!this.all_data[questId].answers[3])
      this.all_data[questId].answers[3] = 'all options are false';
  }

  deleteAnswer(questId: number, index: number) {
    this.all_data[questId].answers[index] = '';
    if (this.all_data[questId].correctAnswersIndex === index)
      this.all_data[questId].correctAnswersIndex = -1;
  }

  validateInput(question: Questions) {
    this.requiredQuestion = false;
    this.shortQuestion = false;
    this.requiredAnswer1 = false;
    this.requiredAnswer2 = false;
    this.requiredRadio = false;
    if (question['question'].length === 0) this.requiredQuestion = true;
    if (!this.requiredQuestion && question['question'].length < 10)
      this.shortQuestion = true;
    if (question['answers'][0].length === 0)
      this.requiredAnswer1 = true;
    if (question['answers'][1].length === 0)
      this.requiredAnswer2 = true;
    if (question['correctAnswersIndex'] === -1)
      this.requiredRadio = true;
  }

  finish() {
    this.correctData = true;
    this.all_data.forEach((question, index) => {
      this.validateInput(question);
      this.updatedQuestion = {
        category: question['category'],
        question: question['question'],
        answers: question['answers'],
        correctAnswersIndex: question['correctAnswersIndex'],
      };
      this.updatedQuestionArray.push(this.updatedQuestion);
      this.datafetchingservice.setUpdatedQuestion(this.updatedQuestionArray);
      this.sessionservice.updateSession('question', this.updatedQuestionArray);
      if (this.requiredQuestion || this.shortQuestion) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `question ${index + 1} are empty or short`,
        });
        this.correctData = false;
      }
      if (this.requiredAnswer1 || this.requiredAnswer2) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `answers for question ${index + 1} are empty`,
        });
        this.correctData = false;
      }
      if (this.requiredRadio) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `select a correct answer for question ${index + 1}`,
        });
        this.correctData = false;
      }
    });
    this.updatedQuestionArray = [];
    if (this.correctData)
      Swal.fire({
        icon: 'success',
        title: 'Data Updated',
        text: 'The question has been updated successfully!',
        showConfirmButton: false,
        timer: 1500
      });
  }

  canDeactivate() {
    let index = 0;
    for (const question of this.all_data) {
      this.validateInput(question);
      index++;
      if (this.requiredQuestion || this.shortQuestion) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `question ${index} are empty or short`,
        });
        return false;
      }
      if (this.requiredAnswer1 || this.requiredAnswer2) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `answers for question ${index} are empty`,
        });
        return false;
      }
      if (this.requiredRadio) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `select a correct answer for question ${index}`,
        });
        return false;
      }
    } 
    return true;
  }
}
