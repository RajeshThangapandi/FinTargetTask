// src/services/taskService.js
const Queue = require('bull');
const fs = require('fs');
const path = require('path');
const redisClient = require('../config/redisClient');

const taskQueue = new Queue('taskQueue', {
  redis: { host: '127.0.0.1', port: 6379 },
});

const LOG_FILE_PATH = path.join(__dirname, '../logs/task.log');

const rateLimiter = async (userId) => {
  const userRateLimitKey = `rate_limit_${userId}`;
  const currentCount = await redisClient.get(userRateLimitKey) || 0;

  if (currentCount >= 20) {
    return false;
  } else {
    await redisClient.set(userRateLimitKey, parseInt(currentCount) + 1, {
      EX: 60,
    });
    return true;
  }
};

const processTask = (userId) => {
  const timestamp = new Date().toISOString();
  const logEntry = `User: ${userId}, Task completed at: ${timestamp}\n`;
  fs.appendFileSync(LOG_FILE_PATH, logEntry);
  console.log(`Task completed for user ${userId} at ${timestamp}`);
};

taskQueue.process(async (job) => {
  const { userId } = job.data;
  processTask(userId);
});

const addTaskToQueue = async (userId) => {
  const allowed = await rateLimiter(userId);
  if (!allowed) {
    return { error: 'Rate limit exceeded, try again later' };
  }

  await taskQueue.add({ userId }, { delay: 1000 });
  return { success: 'Task added to queue' };
};

module.exports = { addTaskToQueue };
