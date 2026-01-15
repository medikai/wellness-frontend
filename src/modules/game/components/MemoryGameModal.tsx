'use client';

import React from 'react';
import { Icon } from '@/components/ui';
import MemoryMatchModal from '@/components/MemoryMatchModal'; // Reuse existing game logic

interface MemoryGameModalProps {
    onClose: () => void;
}

const MemoryGameModal: React.FC<MemoryGameModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 ">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="bg-teal-primary px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-white">
                        <Icon name="heart" size="md" color="white" />
                        <h3 className="text-xl font-bold">Memory Challenge</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <Icon name="x" size="sm" color="white" />
                    </button>
                </div>

                {/* Content - Reuse existing component but wrap it nicely */}
                <div className="p-6">
                    <MemoryMatchModal onClose={onClose} />
                </div>
            </div>
        </div>
    );
};

export default MemoryGameModal;
