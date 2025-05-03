import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestgameComponent } from './testgame.component';

describe('TestgameComponent', () => {
  let component: TestgameComponent;
  let fixture: ComponentFixture<TestgameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestgameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestgameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
