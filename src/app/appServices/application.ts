import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClientHelper } from '../app.httpClient';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import 'rxjs/Rx';
import { Router } from '@angular/router';

@Injectable()
export class ApplicationAdminServices {
    private loginWithfacebookUrl: string = 'users/loginwithfacebook';
    private setPasswordUrl: string = 'users/setPassword';
    private getAllCardsUrl: string = '/getCards';
    private loginUrl: string = '/login';
    private logoutUrl: string = '/logout';
    private signUpUrl: string = '/signup';
    private generateCodeUrl: string = 'users/generateCode';
    private forgotPasswordUrl: string = 'users/forgotPassword';
    private httpClient: HttpClientHelper;

    constructor(httpClient: HttpClientHelper, private router: Router, public toastr: ToastsManager) {
        this.httpClient = httpClient;
    }

    /**
     * get all cards
     * @returns {Observable<any>}
     */
    getAllCards(): Observable<any> {
        return this.httpClient.get(this.getAllCardsUrl)
            .map(this.extractResponse)
            .catch(this.handleError.bind(this));
    }


    /**
     * Login With Facebook
     * @param data
     * @returns {Observable<any | any>}
     */
    loginWithFacebook(data) {
        return this.httpClient.post(this.loginWithfacebookUrl, data)
            .map(this.extractResponse)
            .catch(this.handleError.bind(this));
    }

    /**
     * User Login from application
     * @param data
     * @returns {Observable<any>}
     */
    userLogin(data): Observable<any> {
        return this.httpClient.post(this.loginUrl, data)
            .map(this.extractResponse)
            .catch(this.handleError.bind(this));
    }

    /**
     * User Logged out from application
     * @param data
     * @returns {Observable<any>}
     */
    userLogout(data): Observable<any> {
        return this.httpClient.post(this.logoutUrl, data)
            .map(this.extractResponse)
            .catch(this.handleError);
    }

    /**
     * To get call user signUp
     * @param data
     * @returns {Observable<any>}
     */
    userSignUp(data): Observable<any> {
        return this.httpClient.post(this.signUpUrl, data)
            .map(this.extractResponse)
            .catch(this.handleError.bind(this));
    }

    /**
     * To get call user generateCode
     * @param data
     * @returns {Observable<any>}
     */
    generateCode(data): Observable<any> {
        return this.httpClient.post(this.generateCodeUrl, data)
            .map(this.extractResponse)
            .catch(this.handleError.bind(this));
    }

    /**
     * To get call user forgotPassword
     * @param data
     * @returns {Observable<any>}
     */
    forgotPassword(data): Observable<any> {
        return this.httpClient.post(this.forgotPasswordUrl, data)
            .map(this.extractResponse)
            .catch(this.handleError.bind(this));
    }

    /**
     * To get call user setPassword
     * @param data
     * @returns {Observable<any>}
     */
    setPassword(data): Observable<any> {
        return this.httpClient.post(this.setPasswordUrl, data)
            .map(this.extractResponse)
            .catch(this.handleError.bind(this));
    }

    /**
     * Extract response from the API call.
     * @param res
     * @returns {any}
     */
    private extractResponse(res) {
        return res;
    }

    private handleError(error) {
        let errorCode = error.error.code;
        // if invalid token or token expired
        if (errorCode == '-114' || errorCode == -114 || errorCode == '-102' || errorCode == -102 || errorCode == '-132'
            || errorCode == -132) {
            // if the user is inactivated by the admin
            if (errorCode == '-132' || errorCode == -132) {
                localStorage.clear();
                this.toastr.error(error.error.message);
                setTimeout(() => {
                    this.router.navigate(['login']);
                }, 3000);
            } else {
                localStorage.clear();
                this.router.navigate(['login']);
            }
        } else {
            return Observable.throw(error);
        }
    }
}
