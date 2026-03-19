# AWS deployment instructions

This directory holds infrastructure-as-code for the `contactForm` Lambda function.
You can use either the **SAM** template or the **Terraform** configuration; pick one.

## 1. Common prerequisites

- AWS CLI configured with credentials (`aws configure`).
- Node.js installed (to run `npm install` in the `lambda/` folder).
- `cd lambda && npm install` to populate `node_modules`.

### Environment variables (required)

- `TELEGRAM_TOKEN` – your bot token
- `TELEGRAM_CHAT` – chat ID to send messages to

You can pass these into Terraform or SAM as parameters.

## 2. Using SAM

```bash
# build your code and create a local deployment package
cd /Users/samuelwong/Website/aws
sam build

# deploy (the guided flow will ask for parameter values)
sam deploy --guided
# note the API endpoint printed at the end; use it in contact.html
```

The SAM template (`sam.yaml`) defines:
- `ContactFunction`: Node.js Lambda using `lambda/handler.js`
- `ContactApi`: HTTP API Gateway with a POST `/contact` route
- CORS enabled

## 3. Using Terraform

```bash
cd /Users/samuelwong/Website/terraform
terraform init
# before apply, create a zip of the lambda sources:
(cd .. && zip -r lambda.zip lambda)
cp ../lambda.zip .
terraform apply -var="telegram_token=..." -var="telegram_chat=..."
```

The Terraform config creates similar resources:
- IAM role, Lambda function
- HTTP API, integration, route and stage
- Permission to allow API Gateway to invoke the function

When `terraform apply` completes it will print the `api_url` output (use this in `contact.html`).

---

Either approach leaves all runtime code in the `lambda/` folder; files in this `aws/` directory are never deployed to Cloudflare thanks to `.cfignore`.