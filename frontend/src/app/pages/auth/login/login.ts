import { Component, inject } from '@angular/core';
import { AppFloatingConfigurator } from '@/app/layout/component/app.floatingconfigurator';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import {  PasswordModule } from 'primeng/password';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '@/services/auth.service';
import { email } from '@angular/forms/signals';
import { UserService } from '@/services/user.service';

@Component({
    selector: 'app-login',
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, ReactiveFormsModule],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class Login {
    private authService = inject(AuthService);
    private userService = inject(UserService);
    private router = inject(Router);
    userForm = new FormGroup({
        email: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
    });

    checked: boolean = false;

    onLogin = () => {
        if (this.userForm.invalid) {
            return;
        }
        const payload:{email:string,password:string} = this.userForm.getRawValue();

        this.userService.signIn(payload).subscribe({
            next: (response) => {
                if (response) {
                    this.authService.setToken(response.token);

                    this.router.navigate(['/dashboard']);
                }
            },
            error: (err) => {
                console.error('Login failed! ', err);
            }
        });
    };
}
