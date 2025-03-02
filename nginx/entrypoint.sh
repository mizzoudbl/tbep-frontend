#!/bin/sh

# Ensure AUTH_MAP is set
if [ -z "$AUTH_MAP" ]; then
    echo "AUTH_MAP is not set. Exiting..."
    exit 1
fi

# Clear the existing .htpasswd file
> /etc/nginx/.htpasswd

# Set IFS to ';' and split AUTH_MAP into key-value pairs
IFS=';'
for pair in $AUTH_MAP; do
    user=$(echo $pair | cut -d= -f1)
    password=$(echo $pair | cut -d= -f2)
    htpasswd -bB /etc/nginx/.htpasswd $user $password
done
echo "Updated .htpasswd file"

# Start Nginx
nginx -g "daemon off;"