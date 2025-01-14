import { Card } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import Typewriter from 'typewriter-effect/dist/core';

const VoiceWaves = dynamic({
  loader: () => import('@/components/VoiceWaves').then((ctx) => ctx.VoiceWaves),
  ssr: false,
});

const HomePage = observer(() => {
  const typewriterRef = useRef(null);
  useEffect(() => {
    typewriterRef.current = new Typewriter('#typewriter', {
      delay: 30,
    });
    return () => {
      if (typewriterRef.current) {
        typewriterRef.current.deleteAll();
        typewriterRef.current = null;
      }
    };
  }, []);
  return (
    <main className="w-full min-h-[calc(100vh-70px)] p-2 flex flex-col justify-center items-center">
      <Card className="w-full lg:w-[800px] p-4 lg:p-[48px] bg-[#CFDCFF]" radius="sm" shadow="sm">
        <div className="rounded-md overflow-hidden">
          <VoiceWaves
            onText={(data, isTranscribing) => {
              const { transcription, temperature, language, no_speech_prob } = data;
              if (!transcription || !language || no_speech_prob === undefined) {
                return;
              }
              const no_speech_prob_text = no_speech_prob < 0.1 ? '' : `【no_speech_prob: ${no_speech_prob.toFixed(2)}】`;
              const text = `<p style=${getStyle(temperature)}>${transcription}【${language}】${no_speech_prob_text}</p>`;
              if (isTranscribing) {
                typewriterRef.current.typeString(text).start();
              } else {
                typewriterRef.current.deleteAll(0).typeString('').start();
              }
            }}
          />
          <div id="typewriter" className="py-8 px-4 bg-[#EAF1FF] text-[#55627C] text-base"></div>
        </div>
      </Card>
    </main>
  );
});

export default HomePage;

function getStyle(temperature: number) {
  if (temperature <= 0.3) {
    return 'margin-bottom:2px;padding-left:5px;width:fit-content;background:#00EF004D;';
  } else if (temperature <= 0.8) {
    return 'margin-bottom:2px;padding-left:5px;width:fit-content;background:#FFD0004B;';
  } else {
    return 'margin-bottom:2px;padding-left:5px;width:fit-content;background:#FF42004D;';
  }
}
