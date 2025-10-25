"use client";

import React, { useState } from 'react';
import Icon from './Icon';
import { useFontSize } from '@/contexts/FontSizeContext';

interface TextSizeControlProps {
  variant?: 'header' | 'sidebar';
  className?: string;
}

const TextSizeControl: React.FC<TextSizeControlProps> = ({ 
  variant = 'header', 
  className = '' 
}) => {
  const { fontSizePx, setFontSizePx, minPx, maxPx } = useFontSize();
  const [isOpen, setIsOpen] = useState(false);

  const fontSizeOptions = [
    { value: 12, label: 'Small', description: '12px' },
    { value: 16, label: 'Medium', description: '16px' },
    { value: 20, label: 'Large', description: '20px' },
    { value: 24, label: 'Extra Large', description: '24px' }
  ];

  const currentOption = fontSizeOptions.find(option => option.value === fontSizePx) || fontSizeOptions[1];

  const handleFontSizeChange = (newSize: number) => {
    setFontSizePx(newSize);
    setIsOpen(false);
  };

  if (variant === 'sidebar') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-neutral-dark hover:bg-gradient-to-r hover:from-teal-light/50 hover:to-blue-50/50 hover:text-teal-primary transition-all duration-200 group shadow-sm hover:shadow-md"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-neutral-light to-neutral-light/80 group-hover:from-teal-light group-hover:to-blue-50 transition-all duration-200">
              <Icon name="type" size="sm" color="#059669" />
            </div>
            <div className="text-left">
              <span className="text-base font-semibold">Text Size</span>
              <p className="text-xs text-teal-primary font-medium">{currentOption.description}</p>
            </div>
          </div>
          <Icon 
            name={isOpen ? "chevronUp" : "chevronDown"} 
            size="sm" 
            color="#059669" 
          />
        </button>

        {isOpen && (
          <div className="mt-2 space-y-1 p-2 bg-gradient-to-b from-teal-light/10 to-blue-50/20 rounded-2xl">
            {fontSizeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFontSizeChange(option.value)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                  fontSizePx === option.value
                    ? 'bg-gradient-to-r from-teal-light to-blue-50 text-teal-primary font-semibold shadow-sm'
                    : 'text-neutral-dark hover:bg-white/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                    fontSizePx === option.value ? 'bg-teal-primary' : 'bg-neutral-light'
                  }`} />
                  <span className="font-medium">{option.label}</span>
                </div>
                <span className="text-xs text-neutral-medium font-medium">{option.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Header variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2.5 text-sm text-neutral-medium hover:text-teal-primary hover:bg-teal-light/50 rounded-xl transition-all duration-200 group shadow-sm hover:shadow-md"
        title="Adjust text size"
      >
        <Icon name="type" size="sm" color="#059669" />
        <span className="font-semibold">{currentOption.description}</span>
        <Icon 
          name={isOpen ? "chevronUp" : "chevronDown"} 
          size="sm" 
          color="#059669" 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-3 w-56 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-neutral-light/50 z-20 py-3 overflow-hidden">
            <div className="px-4 py-3 border-b border-neutral-light/50 bg-gradient-to-r from-teal-light/20 to-blue-50">
              <p className="text-sm font-semibold text-neutral-dark">Text Size</p>
              <p className="text-xs text-teal-primary font-medium">Adjust the app's text size</p>
            </div>
            
            <div className="py-2">
              {fontSizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFontSizeChange(option.value)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-all duration-200 ${
                    fontSizePx === option.value
                      ? 'bg-gradient-to-r from-teal-light to-blue-50 text-teal-primary font-semibold shadow-sm'
                      : 'text-neutral-dark hover:bg-neutral-light/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      fontSizePx === option.value 
                        ? 'bg-teal-primary shadow-sm' 
                        : 'bg-neutral-light group-hover:bg-teal-light'
                    }`} />
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <span className="text-xs text-neutral-medium font-medium">{option.description}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TextSizeControl;