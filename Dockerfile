FROM node:lts-buster

# Clone bot from GitHub
RUN git clone https://github.com/Sila-Md/SILA-MD.git /root/SILA-MD

# Set working directory
WORKDIR /root/SILA-MD

# Install dependencies
RUN npm install && npm install -g pm2

# Expose port
EXPOSE 9090

# Start the bot
CMD ["npm", "start"]

