# AI Utilities

**Author:** Jason Keys

**Description:**
This repository, "ai-utilities," contains a suite of AWS Lambda functions that interact with various AI and LLMs (Language Model Models) like OpenAI, Stability AI, and more. These functions are designed to leverage the power of AI and make it accessible through simple API endpoints. The repository uses the AWS Serverless Application Model (AWS SAM) and CloudFormation to create the necessary AWS resources.

## Functions

### OpenAI Chat

- **Function Name:** openai-chat
- **Description:** The "openai-chat" Lambda function uses the OpenAI chat completions API to facilitate a chat-based discussion via an API Gateway endpoint. It enables you to have natural conversations with the OpenAI GPT-3 model.
- **Usage:** You can call this function via an HTTP POST request to the associated API Gateway endpoint.

## Getting Started

To get started, you will need an AWS account and the AWS CLI configured. You should also have the AWS SAM CLI installed.

1. Clone this repository to your local development environment.

2. Navigate to the "openai-chat / src" directory to access specific functions.

3. Set up your AWS SAM deployment using the SAM CLI from the  "openai-chat / src" path. Make sure to provide the necessary environment variables, such as your API keys.

   ```bash
   sam deploy --guided

Once deployed, you will receive an API Gateway endpoint for accessing the "openai-chat" function.

## Example
To see an example of how to use the "openai-chat" function, you can check out the Mocha test for an email parsing application in the "test" directory. This test demonstrates how to make API requests to the function and process responses.

## Contributing
Feel free to contribute to this repository by creating new Lambda functions for other AI and LLMs or improving existing ones. We welcome your pull requests, bug reports, and feature suggestions. Together, we can make AI more accessible and powerful.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
