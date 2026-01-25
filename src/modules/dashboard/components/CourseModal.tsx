'use client';

import React from 'react';
import UnifiedCourseLayout from '@/components/course/UnifiedCourseLayout';
import { dummyCourse } from '@/data/dummyCourseData';
import { Button } from '@/components/ui';

interface CourseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-[90%] h-[90%] rounded-2xl overflow-hidden relative flex flex-col">
                <div className="flex-1 overflow-hidden">
                    <UnifiedCourseLayout
                        course={dummyCourse}
                        courseId="mock-course-1"
                        onClose={onClose}
                    />
                </div>
            </div>
        </div>
    );
};

export default CourseModal;
