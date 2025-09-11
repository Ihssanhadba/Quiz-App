import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuesstionComponent } from './add-quesstion.component';

describe('AddQuesstionComponent', () => {
  let component: AddQuesstionComponent;
  let fixture: ComponentFixture<AddQuesstionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddQuesstionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddQuesstionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
