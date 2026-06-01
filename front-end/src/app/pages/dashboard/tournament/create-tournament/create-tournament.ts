import { Component, computed, inject, Input, signal } from '@angular/core';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { toSignal } from '@angular/core/rxjs-interop';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TournamentService } from '@/services/tournament.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { finalize } from 'rxjs';
import { CreateTournamentPayload } from '@/models/tournament.model';


// Custom Validators

const tournamentDatesValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const start = control.get('startDate')?.value;
    const end = control.get('endDate')?.value;
    const reg = control.get('registrationDeadline')?.value;

    if (!start || !end || !reg) return null;

    const errors: ValidationErrors = {};
    if (new Date(reg) >= new Date(start)) errors['regAfterStart'] = true;
    if (new Date(start) >= new Date(end)) errors['startAfterEnd'] = true;

    return Object.keys(errors).length > 0 ? errors : null;
};

// ---

// Some Helping Utils
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);


//--


@Component({
    selector: 'app-create-tournament',
    imports: [FluidModule, InputTextModule, ButtonModule, SelectModule, TextareaModule, DatePickerModule, RadioButtonModule, MessageModule, ToggleSwitch, ReactiveFormsModule, SelectButtonModule, ButtonModule, Toast],
    providers: [MessageService],
    templateUrl: './create-tournament.html',
    styleUrl: './create-tournament.scss'
})
export class CreateTournament {
    private tournamentService = inject(TournamentService);
    private router = inject(Router);
    private messageService = inject(MessageService);

    isLoading = signal(false);
    dropdownItems = [
        { label: 'Court A', value: 'Court A' },
        { label: 'Court B', value: 'Court B' },
        { label: 'Court C', value: 'Court C' }
    ];
    bestOfOptions = [
        { label: '3', value: 3 },
        { label: '5', value: 5 }
    ];

    tournamentForm = new FormGroup(
        {
            tournamentName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
            maxPlayers: new FormControl(2, { validators: [Validators.required, Validators.min(2)] }),
            bestOf: new FormControl<3 | 5>(3, { nonNullable: true }),
            tournamentDescription: new FormControl<string | null>(''),
            location: new FormControl('', { validators: [Validators.required] }),
            registrationDeadline: new FormControl(today, { validators: [Validators.required] }),
            startDate: new FormControl(tomorrow, { validators: [Validators.required] }),
            endDate: new FormControl(dayAfterTomorrow, { validators: [Validators.required] }),
            tournamentType: new FormControl(false, { nonNullable: true })
        },
        { validators: tournamentDatesValidator }
    ); // Cross-field validation integrated directly here!


    formValues = toSignal(this.tournamentForm.valueChanges, { initialValue: this.tournamentForm.value });

    isInvalid(controlName: string): boolean {
        const control = this.tournamentForm.get(controlName);
        return !!(control?.invalid && (control.touched || this.isLoading()));
    }


    onCreateTournament = () => {
        if (this.tournamentForm.invalid) {
            this.tournamentForm.markAllAsTouched();
            return;
        }
        this.isLoading.set(true);
        const v = this.tournamentForm.getRawValue();

        const payload: CreateTournamentPayload = {
            name: v.tournamentName,
            max_players: v.maxPlayers!,
            best_of: v.bestOf,
            description: v.tournamentDescription,
            location: v.location!,
            start_date: v.startDate!.toISOString(),
            end_date: v.endDate!.toISOString(),
            registration_deadline: v.registrationDeadline!.toISOString(),
            format: v.tournamentType ? 'single_elimination' : 'round_robin',
            status: 'draft'
        };

        console.log('reached here');

        this.tournamentService
            .createTournament(payload)
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Tournament Created',
                        detail: `${v.tournamentName} has been created successfully`
                    });
                    setTimeout(() => this.router.navigate(['/dashboard/tournaments']), 1500);
                    this.tournamentForm.reset(); // Probably un-necessary.
                    this.isLoading.set(false);
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: err.error?.message || 'Could not create tournament'
                    });

                    console.log('failed' + err.error);
                    this.isLoading.set(false);
                },
                complete: () => {}
            });
    };

    onCancel = () => {
        this.router.navigate(['/dashboard/tournaments']);
    };
}
