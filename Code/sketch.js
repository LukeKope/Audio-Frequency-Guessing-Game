let osc, env, fft;

let victory = False;

let attackLevel = 1.0;
let releaseLevel = 0;

let attackTime = 0.001;
let decayTime = 0.2;
let susPercent = 0.2;
let releaseTime = 0.5;

function setup() {
  env = new p5.Envelope();
  env.setADSR(attackTime, decayTime, susPercent, releaseTime);
  env.setRange(attackLevel, releaseLevel);
  //this is another way to make a sine wave oscillator
  osc = new p5.Oscillator();
  osc.amp(env);
  //Set frequency to change based on level of game. Need to set a target frequency and then have game start at random frequency
  osc.freq(440);
  osc.setType("sine");
  osc.start();

  fft = new p5.FFT();
}

function draw() {
  createCanvas(windowWidth, windowHeight);

  let freqs = fft.analyze();

  push();
  noStroke();
  fill(0, fft.getEnergy(440), 0); // spectrum is green depending on energy of the frequency. Have color change to red if further or blue if further. Maybe blue for too low and red for too high
  for (let i = 0; i < freqs.length; i++) {
    let x = map(i, 0, freqs.length, 0, windowWidth);
    let h = -height + map(freqs[i], 0, 255, height, 0);
    rect(x, height, windowWidth / freqs.length, h);
  }
  pop();

  //Game instructionss
  textSize(24);
  text("'a' to play note", 20, 100);
}

function keyReleased() {
  if (key == "a") {
    env.triggerAttack();
  }
}

//Mapping frequency to the position of the mouse
function mouseDragged() {
  osc.freq(map(mouseX, 0, windowWidth, 0, 2200));
}


function victoryCheck(){
  //If user is at right frequency (i.e. the color is all the way green)
  if(fft.getEnergy>=255){
    //Start timer if user is at correct frequency
    let m = millis();
    //If user holds at right frequency for 3 seconds, victory = True, move on to next level
    if(m==3000){
      victory = True;
    }
    else{
      //reset m to zero if user moves position
      m = 0;
    }
  }
}