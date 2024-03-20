import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private http: HttpClient) {}

  getLayer1(): Observable<Blob> {
    return this.http
      .get<Blob>('http://localhost:3000/api/layer1', {
        responseType: 'blob' as 'json',
      })
      .pipe(catchError(this.handleError));
  }

  getLayer2() {
    return this.http
      .get<Blob>('http://localhost:3000/api/layer2', {
        responseType: 'blob' as 'json',
      })
      .pipe(catchError(this.handleError));
  }

  search(location: any): Observable<any> {
    return this.http
      .get<any>(
        `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
