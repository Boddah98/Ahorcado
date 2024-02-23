import { Component, OnInit } from '@angular/core';
import{ ConnectionService } from '../services/connection';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['../../styles.css']
})
export class gameComponent implements OnInit{
  title = 'FE-app';
  letters = 
    ["Q","W","E","R","T","Y","U","I","O","P",
    "A","S","D","F","G","H","J","K","L","Ñ",
    "Z","X","C","V","B","N","M"    
  ];
  constructor(){
    document.addEventListener('DOMContentLoaded', () => {
      this.createKeyboard();
    });
  }
  ngOnInit(): void {
    
    this.init();
  }
  async init(){
    
  }
  createKeyboard(){
    let keyboardContainer = document.getElementById("keyboard")
    this.letters.forEach(letter => {
      let letterObj = document.createElement("mat-button");
      letterObj.innerHTML = letter;
      letterObj.setAttribute("id",letter);
      keyboardContainer?.appendChild(letterObj);
    });
  }
}
