import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiunComponent } from './premiun.component';

describe('PremiunComponent', () => {
  let component: PremiunComponent;
  let fixture: ComponentFixture<PremiunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremiunComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PremiunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
