// app/page.tsx
import { GraphQLClient, gql } from 'graphql-request'
import Link from 'next/link'
import Image from 'next/image'

const CONTRACT = '0xc9041f80dce73721a5f6a779672ec57ef255d27c'
const TOKEN_ID = '29'
const API_URL = 'https://api.onesource.io/v1/ethereum/graphql'

const GET_TOKEN_QUERY = gql`
  query GetTokenWithImage($contract: ID!, $tokenID: ID!) {
    token(contract: $contract, tokenID: $tokenID) {
      contract {
        id
        type
        name
        symbol
        decimals
      }
      tokenID
      tokenURI
      tokenURIStatus
      image {
        status
        url
        contentType
        width
        height
        thumbnails {
          preset
          status
          url
          width
          height
          contentType
          createdAt
        }
        createdAt
        errorMsg
      }
      createdAt
      createdBlock
    }
  }
`

type Thumbnail = {
  preset: string
  status: string
  url: string
  width: number
  height: number
  contentType: string
  createdAt: string
}

type TokenImage = {
  status: string
  url: string
  contentType: string
  width: number
  height: number
  thumbnails: Thumbnail[]
  createdAt: string
  errorMsg?: string
}

type NFTResponse = {
  token: {
    contract: {
      id: string
      type: string
      name: string
      symbol: string
      decimals: number
    }
    tokenID: string
    tokenURI: string
    tokenURIStatus: string
    image: TokenImage
    createdAt: string
    createdBlock: number
  }
}

export default async function Home() {
  let nft: NFTResponse['token'] | null = null
  let error = null

  try {
    const graphQLClient = new GraphQLClient(API_URL, {
      headers: {
        'x-bp-token': process.env.BP_TOKEN!,
      },
    })

    const data = await graphQLClient.request<NFTResponse>(GET_TOKEN_QUERY, {
      contract: CONTRACT,
      tokenID: TOKEN_ID,
    })

    nft = data.token
  } catch (err) {
    console.error('Error fetching NFT:', err)
    error = 'Failed to fetch NFT'
  }

  if (error) return <div>Error: {error}</div>
  if (!nft) return <div>No NFT data found</div>

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{nft.contract.name} #{nft.tokenID}</h1>

      {nft.image && nft.image.status === 'OK' && (
        <div className="my-8 relative w-[150px] h-[150px]">
          <Image
            src={nft.image.url}
            alt={`${nft.contract.name} #${nft.tokenID}`}
            fill
            className="rounded-lg shadow-md object-contain"
            sizes="150px"
          />
        </div>
      )}

      <div className="mt-4 space-y-2">
        <p>Token ID: {nft.tokenID}</p>
        <p>Contract: {nft.contract.name} ({nft.contract.symbol})</p>
        <p>Token Type: {nft.contract.type}</p>
        <p>Created At: {new Date(nft.createdAt).toLocaleDateString()}</p>
        {nft.tokenURI && (
          <p>
            <Link
              href={nft.tokenURI}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              View Token URI
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}



