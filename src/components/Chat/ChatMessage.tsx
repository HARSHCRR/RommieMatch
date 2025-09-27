'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MoreVertical, 
  Reply, 
  Edit3, 
  Trash2, 
  Copy, 
  Clock,
  Check,
  CheckCheck,
  Image as ImageIcon,
  FileText,
  Download
} from 'lucide-react';
import { Message } from '@/lib/chatService';

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  onReply?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onDelete?: (message: Message) => void;
  onCopy?: (message: Message) => void;
}

export default function ChatMessage({
  message,
  isOwn,
  showAvatar = true,
  onReply,
  onEdit,
  onDelete,
  onCopy
}: ChatMessageProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageTypeIcon = () => {
    switch (message.type) {
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'file':
        return <FileText className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getReadStatus = () => {
    if (message.read) {
      return <CheckCheck className="w-4 h-4 text-blue-400" />;
    }
    return <Check className="w-4 h-4 text-white/50" />;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    onCopy?.(message);
    setShowMenu(false);
  };

  const handleReply = () => {
    onReply?.(message);
    setShowMenu(false);
  };

  const handleEdit = () => {
    onEdit?.(message);
    setShowMenu(false);
  };

  const handleDelete = () => {
    onDelete?.(message);
    setShowMenu(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        {showAvatar && !isOwn && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
            {message.senderId.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Message Content */}
        <div className="relative group">
          {/* Message Bubble */}
          <div
            className={`relative px-4 py-2 rounded-2xl ${
              isOwn
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
            }`}
          >
            {/* Reply Indicator */}
            {message.replyTo && (
              <div className="mb-2 pb-2 border-l-2 border-white/30 pl-3 text-xs text-white/70">
                Replying to message...
              </div>
            )}

            {/* Message Type Icon */}
            {getMessageTypeIcon() && (
              <div className="absolute top-2 right-2 text-white/50">
                {getMessageTypeIcon()}
              </div>
            )}

            {/* Message Content */}
            <div className="pr-6">
              {message.type === 'image' && message.metadata?.imageUrl ? (
                <div className="mb-2">
                  <img
                    src={message.metadata.imageUrl}
                    alt="Shared image"
                    className="rounded-lg max-w-full h-auto"
                  />
                </div>
              ) : message.type === 'file' && message.metadata?.fileName ? (
                <div className="flex items-center space-x-2 p-2 bg-white/10 rounded-lg mb-2">
                  <FileText className="w-5 h-5 text-white/70" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{message.metadata.fileName}</p>
                    {message.metadata.fileSize && (
                      <p className="text-xs text-white/60">
                        {(message.metadata.fileSize / 1024).toFixed(1)} KB
                      </p>
                    )}
                  </div>
                  <button className="p-1 hover:bg-white/10 rounded">
                    <Download className="w-4 h-4 text-white/70" />
                  </button>
                </div>
              ) : null}

              <p className="text-sm leading-relaxed break-words">
                {message.content}
              </p>

              {/* Edited Indicator */}
              {message.edited && (
                <p className="text-xs text-white/60 mt-1">(edited)</p>
              )}
            </div>

            {/* Message Menu */}
            {(isHovered || showMenu) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-10 right-0 bg-black/80 backdrop-blur-sm rounded-lg p-1 flex items-center space-x-1"
              >
                <button
                  onClick={handleCopy}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="Copy message"
                >
                  <Copy className="w-3 h-3 text-white/70" />
                </button>
                <button
                  onClick={handleReply}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="Reply"
                >
                  <Reply className="w-3 h-3 text-white/70" />
                </button>
                {isOwn && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                      title="Edit message"
                    >
                      <Edit3 className="w-3 h-3 text-white/70" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <MoreVertical className="w-3 h-3 text-white/70" />
                </button>
              </motion.div>
            )}
          </div>

          {/* Message Meta */}
          <div className={`flex items-center space-x-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-white/50 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{formatTimestamp(message.timestamp)}</span>
            </span>
            {isOwn && (
              <div className="flex items-center">
                {getReadStatus()}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
