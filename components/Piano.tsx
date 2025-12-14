import React from 'react';

interface PianoProps {
  highlightedNotes: string[];
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const Piano: React.FC<PianoProps> = ({ highlightedNotes }) => {
  // Normalize notes for comparison (ignore octaves for simple viz, handle flats/sharps)
  const isHighlighted = (noteName: string) => {
    return highlightedNotes.some(n => {
      // Very basic normalization, assuming API returns # mostly as requested
      // Handle simple enharmonics if needed or rely on prompt engineering
      return n.replace(/[0-9]/g, '') === noteName; 
    });
  };

  const renderOctave = (octaveIndex: number) => {
    return NOTES.map((note, index) => {
      const isSharp = note.includes('#');
      const isActive = isHighlighted(note);
      
      // Basic styling for white vs black keys
      if (isSharp) {
        return (
          <div
            key={`${note}-${octaveIndex}`}
            className={`
              absolute w-8 h-24 -ml-4 z-10 border border-slate-900 rounded-b-md
              ${isActive ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]' : 'bg-slate-800'}
            `}
            style={{ left: `${(index - (index > 4 ? 2 : 1)) * 3}rem` }} // Approximate positioning logic
          ></div>
        );
      }
      return null; // Render black keys separately if using absolute, or interleaved.
                   // To keep it simple, let's use a flex structure for white keys and absolute for black.
    });
  };

  // Simplified layout: Flex container for white keys, absolute mostly for black keys relative to container.
  // Actually, let's map keys strictly by position.
  
  const keys = [];
  const whiteKeyWidth = 3.5; // rem
  const blackKeyWidth = 2;   // rem
  
  let whiteKeyCount = 0;

  for (let i = 0; i < 24; i++) { // 2 Octaves
    const noteIndex = i % 12;
    const noteName = NOTES[noteIndex];
    const isSharp = noteName.includes('#');
    const isActive = isHighlighted(noteName);

    if (!isSharp) {
      // White Key
      keys.push(
        <div
          key={`white-${i}`}
          className={`
            relative flex-shrink-0 h-48 border-r border-slate-300 rounded-b-md transition-all duration-300
            ${isActive ? 'bg-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.5)] z-0' : 'bg-white hover:bg-slate-100'}
          `}
          style={{ width: `${whiteKeyWidth}rem` }}
        >
          <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>
            {noteName}
          </span>
        </div>
      );
      whiteKeyCount++;
    } else {
      // Black Key (Absolute positioned relative to the previous white key's right edge essentially)
      // We push it to a separate layer or handle it via negative margin.
      // Easiest is to insert it after the previous white key but position it absolute.
      
      // Calculate position based on current whiteKeyCount
      const leftPos = (whiteKeyCount * whiteKeyWidth) - (blackKeyWidth / 2);
      
      keys.push(
        <div
          key={`black-${i}`}
          className={`
            absolute top-0 h-28 border border-slate-900 rounded-b-md z-10 transition-all duration-300
            ${isActive ? 'bg-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.6)]' : 'bg-slate-900'}
          `}
          style={{ 
            left: `${leftPos}rem`, 
            width: `${blackKeyWidth}rem` 
          }}
        ></div>
      );
    }
  }

  return (
    <div className="relative flex overflow-x-auto p-4 bg-slate-950 rounded-xl shadow-2xl border border-slate-800 scrollbar-hide">
        <div className="relative flex">
            {keys}
        </div>
    </div>
  );
};
