#!/bin/bash
# Script to clean up resources

set -e

# Colors for output
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${GREEN}Flex Fit App Cleanup Script${NC}"
echo -e "${YELLOW}This script will clean up resources created by the deployment${NC}"
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

# Navigate to the infrastructure directory
cd "$(dirname "$0")/../infra"

# Check if terraform state exists
if [ ! -f "terraform.tfstate" ]; then
    echo -e "${RED}No terraform state found. Nothing to clean up.${NC}"
    exit 1
fi

# Get S3 bucket name from Terraform output
S3_BUCKET=$(terraform output -raw s3_bucket_name 2>/dev/null || echo "")

# Empty S3 bucket if it exists
if [ ! -z "$S3_BUCKET" ]; then
    echo -e "${YELLOW}Emptying S3 bucket $S3_BUCKET...${NC}"
    aws s3 rm "s3://$S3_BUCKET/" --recursive
fi

# Ask for confirmation
echo -e "${RED}WARNING: This will destroy all resources created by Terraform.${NC}"
echo -e "${YELLOW}Do you want to proceed? (yes/no)${NC}"
read -r answer
if [ "$answer" != "yes" ]; then
    echo -e "${RED}Cleanup aborted.${NC}"
    exit 0
fi

# Destroy resources
echo -e "${GREEN}Destroying resources...${NC}"
terraform destroy -auto-approve

# Clean up local files
echo -e "${GREEN}Cleaning up local files...${NC}"
rm -f terraform.tfstate*
rm -f .terraform.lock.hcl
rm -rf .terraform

echo -e "${GREEN}Cleanup completed successfully!${NC}"
