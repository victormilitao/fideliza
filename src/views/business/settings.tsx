import { useState } from 'react'
import { Header } from '@/views/header'
import { SettingsConfig } from './settings-config'
import { MyAccount } from './my-account'

type SettingsTab = 'config' | 'account'

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('config')

  const tabs: { key: SettingsTab; label: string }[] = [
    { key: 'config', label: 'Configurações' },
    { key: 'account', label: 'Minha conta' },
  ]

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />

      {/* Tabs */}
      <div className='border-b border-gray-200 bg-white'>
        <div className='px-6 sm:px-10'>
          <nav className='flex gap-8'>
            {tabs.map((tab) => {
              const isActive: boolean = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-1 -mb-px border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                    isActive
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-neutral-700'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className='flex flex-1 bg-white'>
        <div className='w-full px-8 py-8 sm:px-10 sm:py-8 max-w-lg mx-auto'>
          {activeTab === 'config' && <SettingsConfig />}
          {activeTab === 'account' && <MyAccount />}
        </div>
      </div>
    </div>
  )
}
