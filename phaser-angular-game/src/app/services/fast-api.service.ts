import { Injectable } from '@angular/core';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FastApiService {
    private apiUrl = 'http://localhost:8080/game/generate-level'; // Spring Boot endpoint

    constructor(private http: HttpClient) { }

    genLevel(payload: any): Observable<any> {
        console.log('Angular → Sending:', payload);
        return this.http.post<any>('http://localhost:8080/game/generate-level', payload);
    }

    getScores(username: String): Observable<any> {
        console.log('Angular → Sending:', username);
        return this.http.get<any>('http://localhost:8080/game/user-scores/' + username);
    }

    getLevels(username: String): Observable<any> {

        return this.http.get<any>('http://localhost:8080/game/levels/' + username);
    }

    savescore(username: string, score: number, levelId: string) {
        const params = new HttpParams()
            .set('username', username)
            .set('score', score.toString())
            .set('levelId', levelId);

        return this.http.post<any>('http://localhost:8080/game/save-score', null, { params });
    }
}
