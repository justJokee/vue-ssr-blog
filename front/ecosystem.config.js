/**
 * @desc pm2 配置文件
 * @author justJokee
 */
module.exports = {
  apps: [
    {
      name: 'mapblog',
      cwd: './',
      script: 'server.js',
      max_memory_restart: '1024M',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      exec_mode: 'cluster',
      instances: 'max',
      watch: 'false',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production' // 环境参数，当前指定为生产环境
      }
    }
  ]

  // deploy: {
  //   production: {
  //     user: 'SSH_USERNAME',
  //     host: 'SSH_HOSTMACHINE',
  //     ref: 'origin/master',
  //     repo: 'GIT_REPOSITORY',
  //     path: 'DESTINATION_PATH',
  //     'pre-deploy-local': '',
  //     'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
  //     'pre-setup': ''
  //   }
  // }
}
