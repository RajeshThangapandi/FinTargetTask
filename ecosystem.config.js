// ecosystem.config.js
module.exports = {
    apps: [
      {
        name: 'task-queue',
        script: './src/index.js',
        instances: 4, // Number of instances (processes)
        exec_mode: 'cluster', // Enable cluster mode
        log_file: './logs/combined.log', // Combined log file
        out_file: './logs/out.log', // Standard output log file
        error_file: './logs/error.log', // Error log file
        merge_logs: true, // Merge logs from all instances
        log_date_format: 'YYYY-MM-DD HH:mm:ss', // Date format in logs
        time: true, // Add timestamp to logs
      },
    ],
  };
  