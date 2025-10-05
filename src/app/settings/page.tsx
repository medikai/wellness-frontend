"use client";

import React from 'react'
import { Card } from '@/components/ui'
import TextSizeControl from '@/modules/dashboard/components/TextSizeControl'

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-neutral-dark">Settings</h1>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-neutral-dark mb-4">Text Size</h2>
        <p className="text-neutral-medium mb-4">Adjust the app's text size. This setting is saved on your device.</p>
        <TextSizeControl />
      </Card>
    </div>
  )
}

