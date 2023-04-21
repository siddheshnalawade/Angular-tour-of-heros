import { Injectable } from '@angular/core';
import { Hero } from '../heroes/hero.interface';
import { HEROES } from '../mock-heros';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';  // URL to web api
  constructor(private readonly messageService: MessageService,private http:HttpClient) { }

  private log(message:string):void{
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  getHero(id:number):Observable<Hero>{
    // const hero = HEROES.find(h => h.id == id)!;
    // return of(hero);
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
    .pipe(
      tap((_)=> this.log(`fetched hero id= ${id}`)),
      catchError(this.handleError<Hero>(`getHero id = ${id}`))
    );
  }

  getHeroes():Observable<Hero[]>{
    // const heroes = of(HEROES);
    // return heroes;
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap((_) => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes',[]))
      );
  }
}
