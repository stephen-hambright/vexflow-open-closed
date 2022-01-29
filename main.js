
document.getElementById('inputButton').addEventListener('click', openClose);
const theInput = document.getElementById('input');
var div = document.getElementById("boo");
var errorMessage = document.getElementById('error-message');






VF = Vex.Flow;

function reset() {
    div.remove();
    
}



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

           // let octv = parseInt(noteNum / 12) - 3;
            let octv = parseInt(noteNum / 12 -1); //TOOK -3 OFF FOR RENDERING OF MUSIC

            let arr = (noteNum % 12);
            let A = { flats: flatArr[arr], sharps: sharpArr[arr], octv: octv };
          
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

    noteName(midiNote) {
        if (this.useFlats) {
            return this.noteArray[midiNote].flats;

        } else {
            return this.noteArray[midiNote].sharps;
        }
    }
    getOctave(midiNote) {
        return this.noteArray[midiNote].octv;
    }
    getMidiArray(noteName) {
        return this.midiAArray[noteName]
    }
    lowestMIDINote(noteName) {
        let A = JSON.parse(JSON.stringify(this.midiArray[noteName]))
        return A.shift();
    }
    highestMIDINote(noteName) {
        let A = JSON.parse(JSON.stringify(this.midiArray[noteName]));
        return A.pop();
    }
    shiftVoice = (chd, i = 0) => {
        chd[i].oct = chd[i].oct + 1;
        chd[i].midi = chd[i].midi + 12;
        return chd
    }
    sortChord = (theChord) => {
        //let newOrder = JSON.parse(JSON.stringify(theChord));

        return theChord.sort((a, b) => { return a.midi - b.midi; });
    }
    makeBeatNotes = (nts) => {
        let n = [];
        nts.forEach((c, i) => {
            n.push(`${c.nm}/${c.oct}`)
        })
        return n
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
    findFlatsAndSharps(theNotes){
         //go through theNotes and make object of what note numbers are sharp and flat
        //acc = accidentals
        let acc = [];
        theNotes.forEach((e, i) => {
        if (e.substring(1, 2) === '#') {
            acc.push({voiceNum: i, shpFlt:'#'});
        } else if (e.substring(1, 2) === 'b') {
            acc.push({voiceNum: i, shpFlt: 'b'});
        }
    })
        return acc
    }

    isMusicalNote(theNote) {
        const n = ['C', 'Db', 'C#', 'D', 'Eb', 'D#', 'E', 'F', 'Gb', 'F#', 'G', 'Ab', 'G#', 'A', 'Bb', 'A#', 'B',]
        if (n.includes(theNote)) {
            return {flag: true, msg: 'ok'}
        } else return { flag: false, msg: 'Check your musical note entries'}
    }  

    makeVFVoice(acc, notes) {
        let voice = "";
        if (acc.length == 0) {
          voice =  new VF.StaveNote({ clef: "treble", keys: notes, duration: "q" });
        } else if (acc.length == 1) {
            voice =  new VF.StaveNote({ clef: "treble", keys: notes, duration: "q" })
                .addAccidental(acc[0].voiceNum, new VF.Accidental(acc[0].shpFlt));
    
        } else if (acc.length == 2) {
            voice =  new VF.StaveNote({ clef: "treble", keys: notes, duration: "q" })
                .addAccidental(acc[0].voiceNum, new VF.Accidental(acc[0].shpFlt))
                .addAccidental(acc[1].voiceNum, new VF.Accidental(acc[1].shpFlt));
        } else if (acc.length == 3) {
            voice =  new VF.StaveNote({ clef: "treble", keys: notes, duration: "q" })
                .addAccidental(acc[0].voiceNum, new VF.Accidental(acc[0].shpFlt))
                .addAccidental(acc[1].voiceNum, new VF.Accidental(acc[1].shpFlt))
                .addAccidental(acc[2].voiceNum, new VF.Accidental(acc[2].shpFlt));
        } else if (acc.length == 4) {
            voice =  new VF.StaveNote({ clef: "treble", keys: notes, duration: "q" })
                .addAccidental(acc[0].voiceNum, new VF.Accidental(acc[0].shpFlt))
                .addAccidental(acc[1].voiceNum, new VF.Accidental(acc[1].shpFlt))
                .addAccidental(acc[2].voiceNum, new VF.Accidental(acc[2].shpFlt))
                .addAccidental(acc[3].voiceNum, new VF.Accidental(acc[3].shpFlt));
        }
        return voice;
    
    }
}

    

// -------------Main Code---------------------------------------------------------------------

function openClose() {
    const note1 = document.getElementById('note1').value;
    const note2 = document.getElementById('note2').value;
    const note3 = document.getElementById('note3').value;
    const note4 = document.getElementById('note4').value;

    let chord = [{nm:note1.trim()}, {nm:note2.trim()}, {nm:note3.trim()}, {nm:note4.trim()}];
    

    let errFlag = { flag: true, msg: 'ok' }

    // let chord2 = theInput.value.split(",");
    // let chord = [];
    // if (!chord2.length == 4) {
    //     errFlag = {flag:false, msg: 'Enter notes like this Ab, B#, Eb, G with commas'}
    // } else {
    //     chord2.forEach((e, i) => {
    //         chord.push({nm: e})
    //     })
    // }
    

    const notes = new VibraphoneNotes('sharps')
    const measureNotes = [];

    //here's the chord
    //let chord = [{ nm: 'gb' }, { nm: 'Bb' }, { nm: 'Db' }, { nm: 'e' }]

    chord = notes.upCase(chord);

    if (errFlag.flag) {
        if (Array.isArray(chord)) {
            chord.forEach((e, i) => {
                if (errFlag.flag) {
                    errFlag = notes.isMusicalNote(e.nm);
                }
            })
        }
    }

    // start making the notes
    if (errFlag.flag) {
        chord.forEach((e, i) => chord[i].midi = notes.lowestMIDINote(e.nm));

        chord.forEach((e, i) => chord[i].oct = notes.getOctave(e.midi));
        chord = notes.sortChord(chord);

        let meas = [];
        //----------
        for (x = 0; x < 4; x++) {
            // make the notes for each beat
            let theNotes = notes.makeBeatNotes(chord);

            //go through theNotes 
            let accidentals = notes.findFlatsAndSharps(theNotes);
            
            //make the StaveNote for VF
            meas.push(notes.makeVFVoice(accidentals, theNotes));

            // pass in accidentals and meas. then meas = function
                
            
            // ----------------------------------------------------------------------------------

            //make a copy of the chord for open voicing
            let chordCopy = JSON.parse(JSON.stringify(chord));

            //shift the second note up 1 oct
            chordCopy = notes.shiftVoice(chordCopy, 1);
            chordCopy = notes.sortChord(chordCopy);

            theNotes = notes.makeBeatNotes(chordCopy);
                
            //go through theNotes 
            accidentals = notes.findFlatsAndSharps(theNotes)

            //make the StaveNote for VF
            meas.push(notes.makeVFVoice(accidentals, theNotes));

            chord = notes.shiftVoice(chord, 0);
            chord = notes.sortChord(chord);

        }
// Create an SVG renderer and attach it to the DIV element named "boo".

 renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

// Size our SVG:
renderer.resize(775, 250);

// And get a drawing context:
var context = renderer.getContext();

// -------------
        // ---------------NOW MAKE THE NOTES-------------------------------------------------------------------

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
        var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 325);

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
        var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 350);

        // Render voice

        voice.draw(context, stave);

        // ------------------NOW REVERSE THE ORDER-------------------------------------------------
        meas.reverse();
        const meas3 = meas.slice(0, 4);
        const meas4 = meas.slice(4, 8);

        // meas 3
        var stave = new VF.Stave(50, 125, 350);
            
        // Connect it to the rendering context and draw!
        stave.setContext(context).draw();
        //----

        var voice = new VF.Voice({ num_beats: 4, beat_value: 4 });

        voice.addTickables(meas3);

        // Format and justify the notes 
        var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 350);

        // Render voice

        voice.draw(context, stave);

        // ---------------------------------------------------------------------------------
        // meas 4
        var stave = new VF.Stave(400, 125, 315);
            
        // Connect it to the rendering context and draw!
        stave.setContext(context).draw();
        //----

        var voice = new VF.Voice({ num_beats: 4, beat_value: 4 });

        voice.addTickables(meas4);

        // Format and justify the notes to 400 pixels.
        var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 350);

        // Render voice

        voice.draw(context, stave);
        // delete the old svg and keep the newest
        let svgs = document.getElementsByTagName('svg');

        while (svgs.length > 1) {
            svgs[0].remove();
        }
        errorMessage.innerHTML = "";
        svg = document.getElementsByTagName('svg')
        svg.setAttribute.baseVal = ("class","center") ;

 
     
    } else {
        // errorMessage
        errorMessage.textContent = 'Error: ' + errFlag.msg
    }
    //end making the notes
}



        

















