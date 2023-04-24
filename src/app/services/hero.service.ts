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

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


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

  updateHero(hero:Hero): Observable<any>{
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((_)=>this.log(`updated hero id = ${hero.id}`)),
      catchError(this.handleError<any>('updatedHero'))
    )
  }

  addHero(hero: Hero): Observable<Hero>{
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero:Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>(`addHero`))
    );
  }
  deleteHero(id:number):Observable<Hero>{
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap((_)=>this.log(`Deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    )
  }

  searchHeroes(term:string):Observable<Hero[]>
  {
    if(!term.trim()){
      return of([]);
    }
    const url = `${this.heroesUrl}/?name=${term}`
    return this.http.get<Hero[]>(url).pipe(
      tap(x=>x.length?
        this.log(`found heroes matching "${term}"`) :
       this.log(`no heroes matching "${term}"`)),
       catchError(this.handleError<Hero[]>('searchHeroes', []))
       )
  }

}
