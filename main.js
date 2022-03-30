// Listener not needed when action is added directly to button.
// Listeners should be added inside DOMContentLoaded event handler to make sure they appear on the page before the JS is executed

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('inputButton').addEventListener('click', openClose);
});


// All variable declarations (e.g. Vex.Flow) are wrapped INSIDE a class or function to make sure all JS is loaded before attempting to assign them.

 
//--------------CLASS----------------------------------------------------------------------
class VibraphoneNotes {
  constructor(type) {
    this.useFlats = true;
    if (type == 'sharps')
      this.useFlats = false;
    
    this.chord = Array();
    this.midiArray = Array();
    let notesArr = ['C', 'Db', 'C#', 'D', 'Eb', 'D#', 'E', 'F', 'Gb', 'F#', 'G', 'Ab', 'G#', 'A', 'Bb', 'A#', 'B',]
    // so you can name an array in an array?
    //Initialize MidiNote Array...
    notesArr.forEach(element => { this.midiArray[element] = Array(); })

    this.noteArray = Array();
    let flatArr = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B',];
    let sharpArr = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',];
    

    //Vibraphone Starts on F --Midi 53, ends on MIDI 96
    for (let noteNum = 53; noteNum < 97; noteNum++) {
      //vibraphone Octave (Low F is octave 1)!!!

      let octave = parseInt(noteNum / 12) - 3;
      
      // 'render' Octave for VexFlow is:
      //let render = parseInt(noteNum / 12) -1;

      let arr = (noteNum % 12);
      let A = { flats: flatArr[arr], sharps: sharpArr[arr], octave: octave };
      
      this.noteArray[noteNum] = A;
      //console.log ("NOTE: " + noteNum + " :: ARR: " + flatArr[arr]); 
      //console.log(JSON.parse(JSON.stringify(this.noteArray)))
      //Midi Note Array
      let N = flatArr[arr];
      let T = this.midiArray[N]; //current  array
      T.push(noteNum);

      //extra check for sharps
      if (N.length > 1) {
        N = sharpArr[arr];
        this.midiArray[N] = T;
      }
    }

  }

  
  //Create a usable note Object
  //Assumes bottom octave if not specified...
  //Assumes isValidNoteName(noteName)
  createNoteObjectFromName(noteName, octave = 1) {
    if ((octave<1) || (octave>3)) { octave = 1}
    
    let noteObj = { nm: noteName }
    noteObj.midi = this.getLowestMIDINote(noteObj.nm);
    noteObj.midi += (octave -1 ) * 12;
    noteObj.octave = octave;
    
    return noteObj;
  }
  
  getNoteNameFromMIDI(midiNote) {
    if (this.useFlats) {
      return this.noteArray[midiNote].flats;

    } else {
      return this.noteArray[midiNote].sharps;
    }
  }
  
  getOctaveFromMIDI(midiNote) {
    return this.noteArray[midiNote].octave;
  }
  
  //Returns MIDI Note Corresponding to given Note Name and Octave
  getMIDIFromNote(noteName,octave) { 
    let midiArray = this.midiArray[noteName];
    let midiNote = 0; 
    midiArray.forEach((e, i) => {
      octChk = this.noteArray[e].octave;
      if (octChk == octave) {
      midiNote = e;
      }
    });
    return midiNote;
  }
  
  //Return array of all MIDI notes sharing a particular note name ('A', 'Bb')
  getMidiArray(noteName) {
    return this.midiArray[noteName]
  }
  
  //Returns Lowest possible 
  getLowestMIDINote(noteName) {
    let A = JSON.parse(JSON.stringify(this.midiArray[noteName]))
    return A.shift();
  }
  
  getHighestMIDINote(noteName) {
    let A = JSON.parse(JSON.stringify(this.midiArray[noteName]));
    return A.pop();
  }
  
  // Simulate Drop2 or Drop4 stickings...
  // voice = 0,1,2,3 (left to right, or low to high)
  // direction = 1, -1 (octave up or down)
  octaveShiftVoice = (chd, voice = 0, direction = 1) => {
    if ((direction != 1) && (direction != -1)) {
      direction = 1;
    }
    chd[voice].octave = chd[voice].octave + direction;
    chd[voice].midi = chd[voice].midi + (12 * direction);
    return chd
  }
  
  
  //Returns the Lowest possible order of notes for a given chord
  sortChordNotes = (theChord) => {
    //let newOrder = JSON.parse(JSON.stringify(theChord));
    return theChord.sort((a, b) => { return a.midi - b.midi; });
  }
  
  
  upCase(chd) {
    chd.forEach((e, i) => {
      if (e.nm.length === 2) {
        chd[i].nm = e.nm.substring(0, 1).toUpperCase() + e.nm.substring(1, 2);         
      } else {
        chd[i].nm = e.nm.toUpperCase();

      }
    })
    return chd;
  }


  _makeVFBeatNotes = (chord) => {
    // 'render' Octave for VexFlow is:
    //let render = parseInt(noteNum / 12) - 1
    let n = [];
    chord.forEach((c, i) => {
      var oct = (c.midi / 12) - 1;
      n.push(`${c.nm}/${oct}`)
    })
    return n
  }
  
  _assignVFAccidenatls(chord, voice){
     //go through theNotes and make object of what note numbers are sharp and flat
    //acc = accidentals
    let acc = new Object();
        
    chord.forEach((e, i) => {
      let name = e.nm;
      let letter = name.charAt(0);
      console.log(letter);
      console.log(name);
      //console.log(e);
      if (name.charAt(1) === '#') {
      acc[letter] = i;
      //Vex.FlowStaveNote
        voice.addAccidental(i, new Vex.Flow.Accidental('#')); 
      } else if (name.charAt(1) === 'b') {
      acc[letter] = i;
      //Vex.FlowStaveNote
        voice.addAccidental(i, new Vex.Flow.Accidental('b')); 
      } 
    });
    
    //Must mark notes that require a natural sign, so we pass thru twice!
    chord.forEach((e, i) => { 
      let name = e.nm;
      let letter = name.charAt(0);
      //Should be natural, but the same letter appears elsewhere in the chord with an accidental!
      if ((name.length === 1) && (Object.keys(acc).includes(letter)) && (acc[letter] != i)) {
      voice.addAccidental(i, new Vex.Flow.Accidental('n')); 
      }  
    });
    
    return voice;
  }

  isValidNoteName(theNote) {
    const n = ['C', 'Db', 'C#', 'D', 'Eb', 'D#', 'E', 'F', 'Gb', 'F#', 'G', 'Ab', 'G#', 'A', 'Bb', 'A#', 'B',]
    if (n.includes(theNote)) {
      return true;
    } else return false;
  }  

  //Vibe chords will have a maximum of four voices, so it is okay to leave this as is...
  //Variable 'length' added to function to allow flexibility in future calls.
  // length -- 'q', 'e', etc... see Vex.Flow documentation
  makeVFVoice(chord, length = "q") {
    //use correct formatting for Vex.Flow...
    let VFnotes = this._makeVFBeatNotes(chord);  
    
    let voice =  new Vex.Flow.StaveNote({ clef: "treble", keys: VFnotes, duration: length });
    
    voice = this._assignVFAccidenatls(chord, voice);

    return voice;
  
  }
}

  

// -------------Main Code---------------------------------------------------------------------

function openClose() {
  let VF = Vex.Flow;
  
  let VF_Window = document.getElementById("VF_Window");
  var errorMessage = document.getElementById('open_closed_error-message');
  let errFlag = { flag: true, msg: 'ok' }

  let VN = new VibraphoneNotes('sharps')
  let measureNotes = [];
  let chord = [];
  
  const note1 = document.getElementById('open_closed_note1').value.trim();
  if (!(VN.isValidNoteName(note1))) {
    errFlag.flag = false;
    errFlag.msg = 'Check Your Note Entries...';
  } else {
    chord.push(VN.createNoteObjectFromName(note1));
  }
  
  const note2 = document.getElementById('open_closed_note2').value.trim();
  if (!(VN.isValidNoteName(note2))) {
    errFlag.flag = false;
    errFlag.msg = 'Check Your Note Entries...';
  } else {
    chord.push(VN.createNoteObjectFromName(note2));
  }

  const note3 = document.getElementById('open_closed_note3').value.trim();
  if (!(VN.isValidNoteName(note3))) {
    errFlag.flag = false;
    errFlag.msg = 'Check Your Note Entries...';
  } else {
    chord.push(VN.createNoteObjectFromName(note3));
  }

  const note4 = document.getElementById('open_closed_note4').value.trim();
  if (!(VN.isValidNoteName(note4))) {
    errFlag.flag = false;
    errFlag.msg = 'Check Your Note Entries...';
  } else {
    chord.push(VN.createNoteObjectFromName(note4));
  }

  //Not needed here - function should be cleaned up for later use...
  //chord = VN.upCase(chord);

  // start making the notes
  if (errFlag.flag) {
  
    chord = VN.sortChordNotes(chord);

    let meas = [];
    //----------
    for (x = 0; x < 4; x++) {
      
      //make the StaveNote for VF
      meas.push(VN.makeVFVoice(chord,'q'));
      
      //make a copy of the chord for open voicing
      let chordCopy = JSON.parse(JSON.stringify(chord));

      //octave shift the second voice of chord 
      chordCopy = VN.octaveShiftVoice(chordCopy, 1, 1);
      chordCopy = VN.sortChordNotes(chordCopy);

      meas.push(VN.makeVFVoice(chordCopy,'q'));

      //octave shift first voice of Original chord...
      chord = VN.octaveShiftVoice(chord, 0, 1);
      chord = VN.sortChordNotes(chord);

    }


    
// -------------
// ---------------NOW MAKE THE NOTES-------------------------------------------------------------------

  // Create an SVG renderer and attach it to the DIV element named "VF_Window".
    var renderer = new VF.Renderer(VF_Window, VF.Renderer.Backends.SVG);

  // Size our SVG:
    renderer.resize(775, 250);

  // And get a drawing context:
    var context = renderer.getContext();

    // Create a stave at position 10, 40 of width 400 on the canvas.

  //measure 1
    var stave = new VF.Stave(50, 10, 350);

    //Add a clef and time signature.

    stave.addClef("treble").addTimeSignature("4/4");

    // Connect it to the rendering context and draw!

    stave.setContext(context).draw();

    const meas1 = meas.slice(0, 4)
    const meas2 = meas.slice(4, 8);
    
    // Create a voice in 4/4 and add the notes from above
    var voice = new VF.Voice({ num_beats: 4, beat_value: 4 });

    //these are the notes
    voice.addTickables(meas1);

    // Format and justify the notes to 400 pixels.
    var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 305);

    // Render voice
    voice.draw(context, stave);
      
  // meas 2
    var stave = new VF.Stave(400, 10, 315);
      
    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();
    //----

    var voice = new VF.Voice({ num_beats: 4, beat_value: 4 });

    voice.addTickables(meas2);

    // Format and justify the notes to 400 pixels.
    var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 325);

    // Render voice

    voice.draw(context, stave);

    // ------------------NOW REVERSE THE ORDER-------------------------------------------------
    meas.reverse();
    const meas3 = meas.slice(0, 4);
    const meas4 = meas.slice(4, 8);

   // meas 3
    var stave = new VF.Stave(50, 125, 350);
    stave.addClef("treble");
    
    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();
    //----

    var voice = new VF.Voice({ num_beats: 4, beat_value: 4 });

    voice.addTickables(meas3);

    // Format and justify the notes 
    var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 350);

    // Render voice

    voice.draw(context, stave);

   // meas 4
    var stave = new VF.Stave(400, 125, 315);
      
    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();
    //----

    var voice = new VF.Voice({ num_beats: 4, beat_value: 4 });

    voice.addTickables(meas4);

    // Format and justify the notes to 400 pixels.
    var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 325);

    // Render voice

    voice.draw(context, stave);
    // delete the old svg and keep the newest
    let svgs = document.getElementsByTagName('svg');

    while (svgs.length > 1) {
      svgs[0].remove();
    }
    errorMessage.innerHTML = "";
    svg = document.getElementsByTagName('svg')
    //svg.setAttribute.baseVal = ("class","center") ;

 
   
  } else {
    // errorMessage
    errorMessage.textContent = 'Error: ' + errFlag.msg
  }
  //end making the notes
}



    

















