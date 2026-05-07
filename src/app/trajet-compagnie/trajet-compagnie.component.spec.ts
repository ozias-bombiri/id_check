import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajetCompagnieComponent } from './trajet-compagnie.component';

describe('TrajetCompagnieComponent', () => {
  let component: TrajetCompagnieComponent;
  let fixture: ComponentFixture<TrajetCompagnieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrajetCompagnieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrajetCompagnieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
