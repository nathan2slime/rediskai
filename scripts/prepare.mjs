import { spawnSync } from 'node:child_process'

if (process.env.CI === 'true' || process.env.LEFTHOOK === '0') {
  process.exit(0)
}

const result = spawnSync('git', ['--version'], { stdio: 'ignore' })
if (result.status !== 0) {
  process.exit(0)
}

const install = spawnSync('lefthook', ['install'], {
  stdio: 'inherit'
})

process.exit(install.status ?? 1)
