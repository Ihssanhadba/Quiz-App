import { Component, ElementRef, AfterViewInit, OnInit, Renderer2, Output, ViewChild } from '@angular/core';
import { DataFetchingService } from '.././data-fetching.service';
import { Questions } from '.././questions';

@Component({
  selector: 'app-quiz-api',
  templateUrl: './quiz-api.component.html',
  styleUrl: './quiz-api.component.scss'
})
export class QuizApiComponent {
  title = 'angular-quiz-app';
  @ViewChild('parent', { static: false }) parent!: ElementRef;
  @ViewChild('correctAnswers', { static: true }) correctAnswers!: ElementRef;
  // @Output() countdownFinished = new EventEmitter<any>();
  allQuestionsData: any[] = [];
  questionArray: any[] = [];
  questionInterface!: Questions;
  oneQuestion: Questions[] = [];
  finish: boolean = false;
  I = 0;
  index = 0;
  time = 10;
  timer: any;
  selectedAnswer!: string;
  score = 0;
  passed = false;
  startQuiz = 0;
  previousIndex: number | null = null;
  indexSelected!: number;
  selectedCategory!: any;
  categories: any[] = [];
  categorySelected: boolean = false;
  questionLoaded: boolean = true;
  start!: boolean;
  timeText!: any;
  selectedOption: any;
  wrongAnswerArray: any[] = [];
  selectedRadioArray: any[] = [];

  constructor(private datafetchingservice: DataFetchingService, private el: ElementRef, private renderer: Renderer2) { };

  ngOnInit(): void {
    this.datafetchingservice.getAllQuestions().subscribe((data) => {
      this.fillCategArray(data);
    })
  }

  fillCategArray(data: any) {
    data.forEach(element => {
      if (element.category.length > 0 && !this.categories.includes(element.category))
        this.categories.push(element.category)
    });
  }

  onCategorySelected(): void {
    this.questionLoaded = false;
    this.categorySelected = false;
    this.datafetchingservice.getQuestionsByCategory(8, this.selectedCategory).subscribe((data) => {
      this.allQuestionsData = data;
      this.fillArray();
      this.questionLoaded = true;
      this.oneQuestion = [this.questionArray[this.I]];
      this.categorySelected = true;
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

  showNextQuestion() {
    this.timeText = this.el.nativeElement.querySelectorAll('.timer')[0];
    this.timeText.style.color = 'greenyellow';
    this.checkRadioSelected(this.indexSelected);
    this.checkAnswer();
    this.time = 10;
    clearInterval(this.timer);
    this.startTime();
    this.start = true;
    this.changeColorCircle();
    this.oneQuestion = [this.questionArray[++this.I]];
    if (this.I == this.questionArray.length) {
      clearInterval(this.timer);
      this.finish = true;
      this.start = true;
      this.el.nativeElement.querySelector('#allQuestions').classList.remove('hide');
      this.showTrueAnswers();
      this.showScore();
    }
  }
  changeColorCircle() {
    if (this.I < this.questionArray.length) {
      const children = this.parent.nativeElement?.children;
      const child = children[this.I];
      child.style.backgroundColor = "blue";
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

  onAnswerSelected(indexSelected: number): any {
    this.indexSelected = indexSelected;
    this.timeText = this.el.nativeElement.querySelectorAll('.timer')[0];
    if (this.time == 10)
      this.timeText.style.color = 'greenyellow';
    if (this.startQuiz++ == 0) {
      this.start = true;
      this.startTime();
    }
    if (this.previousIndex !== null) {
      const previousAnswer = document.getElementById('answerBox')?.children[this.previousIndex];
      if (previousAnswer) {
        (previousAnswer as HTMLElement).style.color = 'black';
      }
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
      const wrongAnswer = allAnswers[this.I].children[indexSelected];
      wrongAnswer.style.backgroundColor = 'red';
      this.wrongAnswerArray.push(wrongAnswer);
    }
  }

  checkAnswer() {
    if (this.indexSelected == this.questionArray[this.I]?.correctAnswersIndex)
      this.score++;
    else
      this.selectFalseAnswers(this.indexSelected);
    this.indexSelected = -1;
  }

  checkRadioSelected(indexSelected) {
    const allAnswers = this.el.nativeElement.querySelectorAll('#allAnswers');
    if (indexSelected >= 0) {
      let selectedAnswer = allAnswers[this.I].children[indexSelected];
      let li = selectedAnswer.children[0];
      let radio = li.children[0];
      this.selectedRadioArray.push(radio);
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

  retryQuiz() {
    this.finish = false;
    this.I = 0;
    this.index = 0;
    this.time = 10;
    clearInterval(this.timer);
    this.score = 0;
    this.passed = false;
    this.startQuiz = 0;
    this.categorySelected = true;
    this.questionLoaded = true;
    this.oneQuestion = [this.questionArray[this.I]];
    this.el.nativeElement.querySelector('#allQuestions').classList.add('hide');
    this.wrongAnswerArray.forEach(element => {
      element.style.backgroundColor = '#EEEEEE';
    });
    this.selectedRadioArray.forEach(element => {
      element.removeAttribute('checked');
      element.setAttribute('disabled', 'true');
    });
  }

  restartQuiz() {
    this.finish = false;
    this.I = 0;
    this.index = 0;
    this.time = 10;
    clearInterval(this.timer);
    this.score = 0;
    this.passed = false;
    this.startQuiz = 0;
    this.categorySelected = false;
    this.questionLoaded = true;
    this.start = false;
    this.selectedCategory = '';
  }

  startTime() {
    this.timer = setInterval(() => {
      if (this.time == 10) {
        this.timeText.style.color = 'greenyellow';
      }
      if (this.time == 7) {
        this.timeText.style.color = 'orange';
      }
      if (this.time == 4) {
        this.timeText.style.color = 'red';
      }
      this.time--;
      if (this.time == 0) {
        this.showNextQuestion();
      }
    }, 1000)
  }
}
// selectFalseAnswers(indexSelected: number) {
//   if (indexSelected >= 0) {
//     const allAnswers = this.el.nativeElement.querySelectorAll('#allAnswers');
//     const wrongAnswer = allAnswers[this.I].children[indexSelected];
//     wrongAnswer.style.backgroundColor = 'red';
//   }
// }
// onAnswerSelected(indexSelected: number): any {
//   this.indexSelected = indexSelected;
//   if (this.startQuiz++ == 0) this.startTime();
//   if (this.previousIndex !== null) {
//     const previousAnswer = document.getElementById('answerBox')?.children[this.previousIndex];
//     (previousAnswer as HTMLElement).style.color = 'black';
//   }
//   this.previousIndex = indexSelected;
//   const answerSelected = document.getElementById('answerBox')?.children[indexSelected];
//   (answerSelected as HTMLElement).style.color = 'blue';
// }

// checkRadioSelected(indexSelected) {
//   const allAnswers = this.el.nativeElement.querySelectorAll('#allAnswers');
//   if (indexSelected >= 0) {
//     let selectedAnswer = allAnswers[this.I].children[indexSelected];
//     let li = selectedAnswer.children[0];
//     let radio = li.children[0];
//     this.renderer.setAttribute(radio, 'checked', 'true');
//     this.renderer.removeAttribute(radio, 'disabled');
//   }
// }

//}