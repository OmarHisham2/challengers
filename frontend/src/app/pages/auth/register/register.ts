import { Component } from '@angular/core';
import { AppFloatingConfigurator } from '@/app/layout/component/app.floatingconfigurator';
import {  ButtonModule } from 'primeng/button';
import {  CheckboxModule } from 'primeng/checkbox';
import {  InputTextModule } from 'primeng/inputtext';
import {  PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import {  RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { Select } from 'primeng/select';

@Component({
    selector: 'app-register',
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, Select],
    templateUrl: './register.html',
    styleUrl: './register.scss'
})
export class Register {
    name: string = '';
    email: string = '';
    phone: string = '';

    password: string = '';

    checked: boolean = false;

    dropdownItem: any = null;
    licenseId: string = '';

    dropdownItems = [
        { name: 'Judge', value: 'judge' },
        { name: 'Player', value: 'player-info' }
    ];
}
