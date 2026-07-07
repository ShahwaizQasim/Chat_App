import { useEffect, useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import { Mic, Square, X, Send } from "lucide-react";
 
// Decodes the recorded audio and reduces it to a fixed number of
// peak values so we can draw a waveform like the screenshot.
export function useWaveform(mediaBlobUrl, bars = 40) {
  const [peaks, setPeaks] = useState([]);
 
  useEffect(() => {
    if (!mediaBlobUrl) {
      setPeaks([]);
      return;
    }
    let cancelled = false;
 
    (async () => {
      try {
        const res = await fetch(mediaBlobUrl);
        const arrayBuffer = await res.arrayBuffer();
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        const rawData = audioBuffer.getChannelData(0);
        const blockSize = Math.floor(rawData.length / bars);
        const values = [];
 
        for (let i = 0; i < bars; i++) {
          const start = i * blockSize;
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[start + j] || 0);
          }
          values.push(sum / blockSize);
        }
 
        const max = Math.max(...values, 0.0001);
        if (!cancelled) setPeaks(values.map((v) => v / max));
        audioCtx.close();
      } catch (e) {
        if (!cancelled) {
          setPeaks(Array.from({ length: bars }, () => 0.2 + Math.random() * 0.8));
        }
      }
    })();
 
    return () => {
      cancelled = true;
    };
  }, [mediaBlobUrl, bars]);
 
  return peaks;
}