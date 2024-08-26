# FinTargetTask

# Task Queue with Rate Limiting

This project implements a task queuing system with rate limiting using Node.js and Express. The system ensures that no tasks are dropped, even when the rate limit is exceeded, by queuing them and processing them after the desired interval.

## Features

Rate Limiting: Limits the number of tasks a user can submit per minute.
Task Queuing: Tasks exceeding the rate limit are preserved and processed after the rate limit interval.
Clustering: The application uses Node.js clustering to take advantage of multiple CPU cores for better performance.

## How It Works

1. **Task Submission**:
   - Users submit tasks via a POST request to the `/task` endpoint.
   - Each request includes a `userId` and a `task` in the JSON body.

2. **Rate Limiting**:
   - The system allows up to 20 tasks per user per minute.
   - If a user exceeds this limit, additional tasks are queued.

3. **Task Queuing**:
   - Queued tasks are processed in the order they were received.
   - Once the rate limit interval passes, the queued tasks are processed.

4. **Clustering**:
   - The application uses Node.js clusters to run multiple instances of the Express server, taking advantage of all available CPU cores.
   - This improves the scalability and performance of the system.

## Endpoints

### `POST /task`

Submit a task for processing.

**Request Body**:
```json
{
  "userId": "user123",
  "task": "Complete Node.js assignment"
}
```

**Response**:
```json
{
  "message": "Task added to queue",
  "rateLimitStatus": {
    "tasksInQueue": 5,
    "requestsInLastMinute": 20,
    "isRateLimited": true
  }
}
```

## Getting Started

### Prerequisites

- Node.js v14 or higher
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/node-task-queue.git
   cd node-task-queue
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the application with clustering:

```bash
node src/cluster.js
```

This will start the application and automatically create a worker for each CPU core.

### Testing the Rate Limiting and Queuing

1. Use Postman or any other API client to send POST requests to `http://localhost:3002/task` with a JSON body containing `userId` and `task`.

2. If you exceed the rate limit (more than 20 tasks per minute), you should see messages like:

```bash
Rate limit exceeded for user user123. Task added to the queue.
```

3. After the rate limit interval passes, the queued tasks will be processed, and you will see:

```bash
Task completed for user user123: Complete Node.js assignment
```

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss changes.
