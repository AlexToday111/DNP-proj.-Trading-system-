import { type ChangeEvent } from 'react'
import { EmptyState } from '../components/ui/EmptyState'
import { type ScenarioSetting } from '../types/trading'

interface SettingsPageProps {
  settings: ScenarioSetting[]
  onUpdateSetting: (settingId: string, value: boolean | number | string) => void
}

export function SettingsPage({
  settings,
  onUpdateSetting
}: SettingsPageProps) {
  if (settings.length === 0) {
    return (
      <EmptyState
        title="No scenario controls configured"
        description="Add scenario settings to the mock data model to expose replay controls here."
      />
    )
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {settings.map((setting) => (
        <section key={setting.id} className="surface-card p-5 sm:p-6">
          <p className="eyebrow">Scenario control</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-text">
            {setting.label}
          </h3>
          <p className="mt-3 text-sm leading-6 text-muted">{setting.description}</p>

          <div className="mt-6">
            {setting.type === 'toggle' ? (
              <button
                type="button"
                role="switch"
                aria-checked={Boolean(setting.value)}
                onClick={() => onUpdateSetting(setting.id, !setting.value)}
                className={`flex h-12 w-full items-center justify-between rounded-[22px] border px-4 text-sm font-semibold transition ${
                  setting.value
                    ? 'border-accent bg-accent-soft text-accent'
                    : 'border-line bg-shell text-text'
                }`}
              >
                <span>{Boolean(setting.value) ? 'Enabled' : 'Disabled'}</span>
                <span className={`h-6 w-11 rounded-full p-1 transition ${setting.value ? 'bg-accent' : 'bg-line'}`}>
                  <span
                    className={`block h-4 w-4 rounded-full bg-white transition ${
                      setting.value ? 'translate-x-5' : ''
                    }`}
                  />
                </span>
              </button>
            ) : null}

            {setting.type === 'range' ? (
              <label className="block">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-text">Playback speed</span>
                  <span className="mono-data text-sm text-muted">{setting.value}x</span>
                </div>
                <input
                  type="range"
                  min={setting.min}
                  max={setting.max}
                  step={setting.step}
                  value={Number(setting.value)}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    onUpdateSetting(setting.id, Number(event.target.value))
                  }
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-line accent-[#0f6b4b]"
                />
              </label>
            ) : null}

            {setting.type === 'select' ? (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-text">Option</span>
                <select
                  className="control-select w-full"
                  value={String(setting.value)}
                  onChange={(event) => onUpdateSetting(setting.id, event.target.value)}
                >
                  {setting.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>
        </section>
      ))}
    </div>
  )
}
