import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

@Component({
    selector: 'app-book-card-skeleton',
    imports: [NzCardModule, NzSkeletonModule],
    templateUrl: './book-card-skeleton-component.html',
    styleUrl: './book-card-skeleton-component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCardSkeletonComponent {}
