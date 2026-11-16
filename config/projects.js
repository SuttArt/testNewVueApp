// All call-offs use the same stores and can reuse components from src/components.
// Set `entry` on a call-off to replace its family's entire presentation.
const families = {
  BR1: './src/projects/br1/App.vue',
  BR2: './src/projects/br2/App.vue',
  BR3: './src/projects/br3/App.vue',
  BR4: './src/projects/br4/App.vue',
}

export const projects = {
  BR1_START: { family: 'BR1', callOff: 'Start', accent: '#2563eb' },
  BR1_METRO: { family: 'BR1', callOff: 'Metro', accent: '#7c3aed' },
  BR2_SRM: { family: 'BR2', callOff: 'SRM', accent: '#047857' },
  BR2_ENOE: { family: 'BR2', callOff: 'ENOE', accent: '#0e7490' },
  BR3_AGAM: { family: 'BR3', callOff: 'AGAM', accent: '#b45309' },
  BR3_CONVERGENCE: { family: 'BR3', callOff: 'Convergence', accent: '#be123c' },
  BR3_ONIT: { family: 'BR3', callOff: 'Onit', accent: '#4338ca' },
  BR4_SBR: { family: 'BR4', callOff: 'SBR', accent: '#334155' },
  BR4_DT6: { family: 'BR4', callOff: 'DT6', accent: '#0f766e' },
}

export function resolveProject(id) {
  if (!Object.hasOwn(projects, id)) {
    throw new Error(`Unknown project "${id}". Choose one of: ${Object.keys(projects).join(', ')}`)
  }

  const { entry, ...settings } = projects[id]
  return {
    entry: entry ?? families[settings.family],
    config: { id, ...settings, title: `${settings.family} (${settings.callOff})` },
  }
}
