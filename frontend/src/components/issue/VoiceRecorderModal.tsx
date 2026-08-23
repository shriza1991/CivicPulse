import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Play, Pause, RotateCcw, Check, AlertCircle, Sparkles, Globe, Edit2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/design-system/primitives/buttons/Button';
import { apiClient } from '@/api/client';

export interface VoiceAnalysisResult {
  transcript: string;
  detected_language: string;
  english_translation?: string;
  issue_category?: string;
  issue_subcategory?: string;
  severity?: string;
  department?: string;
  summary?: string;
}

export interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (audioFile: File, analysis: VoiceAnalysisResult) => void;
}

type RecordingPhase =
  | 'idle'
  | 'recording'
  | 'recorded'
  | 'uploading'
  | 'transcribing'
  | 'understanding'
  | 'ready'
  | 'error';

export const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [recordingState, setRecordingState] = useState<RecordingPhase>('idle');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('auto');
  const [recordDuration, setRecordDuration] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<VoiceAnalysisResult | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTranscript, setEditedTranscript] = useState<string>('');
  const [editedCategory, setEditedCategory] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Clean up timer and audio url on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  if (!isOpen) return null;

  const startRecording = async () => {
    setErrorMessage(null);
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());

        // Automatically transcribe and analyze voice demand immediately after finishing recording
        if (blob.size > 0) {
          processAudioAnalysis(blob);
        } else {
          setErrorMessage('No audio was captured. Please try speaking again.');
          setRecordingState('idle');
        }
      };

      recorder.start(250);
      setRecordingState('recording');
      setRecordDuration(0);
      timerRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied:', err);
      setErrorMessage('Microphone access denied. Please check your browser permissions.');
      setRecordingState('idle');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const resetRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordDuration(0);
    setIsPlaying(false);
    setAnalysisResult(null);
    setIsEditing(false);
    setErrorMessage(null);
    setRecordingState('idle');
  };

  const togglePlayback = () => {
    if (!audioElementRef.current && audioUrl) {
      audioElementRef.current = new Audio(audioUrl);
      audioElementRef.current.onended = () => setIsPlaying(false);
    }
    if (audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      } else {
        audioElementRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const processAudioAnalysis = async (inputBlob?: Blob) => {
    const targetBlob = inputBlob || audioBlob;
    if (!targetBlob) return;
    setRecordingState('uploading');
    setErrorMessage(null);

    const ext = targetBlob.type.includes('mp4') ? 'mp4' : 'webm';
    const audioFile = new File([targetBlob], `demand_voice_${Date.now()}.${ext}`, { type: targetBlob.type });

    const formData = new FormData();
    formData.append('audio', audioFile);
    if (selectedLanguage !== 'auto') {
      formData.append('language_code', selectedLanguage);
    }

    try {
      setRecordingState('transcribing');
      const response = await apiClient.post<{
        success: boolean;
        transcript: string;
        analysis: any;
      }>('/voice/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });

      if (response.data.success) {
        setRecordingState('understanding');
        const resAnalysis = response.data.analysis || {};
        const parsed: VoiceAnalysisResult = {
          transcript: response.data.transcript,
          detected_language: resAnalysis.detected_language || (selectedLanguage === 'mr' ? 'Marathi' : selectedLanguage === 'hi' ? 'Hindi' : 'English'),
          english_translation: resAnalysis.english_translation,
          issue_category: resAnalysis.issue_category || 'Infrastructure Need',
          issue_subcategory: resAnalysis.issue_subcategory || 'Community Improvement',
          severity: resAnalysis.severity || 'Medium',
          department: resAnalysis.department || 'Public Works / Urban Local Body',
          summary: resAnalysis.summary || response.data.transcript,
        };
        setAnalysisResult(parsed);
        setEditedTranscript(parsed.transcript);
        setEditedCategory(parsed.issue_category || 'Infrastructure Need');
        setRecordingState('ready');
      } else {
        throw new Error('Voice analysis returned unsuccessful result.');
      }
    } catch (err: any) {
      console.error('Voice processing error:', err);
      const detail = err.response?.data?.message || err.message || 'Failed to process voice request. You can re-record or retry transcription.';
      setErrorMessage(detail);
      setRecordingState('recorded');
    }
  };

  const handleConfirmSubmission = () => {
    if (!audioBlob || !analysisResult) return;
    const ext = audioBlob.type.includes('mp4') ? 'mp4' : 'webm';
    const audioFile = new File([audioBlob], `demand_voice_${Date.now()}.${ext}`, { type: audioBlob.type });

    const finalAnalysis: VoiceAnalysisResult = {
      ...analysisResult,
      transcript: editedTranscript || analysisResult.transcript,
      issue_category: editedCategory || analysisResult.issue_category,
    };

    onConfirm(audioFile, finalAnalysis);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
              <Mic className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Speak Your Community Demand</h3>
              <p className="text-xs text-slate-500">Sarvam Speech-to-Text & Gemini Demand Extraction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Language Selector */}
          {recordingState === 'idle' && (
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Globe className="w-4 h-4 text-teal-600" />
                <span>Audio Language:</span>
              </div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 cursor-pointer"
              >
                <option value="auto">Auto-Detect Indian Language</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="en">English</option>
              </select>
            </div>
          )}

          {recordingState === 'idle' && (
            <div className="text-center py-6 space-y-4">
              <button
                type="button"
                onClick={startRecording}
                className="w-20 h-20 mx-auto rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer group hover:scale-105 active:scale-95"
              >
                <Mic className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </button>
              <div>
                <span className="text-sm font-bold text-slate-800 block">Tap to Start Speaking</span>
                <span className="text-xs text-slate-500">Explain the infrastructure or municipal need in your area</span>
              </div>
            </div>
          )}

          {recordingState === 'recording' && (
            <div className="text-center py-6 space-y-4">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-rose-400/30 animate-ping" />
                <button
                  type="button"
                  onClick={stopRecording}
                  className="relative w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition-all cursor-pointer"
                >
                  <Square className="w-6 h-6 fill-current" />
                </button>
              </div>
              <div>
                <span className="text-sm font-mono font-bold text-rose-600 block">
                  Recording Voice Demand... {recordDuration}s
                </span>
                <span className="text-xs text-slate-500">Tap red square when finished speaking</span>
              </div>
            </div>
          )}

          {recordingState === 'recorded' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlayback}
                    className="p-2.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Voice Note Recorded ({recordDuration}s)</span>
                    <span className="text-[11px] text-slate-500">Ready for Sarvam STT & Gemini analysis</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetRecording}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-record</span>
                </button>
              </div>

              <Button
                variant="primary"
                onClick={() => processAudioAnalysis()}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5"
                leadingIcon={<Sparkles className="w-4 h-4" />}
              >
                Retry Transcription & Demand Analysis
              </Button>
            </div>
          )}

          {(recordingState === 'uploading' || recordingState === 'transcribing' || recordingState === 'understanding') && (
            <div className="py-6 space-y-4">
              <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-teal-900 border-b border-teal-200/60 pb-2">
                  <span>AI Demand Processing Pipeline</span>
                  <span className="inline-block w-4 h-4 rounded-full border-2 border-teal-300 border-t-teal-700 animate-spin" />
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-800 font-medium">Voice audio received ({recordDuration}s)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {recordingState === 'transcribing' || recordingState === 'understanding' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-teal-400 animate-pulse" />
                    )}
                    <span className="text-slate-800 font-medium">Sarvam AI Speech-to-Text Transcription</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {recordingState === 'understanding' ? (
                      <span className="w-4 h-4 rounded-full border border-teal-400 animate-pulse" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300" />
                    )}
                    <span className="text-slate-800 font-medium">Google Gemini 3.6 Structured Demand Extraction</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {recordingState === 'ready' && analysisResult && (
            <div className="space-y-4 animate-fade">
              {/* Language & What you said */}
              <div className="p-4 bg-teal-50/60 border border-teal-200/80 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-teal-900 border-b border-teal-200/60 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-teal-700" />
                    Language: {analysisResult.detected_language}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>{isEditing ? 'Done Editing' : 'Edit Text'}</span>
                  </button>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                    What We Heard:
                  </span>
                  {isEditing ? (
                    <textarea
                      value={editedTranscript}
                      onChange={(e) => setEditedTranscript(e.target.value)}
                      rows={2}
                      className="w-full text-xs font-medium text-slate-900 bg-white p-2 rounded-lg border border-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  ) : (
                    <p className="text-xs font-medium text-slate-800 italic bg-white/80 p-2.5 rounded-lg border border-teal-100">
                      "{editedTranscript || analysisResult.transcript}"
                    </p>
                  )}
                </div>
              </div>

              {/* What Nivaran Understood */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs">
                <span className="font-bold text-[10px] text-slate-500 uppercase tracking-wider block">
                  What Nivaran Understood (Demand Intelligence)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-450 block text-[10px]">Infrastructure Need:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedCategory}
                        onChange={(e) => setEditedCategory(e.target.value)}
                        className="w-full text-xs font-bold text-slate-800 bg-white p-1 border rounded"
                      />
                    ) : (
                      <span className="font-bold text-slate-800">{editedCategory || analysisResult.issue_category}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-450 block text-[10px]">Urgency / Severity:</span>
                    <span className="font-bold text-slate-800">{analysisResult.severity || 'Medium'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-450 block text-[10px]">Responsible Department / Scheme:</span>
                    <span className="font-bold text-slate-800">{analysisResult.department || 'Public Works Directorate'}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetRecording}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 border border-slate-250 rounded-xl transition cursor-pointer"
                >
                  Record Again
                </button>
                <Button
                  variant="primary"
                  onClick={handleConfirmSubmission}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl"
                  leadingIcon={<Check className="w-4 h-4" />}
                >
                  Confirm & Apply Need
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VoiceRecorderModal;
