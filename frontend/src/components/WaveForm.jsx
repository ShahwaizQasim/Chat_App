import { useWaveform } from "../hooks/useWaveFrom.jsx";

export function Waveform({ mediaBlobUrl }) {
  const peaks = useWaveform(mediaBlobUrl);

  return (
    <div className="flex items-center gap-[3px] h-8 flex-1 px-1 overflow-hidden">
      {peaks.map((p, i) => (
        <span
          key={i}
          className="w-[2px] rounded-full bg-gray-400 shrink-0"
          style={{ height: `${Math.max(p * 100, 10)}%` }}
        />
      ))}
    </div>
  );
}
