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
}
