import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookRedactorComponent } from './book-redactor-component';

describe('BookRedactorComponent', () => {
    let component: BookRedactorComponent;
    let fixture: ComponentFixture<BookRedactorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BookRedactorComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BookRedactorComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
