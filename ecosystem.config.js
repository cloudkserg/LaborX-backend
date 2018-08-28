module.exports = {
  apps: [
    {
      name: 'laborx.profile.backend',
      script: 'bin/www',
      watch: true,
      env_production: {
        PORT: 3000,
        NODE_ENV: 'production',
        DEBUG: '@laborx/profile.backend:*',
        DEBUG_COLORS: true
      },
      env_development: {
        PORT: 3001,
        NODE_ENV: 'development'
      },
      env_stage: {
        PORT: 3000,
        NODE_ENV: 'stage'
      }
    }
  ]
}
