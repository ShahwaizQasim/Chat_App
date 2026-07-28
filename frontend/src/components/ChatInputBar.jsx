import { ReactMediaRecorder } from "react-media-recorder";
import { Mic, Square, Trash2, Send, X, Play, Pause, Smile, Plus, FileText } from "lucide-react";
import { Waveform } from "./ui/WaveForm";
import { memo, useState, useRef, useEffect, useCallback } from "react";
import EmojiPicker from 'emoji-picker-react';

const ChatInputBar = memo(function ChatInputBar({
  message,
  setMessage,
  handleKeyPress,
  selectedUser,
  HandleSendPrivateMessage, // (userId) => void — used for text-only sends
  handleSendVoiceMessage, // (blobUrl) => void — wire this to your upload logic
  handleSendFileMessage, // (file, message, userId) => void — wire this to your upload logic
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const inputRef = useRef(null);
  const pickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const fileInputRef = useRef(null);
  // Tracks where the caret was last, so we still know where to insert
  // after the input has lost focus to the picker.
  const cursorPosRef = useRef(0);

  const updateCursorPos = useCallback(() => {
    if (inputRef.current) {
      cursorPosRef.current = inputRef.current.selectionStart ?? message.length;
    }
  }, [message.length]);

  // Close the picker on outside click
  useEffect(() => {
    if (!showEmojiPicker) return;

    function handleClickOutside(e) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const toggleEmojiPicker = () => {
    // Capture caret position before the input blurs
    if (inputRef.current) {
      cursorPosRef.current = inputRef.current.selectionStart ?? message.length;
    }
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    const pos = cursorPosRef.current ?? message.length;
    const before = message.slice(0, pos);
    const after = message.slice(pos);
    const next = before + emoji + after;

    setMessage(next);

    const newPos = pos + emoji.length;
    cursorPosRef.current = newPos;

    // Refocus the input and place the caret right after the inserted emoji,
    // once React has flushed the new value.
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(newPos, newPos);
      }
    });
  };

  const handlePlusClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
    // reset so selecting the same file again still fires onChange
    e.target.value = "";
  };

  const clearSelectedFile = () => setSelectedFile(null);

  const handleSend = () => {
    if (selectedFile) {
      handleSendFileMessage?.(selectedFile);
      setSelectedFile(null);
      setMessage("");
      return;
    }
    HandleSendPrivateMessage(selectedUser._id);
  };

  const isImageFile = selectedFile && selectedFile.type?.startsWith("image/");
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);

  useEffect(() => {
    if (isImageFile) {
      const url = URL.createObjectURL(selectedFile);
      setFilePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setFilePreviewUrl(null);
  }, [selectedFile, isImageFile]);

  return (
    <div className="bg-white p-4 border-t border-gray-200">
      {selectedFile && (
        <div className="flex items-center gap-3 mb-2 rounded-lg bg-gray-100 px-3 py-2">
          {isImageFile ? (
            <img
              src={filePreviewUrl}
              alt={selectedFile.name}
              className="h-10 w-10 rounded object-cover"
            />
          ) : (
            <FileText size={22} className="text-gray-500 shrink-0" />
          )}
          <span className="flex-1 truncate text-sm text-gray-700">
            {selectedFile.name}
          </span>
          <button
            onClick={clearSelectedFile}
            className="p-1 text-gray-500 hover:text-gray-700"
            aria-label="Remove attached file"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={handlePlusClick}
          className="p-2 text-gray-500 hover:text-gray-700"
          aria-label="Attach a file"
        >
          <Plus size={22} />
        </button>

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
              {/* Show emoji toggle + text input only when there's no recording in progress/preview */}
              {status !== "recording" && !mediaBlobUrl && (
                <>
                  <div className="relative">
                    <button
                      ref={emojiButtonRef}
                      type="button"
                      onClick={toggleEmojiPicker}
                      className="p-2 text-gray-500 hover:text-gray-700"
                      aria-label="Open emoji picker"
                    >
                      <Smile size={22} />
                    </button>

                    {showEmojiPicker && (
                      <div
                        ref={pickerRef}
                        className="absolute bottom-full left-0 mb-2 z-50"
                      >
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}
                  </div>

                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onClick={updateCursorPos}
                    onKeyUp={updateCursorPos}
                  />
                </>
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

        {/* Send button — hidden while a recording/preview is active. Sends text,
            or a file (with optional caption text), depending on what's attached. */}
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          disabled={!message.trim() && !selectedFile}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
})

export default ChatInputBar;