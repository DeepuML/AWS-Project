# PowerShell script to deploy backend to EC2 instance

# Colors for output
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"

Write-Host "Flex Fit App Backend Deployment Script" -ForegroundColor $Green
Write-Host "This script will deploy the backend to the EC2 instance" -ForegroundColor $Yellow
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
    Write-Host "No terraform state found. Please run the deployment script first." -ForegroundColor $Red
    exit 1
}

# Get EC2 instance public IP and RDS endpoint from Terraform output
$EC2_IP = terraform output -raw ec2_public_ip
$RDS_ENDPOINT = terraform output -raw rds_endpoint
$SSH_KEY_NAME = terraform output -raw ssh_key_name

# Check if SSH key exists
$sshKeyPath = "~/.ssh/${SSH_KEY_NAME}.pem"
if (-not (Test-Path -Path (Resolve-Path $sshKeyPath -ErrorAction SilentlyContinue))) {
    Write-Host "SSH key not found at $sshKeyPath" -ForegroundColor $Red
    Write-Host "Please provide the path to your SSH key:" -ForegroundColor $Yellow
    $sshKeyPath = Read-Host
    
    if (-not (Test-Path -Path $sshKeyPath)) {
        Write-Host "SSH key not found at $sshKeyPath" -ForegroundColor $Red
        exit 1
    }
}

# Create a temporary directory for deployment files
$tempDir = Join-Path $env:TEMP "flex-fit-backend-deploy"
if (Test-Path -Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Navigate to the project root directory
$projectRoot = Split-Path -Parent $scriptDir
Set-Location -Path $projectRoot

# Create a .env file for the backend
$envFile = Join-Path $tempDir ".env"
@"
DATABASE_URL=postgresql://postgres:postgres@${RDS_ENDPOINT}/postgres
"@ | Out-File -FilePath $envFile -Encoding utf8

# Create a docker-compose.yml file for the backend
$dockerComposeFile = Join-Path $tempDir "docker-compose.yml"
@"
version: '3'

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@${RDS_ENDPOINT}/postgres
    restart: always
"@ | Out-File -FilePath $dockerComposeFile -Encoding utf8

# Create a deployment script to run on the EC2 instance
$deployScriptFile = Join-Path $tempDir "deploy.sh"
@"
#!/bin/bash
set -e

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    sudo apt-get update
    sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu \$(lsb_release -cs) stable"
    sudo apt-get update
    sudo apt-get install -y docker-ce
    sudo usermod -aG docker \$USER
    sudo systemctl enable docker
    sudo systemctl start docker
fi

# Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-\$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Create app directory if it doesn't exist
mkdir -p ~/flex-fit-app

# Extract the backend files
tar -xzf backend.tar.gz -C ~/flex-fit-app

# Copy the .env and docker-compose.yml files
cp .env ~/flex-fit-app/
cp docker-compose.yml ~/flex-fit-app/

# Navigate to the app directory
cd ~/flex-fit-app

# Build and start the backend container
sudo docker-compose up -d --build

echo "Backend deployed successfully!"
"@ | Out-File -FilePath $deployScriptFile -Encoding utf8

# Package the backend files
Write-Host "Packaging backend files..." -ForegroundColor $Green
Set-Location -Path $projectRoot

# Create a tar archive of the backend directory
$backendDir = Join-Path $projectRoot "backend"
$backendTarFile = Join-Path $tempDir "backend.tar.gz"

# For Windows, we need to use 7-Zip or similar to create a tar.gz file
# Check if 7-Zip is installed
if (Get-Command 7z -ErrorAction SilentlyContinue) {
    # First create a tar file
    7z a -ttar "$tempDir\backend.tar" "$backendDir\*"
    # Then compress it to gzip
    7z a -tgzip "$backendTarFile" "$tempDir\backend.tar"
    Remove-Item -Path "$tempDir\backend.tar" -Force
} else {
    # If 7-Zip is not available, try to use tar command if available (Windows 10 1803+)
    if (Get-Command tar -ErrorAction SilentlyContinue) {
        Set-Location -Path $backendDir
        tar -czf $backendTarFile *
        Set-Location -Path $projectRoot
    } else {
        Write-Host "Neither 7-Zip nor tar command is available. Please install 7-Zip or use Windows 10 1803+." -ForegroundColor $Red
        exit 1
    }
}

# Copy files to the EC2 instance
Write-Host "Copying files to EC2 instance..." -ForegroundColor $Green

# Use SCP to copy the files
$scpCommand = "scp -i `"$sshKeyPath`" -o StrictHostKeyChecking=no `"$backendTarFile`" `"$envFile`" `"$dockerComposeFile`" `"$deployScriptFile`" ubuntu@${EC2_IP}:~"
Invoke-Expression $scpCommand

# SSH into the EC2 instance and run the deployment script
Write-Host "Deploying backend on EC2 instance..." -ForegroundColor $Green
$sshCommand = "ssh -i `"$sshKeyPath`" -o StrictHostKeyChecking=no ubuntu@${EC2_IP} 'chmod +x ~/deploy.sh && ~/deploy.sh'"
Invoke-Expression $sshCommand

Write-Host "Backend deployed successfully!" -ForegroundColor $Green
Write-Host "Backend API is available at: http://${EC2_IP}:8000" -ForegroundColor $Green

# Clean up temporary files
Remove-Item -Path $tempDir -Recurse -Force