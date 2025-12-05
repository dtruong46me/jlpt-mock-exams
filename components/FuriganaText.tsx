import React from 'react';

interface FuriganaTextProps {
    text: string;
    className?: string;
}

/**
 * FuriganaText component renders text with ruby annotations.
 * Format: {Kanji|Furigana} -> <ruby>Kanji<rt>Furigana</rt></ruby>
 */
const FuriganaText: React.FC<FuriganaTextProps> = ({ text, className = '' }) => {
    if (!text) return null;

    const parseToRuby = (inputText: string): React.ReactNode[] => {
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;

        // Regex to match {kanji|furigana} pattern
        const regex = /\{([^|]+)\|([^}]+)\}/g;
        let match;

        while ((match = regex.exec(inputText)) !== null) {
            // Add text before the match
            if (match.index > lastIndex) {
                const preText = inputText.substring(lastIndex, match.index);
                // Handle newlines if needed, but for now just text
                parts.push(
                    <span key={`text-${lastIndex}`}>
                        {preText}
                    </span>
                );
            }

            // Add ruby text
            parts.push(
                <ruby key={`ruby-${match.index}`} className="mx-0.5">
                    {match[1]}
                    <rt className="text-[0.6em] text-slate-500 select-none">{match[2]}</rt>
                </ruby>
            );

            lastIndex = match.index + match[0].length;
        }

        // Add remaining text
        if (lastIndex < inputText.length) {
            parts.push(
                <span key={`text-${lastIndex}`}>
                    {inputText.substring(lastIndex)}
                </span>
            );
        }

        return parts.length > 0 ? parts : [<span key="empty">{inputText}</span>];
    };

    return (
        <span className={`font-jp leading-loose ${className}`}>
            {parseToRuby(text)}
        </span>
    );
};

export default FuriganaText;
