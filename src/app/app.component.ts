import { Component, ElementRef, EventEmitter, AfterViewInit, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { DataFetchingService } from './data-fetching.service';
import { Questions } from './questions';
import { take } from 'rxjs/operators';
import { interval } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-quiz-app';
  @Output() countdownFinished = new EventEmitter<number>();
  allQuestionsData: Questions[] = [];
  questionArray: Questions[] = [];
  questionInterface!: Questions;
  oneQuestion: Questions[] = [];
  finish: boolean = false;
  I = 0;
  coloredCircleIndex = -1;
  index = 0;
  time = 10;
  selectedAnswer!: string;
  score = 0;
  passed = false;
  startQuiz = 0;
  previousIndex: number | null = null;
  submitted = false;
  indexSelected!: number;
  timer: any;
  selectedOption!: number ;
  wrongAnswerSelected: number[] = [];
  radioSelected: number[] = [];
  constructor(private datafetchingservice: DataFetchingService) { };

  ngOnInit(): void {
    this.datafetchingservice.getQuestions().pipe(
      take(1)
    ).subscribe((data) => {
      this.allQuestionsData = data.questions;
      this.fillArray();
      this.oneQuestion = [this.questionArray[this.I]];
    })
  }

  ngAfterViewInit(): void {
    this.startTime();
  };

  fillArray() {
    this.allQuestionsData.forEach(element => {
      this.questionInterface = {
        category: element['category'],
        question: element['question'],
        answers: element['answers'],
        correctAnswersIndex: element['correctAnswersIndex'],
      }
      this.questionArray.push(this.questionInterface);
    });
  }

  showNextQuestion() {
    this.checkAnswer();
    this.time = 10;
    this.coloredCircleIndex++;
    clearInterval(this.timer);
    this.startTime();
    this.oneQuestion = [this.questionArray[++this.I]];
    if (this.I == this.questionArray.length) {
      this.finish = true;
      this.showScore();
      clearInterval(this.timer);
    }
  }

  selectOption(indexSelected: number): void {
    if (this.startQuiz++ == 0) this.startTime();
    if (this.selectedOption !== indexSelected)
      this.selectedOption = indexSelected;
    else {
      this.selectedOption = -1;
      setTimeout(() => this.selectedOption = indexSelected, 0);
    }
  }

  checkAnswer() {
    if (this.selectedOption == this.questionArray[this.I]?.correctAnswersIndex) {
      this.score++;
      this.wrongAnswerSelected.push(-1);
    }
    else {
      this.wrongAnswerSelected.push(this.selectedOption);
    }
    this.radioSelected.push(this.selectedOption);
    this.selectedOption = -1;
  }

  showScore() {
    if (this.score < this.questionArray.length / 2)
      this.passed = false;
    else
      this.passed = true;
  }

  startTime() {
    this.timer = setInterval(() => {
      this.time--;
      if (this.time == 0) {
        this.showNextQuestion();
        this.countdownFinished.emit();
      }
    }, 1000)
  }
}

// import { Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
// import { DataFetchingService } from './data-fetching.service';
// import { Questions } from './questions';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.scss'
// })
// export class AppComponent {
//   title = 'angular-quiz-app';
//   @ViewChild('parent', { static: false }) parent!: ElementRef;
//   @ViewChild('correctAnswers', { static: true }) correctAnswers!: ElementRef;
//   allQuestionsData: Questions[] = [];
//   questionArray: Questions[] = [];
//   questionInterface!: Questions;
//   oneQuestion: Questions[] = [];
//   finish: boolean = false;
//   I = 0;
//   index = 0;
//   time = 10;
//   timer: any;
//   selectedAnswer!: string;
//   score = 0;
//   passed = false;
//   startQuiz = 0;
//   previousIndex: number | null = null;
//   indexSelected!: number;
//   selectedCategory!: string;
//   categories: string[] = [];
//   categorySelected: boolean = false;
//   questionLoaded: boolean = true;
//   start!: boolean;
//   selectedOption!: number;
//   wrongAnswerArray: number[] = [];
//   selectedRadioArray: number[] = [];
//   coloredCircleIndex = -1;
//   wrongAnswerSelected: number[] = [];
//   radioSelected: number[] = [];

//   constructor(private datafetchingservice: DataFetchingService, private el: ElementRef, private renderer: Renderer2) { };

//   ngOnInit(): void {
//     this.datafetchingservice.getAllQuestions().subscribe((data) => {
//       this.fillCategArray(data);
//     })
//   }

//   fillCategArray(data: any) {
//     data.forEach(element => {
//       if (element.category.length > 0 && !this.categories.includes(element.category))
//         this.categories.push(element.category)
//     });
//   }

//   onCategorySelected(): void {
//     this.questionLoaded = false;
//     this.categorySelected = false;
//     this.datafetchingservice.getQuestionsByCategory(8, this.selectedCategory).subscribe((data) => {
//       this.allQuestionsData = data;
//       this.fillArray();
//       this.questionLoaded = true;
//       this.oneQuestion = [this.questionArray[this.I]];
//       this.categorySelected = true;
//     })
//   }

//   fillArray() {
//     this.questionArray = [];
//     this.allQuestionsData.forEach(element => {
//       this.questionInterface = {
//         category: element['category'],
//         question: element['question'],
//         answers: element['answers'],
//         correctAnswersIndex: this.getTrueIndex(element['correct_answers'])
//       }
//       this.questionArray.push(this.questionInterface);
//     });
//   }

//   showNextQuestion() {
//     this.checkAnswer();
//     this.time = 10;
//     this.coloredCircleIndex++;
//     clearInterval(this.timer);
//     this.startTime();
//     this.start = true;
//     this.oneQuestion = [this.questionArray[++this.I]];
//     if (this.I == this.questionArray.length) {
//       clearInterval(this.timer);
//       this.finish = true;
//       this.start = true;
//       this.showScore();
//     }
//   }

//   getTrueIndex(answers: { [key: string]: string }): number {
//     const entries = Object.entries(answers);
//     for (let i = 0; i < entries.length; i++) {
//       if (entries[i][1] === "true") {
//         return i;
//       }
//     }
//     return -1;
//   }

//   onAnswerSelected(indexSelected: number): any {
//     if (this.startQuiz++ == 0) {
//       this.start = true;
//       this.startTime();
//     }
//   }

//   selectOption(indexSelected: number): void {
//     this.indexSelected = indexSelected;
//     if (this.selectedOption !== indexSelected)
//       this.selectedOption = indexSelected;
//     else {
//       this.selectedOption = -1;
//       setTimeout(() => this.selectedOption = indexSelected, 0);
//     }
//   }


//   checkAnswer() {
//     if (this.selectedOption == this.questionArray[this.I]?.correctAnswersIndex) {
//       this.wrongAnswerSelected.push(-1);
//       this.score++;
//     }
//     else
//       this.wrongAnswerSelected.push(this.indexSelected);
//     this.radioSelected.push(this.indexSelected);
//     this.indexSelected = -1;
//     this.selectedOption = -1;
//   }

//   showScore() {
//     if (this.score < this.questionArray.length / 2)
//       this.passed = false;
//     else
//       this.passed = true;
//   }

//   retryQuiz() {
//     this.finish = false;
//     this.I = 0;
//     this.index = 0;
//     this.radioSelected = [];
//     this.coloredCircleIndex = -1;
//     this.wrongAnswerSelected = [];
//     this.time = 10;
//     clearInterval(this.timer);
//     this.score = 0;
//     this.passed = false;
//     this.startQuiz = 0;
//     this.categorySelected = true;
//     this.questionLoaded = true;
//     this.oneQuestion = [this.questionArray[this.I]];
//   }

//   restartQuiz() {
//     this.finish = false;
//     this.I = 0;
//     this.radioSelected = [];
//     this.index = 0;
//     this.time = 10;
//     this.coloredCircleIndex = -1;
//     this.wrongAnswerSelected = [];
//     clearInterval(this.timer);
//     this.score = 0;
//     this.passed = false;
//     this.startQuiz = 0;
//     this.categorySelected = false;
//     this.questionLoaded = true;
//     this.start = false;
//     this.selectedCategory = '';
//   }

//   getTimeClass() {
//     if (this.time > 6 && this.time <= 10)
//       return 'greenyellow';
//     if (this.time > 3 && this.time <= 6)
//       return 'orange';
//     if (this.time <= 3)
//       return 'red';
//     else {
//       return '';
//     }
//   }
//   startTime() {
//     this.timer = setInterval(() => {
//       this.getTimeClass();
//       this.time--;
//       if (this.time == 0) {
//         this.showNextQuestion();
//       }
//     }, 1000)
//   }
// }
