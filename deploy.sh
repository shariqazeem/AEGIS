#!/bin/bash
# =============================================================================
# AEGIS Web Sentinel - Ubuntu Deployment Script
# =============================================================================
# This script deploys AEGIS on Ubuntu with Docker and nginx
#
# Usage:
#   ./deploy.sh              # Deploy without SSL (HTTP only)
#   ./deploy.sh --ssl        # Deploy with SSL (requires domain)
#   ./deploy.sh --ssl yourdomain.com
#
# Prerequisites:
#   - Ubuntu 20.04+ server
#   - Docker and Docker Compose installed
#   - Port 80 (and 443 for SSL) open in firewall
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║     █████╗ ███████╗ ██████╗ ██╗███████╗                         ║"
echo "║    ██╔══██╗██╔════╝██╔════╝ ██║██╔════╝                         ║"
echo "║    ███████║█████╗  ██║  ███╗██║███████╗                         ║"
echo "║    ██╔══██║██╔══╝  ██║   ██║██║╚════██║                         ║"
echo "║    ██║  ██║███████╗╚██████╔╝██║███████║                         ║"
echo "║    ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝                         ║"
echo "║                                                                  ║"
echo "║           Ubuntu Deployment Script                               ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${YELLOW}Docker not found. Installing Docker...${NC}"
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        rm get-docker.sh
        echo -e "${GREEN}Docker installed successfully!${NC}"
    else
        echo -e "${GREEN}✓ Docker is installed${NC}"
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        echo -e "${YELLOW}Docker Compose not found. Installing...${NC}"
        sudo apt-get update
        sudo apt-get install -y docker-compose-plugin
    else
        echo -e "${GREEN}✓ Docker Compose is available${NC}"
    fi
}

# Create necessary directories
setup_directories() {
    echo -e "${YELLOW}Setting up directories...${NC}"
    mkdir -p nginx/ssl
    mkdir -p certbot/www
    mkdir -p certbot/conf
    echo -e "${GREEN}✓ Directories created${NC}"
}

# Deploy without SSL
deploy_http() {
    echo -e "${YELLOW}Deploying AEGIS (HTTP mode)...${NC}"

    # Build and start containers
    docker compose up -d --build aegis nginx

    echo -e "${GREEN}"
    echo "════════════════════════════════════════════════════════════════"
    echo "  AEGIS Web Sentinel is now running!"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "  Access your demo at: http://$(curl -s ifconfig.me)"
    echo "  Or locally at: http://localhost"
    echo ""
    echo "  View logs: docker compose logs -f aegis"
    echo "  Stop: docker compose down"
    echo ""
    echo -e "${NC}"
}

# Deploy with SSL
deploy_ssl() {
    DOMAIN=$1

    if [ -z "$DOMAIN" ]; then
        echo -e "${RED}Error: Domain name required for SSL deployment${NC}"
        echo "Usage: ./deploy.sh --ssl yourdomain.com"
        exit 1
    fi

    echo -e "${YELLOW}Deploying AEGIS with SSL for domain: $DOMAIN${NC}"

    # Update nginx config with domain
    sed -i "s/yourdomain.com/$DOMAIN/g" nginx/nginx.conf

    # Start containers to get initial certificate
    echo -e "${YELLOW}Starting services for SSL certificate...${NC}"
    docker compose up -d aegis nginx

    # Get SSL certificate
    echo -e "${YELLOW}Obtaining SSL certificate...${NC}"
    docker compose run --rm certbot certonly --webroot \
        --webroot-path=/var/www/certbot \
        --email admin@$DOMAIN \
        --agree-tos \
        --no-eff-email \
        -d $DOMAIN

    # Enable HTTPS in nginx config
    echo -e "${YELLOW}Enabling HTTPS configuration...${NC}"
    # Uncomment the HTTPS server block in nginx.conf
    sed -i 's/# server {$/server {/' nginx/nginx.conf
    sed -i 's/#     listen 443/    listen 443/' nginx/nginx.conf

    # Restart nginx with SSL
    docker compose restart nginx

    # Start certbot for auto-renewal
    docker compose --profile ssl up -d certbot

    echo -e "${GREEN}"
    echo "════════════════════════════════════════════════════════════════"
    echo "  AEGIS Web Sentinel is now running with SSL!"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "  Access your demo at: https://$DOMAIN"
    echo ""
    echo "  View logs: docker compose logs -f aegis"
    echo "  Stop: docker compose down"
    echo ""
    echo -e "${NC}"
}

# Main script
main() {
    check_docker
    setup_directories

    if [ "$1" == "--ssl" ]; then
        deploy_ssl $2
    else
        deploy_http
    fi
}

main "$@"
