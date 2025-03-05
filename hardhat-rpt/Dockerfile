ARG NODE_VERSION=18.20.7
FROM node:${NODE_VERSION}-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
RUN apk add --no-cache python3 g++ make
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci
COPY . .
RUN npm install -g typescript ts-node
RUN npx hardhat compile
EXPOSE 8545
CMD ["sh", "-c", "npx hardhat node & ts-node scripts/deploy.ts"]