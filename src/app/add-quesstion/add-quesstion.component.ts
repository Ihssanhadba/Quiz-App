import { Component } from '@angular/core';
import { DataFetchingService } from '../data-fetching.service';
import { SessionService } from '../session.service';
import { Questions } from '../questions';
import { take } from 'rxjs';
declare var bootstrap: any;

@Component({
  selector: 'app-add-quesstion',
  templateUrl: './add-quesstion.component.html',
  styleUrl: './add-quesstion.component.scss'
})
export class AddQuesstionComponent {
  selectedCategory: string = '';
  categories: string[] = [];
  categorySelected: boolean = false;
  requiredQuestion: boolean = false;
  shortQuestion: boolean = false;
  requiredAnswer1: boolean = false;
  requiredAnswer2: boolean = false;
  requiredRadio: boolean = false;
  answerNb = 0;
  question: string = '';
  answer1: string = '';
  answer2: string = '';
  answer3!: string;
  answer4!: string;
  correctAnswerIndex: number = -1;
  addedQuestion !: Questions;

  constructor(private datafetchingservice: DataFetchingService, private sessionservice: SessionService) { };

  ngOnInit() {
    this.datafetchingservice.sendSelectedCategory$.pipe(take(1)).subscribe((category) => {
      this.selectedCategory = category;
      if (this.selectedCategory)
      this.onCategorySelected();
    })
    this.datafetchingservice.getAllQuestions().pipe(take(1)).subscribe((data) => {
      this.fillCategArray(data);
    })
  }

  ngOnDestroy() {
    this.selectedCategory = '';
    this.datafetchingservice.setSelectedCategory('');
  }

  fillCategArray(data: any) {
    data.forEach(element => {
      if (element.category.length > 0 && !this.categories.includes(element.category))
        this.categories.push(element.category)
    });
  }

  onCategorySelected(): void {
    this.categorySelected = true;
  }

  checkCorrectAnswer(index: number) {
    this.correctAnswerIndex = index;
  }

  addAnswer() {
    if (this.answerNb < 3)
      this.answerNb++;
  }

  validateInput() {
    this.requiredQuestion = false;
    this.shortQuestion = false;
    this.requiredAnswer1 = false;
    this.requiredAnswer2 = false;
    this.requiredRadio = false;
    if (this.question.length === 0)
      this.requiredQuestion = true;
    if (!this.requiredQuestion && this.question.length < 10)
      this.shortQuestion = true;
    if (this.answer1.length === 0)
      this.requiredAnswer1 = true;
    if (this.answer2.length === 0)
      this.requiredAnswer2 = true;
    if (this.correctAnswerIndex === -1) {
      this.requiredRadio = true;
    }
  }

  finish() {
    this.validateInput();
    if (this.requiredRadio && !this.requiredAnswer2) {
      alert('you have to select a correct answer');
    }
    if (!this.requiredQuestion && !this.shortQuestion && !this.requiredAnswer1 && !this.requiredAnswer2 && !this.requiredRadio) {
      this.addedQuestion = {
        category: this.selectedCategory,
        question: this.question,
        answers: [this.answer1, this.answer2, this.answer3, this.answer4],
        correctAnswersIndex: this.correctAnswerIndex,
      },
        this.datafetchingservice.setAddedQuestion([this.addedQuestion]);
      this.sessionservice.addToSession('question', this.addedQuestion);
      this.question = '';
      this.answer1 = '';
      this.answer2 = '';
      this.answer3 = '';
      this.answer4 = '';
      this.answerNb = 0;
      this.correctAnswerIndex = -1;
      const toastElement = document.getElementById('updateToast');
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
    }
  }
}
