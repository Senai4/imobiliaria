import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CorretorGuard implements CanActivate {
  constructor(private auths: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auths.isCorretor()) {
      return true;
    }

    this.router.navigate(['/home']);
    return false;
  }
}
