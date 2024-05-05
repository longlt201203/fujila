FROM node:18
WORKDIR /app
COPY . .
RUN yarn
RUN yarn deploy-commands
CMD ["yarn", "start"]