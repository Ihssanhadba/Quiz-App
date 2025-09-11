import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuizApiComponent } from './quiz-api/quiz-api.component';
import { AddQuesstionComponent } from './add-quesstion/add-quesstion.component';
import { HomeComponent } from './home/home.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    QuizApiComponent,
    AddQuesstionComponent,
    HomeComponent,
    EditQuestionComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule
  ],
  providers: [
    provideClientHydration(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
