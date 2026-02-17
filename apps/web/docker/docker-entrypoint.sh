#!/bin/sh
# docker-entrypoint.sh

set -e

echo "Setting up runtime configuration..."

# Replace placeholders in config.js with actual environment variables
if [ -f /usr/share/nginx/html/config.js ]; then
    # Replace SERVER_URL placeholder
    if [ -n "$SERVER_URL" ]; then
        sed -i "s|__SERVER_URL__|$SERVER_URL|g" /usr/share/nginx/html/config.js
    fi
    
    # Replace ENV placeholder
    if [ -n "$ENV" ]; then
        sed -i "s|__ENV__|$ENV|g" /usr/share/nginx/html/config.js
    fi
fi

# Start nginx
exec "$@"




# docker run --rm -p 3001:80 -e SERVER_URL="http://localhost:3000" -e ENV="development" myapp
# docker run --rm -p 3001:80 -e SERVER_URL="http://localhost:3000" -e ENV="staging" myapp
# docker run --rm -p 3001:80 -e SERVER_URL="http://localhost:3000" -e ENV="production" myapp