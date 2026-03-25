import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajetComponent } from './trajet.component';

describe('TrajetComponent', () => {
  let component: TrajetComponent;
  let fixture: ComponentFixture<TrajetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrajetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrajetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
