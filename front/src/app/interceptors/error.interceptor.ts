import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Une erreur est survenue';

        // Ne rien afficher si on est sur /login ou /register et que c'est une 401/403 pour isLoggedIn
        const url = this.router.url;
        if (
          (url.startsWith('/login') || url.startsWith('/register')) &&
          (error.status === 401 || error.status === 403) &&
          req.url.includes('/user/profile')
        ) {
          // Ne rien afficher pour la vérification isLoggedIn sur login/register
          return throwError(() => error);
        }

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erreur: ${error.error.message}`;
        } else {
          switch (error.status) {
            case 401:
              errorMessage = 'Identifiants invalides';
              // Ne pas rediriger si on est déjà sur login
              if (!url.startsWith('/login')) {
                this.router.navigate(['/login']);
              }
              break;
            case 403:
              errorMessage = 'Accès interdit';
              break;
            case 404:
              errorMessage = 'Ressource non trouvée';
              break;
            case 500:
              errorMessage = 'Erreur serveur interne';
              break;
            default:
              errorMessage = error.error?.message || `Erreur ${error.status}: ${error.statusText}`;
          }
        }

        // Afficher le message d'erreur via SnackBar
        this.snackBar.open(errorMessage, 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });

        return throwError(() => error);
      })
    );
  }
}

