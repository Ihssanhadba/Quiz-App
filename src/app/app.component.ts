import { Component, AfterViewInit, NgZone, ViewChild } from '@angular/core';
import { DataFetchingService } from './data-fetching.service';
import { Question as Question } from './questions';
import { take } from 'rxjs/operators';
import { CdTimerComponent } from 'angular-cd-timer';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-quiz-app';
  questionsArray: Question[] = [];
  questionToShow: Question = {
    id: 0,
    question: '',
    answers: [],
    category: '',
    correctAnswersIndex: -1
  };
  finish: boolean = false;
  questionIndexToShow: number = 0;
  coloredCircleIndex: number = -1;
  score: number = 0;
  passed: boolean = false;
  selectedOption!: number;
  wrongAnswerSelected: { [key: number]: number } = {};
  radioSelected: { [key: number]: number } = {};
  @ViewChild('basicTimer') basicTimer!: CdTimerComponent;
  timerLoaded: boolean = false;

  constructor(private DataFetchingService: DataFetchingService, private ngZone: NgZone) { };

  ngOnInit(): void {
    this.DataFetchingService.getQuestions().pipe(
      take(1)
    ).subscribe((data) => {
      this.fillDataArray(data.questions);
      this.questionToShow = this.questionsArray[this.questionIndexToShow];
    })
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.loadTimerComponent();
    });
  }

  loadTimerComponent() {
    setTimeout(() => {
      this.ngZone.run(() => {
        this.timerLoaded = true;
      });
    }, 450);
  }

  fillDataArray(data: Question[]) {
    data.forEach(element => {
      const question: Question = {
        id: element['id'],
        category: element['category'],
        question: element['question'],
        answers: element['answers'],
        correctAnswersIndex: element['correctAnswersIndex'],
      }
      this.questionsArray.push(question);
    }); 
  }

  showNextQuestion() {
    if (this.questionIndexToShow < this.questionsArray.length) {
      this.basicTimer.start();
      this.checkAnswer(this.questionToShow);
      this.coloredCircleIndex++;
      this.questionToShow = this.questionsArray[++this.questionIndexToShow];
    }
    if (this.questionIndexToShow === this.questionsArray.length) {
      this.finish = true;
      this.showScore();
      this.basicTimer.stop();
    }
  }

  selectOption(indexSelected: number): void {
    if (this.selectedOption !== indexSelected)
      this.selectedOption = indexSelected;
    else {
      this.selectedOption = -1;
      setTimeout(() => this.selectedOption = indexSelected, 0);
    }
  }

  checkAnswer(question: Question) {
    if (this.selectedOption === question?.correctAnswersIndex)
      this.score++;
    else
      this.wrongAnswerSelected[question.id] = this.selectedOption;
    this.radioSelected[question.id] = this.selectedOption;
    this.selectedOption = -1;
  }

  showScore() {
    if (this.score < this.questionsArray.length / 2)
      this.passed = false;
    else
      this.passed = true;
  }
}

