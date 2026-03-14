import { pluginReact } from '@rsbuild/plugin-react'
import { defineConfig } from '@rstest/core'

export default defineConfig({
  plugins: [pluginReact()],
  globals: true,
  testEnvironment: 'happy-dom',
  setupFiles: ['./src/tests/setup.ts']
})
