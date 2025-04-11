import { GraphQLClient, gql } from 'graphql-request';
import Link from 'next/link';
import Image from 'next/image';

const NFT_CONTRACT_ADDRESS = '0xc9041f80dce73721a5f6a779672ec57ef255d27c';
const BALANCES_CONTRACT_ADDRESS = '0xd774557b647330c91bf44cfeab205095f7e6c367';
const OWNER_WALLET = '0xd00aE6F9eb43E90E2C6468Ab9A9faA7E4e9ec6d2';
const TOKEN_ID = '29';
const API_URL = 'https://api.onesource.io/v1/ethereum/graphql';

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
`;

type Thumbnail = {
  preset: string;
  status: string;
  url: string;
  width: number;
  height: number;
  contentType: string;
  createdAt: string;
};

type TokenImage = {
  status: string;
  url: string;
  contentType: string;
  width: number;
  height: number;
  thumbnails: Thumbnail[];
  createdAt: string;
  errorMsg?: string;
};

type NFTResponse = {
  token: {
    contract: {
      id: string;
      type: string;
      name: string;
      symbol: string;
      decimals: number;
    };
    tokenID: string;
    tokenURI: string;
    tokenURIStatus: string;
    image: TokenImage;
    createdAt: string;
    createdBlock: number;
  };
};

const GET_BALANCES_QUERY = gql`
  query GetBalancesByOwnerAndContract(
    $owner: ID!
    $contract: String!
    $first: Int = 10
    $skip: Int = 0
  ) {
    balances(
      owner: $owner
      first: $first
      skip: $skip
      where: { contract: $contract }
    ) {
      count
      remaining
      cursor
      balances {
        owner
        contractType
        contract {
          id
          type
          name
          symbol
        }
        token {
          tokenID
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
        }
        value
      }
    }
  }
`;

type Balance = {
  owner: string;
  contractType: string;
  contract: {
    id: string;
    type: string;
    name: string;
    symbol: string;
  };
  token: {
    tokenID: string;
    image: TokenImage;
  };
  value: string;
};

type BalancesResponse = {
  balances: {
    count: number;
    remaining: number;
    cursor: string;
    balances: Balance[];
  };
};

const getImageUrl = (imageUrl: string) => {
  if (!imageUrl) return '';
  
  // If URL is already complete
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If this is an IPFS hash
  if (imageUrl.startsWith('Qm')) {
    return `https://ipfs.io/ipfs/${imageUrl}`;
  }
  
  return imageUrl;
};

export default async function Home() {
  let nft: NFTResponse['token'] | null = null;
  let balances: Balance[] | null = null;
  let error = null;

  try {
    const graphQLClient = new GraphQLClient(API_URL, {
      headers: {
        'x-bp-token': process.env.BP_TOKEN!,
      },
    });

    // Fetch both NFT and balances data
    const [nftData, balancesData] = await Promise.all([
      graphQLClient.request<NFTResponse>(GET_TOKEN_QUERY, {
        contract: NFT_CONTRACT_ADDRESS,
        tokenID: TOKEN_ID,
      }),
      graphQLClient.request<BalancesResponse>(GET_BALANCES_QUERY, {
        owner: OWNER_WALLET,
        contract: BALANCES_CONTRACT_ADDRESS,
        first: 12,
        skip: 0,
      }),
    ]);

    nft = nftData.token;
    balances = balancesData.balances.balances;
  } catch (err) {
    console.error('Error fetching data:', err);
    error = 'Failed to fetch data';
  }

  if (error) return <div>Error: {error}</div>;
  if (!nft || !balances) return <div>No data found</div>;

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      {/* Single NFT section */}
      <h1 className='text-2xl font-bold mb-6'>
        {nft.contract.name} #{nft.tokenID}
      </h1>
      <div className="grid grid-cols-2 gap-6 items-start">
        {/* NFT Image */}
        <div>
          {nft.image && nft.image.status === 'OK' && (
            <div className='relative w-full aspect-square max-w-[220px]'>
              <Image
                src={nft.image.url}
                alt={`${nft.contract.name} #${nft.tokenID}`}
                fill
                priority
                className='rounded-lg shadow-md object-contain'
                sizes='(max-width: 768px) 50vw, 300px'
              />
            </div>
          )}
        </div>
        {/* NFT Details */}
        <div className='space-y-3'>
          <h2 className="text-xl font-bold mb-4">NFT Details</h2>
          <p>Token ID: {nft.tokenID}</p>
          <p>
            Contract: {nft.contract.name} ({nft.contract.symbol})
          </p>
          <p>Contract Address: {nft.contract.id}</p>
          <p>Token Type: {nft.contract.type}</p>
          <p>Created At: {new Date(nft.createdAt).toLocaleDateString()}</p>
          {nft.tokenURI && (
            <p>
              <Link
                href={nft.tokenURI}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:text-blue-800 underline'
              >
                View Token URI
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Balances section */}
      <div className='mt-8'>
        <h2 className='text-2xl font-bold mb-6'>Token Balances</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
          {balances.map((balance, index) => (
            <div key={index} className='p-5 border rounded-lg shadow-sm hover:shadow-md transition-shadow min-w-[380px]'>
              <div className='flex flex-col items-center'>
                {balance.token.image && balance.token.image.status === 'OK' && (
                  <div className='relative w-36 h-36 mb-4'>
                    <Image
                      src={getImageUrl(balance.token.image.url)}
                      alt={`Token ${balance.token.tokenID}`}
                      fill
                      className='rounded-lg object-contain'
                      sizes="(max-width: 768px) 144px, 144px"
                    />
                  </div>
                )}
                <p className='font-medium text-center text-base'>
                  {balance.contract.name} ({balance.contract.symbol})
                </p>
                <p className='text-sm mt-2'>Token ID: {balance.token.tokenID}</p>
                <p className='text-sm font-semibold'>Balance: {balance.value}</p>
                <p className='text-xs text-gray-600 mt-2 text-center break-all px-2'>
                  Owner: {balance.owner}
                </p>
                <p className='text-xs text-gray-600'>
                  Contract Type: {balance.contractType}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
