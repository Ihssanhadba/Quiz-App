import { Component } from '@angular/core';
import { DataFetchingService } from '.././data-fetching.service';
import { SessionService } from '../session.service';
import { Questions } from '.././questions';
import { take } from 'rxjs';

@Component({
  selector: 'app-quiz-api',
  templateUrl: './quiz-api.component.html',
  styleUrl: './quiz-api.component.scss'
})
export class QuizApiComponent {
  title = 'angular-quiz-app';
  allQuestionsData: Questions[] = [];
  questionArray: Questions[] = [];
  questionInterface!: Questions;
  oneQuestion: Questions[] = [];
  finish: boolean = false;
  I = 0;
  time = 10;
  timer!: NodeJS.Timeout;;
  selectedAnswer!: string;
  score = 0;
  passed = false;
  startQuiz = 0;
  selectedCategory!: string;
  categories: string[] = [];
  categorySelected: boolean = false;
  questionLoaded: boolean = true;
  start!: boolean;
  selectedOption!: number;
  selectedRadioArray: number[] = [];
  coloredCircleIndex = -1;
  wrongAnswerSelected: number[] = [];
  radioSelected: number[] = [];
  addedQuestions: Questions[] = [];

  constructor(private datafetchingservice: DataFetchingService, private sessionservice: SessionService,) { };

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

  onCategorySelected() {
    clearInterval(this.timer);
    this.questionLoaded = false;
    this.categorySelected = false;
    this.datafetchingservice.getQuestionsByCategory(8, this.selectedCategory).subscribe((data) => {
      this.allQuestionsData = data;
      this.fillArray();
      this.addQuestions();
      this.questionLoaded = true;
      this.oneQuestion = [this.questionArray[this.I]];
      this.categorySelected = true;
      this.startTime();
    })
  }

  fillArray() {
    this.questionArray = [];
    this.allQuestionsData.forEach(element => {
      this.questionInterface = {
        category: element['category'],
        question: element['question'],
        answers: element['answers'],
        correctAnswersIndex: this.getTrueIndex(element['correct_answers'])
      }
      this.questionArray.push(this.questionInterface);
    });
  }

  addQuestions() {
    this.datafetchingservice.sendAddedQuestion$.subscribe(questions => {
      questions.forEach(question => {
        if (question.category === this.selectedCategory)
          this.questionArray.push(question);
      })
    });
  }

  showNextQuestion() {
    this.checkAnswer();
    this.time = 10;
    this.coloredCircleIndex++;
    clearInterval(this.timer);
    this.startTime();
    this.start = true;
    this.oneQuestion = [this.questionArray[++this.I]];
    if (this.I == this.questionArray.length) {
      clearInterval(this.timer);
      this.finish = true;
      this.start = true;
      this.showScore();
    }
  }

  getTrueIndex(answers: { [key: string]: string }): number {
    const entries = Object.entries(answers);
    for (let i = 0; i < entries.length; i++) {
      if (entries[i][1] === "true") {
        return i;
      }
    }
    return -1;
  }

  selectOption(indexSelected: number): void {
    if (this.selectedOption !== indexSelected)
      this.selectedOption = indexSelected;
    else {
      this.selectedOption = -1;
      setTimeout(() => this.selectedOption = indexSelected, 0);
    }
  }

  checkAnswer() {
    if (this.selectedOption == this.questionArray[this.I]?.correctAnswersIndex) {
      this.wrongAnswerSelected.push(-1);
      this.score++;
    }
    else
      this.wrongAnswerSelected.push(this.selectedOption);
    this.radioSelected.push(this.selectedOption);
    this.selectedOption = -1;
  }

  showScore() {
    if (this.score < this.questionArray.length / 2)
      this.passed = false;
    else
      this.passed = true;
  }

  retryQuiz() {
    this.finish = false;
    this.I = 0;
    this.radioSelected = [];
    this.coloredCircleIndex = -1;
    this.wrongAnswerSelected = [];
    this.time = 10;
    clearInterval(this.timer);
    this.score = 0;
    this.passed = false;
    this.startTime()
    this.categorySelected = true;
    this.questionLoaded = true;
    this.oneQuestion = [this.questionArray[this.I]];
  }

  restartQuiz() {
    this.finish = false;
    this.I = 0;
    this.radioSelected = [];
    this.time = 10;
    this.coloredCircleIndex = -1;
    this.wrongAnswerSelected = [];
    clearInterval(this.timer);
    this.score = 0;
    this.passed = false;
    this.startQuiz = 0;
    this.categorySelected = false;
    this.questionLoaded = true;
    this.start = false;
    this.selectedCategory = '';
  }

  getTimeClass() {
    if (this.time > 6 && this.time <= 10)
      return 'greenyellow';
    if (this.time > 3 && this.time <= 6)
      return 'orange';
    if (this.time <= 3)
      return 'red';
    else {
      return '';
    }
  }
  startTime() {
    this.timer = setInterval(() => {
      this.getTimeClass();
      this.time--;
      if (this.time == 0) {
        this.showNextQuestion();
      }
    }, 1000)
  }
}
