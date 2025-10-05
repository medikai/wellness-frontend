"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Class, ClassBooking } from "@/types/class";

type ClassContextValue = {
  classes: Class[];
  bookings: ClassBooking[];
  createClass: (classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateClass: (id: string, updates: Partial<Class>) => void;
  deleteClass: (id: string) => void;
  bookClass: (classId: string, userId: string) => void;
  cancelBooking: (bookingId: string) => void;
  getClassById: (id: string) => Class | undefined;
  getBookingsByClassId: (classId: string) => ClassBooking[];
  getBookingsByUserId: (userId: string) => ClassBooking[];
};

const CLASSES_STORAGE_KEY = "wellness_classes";
const BOOKINGS_STORAGE_KEY = "wellness_class_bookings";

const ClassContext = createContext<ClassContextValue | undefined>(undefined);

export const ClassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [bookings, setBookings] = useState<ClassBooking[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedClasses = typeof window !== "undefined" ? window.localStorage.getItem(CLASSES_STORAGE_KEY) : null;
      const storedBookings = typeof window !== "undefined" ? window.localStorage.getItem(BOOKINGS_STORAGE_KEY) : null;
      
      if (storedClasses) {
        setClasses(JSON.parse(storedClasses));
      }
      
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      }
    } catch (error) {
      console.error("Error loading class data from localStorage:", error);
    }
  }, []);

  // Save classes to localStorage whenever classes change
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(classes));
      }
    } catch (error) {
      console.error("Error saving classes to localStorage:", error);
    }
  }, [classes]);

  // Save bookings to localStorage whenever bookings change
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
      }
    } catch (error) {
      console.error("Error saving bookings to localStorage:", error);
    }
  }, [bookings]);

  const createClass = useCallback((classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newClass: Class = {
      ...classData,
      id: `class_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    
    setClasses(prev => [...prev, newClass]);
  }, []);

  const updateClass = useCallback((id: string, updates: Partial<Class>) => {
    setClasses(prev => prev.map(cls => 
      cls.id === id 
        ? { ...cls, ...updates, updatedAt: new Date().toISOString() }
        : cls
    ));
  }, []);

  const deleteClass = useCallback((id: string) => {
    setClasses(prev => prev.filter(cls => cls.id !== id));
    // Also remove related bookings
    setBookings(prev => prev.filter(booking => booking.classId !== id));
  }, []);

  const bookClass = useCallback((classId: string, userId: string) => {
    const now = new Date().toISOString();
    const newBooking: ClassBooking = {
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      classId,
      userId,
      bookedAt: now,
      status: 'confirmed',
    };
    
    setBookings(prev => [...prev, newBooking]);
  }, []);

  const cancelBooking = useCallback((bookingId: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: 'cancelled' as const }
        : booking
    ));
  }, []);

  const getClassById = useCallback((id: string) => {
    return classes.find(cls => cls.id === id);
  }, [classes]);

  const getBookingsByClassId = useCallback((classId: string) => {
    return bookings.filter(booking => booking.classId === classId);
  }, [bookings]);

  const getBookingsByUserId = useCallback((userId: string) => {
    return bookings.filter(booking => booking.userId === userId);
  }, [bookings]);

  const value = useMemo<ClassContextValue>(() => ({
    classes,
    bookings,
    createClass,
    updateClass,
    deleteClass,
    bookClass,
    cancelBooking,
    getClassById,
    getBookingsByClassId,
    getBookingsByUserId,
  }), [
    classes,
    bookings,
    createClass,
    updateClass,
    deleteClass,
    bookClass,
    cancelBooking,
    getClassById,
    getBookingsByClassId,
    getBookingsByUserId,
  ]);

  return (
    <ClassContext.Provider value={value}>
      {children}
    </ClassContext.Provider>
  );
};

export const useClass = (): ClassContextValue => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error("useClass must be used within a ClassProvider");
  }
  return context;
};