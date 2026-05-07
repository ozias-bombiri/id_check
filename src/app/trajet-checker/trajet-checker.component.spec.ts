import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajetCheckerComponent } from './trajet-checker.component';

describe('TrajetCheckerComponent', () => {
  let component: TrajetCheckerComponent;
  let fixture: ComponentFixture<TrajetCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrajetCheckerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrajetCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
