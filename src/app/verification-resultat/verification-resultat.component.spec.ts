import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationResultatComponent } from './verification-resultat.component';

describe('VerificationResultatComponent', () => {
  let component: VerificationResultatComponent;
  let fixture: ComponentFixture<VerificationResultatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationResultatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerificationResultatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
