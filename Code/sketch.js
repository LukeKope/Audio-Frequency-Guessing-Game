let osc, fft;
//Variables for game: victory condition, and game frequencies
let victory = false;
//Array of frequencies to be chosen for victory condition
let targetFrequency = [200, 500, 400, 1500, 2000];


//Set Range
let attackLevel = 1.0;
let releaseLevel = 0;

//Set ADSR
let attackTime = .001;
let decayTime = .5;
let susPercent = .1;
let releaseTime = .5;

let new_freq = targetFrequency[0];
//index of array of targetFrequencies
let i = 0;

//number of lives player has
let number_of_lives = 5;

//index of notes array
let note = 0;
//Notes to play when user loses
let losingNotes = [523, 493, 466, 440];
let losingSong = [{
    note: 0,
    duration: 1000,
    display: "C"
  },
  {
    note: 1,
    duration: 1000,
    display: "B"
  },
  {
    note: 2,
    duration: 1000,
    display: "Bflat"
  },
  {
    note: 3,
    duration: 3000,
    display: "A"
  },

];


function setup() {
  fft = new p5.FFT();

  //Making the sine wave oscillator
  osc = new p5.Oscillator();
  env = new p5.Envelope();
  env.setADSR(attackTime, decayTime, susPercent, releaseTime);
  env.setRange(attackLevel, releaseLevel);
  //set initial amp to 0 so oscillator doesn't start until key is pressed
  osc.amp(0);
  //Set frequency to change based on level of game. Need to set a target frequency and then have game start at random frequency
  osc.freq(new_freq);
  osc.setType("sine");

  playTargetFrequency();
}



function draw() {
  createCanvas(windowWidth, windowHeight);
  textSize(40);
  fill(0);
  text("Target frequency: " + new_freq, windowWidth / 2.6, 1100);
  text("Number of lives: " + number_of_lives, windowWidth / 2.5, 1150);
  let freqs = fft.analyze();
  push();
  noStroke();
  osc.start();
  fill(200 - (.3 * (fft.getEnergy(new_freq))), fft.getEnergy(new_freq), 20); // spectrum is green depending on energy of the frequency. Have color change to red if further or blue if further. Maybe blue for too low and red for too high
  for (let i = 0; i < freqs.length; i++) {
    let x = map(i, 0, freqs.length, 0, windowWidth);
    //sets the height equal the negative height of the browser plus the index of the frequency of the particular part of the FFT spectrum (all values between 0 and 255) from the height to 100 pixels
    let h = -height + map(freqs[i], 0, 255, height, 100);
    //set each rectangle in the fft to width of 5 and height of h
    rect(x, 1000, 2, h * .5);
  }
  pop();

  //checks if user ran out of lives
  if (number_of_lives == 0) {
    background(255);
    fill(255, 0, 0);
    textSize(100);
    text("Game Over", windowWidth / 2.5, windowHeight / 2);
    while (note < 4) {
      osc.freq(losingNotes[note]);
      env.play(osc, 1, 1);
      note = (note + 1) % losingNotes.length;
    }
    noLoop();
  }

  //if user picks correct frequency, picks a new target frequency and sets victory to false
  if (victory == true) {
    new_freq = pickVictoryFrequency(targetFrequency);
    console.log('newfreq', (new_freq));
    //after victory, set a random starting point
    osc.freq(int(random(0, 4000)));
    victory = false;
  }

  //Game instructions
  textSize(24);
  fill(0);
  text("Press 'a' to play! Once you think you've found the right note, press 'f'! For a hint, press 'r'", 200, 100);
}

function keyPressed() {
  if (key == "a") {
    env.play(osc, 0, .1);
  } else if (key == "f" & fft.getEnergy(new_freq) >= 255) {
    console.log("VICTORY");
    victory = true;
    osc.amp(0);
  } else if (key == "f") {
    number_of_lives -= 1;
    victory = false;
  }

  if (key == "r") {
    playTargetFrequency();
  }
}

//Mapping frequency to the position of the mouse
function mouseMoved() {
  //mapping values from 100 to 2000 to 0 through windowWidth
  osc.freq(map(mouseX, 0, 2000, 0, windowWidth));
}


function pickVictoryFrequency(victoryFreqs) {
  console.log(i);
  console.log('Victory freq:', victoryFreqs[i])
  i += 1;
  if (i >= 5) {
    i = 0;
  }
  return (victoryFreqs[i]);

}

function playSong(note) {
  osc.freq(note);
}

//function will preview target frequency for user to replicate
function playTargetFrequency(duration) {
  osc.freq(new_freq);
  env.play(osc, 0.1, .1);
}