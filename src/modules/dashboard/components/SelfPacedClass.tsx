'use client';
import React, { useState } from 'react'
import { Card, Button } from '@/components/ui'
import CourseModal from './CourseModal';

const SelfPacedCard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleStartClass = () => {
        setIsModalOpen(true);
    }

    return (
        <>
            <Card hover className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="text-sm text-neutral-medium">Self-Paced Class</span>
                        <h3 className="text-2xl font-bold text-neutral-dark mt-1">
                            Self-Paced Class
                        </h3>
                        <p className="text-neutral-medium mt-1">
                            Start your self-paced class today
                        </p>
                    </div>
                    <Button variant="default" size="lg" onClick={handleStartClass} className="shadow-md hover:shadow-lg transition-all rounded-xl">
                        Start Class →
                    </Button>
                </div>
            </Card>
            <CourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    )
}


export default SelfPacedCard
