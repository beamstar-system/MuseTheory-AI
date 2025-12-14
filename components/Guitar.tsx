import React from 'react';

interface GuitarProps {
  highlightedNotes: string[];
}

const STRINGS = ['E', 'B', 'G', 'D', 'A', 'E']; // High E at top (index 0) visually usually top string
const FRETS = 12;

// Standard tuning map
const getNoteAtFret = (stringOpenNote: string, fret: number) => {
  const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const startIndex = NOTES.indexOf(stringOpenNote);
  return NOTES[(startIndex + fret) % 12];
};

export const Guitar: React.FC<GuitarProps> = ({ highlightedNotes }) => {
  const isHighlighted = (note: string) => {
     return highlightedNotes.some(n => n.replace(/[0-9]/g, '') === note); 
  };

  return (
    <div className="w-full overflow-x-auto p-6 bg-slate-900 rounded-xl border border-slate-800 shadow-2xl">
      <div className="flex flex-col relative min-w-[800px]">
        {/* Fret Markers */}
        <div className="flex ml-12 mb-2 text-slate-500 text-xs font-mono">
           {Array.from({ length: FRETS + 1 }).map((_, i) => (
             <div key={i} className="flex-1 text-center">{i === 0 ? 'Open' : i}</div>
           ))}
        </div>

        {STRINGS.map((stringNote, stringIndex) => (
          <div key={stringIndex} className="flex items-center relative h-10">
             {/* String Line */}
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-600 z-0 shadow-sm"></div>
            
            {/* Open String Label */}
            <div className="w-12 flex-shrink-0 text-slate-400 font-bold text-sm z-10 bg-slate-900 pr-2">
                {stringNote}
            </div>

            {/* Frets */}
            <div className="flex-1 flex z-10">
                {Array.from({ length: FRETS + 1 }).map((_, fretIndex) => {
                    const note = getNoteAtFret(stringNote, fretIndex);
                    const active = isHighlighted(note);
                    
                    return (
                        <div key={fretIndex} className="flex-1 flex justify-center items-center border-r border-slate-700 last:border-r-0 relative">
                             {/* Nut (fret 0) is thicker border handled by container or distinct style. Here simpler is fine. */}
                            
                            {active && (
                                <div className={`
                                    w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-transform duration-300 transform scale-100
                                    ${fretIndex === 0 ? 'bg-indigo-600 text-white' : 'bg-teal-500 text-slate-900'}
                                `}>
                                    {note}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
