import { Component, OnInit } from '@angular/core';
import{ ConnectionService } from '../services/connection';
import { firstValueFrom } from 'rxjs';
import { word } from '../models/word';
import { result } from '../models/result'

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
  cs : ConnectionService;
  displayPopup = true;
  input1=''
  input2=''
  // Data for player1
  player1 =''
  efTimePlayer1 = 0
  roundsPlayer1 = 0
  // Data for player1
  player2 =''
  efTimePlayer2 = 0
  roundsPlayer2 = 0
  // Data for actual game
  actualPlayer = ''
  actualPlayerTime = 0
  win = false
  words : word[]
  actualWord = ''
  round = 1
  wordIndex = 0
  hangedStatus = 0
  
  constructor(cs: ConnectionService){
    this.cs = cs;
    this.words= []; 
    
  }

  ngOnInit(): void {
    
    this.init();
  }
  async init(){
    document.getElementById("starGameButton")?.addEventListener("click",evt=>{
      this.newGame();      
    })
    
  }
  togglePopup() {
    let popupElement = document.getElementById("popup") as HTMLElement ;  

    if (!this.displayPopup) {
      this.displayPopup = true;
      popupElement.style.display = 'block'; 
      
    } else {
      this.displayPopup = false;
      popupElement.style.display = 'none';
      
    }      
  
    
  }
  /*
  * Create all the enviroment for start a game 
  */
  async newGame(){
    // gets the words from the backend
    this.words = (await firstValueFrom(this.cs.getWords())).data as word[];
    this.randPlayerInfo();    
    this.togglePopup()
    this.createKeyboard();     
    this.setHangedStatus();    
    this.setWordLetters()
    this.actualPlayerTime = new Date().getTime()
  }
  /*
  * charges the letters container with hidden letter cards for the game using 
  * the connection service gets 4 random words from the backend before
  */
  async setWordLetters(){
    this.actualWord = (this.words[this.wordIndex]).word;
    console.log(this.actualWord)
    const lettersContainer = document.querySelector("#lettersContainer") as HTMLElement | null;  
    const wordObj: word | undefined = this.words[this.wordIndex];
    let word = wordObj.word;
    for(let i=0;i<word.length;i++){
      let letter = word[i];
      let gameLetter = document.createElement("mat-card")
      let labelLetter = document.createElement("strong")
      labelLetter.setAttribute("id","gl-"+i+letter);
      labelLetter.innerHTML = "_";
      gameLetter.appendChild(labelLetter);
      lettersContainer?.appendChild(gameLetter)
    }        
  }
  
  /*
  * set the image of the status of the hanged man 
  */
  setHangedStatus(){
    const hangedField = document.getElementById("hangedField")      
    let imgGame = document.createElement("img");
    imgGame.setAttribute("id", "hangedImg" )
    imgGame.setAttribute("src","../../assets/ah0.png");
    hangedField?.appendChild(imgGame);
  }
  /*
  * actualizes the image instead of the status of the hanged man 
  */
  getHangedStatus():boolean{
    if (this.hangedStatus  > 6){      
      return true
    }
    let imgGame = document.getElementById("hangedImg") as HTMLElement
    
    imgGame.setAttribute("src","../../assets/ah"+this.hangedStatus+".png")
    if (this.hangedStatus == 6){      
      return false
    }
    return true 
  }
  /*
  * inspect if all the hidden letters were discovered and return the status
  */
  checkActualWord():boolean{
    for(let i = 0; i < (this.actualWord).length; i++){
      let gameLetter = document.getElementById("gl-"+i+this.actualWord[i])      
      if (gameLetter?.innerHTML==="_"){ 
        return false        
      }
    }
    this.win = true
    return true
  }
  
  /*
  * Chooses the first turn with the input names of the popup
  */
  randPlayerInfo(){
    let num = Math.floor(Math.random()*2);
    if (num==1){
      this.player1 = this.input1;
      this.player2 = this.input2;
    }else{
      this.player1 = this.input2;
      this.player2 = this.input1;
    }
    this.actualPlayer = this.player1
  }
  createKeyboard(){
    let keyboardContainer = document.getElementById("keyboard")
    this.letters.forEach(letter => {
      //Buttons atributes of the keyboard and event function
      let key = document.createElement("mat-button");
      key.innerHTML = letter;
      key.setAttribute("id","key-"+letter);
        
      const event = key.addEventListener("click",evt=>{      
        let idKey = (evt.target as HTMLElement).id
        const key = document.getElementById(idKey) as HTMLElement   
        //for not to repeat used keys  
        if(key.style.backgroundColor!=='grey'){
          this.pressKeyButton(evt);
        }        
        
      });
      keyboardContainer?.appendChild(key);
    });
  }
  /*
  * handle by the event of the keys buttons, confirms if one play makes win or loose
  */
  pressKeyButton(evt:Event){
    let idKey = (evt.target as HTMLElement).id
    const key = document.getElementById(idKey) as HTMLElement    
    key?.setAttribute("style","background-color : grey")

    let keyLetter = idKey[idKey.length-1]    
    let found = false
    for(let i = 0; i < (this.actualWord).length; i++){
      //Normalize method that replaces vowels with accent for the actual letter 
      let wordGameLetter = this.actualWord[i]
      if (wordGameLetter!=="Ñ"){
        wordGameLetter = (this.actualWord[i]).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      }        
      if(keyLetter===wordGameLetter){ //If the keyPressed and some actual word letter is the same, this control catches it        
        const hiddenLetter = document.getElementById("gl-"+i+this.actualWord[i]) as HTMLElement;        
        hiddenLetter.innerHTML = this.actualWord[i]        
        found = true
        //if this condition is true instead of press the button is win
        if(this.checkActualWord()){
          this.endtourn()
        }
      }

    }
    if (!found){
      this.hangedStatus++
      //if this condition is true instead of press the button is loose
      if(!this.getHangedStatus()){        
        this.endtourn()
      }
    }
  }
  resetGameField(){
    let keyboard = document.getElementById("keyboard")
    while(keyboard?.firstChild){
      keyboard.removeChild(keyboard.firstChild)
    }
    let lettersContainer = document.getElementById("lettersContainer")
    while(lettersContainer?.firstChild){
      lettersContainer.removeChild(lettersContainer.firstChild)
    }
  }
  endtourn(){
    this.actualPlayerTime = ((new Date().getTime()) - this.actualPlayerTime)
    this.showTournInfo()
    
  }
  resetPlayerInfo(){    
    if(this.actualPlayer === this.player1){
      if (this.win){
        this.roundsPlayer1++
      }
      this.efTimePlayer1 += this.actualPlayerTime
      let timeA = this.printTime(this.efTimePlayer1)      
      this.actualPlayer = this.player2
    }else{
      if (this.win){
        this.roundsPlayer2++
      }
      this.efTimePlayer2 += this.actualPlayerTime
      let timeA = this.printTime(this.efTimePlayer2)
      
      this.actualPlayer = this.player1
    }
    this.actualPlayerTime = new Date().getTime()    
  }

  showTournInfo(){
    //Container elements for the pop up
    const mainElement = document.getElementById("main") as HTMLElement
    const endTournDiv = document.createElement("div")
    endTournDiv.setAttribute("class","popup-container")
    
    //Info for the container
    const cardInfo = document.createElement("mat-card")
    
    const winLabel = document.createElement("h1")
    let labelString = ""
    if(this.win){
      labelString = "¡¡Lo salvaste!!"
    }else{
      labelString ="¡Ay! murió :C"
    }
    winLabel.innerHTML = labelString
    // Info of the recent tourn
    const cardPlayerInfo = document.createElement("div")
    cardPlayerInfo.style.backgroundColor = 'white'
    cardPlayerInfo.style.borderRadius= '5px'
    const wordLabel = document.createElement("h2")
    let wordString = "La palabra era: "+this.actualWord
    wordLabel.innerHTML = wordString

    const playerLabel = document.createElement("h2")
    let playerString = "Jugador: "+this.actualPlayer
    playerLabel.innerHTML = playerString

    const timeLabel = document.createElement("h2")
    let timeString = "Tiempo que te tomó: "+this.printTime(this.actualPlayerTime)+" mins"
    timeLabel.innerHTML = timeString

    const buttonNewStarGame = document.createElement("button")
    buttonNewStarGame.innerHTML = "Continuar"
    buttonNewStarGame.addEventListener("click",evt=>{
      mainElement.removeChild(endTournDiv)
      this.newStartGame()
    })
    cardInfo.appendChild(winLabel)
    cardPlayerInfo.appendChild(wordLabel)
    cardPlayerInfo.appendChild(playerLabel)
    cardPlayerInfo.appendChild(timeLabel)
    cardInfo.appendChild(cardPlayerInfo)
    cardInfo.appendChild(buttonNewStarGame)
    endTournDiv.appendChild(cardInfo)
    mainElement.appendChild(endTournDiv)
    
  }
  printResultGame(gameResult : result){
    //Container elements for the pop up
    const mainElement = document.getElementById("main") as HTMLElement
    let endGameDiv = document.createElement("div")
    endGameDiv.setAttribute("class","popup-container")
    let winLabel = document.createElement("h1")
    winLabel.innerHTML = "Partida terminada"
    endGameDiv.style.top = '10%'
    endGameDiv.style.left = '30%'
    endGameDiv.style.minWidth = '600px'
    // Container for game data
    const cardGameInfo = document.createElement("div")
    cardGameInfo.style.backgroundColor = 'white'
    cardGameInfo.style.borderRadius= '5px'
    
    // data for the game container
    let L_nameWinner = document.createElement("h2")
    let nameWinner = "Ganador: "+ gameResult.winner
    L_nameWinner.innerHTML = nameWinner
    let L_winnerMode = document.createElement("h2")
    let winnerMode = "Modo de gane: "+ gameResult.winMode
    L_winnerMode.innerHTML = winnerMode
    cardGameInfo.appendChild(L_nameWinner)
    cardGameInfo.appendChild(L_winnerMode)

    // Container for player 1 
    let cardPlayer1Info = document.createElement("div")
    cardPlayer1Info.style.backgroundColor = 'white'
    cardPlayer1Info.style.borderRadius= '5px'
    // Data for player 1
    let L_P1 = document.createElement("h2")
    let player1 = "Player 1: "
    L_P1.innerHTML = player1
    let L_nameP1 = document.createElement("h2")
    let nameP1 = "Nombre: " + gameResult.player1
    L_nameP1.innerHTML = nameP1
    let L_roundsP1 = document.createElement("h2")
    let roundsP1 = "Rondas ganadas: " + gameResult.roundsPlayer1
    L_roundsP1.innerHTML = roundsP1
    let L_timeP1 = document.createElement("h2")
    let timeP1 = "Tiempo efectivo total: " + gameResult.timePlayer1
    L_timeP1.innerHTML = timeP1
    cardPlayer1Info.appendChild(L_P1)
    cardPlayer1Info.appendChild(L_nameP1)
    cardPlayer1Info.appendChild(L_roundsP1)
    cardPlayer1Info.appendChild(L_timeP1)

    // Container for player 2 
    let cardPlayer2Info = document.createElement("div")
    cardPlayer2Info.style.backgroundColor = 'white'
    cardPlayer2Info.style.borderRadius= '5px'
    // Data for player 2
    let L_P2 = document.createElement("h2")
    let player2 = "Player 2: "
    L_P2.innerHTML = player2
    let L_nameP2 = document.createElement("h2")
    let nameP2 = "Nombre: "+ gameResult.player2
    L_nameP2.innerHTML = nameP2
    let L_roundsP2 = document.createElement("h2")
    let roundsP2 = "Rondas ganadas: " + gameResult.roundsPlayer2
    L_roundsP2.innerHTML = roundsP2
    let L_timeP2 = document.createElement("h2")
    let timeP2 = "Tiempo efectivo total: " + gameResult.timePlayer2
    L_timeP2.innerHTML = timeP2
    cardPlayer2Info.appendChild(L_P2)
    cardPlayer2Info.appendChild(L_nameP2)
    cardPlayer2Info.appendChild(L_roundsP2)
    cardPlayer2Info.appendChild(L_timeP2)
    
    //Button for close
    const buttonNewGame = document.createElement("button")
    buttonNewGame.innerHTML = "Jugar otra vez"
    
    buttonNewGame.addEventListener("click",evt=>{
      mainElement.removeChild(endGameDiv)
      this.round = 1
      this.wordIndex = 0
      this.hangedStatus = 0
      this.win = false
      this.input1=""
      this.input2=""
      this.roundsPlayer1 = 0 
      this.roundsPlayer2 = 0 
      this.efTimePlayer1 = 0
      this.efTimePlayer2 = 0
      this.resetGameField()
      let hangedField = document.getElementById("hangedField")
      let hangedImg = document.getElementById("hangedImg") as HTMLElement
      hangedField?.removeChild(hangedImg)  
      this.togglePopup()
      
    })
    

    endGameDiv.appendChild(winLabel)
    endGameDiv.appendChild(cardGameInfo)
    endGameDiv.appendChild(cardPlayer1Info)
    endGameDiv.appendChild(cardPlayer2Info)
    endGameDiv.appendChild(buttonNewGame)
    mainElement.appendChild(endGameDiv)

  }
  newStartGame(){    
    this.wordIndex++;
    this.resetPlayerInfo()
    this.win = false
    if(this.wordIndex < 4){
      //all the conditions for continue with the tourns 
      this.resetGameField()
      this.createKeyboard()
      this.hangedStatus = 0
      this.getHangedStatus()
      this.setWordLetters()
      if (this.wordIndex == 2){
        this.round++
      }
      
    }else{
      //all the conditions for the end of the rounds and finish the game 
      let gameResult : result 
      
      let gameWinner = ""
      let gameWinMode = ""         
      
      if(this.roundsPlayer1 > this.roundsPlayer2){
        gameWinner = this.player1
        gameWinMode = "Mayoría de rondas"
      }else if(this.roundsPlayer1 < this.roundsPlayer2){
        gameWinner = this.player2
        gameWinMode = "Mayoría de rondas"
      }else if(this.efTimePlayer1 > this.efTimePlayer2){
        gameWinner = this.player2
        gameWinMode = "Menor tiempo efectivo"
      }else if(this.efTimePlayer1 < this.efTimePlayer2){
        gameWinner = this.player1
        gameWinMode = "Menor tiempo efectivo"
      }else{
        gameWinner = "Ninguno"
        gameWinMode = "Empate"
      }

      
      let timePl1 = this.printTime(this.efTimePlayer1)
      
      let timePl2 = this.printTime(this.efTimePlayer2)
      
      
      //Using the result model for save into the backend 
      gameResult = {
        player1 : this.player1,
        roundsPlayer1 : (this.roundsPlayer1).toString(),
        timePlayer1 : timePl1,
        player2 : this.player2,
        roundsPlayer2 : (this.roundsPlayer2).toString(),
        timePlayer2 : timePl2,    
        winner : gameWinner,
        winMode : gameWinMode
      }
      this.cs.addResult(gameResult).subscribe(async response=>{});
      console.log(gameResult)
      this.printResultGame(gameResult)
    }
  }

  printTime(time:number):string{
    const minutes = Math.floor(time/60000)
    const segs = Math.floor((time%60000)/1000) 
    return minutes+":"+segs 
  }
}
