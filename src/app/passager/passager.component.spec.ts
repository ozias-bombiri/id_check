import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassagerComponent } from './passager.component';

describe('PassagerComponent', () => {
  let component: PassagerComponent;
  let fixture: ComponentFixture<PassagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PassagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
