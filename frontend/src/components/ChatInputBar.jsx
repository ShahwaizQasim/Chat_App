import { ReactMediaRecorder } from "react-media-recorder";
import { Mic, Square, Trash2, Send, X, Play, Pause } from "lucide-react";
import { Waveform } from "./WaveForm";

export default function ChatInputBar({
  message,
  setMessage,
  handleKeyPress,
  selectedUser,
  HandleSendPrivateMessage,
  handleSendVoiceMessage, // (blobUrl) => void — wire this to your upload logic
}) {
  return (
    <div className="bg-white p-4 border-t border-gray-200">
      <div className="flex items-center space-x-2">
        <ReactMediaRecorder
          audio
          render={({
            status,
            startRecording,
            stopRecording,
            mediaBlobUrl,
            clearBlobUrl,
          }) => (
            <>
              {/* Show the text input only when there's no recording in progress/preview */}
              {status !== "recording" && !mediaBlobUrl && (
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              )}

              {/* Idle: mic button */}
              {status !== "recording" && !mediaBlobUrl && (
                <button
                  onClick={startRecording}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <Mic size={22} />
                </button>
              )}

              {/* Recording */}
              {status === "recording" && (
                <div className="flex items-center gap-2 flex-1 rounded-lg bg-gray-100 px-4 py-2">
                  <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-medium text-gray-700 flex-1">
                    Recording...
                  </span>
                  <button onClick={stopRecording}>
                    <Pause size={20} />
                  </button>
                </div>
              )}

              {/* Preview after stop — matches the screenshot */}
              {status !== "recording" && mediaBlobUrl && (
                <div className="flex items-center gap-2 flex-1 rounded-full bg-neutral-800 pl-4 pr-2 py-2">
                  <audio
                    src={mediaBlobUrl}
                    controls
                    className="flex-1 h-8"
                    style={{ filter: "invert(1)" }}
                  />

                  <button
                    onClick={clearBlobUrl}
                    className="h-8 w-8 flex items-center justify-center rounded-full text-white/70 hover:text-white"
                    aria-label="Discard recording"
                  >
                    <X size={18} />
                  </button>

                  <button
                    onClick={() => {
                      handleSendVoiceMessage?.(mediaBlobUrl);
                      clearBlobUrl();
                    }}
                    className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600"
                    aria-label="Send recording"
                  >
                    <Send size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        />

        {/* Text send button — hidden while a recording/preview is active */}
        <button
          onClick={() => HandleSendPrivateMessage(selectedUser._id)}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          disabled={!message.trim()}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
