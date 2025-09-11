import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataFetchingService } from '../data-fetching.service';
import { Quiz } from '../quiz';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
  allQuizCategories: Quiz[] = [];
  constructor(private datafetchingservice: DataFetchingService,private router : Router) { }

  ngOnInit() {
    this.datafetchingservice.getQuizCategory().subscribe((quizzes) => {
      this.fillQuizCategArray(quizzes);
    })
  }

  fillQuizCategArray(quizzes: Quiz[]) {
    quizzes.forEach(quiz => {
        this.allQuizCategories.push(quiz)
    });
  }

  GoToQuiz(setSelectedCategory:string){
    this.datafetchingservice.setSelectedCategory(setSelectedCategory);
    this.router.navigate(['/quiz'])
  }

}
