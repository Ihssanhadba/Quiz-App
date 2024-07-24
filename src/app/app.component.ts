import { Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { DataFetchingService } from './data-fetching.service';
import { Questions } from './questions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-quiz-app';
  @ViewChild('parent', { static: false }) parent!: ElementRef;
  @Output() countdownFinished = new EventEmitter<any>();
  allQuestionsData: any[] = [];
  questionArray: any[] = [];
  questionInterface!: Questions;
  oneQuestion: Questions[] = [];
  finish: boolean = false;
  i = 0;
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
  selectedOption:any;
  constructor(private datafetchingservice: DataFetchingService, private el: ElementRef, private renderer: Renderer2) { };

  ngOnInit(): void {
    this.datafetchingservice.getQuestions().subscribe((data) => {
      this.allQuestionsData = data.questions;
      this.fillArray();
      this.oneQuestion = [this.questionArray[this.i]];
    })
  }

  fillArray() {
    this.allQuestionsData.forEach(element => {
      this.questionInterface = {
        category: element['category'],
        question: element['question'],
        answers: element['answers'],
        correctAnswersIndex: element['correctAnswersIndex']
      }
      this.questionArray.push(this.questionInterface);
    });
  }

  showNextQuestion() {
    this.checkRadioSelected(this.indexSelected);
    this.checkAnswer();
    this.time = 10;
    clearInterval(this.timer);
    this.startTime();
    this.changeColorCircle();
    this.oneQuestion = [this.questionArray[++this.i]];
    if (this.i == this.questionArray.length) {
      this.el.nativeElement.querySelector('#allQuestions').classList.remove('hide');
      this.finish = true;
      this.showTrueAnswers();
      this.showScore();
      clearInterval(this.timer);
    }
  }

  changeColorCircle() {
    const children = this.parent.nativeElement?.children;
    const child = children[this.i];
    child.style.backgroundColor = "blue";
  }

  onAnswerSelected(indexSelected: number): any {
    this.indexSelected = indexSelected;
    if (this.startQuiz++ == 0) this.startTime();
    if (this.previousIndex !== null) {
      const previousAnswer = document.getElementById('answerBox')?.children[this.previousIndex];
      (previousAnswer as HTMLElement).style.color = 'black';
    }
    this.previousIndex = indexSelected;
    const answerSelected = document.getElementById('answerBox')?.children[indexSelected];
    (answerSelected as HTMLElement).style.color = 'blue';
  }

  selectOption(indexSelected: number): void {
    if (this.selectedOption !== indexSelected)
      this.selectedOption = indexSelected;
    else {
      this.selectedOption = null;
      setTimeout(() => this.selectedOption = indexSelected, 0);
    }
  }

  showTrueAnswers() {
    const allAnswers = this.el.nativeElement.querySelectorAll('#allAnswers');
    for (let i = 0; i < this.questionArray.length; i++) {
      const correctAnswer = allAnswers[i].children[this.questionArray[i].correctAnswersIndex];
      correctAnswer.style.backgroundColor = 'lightgreen';
    }
  }

  selectFalseAnswers(indexSelected: number) {
    if (indexSelected >= 0) {
      const allAnswers = this.el.nativeElement.querySelectorAll('#allAnswers');
      const wrongAnswer = allAnswers[this.i].children[indexSelected];
      wrongAnswer.style.backgroundColor = 'red';
    }
  }

  checkAnswer() {
    if (this.indexSelected == this.questionArray[this.i]?.correctAnswersIndex)
      this.score++;
    else
      this.selectFalseAnswers(this.indexSelected);
    this.indexSelected = -1;
  }

  checkRadioSelected(indexSelected) {
    const allAnswers = this.el.nativeElement.querySelectorAll('#allAnswers');
    if (indexSelected >= 0) {
      let selectedAnswer = allAnswers[this.i].children[indexSelected];
      let li = selectedAnswer.children[0];
      let radio = li.children[0];
      this.renderer.setAttribute(radio, 'checked', 'true');
      this.renderer.removeAttribute(radio, 'disabled');
    }
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