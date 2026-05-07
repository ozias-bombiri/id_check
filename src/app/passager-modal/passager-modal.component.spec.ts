import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassagerModalComponent } from './passager-modal.component';

describe('PassagerModalComponent', () => {
  let component: PassagerModalComponent;
  let fixture: ComponentFixture<PassagerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassagerModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PassagerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
