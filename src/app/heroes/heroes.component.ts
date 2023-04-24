import { Component } from '@angular/core';
import { Hero } from './hero.interface';
import { HeroService } from '../services/hero.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent {
  heroes:Hero[] = [];

  constructor(private readonly heroService:HeroService, private readonly messageService:MessageService){}

  ngOnInit():void{
    this.getHeroes();
  }

  getHeroes():void{
     this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }

  add(name:string):void{
    name = name.trim();
    if(!name){return;}
    this.heroService.addHero({name} as Hero).subscribe(hero=> {
      this.heroes.push(hero);
    })
  }

  delete(hero:Hero):void{
    this.heroes = this.heroes.filter(h=>h.id!=hero.id);
    this.heroService.deleteHero(hero.id).subscribe();
  }
}
