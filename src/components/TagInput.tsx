"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

export function TagInput({ tags, onChange, maxTags = 10 }: TagInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (tags.length >= maxTags) return;
    if (tags.includes(trimmed)) return;
    onChange([...tags, trimmed]);
    setInput("");
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleBlur = () => {
    if (input.trim()) {
      addTag(input);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2 min-h-[28px]">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 rounded-full text-sm border border-blue-100"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="hover:text-red-400 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Plus className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="flex-1 text-sm text-gray-600 placeholder-gray-400 outline-none bg-transparent"
          placeholder={
            tags.length < maxTags
              ? "输入标签，按回车添加（如：鬼灭之刃、炭治郎）"
              : `最多${maxTags}个标签`
          }
          disabled={tags.length >= maxTags}
        />
      </div>
    </div>
  );
}
