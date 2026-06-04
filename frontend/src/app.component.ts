import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, Toast],
    providers: [MessageService],
    template: `

        <router-outlet></router-outlet>`
})
export class AppComponent {
    router = inject(Router);

    constructor() {
        this.router.events.subscribe((event) => {
            console.log(event);
        });
    }
}
