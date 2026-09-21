import React from 'react';

interface MarqueeBandsProps {
  reverse?: boolean;
}

export const MarqueeBands: React.FC<MarqueeBandsProps> = ({ reverse = false }) => {
  const words = [
    'NEÏROUA',
    '✦',
    'OSE REDÉFINIR LES CODES',
    '//',
    'NEÏROUA',
    '•',
    'COLLECTION 01',
    '✦',
    'NEÏROUA',
    '//',
    'PATRIMOINE COLLECTIF',
    '•',
  ];

  return (
    <div className="overflow-hidden border-y border-[#FFFAFA]/15 bg-[#1F1F1C] py-3 text-[#FFFAFA] m-0 my-0 mt-0 mb-0">
      <div
        className={`marquee-track ${
          reverse ? 'marquee-track-reverse' : ''
        } font-ui text-[12px] uppercase tracking-[.34em] flex items-center`}
      >
        {Array.from({ length: 4 }).flatMap((_, setIdx) =>
          words.map((item, idx) => (
            <span
              key={`${setIdx}-${idx}`}
              className={`mx-5 select-none whitespace-nowrap ${
                item === 'NEÏROUA'
                  ? 'text-[#F6D110] font-bold text-[13px] tracking-[.36em]'
                  : item === '✦' || item === '•' || item === '//' || item === '—'
                  ? 'text-[#F6D110]/70'
                  : 'text-[#FFFAFA]/85'
              }`}
            >
              {item}
            </span>
          ))
        )}
      </div>
    </div>
  );
};
