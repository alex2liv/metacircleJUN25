module.exports = {
  apps: [{
    name: 'metacircle',
    script: 'npm',
    args: 'run start',
    cwd: '/var/www/metacircle',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3091
    },
    error_file: '/var/log/pm2/metacircle-error.log',
    out_file: '/var/log/pm2/metacircle-out.log',
    log_file: '/var/log/pm2/metacircle.log',
    time: true,
    autorestart: true,
    max_restarts: 5,
    min_uptime: '10s'
  }]
}