# PowerShell script to deploy frontend

# Colors for output
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"

Write-Host "Flex Fit App Frontend Deployment Script" -ForegroundColor $Green
Write-Host "This script will build and deploy the frontend to S3" -ForegroundColor $Yellow
Write-Host ""

# Check if AWS CLI is installed
if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
    Write-Host "AWS CLI is not installed. Please install AWS CLI first." -ForegroundColor $Red
    exit 1
}

# Check if terraform is installed
if (-not (Get-Command terraform -ErrorAction SilentlyContinue)) {
    Write-Host "Terraform is not installed. Please install Terraform first." -ForegroundColor $Red
    exit 1
}

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js is not installed. Please install Node.js first." -ForegroundColor $Red
    exit 1
}

# Check if npm is installed
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "npm is not installed. Please install npm first." -ForegroundColor $Red
    exit 1
}

# Navigate to the infrastructure directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$infraDir = Join-Path (Split-Path -Parent $scriptDir) "infra"
Set-Location -Path $infraDir

# Check if terraform state exists
if (-not (Test-Path -Path "terraform.tfstate")) {
    Write-Host "No terraform state found. Please run the deployment script first." -ForegroundColor $Red
    exit 1
}

# Get S3 bucket name and EC2 instance public IP from Terraform output
$S3_BUCKET = terraform output -raw s3_bucket_name
$EC2_IP = terraform output -raw ec2_public_ip

# Navigate to the frontend directory
$frontendDir = Join-Path (Split-Path -Parent $scriptDir) "frontend"
Set-Location -Path $frontendDir

# Create a .env file with the backend API URL
@"
REACT_APP_API_URL=http://${EC2_IP}:8000
"@ | Out-File -FilePath ".env" -Encoding utf8

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor $Green
npm install

# Build the frontend
Write-Host "Building frontend..." -ForegroundColor $Green
npm run build

# Deploy to S3
Write-Host "Deploying to S3..." -ForegroundColor $Green
aws s3 sync build/ "s3://${S3_BUCKET}/" --delete

# Get the S3 website URL
$S3_WEBSITE_URL = aws s3 website "s3://${S3_BUCKET}/" --get-url

Write-Host "Frontend deployed successfully!" -ForegroundColor $Green
Write-Host "Frontend is available at: ${S3_WEBSITE_URL}" -ForegroundColor $Green

# Create a CloudFront invalidation if CloudFront is used
$CLOUDFRONT_ID = aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[?DomainName=='${S3_BUCKET}.s3.amazonaws.com']].Id" --output text

if ($CLOUDFRONT_ID) {
    Write-Host "Creating CloudFront invalidation..." -ForegroundColor $Green
    aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_ID" --paths "/*"
    $CLOUDFRONT_DOMAIN = aws cloudfront get-distribution --id "$CLOUDFRONT_ID" --query "Distribution.DomainName" --output text
    Write-Host "CloudFront distribution is available at: https://${CLOUDFRONT_DOMAIN}" -ForegroundColor $Green
}