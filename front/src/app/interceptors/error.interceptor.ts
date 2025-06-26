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

        // Ne rien afficher si on est sur /login ou /register et que c'est une 401/403
        const url = this.router.url;
        if (
          (url.startsWith('/login') || url.startsWith('/register')) &&
          (error.status === 401 || error.status === 403)
        ) {
          // Ne rien afficher, juste retourner l'erreur
          return throwError(() => error);
        }

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erreur: ${error.error.message}`;
        } else {
          switch (error.status) {
            case 401:
              errorMessage = 'Non autorisé - Veuillez vous reconnecter';
              this.router.navigate(['/login']);
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

        // Afficher uniquement si on n'est pas sur login/register avec 401/403
        this.snackBar.open(errorMessage, 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });

        return throwError(() => error);
      })
    );
  }
}
