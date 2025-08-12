#!/bin/bash

# Flex Fit App Deployment Script
# This script helps deploy the application to AWS using Terraform

set -e

# Colors for output
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${GREEN}Flex Fit App Deployment Script${NC}"
echo -e "${YELLOW}This script will deploy the application to AWS using Terraform${NC}"
echo

# Check if terraform is installed
if ! command -v terraform &> /dev/null; then
    echo -e "${RED}Terraform is not installed. Please install Terraform first.${NC}"
    exit 1
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}AWS CLI is not installed. Please install AWS CLI first.${NC}"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}AWS credentials are not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

# Navigate to the infrastructure directory
cd "$(dirname "$0")/infra"

# Check if terraform.tfvars exists
if [ ! -f "terraform.tfvars" ]; then
    echo -e "${YELLOW}terraform.tfvars file not found. Creating from example...${NC}"
    if [ -f "terraform.tfvars.example" ]; then
        cp terraform.tfvars.example terraform.tfvars
        echo -e "${YELLOW}Please edit terraform.tfvars with your values before continuing.${NC}"
        exit 1
    else
        echo -e "${RED}terraform.tfvars.example not found. Please create terraform.tfvars manually.${NC}"
        exit 1
    fi
fi

# Initialize Terraform
echo -e "${GREEN}Initializing Terraform...${NC}"
terraform init

# Plan the deployment
echo -e "${GREEN}Planning deployment...${NC}"
terraform plan -out=tfplan

# Ask for confirmation
echo -e "${YELLOW}Do you want to apply the above plan? (yes/no)${NC}"
read -r answer
if [ "$answer" != "yes" ]; then
    echo -e "${RED}Deployment aborted.${NC}"
    exit 0
fi

# Apply the plan
echo -e "${GREEN}Applying plan...${NC}"
terraform apply tfplan

# Get outputs
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}Outputs:${NC}"
terraform output

# Build and deploy frontend
echo -e "${GREEN}Building frontend...${NC}"
cd "$(dirname "$0")/frontend"
npm install
npm run build

# Get S3 bucket name from Terraform output
cd "$(dirname "$0")/infra"
S3_BUCKET=$(terraform output -raw s3_bucket_name)

# Upload frontend build to S3
echo -e "${GREEN}Uploading frontend to S3...${NC}"
aws s3 sync "$(dirname "$0")/frontend/build/" "s3://$S3_BUCKET/" --delete

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}You can access your application at:${NC}"
terraform output -raw s3_website_endpoint