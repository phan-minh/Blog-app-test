# Backend service

## Contents

-   [Quick Start](#quick-start)

## <a id="quick-start"></a>Quick Start

This this the back-end repository use service on aws to hosting (including: IAM role, Api Gateway, Lambda, DynamoDB)
After cloning from repository, it is necessary to install dependency and tools required by project


### 1. **Install via npm:**

To install serverless:
```bash
npm install -g serverless
```
To install package:
```bash
npm install
```

### <a id="setup-provider-credentials"></a>2. **Set-up your Provider Credentials**.
To deploy serverless app to AWS you need to account and some basic information to setup 
[Watch the video on setting up credentials](https://www.youtube.com/watch?v=HSd9uYj2LJA)


### 3. **Deploy**
After install package and setting credentials and role for AWS account. Run code to deploy app: 
```bash
npm run deploy
```
After deploy successfuly you can see the endpoint that API Gateway generate, you can test on Postman with this route