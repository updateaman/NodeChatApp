FROM node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

#EXPOSE 80
#EXPOSE 3000
ENTRYPOINT ["npm", "start"]