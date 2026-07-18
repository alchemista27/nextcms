"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { clsx } from "clsx";

export interface Tag {
  id?: string;
  name: string;
  slug?: string;
}

interface TagInputProps {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  availableTags?: Tag[];
  placeholder?: string;
}

export function TagInput({ value, onChange, availableTags = [], placeholder = "Add tags..." }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredTags = availableTags.filter(
    (tag) => 
      tag.name.toLowerCase().includes(inputValue.toLowerCase()) && 
      !value.some((v) => v.name.toLowerCase() === tag.name.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = (tagName: string) => {
    // Check if tag already exists in value
    if (value.some((v) => v.name.toLowerCase() === tagName.toLowerCase())) {
      setInputValue("");
      return;
    }

    // Try to find if it matches an existing available tag
    const existing = availableTags.find((t) => t.name.toLowerCase() === tagName.toLowerCase());
    
    if (existing) {
      onChange([...value, existing]);
    } else {
      // It's a new tag, we'll create it on the fly during post save
      onChange([...value, { name: tagName }]);
    }
    setInputValue("");
    setIsOpen(false);
  };

  const removeTag = (index: number) => {
    const newTags = [...value];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div 
        className="flex flex-wrap items-center gap-1.5 p-1.5 border border-gray-300 rounded focus-within:ring-1 focus-within:ring-[#00704A] focus-within:border-[#00704A] bg-white min-h-[42px]"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, index) => (
          <span 
            key={index}
            className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-sm"
          >
            <span>{tag.name}</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(index); }}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <CloseIcon style={{ fontSize: "14px" }} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] outline-none text-sm p-1 bg-transparent"
        />
      </div>

      {isOpen && (inputValue || filteredTags.length > 0) && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredTags.map((tag, index) => (
            <button
              key={tag.id || index}
              type="button"
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100"
              onClick={() => addTag(tag.name)}
            >
              {tag.name}
            </button>
          ))}
          
          {inputValue && !filteredTags.some(t => t.name.toLowerCase() === inputValue.toLowerCase()) && (
            <button
              type="button"
              className="w-full text-left px-4 py-2 text-sm text-[#00704A] font-medium hover:bg-gray-50 focus:outline-none"
              onClick={() => addTag(inputValue.trim())}
            >
              Add new tag: &quot;{inputValue.trim()}&quot;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
