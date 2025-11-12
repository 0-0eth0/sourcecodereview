import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../_services/token-storage.service';
import { AuthService } from '../_services/auth.service';



@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    isLoggedIn = false;
    constructor(private tokenStorage: TokenStorageService, private authService: AuthService, private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean | UrlTree {
        this.isLoggedIn = !!this.tokenStorage.getToken();
        if (this.isLoggedIn) {
            return true;
        }
        else {
            return this.router.parseUrl("/login");
        }
    }
}
