# SQS POC (Proof of Concept) with NestJS

This project demonstrates how to use Amazon Simple Queue Service (SQS) with NestJS for message queueing. It includes a producer that sends messages to an SQS queue and a consumer that consumes and processes those messages.

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Producer](#producer)
  - [Consumer](#consumer)
- [Advanced Configuration](#advanced-configuration)
- [Contributing](#contributing)
- [License](#license)

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [NPM](https://www.npmjs.com/)
- [AWS Account](https://aws.amazon.com/) with SQS set up

## Installation

  1. Clone the repository:
  ```bash
  git clone https://github.com/abhijeet-2128/sqs_poc_nestjs
  cd sqs-poc_nestjs
  npm install
  
  ```

## Configuration

  1. Create a .env File:
Create a .env file in the root directory with the following content:

.env 
```bash
SQS_REGION=your-sqs-region
SQS_ACCESS_KEY_ID=your-access-key-id
SQS_SECRET_ACCESS_KEY=your-secret-access-key
SQS_QUEUE_URL=your-sqs-queue-url
SQS_QUEUE_NAME=your-sqs-queue-name
```
## Advanced Configuration
To enable content-based deduplication, set contentBasedDeduplication to true :(FIFO Queue) 
Using amazon console options for queue configuration

Message Groups: 
To use message groups, set messageGroupId while sending messages in the producer:
```code
await this.producerService.send(message, jobType, messageGroupId);
```

## Usage
```bash
npm run start:dev
```

## Contributing
Contributions are welcome! Please follow the contribution guidelines.

## License

This README provides detailed instructions on prerequisites, installation, configuration, usage, advanced configuration (deduplication and message groups), contributing, and licensing. Feel free to adjust it further based on your project's specifics.