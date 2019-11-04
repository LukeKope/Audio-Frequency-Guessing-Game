let osc, fft;
//Variables for game: victory condition, and game frequencies
let victory = false;
//Array of frequencies to be chosen for victory condition
let targetFrequency = [440, 2100, 1650, 1500, 2000, 1700, 1000, 750];


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
let number_of_lives = 8;

//index of notes array
let note = 0;
//Notes to play when user loses
let losingNotes = [523, 493, 466, 440];

//check if user used hint. If they did, on the next press of "a", move frequency to a random location
let usedHint = false;

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
  fill(200 - (0.3 * (fft.getEnergy(new_freq))), fft.getEnergy(new_freq), 20); // spectrum is green depending on energy of the frequency. Have color change to red if further or blue if further. Maybe blue for too low and red for too high
  for (let i = 0; i < freqs.length; i++) {
    let x = map(i, 0, freqs.length, 0, windowWidth);
    //sets the height equal the negative height of the browser plus the index of the frequency of the particular part of the FFT spectrum (all values between 0 and 255) from the height to 100 pixels
    let h = -height + map(freqs[i], 0, 255, height, 100);
    //set each rectangle in the fft to width of 5 and height of h
    rect(x, 1000, 2, h * .25);
  }
  pop();

  //checks if user ran out of lives
  if (number_of_lives == 0) {
    background(255);
    fill(255, 0, 0);
    textSize(100);
    text("Game Over", windowWidth / 2.5, windowHeight / 2);
    noLoop();
  }

  //if user picks correct frequency, picks a new target frequency and sets victory to false
  if (victory == true) {
    new_freq = pickVictoryFrequency(targetFrequency);
    console.log('newfreq', (new_freq));
    //after victory, set a random starting point
    playTargetFrequency();
    victory = false;
  }

  //Game instructions
  textSize(24);
  fill(0);
  text("Drag your mouse to play! Once you think you've found the right note, press 'f'! For a hint, press 'r'", 200, 100);
}

function keyPressed() {
  if (key == "a" & usedHint == false) {
    env.play(osc, 0, 0.1);
  } else if (key == "a" & usedHint == true) {
    env.play(osc, 0, 0.1);
    usedHint = false;
  }
  //if user is correct, move onto the next frequency
  else if (key == "f" & fft.getEnergy(new_freq) >= 255) {
    console.log("VICTORY");
    victory = true;
    osc.amp(0);
    //if user is wrong, lose a life
  } else if (key == "f") {
    number_of_lives -= 1;
    victory = false;
  }

  if (key == "r") {
    let usedHint = true;
    playTargetFrequency();
  }
}

//Mapping frequency to the position of the mouse
function mouseMoved() {
  //mapping values from 0, windowWidth from 0 to 3000Hz
  osc.freq(map(mouseX, 0, windowWidth, 0, 3000));
  env.play(osc, 0, 0.01);
}


function pickVictoryFrequency(victoryFreqs) {
  console.log(i);
  console.log('Victory freq:', victoryFreqs[i])
  i += 1;
  if (i >= 8) {
    i = 0;
  }
  return (victoryFreqs[i]);

}

//function will preview target frequency for user to replicate
function playTargetFrequency() {
  osc.freq(new_freq);
  env.play(osc, 0, 0.1);
}