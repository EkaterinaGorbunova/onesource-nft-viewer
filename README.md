# OneSource NFT Viewer

A Next.js application for viewing NFT metadata and images using the OneSource GraphQL API. This project demonstrates how to fetch and display NFT information including token details, contract information, and associated images.

## Features

- NFT metadata display
- Token image rendering
- Contract information viewing
- GraphQL integration with OneSource API
- TypeScript support


## Technology Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [GraphQL](https://graphql.org/) - API queries
- [GraphQL Request](https://github.com/prisma-labs/graphql-request) - GraphQL client
- [OneSource API](https://docs.onesource.io) - NFT data provider
  - Comprehensive NFT metadata
  - Token information
  - Contract details
  - High-quality NFT images
  - Real-time blockchain data

## Prerequisites
- Node.js (version 18.18.0 or higher)
- npm package manager

## Environment Setup

1. Create a `.env` file in the root directory:
```bash
BP_TOKEN=your_onesource_api_token_here
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/EkaterinaGorbunova/onesource-nft-viewer.git
cd onesource-nft-viewer
```

2. Install dependencies:
```bash
npm install
```

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

```bash
npm run build
```

Then start the production server:

```bash
npm run start
```

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Main NFT viewer page
│   │   └── globals.css   # Global styles
├── public/              # Static assets
├── next.config.ts      # Next.js configuration
└── tsconfig.json       # TypeScript configuration
```