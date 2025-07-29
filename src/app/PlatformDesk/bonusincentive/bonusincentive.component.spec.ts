import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusincentiveComponent } from './bonusincentive.component';

describe('BonusincentiveComponent', () => {
  let component: BonusincentiveComponent;
  let fixture: ComponentFixture<BonusincentiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonusincentiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusincentiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
