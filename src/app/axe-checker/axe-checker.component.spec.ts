import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AxeCheckerComponent } from './axe-checker.component';

describe('AxeCheckerComponent', () => {
  let component: AxeCheckerComponent;
  let fixture: ComponentFixture<AxeCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AxeCheckerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AxeCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
