export interface LogLine {
  text: string
  type: 'input' | 'output' | 'error' | 'success'
}

export function evaluateCommand(
  commandLine: string,
  onViewChange: (view: any) => void
): LogLine[] {
  const rawCmd = commandLine.trim()
  if (!rawCmd) return []

  const command = rawCmd.toLowerCase().split(' ')[0]
  const outputs: LogLine[] = []

  switch (command) {
    case 'help':
      outputs.push(
        { text: 'Available commands:', type: 'success' },
        { text: '  about      - Display overview of developer profile', type: 'output' },
        { text: '  skills     - Render skill stats matrix info', type: 'output' },
        { text: '  projects   - Show repository server details', type: 'output' },
        { text: '  clear      - Clear the console output history', type: 'output' },
        { text: '  matrix     - Activate cyber screen rain demo', type: 'success' },
        { text: '  exit       - Exit full screen focus view mode', type: 'output' }
      )
      break
    case 'about':
      outputs.push(
        { text: '=== DEVELOPER BIOGRAPHY ===', type: 'success' },
        { text: 'Name: Agent Alex Mercer', type: 'output' },
        { text: 'Role: Senior Full Stack / 3D Graphics Engineer', type: 'output' },
        { text: 'Bio: Crafting next-generation immersive web interfaces with optimal speed', type: 'output' },
        { text: '     and robust systems architectures.', type: 'output' }
      )
      break
    case 'skills':
      outputs.push(
        { text: '=== CORE TECH MATRIX ===', type: 'success' },
        { text: '  - Frontend: React, TypeScript, Next.js, HTML5/CSS3', type: 'output' },
        { text: '  - Immersive: Three.js, React Three Fiber, Custom Shaders', type: 'output' },
        { text: '  - Backend: Node.js, Express, Go, Postgres, Docker', type: 'output' }
      )
      onViewChange('keyboard')
      break
    case 'projects':
      outputs.push(
        { text: 'Routing system camera deck to server rack node logs...', type: 'output' }
      )
      onViewChange('server')
      break
    case 'matrix':
      outputs.push(
        { text: 'Wake up, Alex...', type: 'error' },
        { text: 'The Matrix has you...', type: 'error' },
        { text: 'Follow the white rabbit. 🐇', type: 'error' }
      )
      break
    case 'exit':
      outputs.push({ text: 'Exiting focus mode. Goodbye.', type: 'output' })
      onViewChange('home')
      break
    default:
      outputs.push({
        text: `Command not found: "${command}". Type "help" for support.`,
        type: 'error',
      })
  }

  return outputs
}
