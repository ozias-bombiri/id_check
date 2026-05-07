import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosteControleComponent } from './poste-controle.component';

describe('PosteControleComponent', () => {
  let component: PosteControleComponent;
  let fixture: ComponentFixture<PosteControleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosteControleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PosteControleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
