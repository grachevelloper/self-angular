import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookFiltersComponent } from './book-filters-component';

describe('BookFiltersComponent', () => {
  let component: BookFiltersComponent;
  let fixture: ComponentFixture<BookFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookFiltersComponent);
    fixture.componentRef.setInput('searchQuery', 'Саша');
    fixture.componentRef.setInput('selectedStatus', 'all');
    component = fixture.componentInstance
    fixture.detectChanges();;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
