# Terraform notes

This directory contains the Terraform configuration (`main.tf`) for provisioning the
AWS resources required by the contact form:

- Lambda function (`contactForm`) with `handler.js` from the `lambda/` folder
- IAM execution role with basic logging permissions
- HTTP API Gateway (v2) with a `POST /contact` route integrated to the Lambda
- Permission to allow the API to invoke the function

## Quick start

1. `cd /Users/samuelwong/Website/terraform`
2. `terraform init` – sets up the AWS provider plugin.
3. Prepare the Lambda deployment bundle:
   ```bash
   (cd .. && zip -r lambda.zip lambda)
   cp ../lambda.zip .
   ```
4. Run `terraform apply -var="telegram_token=..." -var="telegram_chat=..."`.
   Accept the plan and wait for creation to finish.
5. After apply completes, Terraform will output the API endpoint (look for `api_url`).
   Use that URL as the `action` attribute in `contact.html`.

You can destroy the stack with `terraform destroy` when you're done.

> Note: you don't need both SAM and Terraform; they are just alternate
> ways of describing the same infrastructure. Pick whichever tool you
> prefer and ignore the other.

Files in this folder are ignored during the Cloudflare Pages build via `.cfignore`.