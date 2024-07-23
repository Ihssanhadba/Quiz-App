import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizApiComponent } from './quiz-api.component';

describe('QuizApiComponent', () => {
  let component: QuizApiComponent;
  let fixture: ComponentFixture<QuizApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuizApiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuizApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
