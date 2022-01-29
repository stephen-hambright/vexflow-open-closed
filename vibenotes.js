//--------------CLASS----------------------------------------------------------------------
export default class VibraphoneNotes {
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
        console.log(chd);
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