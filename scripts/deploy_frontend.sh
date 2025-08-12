#!/bin/bash
# Script to deploy frontend

set -e

# Colors for output
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${GREEN}Flex Fit App Frontend Deployment Script${NC}"
echo -e "${YELLOW}This script will build and deploy the frontend to S3${NC}"
echo

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}AWS CLI is not installed. Please install AWS CLI first.${NC}"
    exit 1
fi

# Check if terraform is installed
if ! command -v terraform &> /dev/null; then
    echo -e "${RED}Terraform is not installed. Please install Terraform first.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install npm first.${NC}"
    exit 1
fi

# Navigate to the infrastructure directory
cd "$(dirname "$0")/../infra"

# Check if terraform state exists
if [ ! -f "terraform.tfstate" ]; then
    echo -e "${RED}No terraform state found. Please run the deployment script first.${NC}"
    exit 1
fi

# Get S3 bucket name and EC2 instance public IP from Terraform output
S3_BUCKET=$(terraform output -raw s3_bucket_name)
EC2_IP=$(terraform output -raw ec2_public_ip)

# Navigate to the frontend directory
cd "$(dirname "$0")/../frontend"

# Create a .env file with the backend API URL
cat > .env << EOF
REACT_APP_API_URL=http://${EC2_IP}:8000
EOF

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm install

# Build the frontend
echo -e "${GREEN}Building frontend...${NC}"
npm run build

# Deploy to S3
echo -e "${GREEN}Deploying to S3...${NC}"
aws s3 sync build/ "s3://${S3_BUCKET}/" --delete

# Get the S3 website URL
S3_WEBSITE_URL=$(aws s3 website "s3://${S3_BUCKET}/" --get-url)

echo -e "${GREEN}Frontend deployed successfully!${NC}"
echo -e "${GREEN}Frontend is available at: ${S3_WEBSITE_URL}${NC}"

# Create a CloudFront invalidation if CloudFront is used
CLOUDFRONT_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[?DomainName=='${S3_BUCKET}.s3.amazonaws.com']].Id" --output text)

if [ ! -z "$CLOUDFRONT_ID" ]; then
    echo -e "${GREEN}Creating CloudFront invalidation...${NC}"
    aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_ID" --paths "/*"
    CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution --id "$CLOUDFRONT_ID" --query "Distribution.DomainName" --output text)
    echo -e "${GREEN}CloudFront distribution is available at: https://${CLOUDFRONT_DOMAIN}${NC}"
fi
