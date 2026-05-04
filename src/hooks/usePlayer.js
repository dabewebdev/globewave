import { useEffect, useRef, useState } from "react";

export default function usePlayer(initialStation) {
  const audioRef = useRef(null);

  const [currentStation, setCurrentStation] = useState(initialStation);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [muted, setMuted] = useState(false);
  const [status, setStatus] = useState("idle"); 
  // idle | loading | playing | paused | error

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume / 100;
    audioRef.current.muted = muted;

    return () => {
      audioRef.current.pause();
      audioRef.current.src = "";
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = muted;
  }, [muted]);

  const startStream = async (station) => {
    if (!audioRef.current || !station?.streamUrl) return;

    try {
      setStatus("loading");

      audioRef.current.pause();
      audioRef.current.src = station.streamUrl;
      audioRef.current.load();

      await audioRef.current.play();

      setPlaying(true);
      setStatus("playing");
    } catch {
      setPlaying(false);
      setStatus("error");
    }
  };

  const selectStation = (station) => {
    setCurrentStation(station);
    startStream(station);
  };

  const togglePlay = async () => {
    if (!audioRef.current || !currentStation?.streamUrl) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      setStatus("paused");
      return;
    }

    await startStream(currentStation);
  };

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  return {
    currentStation,
    selectStation,
    playing,
    togglePlay,
    volume,
    setVolume,
    muted,
    toggleMute,
    status
  };
}