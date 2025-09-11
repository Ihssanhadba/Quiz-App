import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddQuesstionComponent } from './add-quesstion/add-quesstion.component';
import { QuizApiComponent } from './quiz-api/quiz-api.component';
import { HomeComponent } from './home/home.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { CanDeactivateGuard } from './can-deactivate.guard';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'quiz', component: QuizApiComponent},
  { path : 'add', component: AddQuesstionComponent},
  { path: 'edit', component: EditQuestionComponent, canDeactivate: [CanDeactivateGuard], },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
