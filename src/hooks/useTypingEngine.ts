'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const PARAGRAPHS = [
    "The old oak tree had stood at the edge of the meadow for longer than anyone could remember. Its massive branches stretched skyward, a shelter for birds and squirrels, a gathering place for those seeking shade. Generations had passed beneath its canopy, children climbing its sturdy limbs, lovers carving initials into its rough bark. The tree had witnessed the changing of seasons countless times, each cycle deepening the rings hidden within its ancient trunk.",
    "In the quiet hours before dawn, the city transforms into something almost magical. Street lights cast amber pools on empty sidewalks while the occasional taxi whispers past. The first hints of sunrise paint the eastern sky in shades of lavender and gold. Shop owners begin their daily rituals, raising metal shutters and arranging displays with practiced hands. The aroma of fresh coffee drifts from corner cafes, a silent invitation to the early risers who navigate the waking streets.",
    "The art of writing code is not unlike composing music. Each function plays its part, each variable holds a note. When everything comes together in harmony, the result is something greater than the sum of its parts. Debugging is the process of listening carefully, finding the dissonant chord, and bringing it back into tune. The best programmers are those who understand that elegance matters as much as functionality.",
    "Mountains have always drawn people to them. Perhaps it is the challenge of the ascent, the promise of a view that few others have seen. Or maybe it is something deeper, a desire to stand above the world and gain perspective on the life below. The climb itself becomes a metaphor for perseverance, each step forward a small victory against gravity and doubt. At the summit, there is only the wind and the vast, unending sky.",
    "Rain fell softly on the tin roof, creating a rhythm that was both soothing and melancholic. Inside, the warmth of the fireplace pushed back against the chill that crept through the old windows. A stack of books sat on the table, their pages yellowed with age, each one a doorway to another world. The evening stretched ahead, unhurried and full of possibility, asking nothing more than to be savored one moment at a time.",
    "The ocean has a way of putting things into perspective. Standing at the edge of the shore, watching waves roll in with tireless patience, you begin to understand the meaning of persistence. Each wave is different, yet the motion is eternal. The salt air fills your lungs with something ancient and wild. For a moment, the worries of daily life dissolve like foam on the sand, replaced by a profound sense of connection to something much larger than yourself.",
    "The silent dance of fireflies on a warm midsummer night is a spectacle of nature's own making. Each tiny flicker of light is a signal, a brief moment of connection in the vast darkness of the woods. Beneath the velvet sky, the air is thick with the scent of jasmine and the distant hum of night-blooming cicadas. It's a time when the boundaries between the real and the ethereal seem to blur, leaving only the magic of the moment.",
    "Artificial intelligence is no longer a distant dream of science fiction; it has become an integral part of our daily lives. From the algorithms that recommend our next favorite song to the systems that navigate our cars through complex traffic, machine learning is reshaping the world around us. Yet, as we embrace these technological leaps, we must also consider the ethical implications of creating minds that can think and learn on their own.",
    "The library was a sanctuary of hushed whispers and the comforting scent of old paper and leather bindings. Row upon row of books stretched toward the high ceiling, each spine a doorway to a different century or a distant land. In the corner by the stained-glass window, a single armchair invited the weary traveler to sit and lose themselves in the pages of a forgotten classic. Here, time seemed to stand still, held captive by the shared stories of humanity.",
    "Photography is the art of capturing a single moment in time and holding it still forever. It is a way of seeing the world through a different lens, finding beauty in the mundane and significance in the fleeting. A well-composed photograph can tell a story more powerful than a thousand words, evoking emotions that transcend language and culture. Whether it is a grand landscape or a simple portrait, each image is a testament to the photographer's vision.",
    "The desert at high noon is a place of harsh beauty and unrelenting heat. Shimmering waves of light dance across the sand dunes, creating mirages that trick the eye. Yet, even in this extreme environment, life finds a way to persist. Hardy plants with deep roots and specialized animals that thrive in the shadows of the rocks demonstrate the incredible resilience of nature. It is a landscape that demands respect and offers a unique perspective on the power of endurance.",
    "Space exploration has always pushed the limits of human ingenuity and curiosity. From the first steps on the moon to the latest rovers exploring the dusty plains of Mars, our journey into the cosmos is a testament to our desire to understand the unknown. Each mission brings us closer to answering the fundamental questions of our existence: Where did we come from, and are we alone in the universe? The stars are no longer just points of light; they are destinations.",
    "Cooking is a form of alchemy, a transformation of simple ingredients into a symphony of flavors and textures. It is an act of creativity and love, shared across a table with friends and family. The sizzle of a pan, the aroma of fresh herbs, and the vibrant colors of seasonal produce all contribute to the sensory experience of a well-prepared meal. Beyond nourishment, food is a universal language that brings people together, bridging cultures and creating lasting memories.",
    "The internet has revolutionized the way we communicate, work, and learn, creating a global network that connects billions of people. Information that once took weeks to find is now available at our fingertips in a matter of seconds. Yet, this digital age also brings new challenges, from the rapid spread of misinformation to the complexities of maintaining privacy in a hyper-connected world. Navigating this landscape requires both technical skill and critical thinking.",
    "Architecture is the silent witness to the history of civilization, reflecting the values and aspirations of the people who built it. From the ancient pyramids of Egypt to the soaring skyscrapers of modern cities, buildings are more than just functional structures; they are works of art. The play of light and shadow on a facade, the flow of space within a room, and the choice of materials all combine to create an environment that shapes our experiences and our memories.",
    "Gardening is a slow and rewarding process, a partnership between human effort and the natural world. It requires patience, observation, and a willingness to work with the seasons rather than against them. Planting a seed, nurturing its growth, and finally witnessing the first bloom or harvest is a powerful reminder of the cycles of life. A garden is not just a collection of plants; it is a living ecosystem that provides beauty, food, and a sense of peace.",
    "Mathematics is the universal language of the universe, a system of logic and patterns that underlies everything from the orbits of planets to the structure of a snowflake. It is a discipline of absolute truths and elegant proofs, where each discovery builds upon the work of those who came before. While many see it as a collection of dry numbers and formulas, mathematicians see a world of profound beauty and infinite complexity, waiting to be explored.",
    "The sound of waves crashing against a rugged coastline is one of nature's most powerful and primal rhythms. For centuries, the sea has inspired poets, explorers, and artists, its vastness and unpredictability a source of both wonder and fear. Standing on a cliff's edge, feeling the spray of salt water on your face, you sense the immense scale of the ocean and the tireless energy of the tides. It is a place where land and water meet in a constant, dynamic struggle.",
    "Jazz is a genre of music defined by its spirit of improvisation and its rich, complex harmonies. Born in the vibrant streets of New Orleans, it evolved through a fusion of African and European musical traditions. In a jazz ensemble, each player has the freedom to express their own voice while contributing to a collective sound. It is a music that values individual creativity, spontaneous interaction, and the deep emotional resonance of the blues.",
    "The transition from autumn to winter is a time of quiet reflection and visible change. As the last golden leaves fall from the trees, the landscape takes on a stark, skeletal beauty. The air grows crisp and cold, and the days shorten, inviting us to seek the warmth of the hearth. It is a season for introspection, for gathering with loved ones, and for finding appreciation in the simpler things in life as nature prepares for its long, necessary sleep.",
    "Cybersecurity is the frontline of defense in our increasingly digital world, protecting critical infrastructure, personal data, and national security from constant threats. It is a never-ending game of cat and mouse between those who build systems and those who seek to exploit them. As technology evolves, so too do the methods of attack, requiring constant vigilance and innovation from the professionals who safeguard our online lives.",
    "The art of storytelling is one of the oldest and most fundamental human traditions. Whether through spoken word, written text, or cinematic images, stories allow us to share experiences, convey values, and explore the complexities of the human condition. A great story can transport us to another world, challenge our perspectives, and foster empathy for people whose lives are different from our own. It is the bridge that connects our past, our present, and our future.",
    "The Northern Lights, or Aurora Borealis, are one of the most breathtaking natural phenomena on Earth. These curtains of shimmering green, violet, and red light are caused by the interaction of solar wind with the Earth's magnetic field in the upper atmosphere. Seen from the frozen landscapes of the Arctic, the lights dance across the night sky in a display that seems almost supernatural. It is a reminder of the magnificent and often invisible forces that shape our planet.",
    "Philosophy is the pursuit of wisdom and the exploration of the most fundamental questions about existence, knowledge, ethics, and the nature of reality. It encourages us to think critically about our assumptions, to examine our values, and to seek a deeper understanding of the world and our place within it. From the ancient Greeks to modern thinkers, philosophy has provided the framework for our intellectual and moral development, challenging us to live examined lives.",
    "Vocal music has a unique power to convey emotion and connect with an audience on a deeply personal level. The human voice is perhaps the most versatile instrument, capable of expressing a vast range of feelings from profound sorrow to exuberant joy. Whether in a grand operatic performance or a simple, unaccompanied folk song, the combination of melody and lyrics has a way of transcending the ordinary and touching the soul in ways that words alone cannot.",
    "The craft of woodworking is a testament to the beauty of natural materials and the skill of the artist's hands. Transforming a rough piece of timber into a finely finished piece of furniture requires precision, patience, and a deep understanding of the wood's grain and character. Each join, each curve, and each layer of finish contributes to the final result, creating an object that is both functional and a work of art, designed to be passed down through generations.",
];

export type CharStatus = 'untyped' | 'correct' | 'incorrect';
export type TestMode = 'idle' | 'typing' | 'finished';

export interface CharObj {
  char: string;
  status: CharStatus;
}

export interface WpmDataPoint {
  time: number;
  wpm: number;
}

export function useTypingEngine(
  playKeySound: (k: string) => void,
  playErrorSound: (k: string) => void,
  playCompleteSound: () => void
) {
  const [mode, setMode] = useState<TestMode>('idle');
  const [selectedTime, setSelectedTime] = useState(30);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [text, setText] = useState('');
  const [chars, setChars] = useState<CharObj[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  
  const [wpmHistory, setWpmHistory] = useState<WpmDataPoint[]>([]);
  
  const [isCustom, setIsCustom] = useState(false);

  // Refs for tracking timer without closures getting stale
  const startTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastWpmTimeRef = useRef(0);
  const statsRef = useRef({ correctCount: 0, totalKeystrokes: 0 });

  useEffect(() => {
    statsRef.current = { correctCount, totalKeystrokes };
  }, [correctCount, totalKeystrokes]);

  const initTest = useCallback((newText: string, time: number, custom = false) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    
    setMode('idle');
    setText(newText);
    setSelectedTime(time);
    setTimeRemaining(time);
    setChars(newText.split('').map(char => ({ char, status: 'untyped' })));
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setTotalKeystrokes(0);
    setWpmHistory([]);
    setIsCustom(custom);
    
    startTimeRef.current = null;
    timerIntervalRef.current = null;
    lastWpmTimeRef.current = 0;
  }, []);

  const loadRandomTest = useCallback((time?: number) => {
    const para = PARAGRAPHS[Math.floor(Math.random() * PARAGRAPHS.length)];
    initTest(para, time || selectedTime, false);
  }, [selectedTime, initTest]);

  // Initial load
  useEffect(() => {
    loadRandomTest(30);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const endTest = useCallback(() => {
    setMode('finished');
    if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
    }
    playCompleteSound();
  }, [playCompleteSound]);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    setMode('typing');

    timerIntervalRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, Math.ceil(selectedTime - elapsed));
      setTimeRemaining(remaining);

      const sec = Math.floor(elapsed);
      if (sec > lastWpmTimeRef.current && statsRef.current.correctCount > 0) {
        lastWpmTimeRef.current = sec;
        const wpm = Math.round((statsRef.current.correctCount / 5) / (elapsed / 60));
        setWpmHistory(prev => [...prev, { time: sec, wpm }]);
      }

      if (remaining <= 0) {
        endTest();
      }
    }, 100);
  }, [selectedTime, endTest]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (mode === 'finished') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const ignoredKeys = [
      'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab',
      'Escape', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'Home', 'End', 'PageUp', 'PageDown', 'Insert', 'Delete',
      'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
    ];
    if (ignoredKeys.includes(e.key)) return;

    // Prevent default scrolling for Space
    if (e.key === ' ' || e.key === 'Backspace') {
      e.preventDefault();
    }

    if (mode === 'idle') {
      startTimer();
    }

    if (e.key === 'Backspace') {
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        setChars(prev => {
          const newChars = [...prev];
          const charObj = newChars[currentIndex - 1];
          if (charObj.status === 'correct') setCorrectCount(c => c - 1);
          else if (charObj.status === 'incorrect') setIncorrectCount(c => c - 1);
          
          charObj.status = 'untyped';
          return newChars;
        });
        playKeySound('Backspace');
      }
      return;
    }

    if (e.key.length === 1) {
      if (currentIndex >= chars.length) return;
      
      setTotalKeystrokes(prev => prev + 1);
      const expected = chars[currentIndex].char;

      if (e.key === expected) {
        setChars(prev => {
          const newChars = [...prev];
          newChars[currentIndex].status = 'correct';
          return newChars;
        });
        setCorrectCount(prev => prev + 1);
        playKeySound(e.key);
      } else {
        setChars(prev => {
          const newChars = [...prev];
          newChars[currentIndex].status = 'incorrect';
          return newChars;
        });
        setIncorrectCount(prev => prev + 1);
        playErrorSound(e.key);
      }

      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      if (nextIndex >= chars.length) {
        endTest();
      }
    }
  }, [mode, currentIndex, chars, startTimer, endTest, playKeySound, playErrorSound]);

  return {
    mode,
    chars,
    currentIndex,
    timeRemaining,
    selectedTime,
    correctCount,
    incorrectCount,
    totalKeystrokes,
    wpmHistory,
    text,
    isCustom,
    handleKeyDown,
    initTest,
    loadRandomTest,
    setSelectedTime: (t: number) => {
      setSelectedTime(t);
      loadRandomTest(t);
    }
  };
}
