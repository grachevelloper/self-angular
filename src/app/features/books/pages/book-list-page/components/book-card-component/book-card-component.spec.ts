import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookCardComponent } from './book-card-component';

describe('BookCardComponent', () => {
  let component: BookCardComponent;
  let fixture: ComponentFixture<BookCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookCardComponent);
    fixture.componentRef.setInput('book', {
      id: 1,
      title: 'Test book',
      author: 'Test author',
      status: 'reading',
    });
    component = fixture.componentInstance
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
