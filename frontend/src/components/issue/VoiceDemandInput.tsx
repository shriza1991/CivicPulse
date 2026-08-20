import React, { useEffect, useRef, useState } from 'react';
import { Mic, Pause, Play, Square, Upload, Volume2 } from 'lucide-react';
import { useAnalyzeVoice } from '@/api/queries';
import type { VoiceAnalyzeResponse } from '@/api/types';

export interface VoiceDemandInputProps {
  onAnalysisComplete: (result: VoiceAnalyzeResponse) => void;
}

const supportedAudioTypes = 'audio/*,.mp3,.wav,.webm,.m4a,.aac,.ogg';

export const VoiceDemandInput: React.FC<VoiceDemandInputProps> = ({ onAnalysisComplete }) => {
  const analyzeVoiceMutation = useAnalyzeVoice();
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [result, setResult] = useState<VoiceAnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, [audioUrl]);

  const setSelectedAudio = (file: File) => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioFile(file);
    setAudioUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError('Audio recording is not supported by this browser. Select an audio file instead.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const type = recorder.mimeType || 'audio/webm';
        const recordingBlob = new Blob(chunksRef.current, { type });
        if (recordingBlob.size === 0) {
          setError('No audio was captured. Please try recording again.');
        } else {
          const extension = type.includes('ogg') ? 'ogg' : type.includes('mp4') ? 'm4a' : type.includes('wav') ? 'wav' : 'webm';
          setSelectedAudio(new File([recordingBlob], `voice-demand.${extension}`, { type }));
        }
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      recorder.start();
      setRecording(true);
      setError(null);
    } catch {
      setError('Microphone access was not granted. Allow microphone access or select an audio file.');
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  const analyzeAudio = async () => {
    if (!audioFile) return;
    setError(null);
    try {
      const analysis = await analyzeVoiceMutation.mutateAsync({ audio: audioFile });
      if (!analysis.success || !analysis.transcript.trim()) {
        setError('The speech service did not return a usable transcript. Please try again or type your observation.');
        return;
      }
      setResult(analysis);
      onAnalysisComplete(analysis);
    } catch (err: any) {
      setError(err?.message || 'Voice processing is unavailable. You can still type your observation manually.');
    }
  };

  const readAloud = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setError('Read-aloud is not supported by this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  return (
    <section className="border border-slate-200 bg-slate-50/60 rounded-small p-4 space-y-3" aria-labelledby="voice-demand-heading">
      <div className="flex items-start gap-2">
        <Mic size={17} className="text-primary mt-0.5 shrink-0" aria-hidden="true" />
        <div>
          <h3 id="voice-demand-heading" className="text-xs font-bold text-slate-800">Speak your demand</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Record or upload audio. Nivaran transcribes it with Sarvam, then Gemini identifies the language and prepares an English interpretation.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {recording ? (
          <button type="button" onClick={stopRecording} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-small bg-rose-600 text-white hover:bg-rose-700">
            <Square size={13} fill="currentColor" /> Stop recording
          </button>
        ) : (
          <button type="button" onClick={startRecording} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-small bg-primary text-white hover:bg-primary-hover">
            <Mic size={14} /> Record voice
          </button>
        )}
        <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-small border border-slate-250 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer">
          <Upload size={14} /> Choose audio
          <input className="sr-only" type="file" accept={supportedAudioTypes} onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) setSelectedAudio(file);
            event.currentTarget.value = '';
          }} />
        </label>
        {audioFile && (
          <button type="button" onClick={analyzeAudio} disabled={analyzeVoiceMutation.isPending} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-small border border-primary bg-white text-primary hover:bg-primary-50 disabled:opacity-50">
            {analyzeVoiceMutation.isPending ? <Pause size={14} className="animate-pulse" /> : <SparkleIcon />}
            {analyzeVoiceMutation.isPending ? 'Transcribing and interpreting…' : 'Use voice transcript'}
          </button>
        )}
      </div>

      {audioFile && <p className="text-[11px] text-slate-600">Selected audio: <span className="font-mono">{audioFile.name}</span></p>}
      {audioUrl && <audio controls src={audioUrl} className="w-full h-9" />}
      {error && <p role="alert" className="text-[11px] font-medium text-rose-700">{error}</p>}

      {result && (
        <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
          <div className="flex items-center justify-between gap-3">
            <span className="font-bold text-slate-700">Detected language: {result.analysis.detected_language}</span>
            <button type="button" onClick={() => readAloud(result.analysis.english_translation || result.transcript)} className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline">
              <Volume2 size={13} /> Read interpretation aloud
            </button>
          </div>
          <p><span className="font-semibold text-slate-700">Transcript:</span> {result.transcript}</p>
          <p><span className="font-semibold text-slate-700">English interpretation:</span> {result.analysis.english_translation}</p>
          <p className="text-[11px] text-slate-500">This interpretation has been added to your report notes for review. You can edit it before submitting.</p>
        </div>
      )}
    </section>
  );
};

const SparkleIcon: React.FC = () => <Play size={14} aria-hidden="true" />;
