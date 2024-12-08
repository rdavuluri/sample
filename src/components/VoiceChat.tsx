import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Square, Share2 } from 'lucide-react';
import { useTopicStore } from '../store/topicStore';
import { toast } from 'sonner';

export const VoiceChat: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const { selectedTopic } = useTopicStore();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript((prev) => prev + transcript + ' ');
          } else {
            interimTranscript += transcript;
          }
        }
      };
    }
  }, []);

  const startRecording = async () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsRecording(true);
        toast.success('Recording started');
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast.success('Recording stopped');
    }
  };

  const handleSend = async () => {
    if (!transcript.trim()) {
      toast.error('Please record some input first');
      return;
    }
    // Simulate API call to ChatGPT
    setResponse('This is a simulated response from ChatGPT using ' + selectedTopic?.model);
    toast.success('Response generated');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('URL copied to clipboard');
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] bg-gray-50 flex">
      {/* Left Panel - Voice Input */}
      <div className="w-1/2 p-6 border-r border-gray-200">
        <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Voice Input</h2>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <Share2 className="h-5 w-5" />
              Share
            </button>
          </div>

          <div className="flex-grow bg-gray-50 rounded-lg p-4 mb-6 overflow-auto">
            <p className="text-gray-700 whitespace-pre-wrap">{transcript}</p>
          </div>

          <div className="flex gap-4 justify-center">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Mic className="h-5 w-5" />
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Square className="h-5 w-5" />
                Stop Recording
              </button>
            )}

            <button
              onClick={handleSend}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Send className="h-5 w-5" />
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Response */}
      <div className="w-1/2 p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 h-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Response</h2>
          <div className="bg-gray-50 rounded-lg p-4 h-[calc(100%-4rem)] overflow-auto">
            <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
          </div>
        </div>
      </div>
    </div>
  );
};