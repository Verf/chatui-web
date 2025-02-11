import { exec } from 'child_process'

// 检查数据库连接
exec('pg_isready -h db -U app_user -d llm_app', (error) => {
  process.exit(error ? 1 : 0)
})
