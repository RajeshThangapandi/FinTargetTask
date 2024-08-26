const rateLimit = 20; 
const rateLimitInterval = 60 * 1000; 
const taskProcessingInterval = rateLimitInterval / rateLimit; 

const taskQueue = new Map();
const requestCounts = new Map(); 

function addToQueue(userId, task) {
  if (!taskQueue.has(userId)) {
    taskQueue.set(userId, []);
    requestCounts.set(userId, { count: 0, timestamp: Date.now() });
  }

  const userRequest = requestCounts.get(userId);
  const currentTime = Date.now();

  // Check if the minute has passed
  if (currentTime - userRequest.timestamp > rateLimitInterval) {
    userRequest.count = 0; // Reset count after 1 minute
    userRequest.timestamp = currentTime;
  }

  if (userRequest.count < rateLimit) {
    userRequest.count++;
    taskQueue.get(userId).push(task);
    processQueue(userId);
  } else {
   
    console.log(`Rate limit exceeded for user ${userId}. Task added to the queue.`);
    taskQueue.get(userId).push(task);
  }
}

function processQueue(userId) {
  const tasks = taskQueue.get(userId);
  if (!tasks || tasks.length === 0) return;

  console.log(`Processing queue for user ${userId}. Tasks in queue: ${tasks.length}`);

  let count = 0;
  const interval = setInterval(() => {
    if (count >= rateLimit || tasks.length === 0) {
      clearInterval(interval);
      console.log(`Finished processing queue for user ${userId}. Remaining tasks in queue: ${tasks.length}`);
      return;
    }

    const task = tasks.shift();
    if (task) {

      console.log(`Task completed for user ${userId}:`, task);
      count++;
    }
  }, taskProcessingInterval);
}

exports.handleTaskRequest = (req, res) => {
  const userId = req.body.userId;
  const task = req.body.task;

  if (!userId || !task) {
    return res.status(400).json({ error: 'User ID and task are required' });
  }

  console.log('Received request:', { userId, task });

  addToQueue(userId, task);

  const userRequest = requestCounts.get(userId);
  const rateLimitStatus = {
    tasksInQueue: taskQueue.get(userId).length,
    requestsInLastMinute: userRequest.count,
    isRateLimited: userRequest.count >= rateLimit
  };

  res.status(200).json({ message: 'Task added to queue', rateLimitStatus });
};
