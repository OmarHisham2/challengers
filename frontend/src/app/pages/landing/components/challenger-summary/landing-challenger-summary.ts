import { Component } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'challenger-summary',
    imports: [StyleClassModule, ButtonModule, RippleModule, NgOptimizedImage],
    templateUrl: 'landing-challenger-summary.html'
})
export class ChallengerSummary {}
