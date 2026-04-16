FROM node:lts-buster

# Clone bot from GitHub
RUN git clone https://github.com/codertz26-code/usb.git /root/usb

# Set working directory
WORKDIR /root/usb

# Install dependencies
RUN npm install && npm install -g pm2

# Expose port
EXPOSE 9090

# Start the bot
CMD ["npm", "start"]

