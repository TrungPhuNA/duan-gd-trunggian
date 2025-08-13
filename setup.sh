#!/bin/bash

# SafeTrade Setup Script
# This script sets up the development environment for SafeTrade

set -e

echo "🚀 SafeTrade Setup Script"
echo "========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_nodejs() {
    print_status "Checking Node.js installation..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed: $NODE_VERSION"
        
        # Check if version is >= 16
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$MAJOR_VERSION" -lt 16 ]; then
            print_error "Node.js version 16 or higher is required. Current version: $NODE_VERSION"
            exit 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 16+ first."
        exit 1
    fi
}

# Check if MySQL is installed
check_mysql() {
    print_status "Checking MySQL installation..."
    if command -v mysql &> /dev/null; then
        MYSQL_VERSION=$(mysql --version)
        print_success "MySQL is installed: $MYSQL_VERSION"
    else
        print_warning "MySQL is not installed. Please install MySQL 8.0+ for production."
        print_status "For development, you can use a cloud database or Docker."
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    
    # Install root dependencies
    print_status "Installing root dependencies..."
    npm install
    
    # Install server dependencies
    print_status "Installing server dependencies..."
    cd server && npm install && cd ..
    
    # Install client dependencies
    print_status "Installing client dependencies..."
    cd client && npm install --legacy-peer-deps && cd ..
    
    print_success "All dependencies installed successfully!"
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Server environment
    if [ ! -f "server/.env" ]; then
        cp server/.env.example server/.env
        print_success "Created server/.env from example"
        print_warning "Please update server/.env with your database credentials"
    else
        print_warning "server/.env already exists, skipping..."
    fi
    
    # Client environment
    if [ ! -f "client/.env" ]; then
        cp client/.env.example client/.env
        print_success "Created client/.env from example"
    else
        print_warning "client/.env already exists, skipping..."
    fi
}

# Setup database (optional)
setup_database() {
    print_status "Database setup..."
    
    read -p "Do you want to setup the database now? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Setting up database..."
        
        # Check if .env exists and has database config
        if [ -f "server/.env" ]; then
            cd server
            
            # Run migrations
            print_status "Running database migrations..."
            npm run db:migrate
            
            # Seed data
            print_status "Seeding initial data..."
            npm run db:seed
            
            cd ..
            print_success "Database setup completed!"
        else
            print_error "Please configure server/.env first"
            exit 1
        fi
    else
        print_warning "Skipping database setup. Run 'npm run db:setup' later."
    fi
}

# Build client
build_client() {
    print_status "Building React client..."
    cd client && npm run build && cd ..
    print_success "Client built successfully!"
}

# Main setup function
main() {
    echo
    print_status "Starting SafeTrade setup..."
    echo
    
    # Check prerequisites
    check_nodejs
    check_mysql
    
    echo
    
    # Install dependencies
    install_dependencies
    
    echo
    
    # Setup environment
    setup_environment
    
    echo
    
    # Setup database
    setup_database
    
    echo
    
    # Build client
    build_client
    
    echo
    print_success "🎉 SafeTrade setup completed successfully!"
    echo
    echo "Next steps:"
    echo "1. Update server/.env with your database credentials"
    echo "2. Run 'npm run dev' to start development servers"
    echo "3. Visit http://localhost:3000 to see the application"
    echo
    echo "Demo accounts:"
    echo "- Admin: admin / admin123456"
    echo "- Buyer: 0901234567 / 123456"
    echo "- Seller: 0907654321 / 123456"
    echo
    echo "Documentation: docs/"
    echo "API Docs: http://localhost:5000/api"
    echo
}

# Run main function
main
