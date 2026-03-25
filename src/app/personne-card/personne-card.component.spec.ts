import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonneCardComponent } from './personne-card.component';

describe('PersonneCardComponent', () => {
  let component: PersonneCardComponent;
  let fixture: ComponentFixture<PersonneCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonneCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonneCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
