import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router:Router,private authService:AuthService){ }

  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): boolean {
      let result=this.authService.isAuth();
      if(!result){
        this.router.navigate(["/login"]);
      }
      return true;
  }
}
