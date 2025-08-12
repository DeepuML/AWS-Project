#!/bin/bash
# Script to deploy backend

set -e

# Colors for output
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${GREEN}Flex Fit App Backend Deployment Script${NC}"
echo -e "${YELLOW}This script will deploy the backend to the EC2 instance${NC}"
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

# Navigate to the infrastructure directory
cd "$(dirname "$0")/../infra"

# Check if terraform state exists
if [ ! -f "terraform.tfstate" ]; then
    echo -e "${RED}No terraform state found. Please run the deployment script first.${NC}"
    exit 1
fi

# Get EC2 instance public IP and RDS endpoint from Terraform output
EC2_IP=$(terraform output -raw ec2_public_ip)
RDS_ENDPOINT=$(terraform output -raw rds_endpoint)
RDS_USERNAME=$(grep -E "^db_username" terraform.tfvars | cut -d '=' -f2 | tr -d ' "')
RDS_PASSWORD=$(grep -E "^db_password" terraform.tfvars | cut -d '=' -f2 | tr -d ' "')
RDS_DB_NAME=$(grep -E "^db_name" terraform.tfvars | cut -d '=' -f2 | tr -d ' "' || echo "flexfitdb")
KEY_NAME=$(grep -E "^key_name" terraform.tfvars | cut -d '=' -f2 | tr -d ' "')

# Check if key file exists
KEY_FILE="$HOME/.ssh/${KEY_NAME}.pem"
if [ ! -f "$KEY_FILE" ]; then
    echo -e "${RED}SSH key file not found at $KEY_FILE${NC}"
    echo -e "${YELLOW}Please provide the path to your SSH key file:${NC}"
    read -r KEY_FILE
    if [ ! -f "$KEY_FILE" ]; then
        echo -e "${RED}SSH key file not found at $KEY_FILE${NC}"
        exit 1
    fi
fi

# Set proper permissions for key file
chmod 400 "$KEY_FILE"

# Navigate to the backend directory
cd "$(dirname "$0")/../backend"

# Create a temporary .env file for the backend
cat > .env << EOF
DATABASE_URL=postgresql://${RDS_USERNAME}:${RDS_PASSWORD}@${RDS_ENDPOINT}/${RDS_DB_NAME}
EOF

# Create a temporary docker-compose file for the backend
cat > docker-compose.yml << EOF
version: '3.8'

services:
  backend:
    build:
      context: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://${RDS_USERNAME}:${RDS_PASSWORD}@${RDS_ENDPOINT}/${RDS_DB_NAME}
    restart: always
EOF

# Create a deployment script to run on the EC2 instance
cat > deploy.sh << EOF
#!/bin/bash
set -e

# Install Docker and Docker Compose if not already installed
if ! command -v docker &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker ubuntu
    # Log out and log back in to apply group changes
    # For the script, we'll just use sudo for docker commands
fi

if ! command -v docker-compose &> /dev/null; then
    sudo apt-get install -y docker-compose
fi

# Create backend directory if it doesn't exist
mkdir -p ~/flex-fit/backend

# Copy files to the backend directory
cp -r . ~/flex-fit/backend/

# Navigate to the backend directory
cd ~/flex-fit/backend

# Build and start the backend container
sudo docker-compose down || true
sudo docker-compose build
sudo docker-compose up -d

echo "Backend deployed successfully!"
EOF

chmod +x deploy.sh

# Create a tar file with the backend files
tar -czf backend.tar.gz Dockerfile requirements.txt app/ .env docker-compose.yml deploy.sh

echo -e "${GREEN}Copying files to EC2 instance...${NC}"
# Copy the tar file to the EC2 instance
scp -i "$KEY_FILE" -o StrictHostKeyChecking=no backend.tar.gz ubuntu@${EC2_IP}:~/backend.tar.gz

echo -e "${GREEN}Deploying backend on EC2 instance...${NC}"
# SSH into the EC2 instance and deploy the backend
ssh -i "$KEY_FILE" -o StrictHostKeyChecking=no ubuntu@${EC2_IP} << 'ENDSSH'
# Extract the backend files
mkdir -p ~/backend
tar -xzf ~/backend.tar.gz -C ~/backend
cd ~/backend

# Run the deployment script
bash deploy.sh

# Clean up
rm -f ~/backend.tar.gz
ENDSSH

# Clean up local temporary files
rm -f .env docker-compose.yml deploy.sh backend.tar.gz

echo -e "${GREEN}Backend deployed successfully!${NC}"
echo -e "${GREEN}Backend API is available at: http://${EC2_IP}:8000${NC}"
echo -e "${GREEN}API documentation is available at: http://${EC2_IP}:8000/docs${NC}"
