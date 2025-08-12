# PowerShell script to clean up AWS resources created by Terraform

# Colors for output
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"

Write-Host "Flex Fit App Cleanup Script" -ForegroundColor $Green
Write-Host "This script will clean up all AWS resources created by Terraform" -ForegroundColor $Yellow
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

# Navigate to the infrastructure directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$infraDir = Join-Path (Split-Path -Parent $scriptDir) "infra"
Set-Location -Path $infraDir

# Check if terraform state exists
if (-not (Test-Path -Path "terraform.tfstate")) {
    Write-Host "No terraform state found. Nothing to clean up." -ForegroundColor $Yellow
    exit 0
}

# Get S3 bucket name from Terraform output
try {
    $S3_BUCKET = terraform output -raw s3_bucket_name
    
    # Empty the S3 bucket first
    if ($S3_BUCKET) {
        Write-Host "Emptying S3 bucket ${S3_BUCKET}..." -ForegroundColor $Yellow
        aws s3 rm "s3://${S3_BUCKET}/" --recursive
    }
} catch {
    Write-Host "Could not get S3 bucket name from Terraform output. Continuing..." -ForegroundColor $Yellow
}

# Confirm before destroying resources
Write-Host "WARNING: This will destroy all resources created by Terraform." -ForegroundColor $Red
Write-Host "Are you sure you want to continue? (y/n)" -ForegroundColor $Yellow
$confirmation = Read-Host

if ($confirmation -ne "y") {
    Write-Host "Cleanup aborted." -ForegroundColor $Yellow
    exit 0
}

# Destroy all resources
Write-Host "Destroying all resources..." -ForegroundColor $Yellow
try {
    terraform destroy -auto-approve
    
    # Clean up local Terraform files
    Write-Host "Cleaning up local Terraform files..." -ForegroundColor $Yellow
    if (Test-Path -Path ".terraform") {
        Remove-Item -Path ".terraform" -Recurse -Force
    }
    if (Test-Path -Path "terraform.tfstate") {
        Remove-Item -Path "terraform.tfstate" -Force
    }
    if (Test-Path -Path "terraform.tfstate.backup") {
        Remove-Item -Path "terraform.tfstate.backup" -Force
    }
    
    Write-Host "Cleanup completed successfully!" -ForegroundColor $Green
} catch {
    Write-Host "Error during cleanup: $_" -ForegroundColor $Red
    exit 1
}