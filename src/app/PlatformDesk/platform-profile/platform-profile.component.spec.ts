import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformProfileComponent } from './platform-profile.component';

describe('PlatformProfileComponent', () => {
  let component: PlatformProfileComponent;
  let fixture: ComponentFixture<PlatformProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatformProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
