import {Component, ViewEncapsulation, ViewContainerRef, ViewChildren, ViewChild, ElementRef} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router}  from '@angular/router';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {BaThemeSpinner} from '../../theme/services';
import {BlankSpaceValidator} from '../../theme/validators/blank.validator';
import {AppConstant} from "../../app.constant";
import {ApplicationAdminServices} from '../../appServices/application';
import {AuthenticationHelper} from "../../app.authentication";

@Component({
    selector: 'signUp',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './signUp.html',
    styleUrls: ['./signUp.scss']
})

export class signUp extends AppConstant {
    form: FormGroup;
    submitted: boolean = false;
    data: any;
    fileUploadArray: any = [];
    skillsArray: any = [];
    skillsArray1: any = [];
    @ViewChild('fileInput') fileInput: ElementRef;
    @ViewChildren('name') firstField;

    constructor(private authentication: AuthenticationHelper,
                fb: FormBuilder, private router: Router, private appService: ApplicationAdminServices,
                public toastr: ToastsManager, vRef: ViewContainerRef, private _spinner: BaThemeSpinner) {
        super();
        this.form = fb.group({
            'name': ['', Validators.compose([Validators.required, BlankSpaceValidator.validate])],
            'age': ['', Validators.compose([Validators.required, BlankSpaceValidator.validate])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
            'skill': [''],
            'fileUpload': [''],
        });
    }

    // onSubmit
    onSubmit(value: any): void {
        this._spinner.show();
        const data: any = {
            name: value.name,
            age: value.age,
            password: value.password,
            skills: this.skillsArray1,
            pictures: this.fileUploadArray,
        };

       // Api call to sign up, if success signUpSuccess(data) and if error signUpFail(error)
        this.appService.userSignUp(data).subscribe(
            data => this.signUpSuccess(data),
            error => this.signUpFail(error)
        );
    }

    /**
     * if signup success
     * @param data
     */
    signUpSuccess(res) {
        if (res) {
            this._spinner.hide();
            this.authentication.setLoggedIn(res.data[0].original);
            this.toastr.success('SignUp Successful');
            this.router.navigate(['/dashboard']);
        }
    }

    /**
     * if signup fail
     * @param Error
     */
    signUpFail(err) {
        this._spinner.hide();
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else {
            this.toastr.error('Server error');
        }
    }

    addSkill(event) {
        if (event) {
            const skillData: any = {
                skill : event,
            };
            this.skillsArray.push(skillData);
            this.skillsArray1.push(event);
            this.form.controls['skill'].setValue('');
        } else {
            this.toastr.error('Skill should not be empty');
        }

    }

    /**
     * function call when file changes from upload functionality.
     * @param event
     */
    onFileChange(event) {
        if (this.fileUploadArray.length <= 1) {
            const reader = new FileReader();
            if (event.target.files && event.target.files.length > 0) {
                const file = event.target.files[0];
                reader.readAsDataURL(file);
                reader.onload = () => {
                    const base64: any = btoa(reader.result);

                    if (this.fileUploadArray.length == 0) {
                        const fileType: any = file.type.split('/');
                        if (fileType[0] == 'image') {
                            const fileData: any = {
                                name: file.name,
                                type: file.type,
                                data: reader.result.split(',')[1],
                                encrypted: base64,
                            };
                            this.fileUploadArray.push(fileData);
                        } else {
                            this.toastr.error('Please select Image');
                        }
                    } else {
                        this.fileUploadArray.map(data => {
                            if (data.encrypted == base64) {
                                this.toastr.error('Images should be different');
                            } else {
                                const fileType: any = file.type.split('/');
                                if (fileType[0] == 'image') {
                                    const fileData: any = {
                                        name: file.name,
                                        type: file.type,
                                        data: reader.result.split(',')[1],
                                        encrypted: base64,
                                    };
                                    this.fileUploadArray.push(fileData);
                                } else {
                                    this.toastr.error('Please select Image');
                                }
                            }
                        });
                    }
                };
            }
        }
    }

    clearFile() {
        this.fileInput.nativeElement.value = '';
        this.fileUploadArray = [];
    }

    /**
     *  To navigate to forgot password page.
     */
    navigateToForgotPassword() {
        this.router.navigate(['/forgot-password']);
    }

    /**
     *  To navigate to Home page.
     */
    navigateToHome() {
        this.router.navigate(['']);
    }

    /**
     *  To navigate to sign in page.
     */
    navigateToSignIn() {
        this.router.navigate(['/login']);
    }

    trimContent(value, control) {
        if (value) {
            this.form.controls[control].setValue(value.trim());
        }
        return value.trim();

    }
    

}
