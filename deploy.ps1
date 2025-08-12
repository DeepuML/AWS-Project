# Flex Fit App Deployment Script for Windows
# This script helps deploy the application to AWS using Terraform

# Function to check if a command exists
function Test-CommandExists {
    param ($command)
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = 'stop'
    try { if (Get-Command $command) { return $true } }
    catch { return $false }
    finally { $ErrorActionPreference = $oldPreference }
}

Write-Host "Flex Fit App Deployment Script" -ForegroundColor Green
Write-Host "This script will deploy the application to AWS using Terraform" -ForegroundColor Yellow
Write-Host ""

# Check if terraform is installed
if (-not (Test-CommandExists terraform)) {
    Write-Host "Terraform is not installed. Please install Terraform first." -ForegroundColor Red
    exit 1
}

# Check if AWS CLI is installed
if (-not (Test-CommandExists aws)) {
    Write-Host "AWS CLI is not installed. Please install AWS CLI first." -ForegroundColor Red
    exit 1
}

# Check if AWS credentials are configured
try {
    $null = aws sts get-caller-identity
} catch {
    Write-Host "AWS credentials are not configured. Please run 'aws configure' first." -ForegroundColor Red
    exit 1
}

# Navigate to the infrastructure directory
Set-Location -Path "$PSScriptRoot\infra"

# Check if terraform.tfvars exists
if (-not (Test-Path -Path "terraform.tfvars")) {
    Write-Host "terraform.tfvars file not found. Creating from example..." -ForegroundColor Yellow
    if (Test-Path -Path "terraform.tfvars.example") {
        Copy-Item -Path "terraform.tfvars.example" -Destination "terraform.tfvars"
        Write-Host "Please edit terraform.tfvars with your values before continuing." -ForegroundColor Yellow
        exit 1
    } else {
        Write-Host "terraform.tfvars.example not found. Please create terraform.tfvars manually." -ForegroundColor Red
        exit 1
    }
}

# Initialize Terraform
Write-Host "Initializing Terraform..." -ForegroundColor Green
terraform init

# Plan the deployment
Write-Host "Planning deployment..." -ForegroundColor Green
terraform plan -out=tfplan

# Ask for confirmation
$answer = Read-Host -Prompt "Do you want to apply the above plan? (yes/no)"
if ($answer -ne "yes") {
    Write-Host "Deployment aborted." -ForegroundColor Red
    exit 0
}

# Apply the plan
Write-Host "Applying plan..." -ForegroundColor Green
terraform apply tfplan

# Get outputs
Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "Outputs:" -ForegroundColor Green
terraform output

# Build and deploy frontend
Write-Host "Building frontend..." -ForegroundColor Green
Set-Location -Path "$PSScriptRoot\frontend"
npm install
npm run build

# Get S3 bucket name from Terraform output
Set-Location -Path "$PSScriptRoot\infra"
$S3_BUCKET = terraform output -raw s3_bucket_name

# Upload frontend build to S3
Write-Host "Uploading frontend to S3..." -ForegroundColor Green
aws s3 sync "$PSScriptRoot\frontend\build\" "s3://$S3_BUCKET/" --delete

Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "You can access your application at:" -ForegroundColor Green
terraform output -raw s3_website_endpoint