import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddplatformComponent } from './addplatform.component';

describe('AddplatformComponent', () => {
  let component: AddplatformComponent;
  let fixture: ComponentFixture<AddplatformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddplatformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddplatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
