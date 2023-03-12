import React, { FC, useState } from 'react'
import { ethers } from 'ethers'
import { ArgentLoginButton, IEthereumProvider } from '@argent/login-react'

export const ArgentLogin: FC = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>()

  const handleConnect = async (ethereumProvider: IEthereumProvider) => {
    const provider = new ethers.providers.Web3Provider(ethereumProvider)
    setProvider(provider)
  }

  const handleDisconnect = async () => {
    localStorage.removeItem('walletconnect') // to make sure WC is disconnected
    setProvider(undefined)
  }

  //   id: 0,  // product id must be unique
  //   favorite: false,   // must be false (to be added it to the wishlist )
  //   name: 'Pure Color Revitalizing Crystal Balm',  // product name
  //   image:
  //     'https://www.esteelauder.com/media/export/cms/products/640x640/el_sku_PLT202_640x640_0.jpg',   // product image
  //   price: '36.00',
  //   company: 'Estee Lauder',  // product company
  //   description: 'Mood-boosting shades. All-day lip plumping hydration.',  // product desc
  //   rating: '4.5',  // product rating (since we don't have a rating system  hard coded for now )
  //   reviews_number: '41', // product reviews_number (since we don't have a rating system  hard coded for now )
  //   accesibility: true,  // is the product marked as a product dfor people with disabilities
  //   detail: {
  //     what_it_is:
  //       'A creamy, tinted lip balm, infused with 92% naturally derived ingredients that is inspired by powerful crystal energy. Revitalizes with all-day lip plumping hydration.',
  //     formulation_type: 'Lip Balm & Treatment',
  //     benefits: 'Hydrating and Soothing',
  //     coverage: 'Sheer buildable coverage',
  //   },
  //   colors: [
  //     {
  //       color: 'DFA096',
  //       color_description: 'Sheer peach nude with a crystalline shimmer',
  //     },
  //     {
  //       color: 'D12946',
  //       color_description: 'TO BE ADD IT',
  //     },

  //     {
  //       color: 'E52136',
  //       color_description: 'TO BE ADD IT',
  //     },
  //     {
  //       color: 'AD0A48',
  //       color_description: 'TO BE ADD IT',
  //     },
  //     {
  //       color: '623735',
  //       color_description: 'TO BE ADD IT',
  //     },
  //     {
  //       color: '5B1D2D',
  //       color_description: 'TO BE ADD IT',
  //     },
  //   ],
  //   ingredients_info:
  //     'Includes 92% naturally derived ingredients. Using the ISO Standard, from plants, non-petroleum minerals, or water.',
  //   ingredients: [
  //     'Ricinus Communis (Castor) Seed Oil',
  //     'Glyceryl Triacetyl Ricinoleate',
  //     'Cety Ricinoleate',
  //     'Euphorbia Cerifera (Candelilla) ',
  //     'WaxCandelilla CeraCire De Candelilla',
  //     'Bis-Diglyceryl Polyacyladipate-2',
  //     'Copernicia Cerifera (Carnauba) Wax',
  //   ],
  //   usage_info: 'Glide effortlessly over top and bottom lips.',
  //   usage_steps: [
  //     'Apply once for sheer, revitalizing color.',
  //     'Repeat to amplify the color impact for a hint of mood-boosting tint.',
  //     'Touch on to revitalize lips throughout the day.',
  //   ],
  //   packaging: {
  //     size: ' 0.11 oz.',
  //     shape: 'Square curved shape lipstick case with slim ring',
  //   },
  //   'q&a': [
  //     {
  //       question:
  //         'A few years ago, they included a regular size lipstick in their give-a-ways. It is kinda a golden coral. By any chance, does anyone know the shade name?',
  //       author: 'Sher',
  //       created_date: '7 months ago',
  //       replier: 'Meredith',
  //       response:
  //         'Thanks for your question, Sher! There are a few options, and we would love to help you find that shade, or one that is similar. To chat live with our team of Beauty Advisors, click here: https://estee.cm/LiveChatUS. You can even upload a photo or video chat!',
  //     },
  //   ],
  //   similar_products: [
  //     {
  //       image:
  //         'https://www.esteelauder.com/media/export/cms/products/640x640/el_sku_PLT202_640x640_0.jpg',
  //       name: 'Pure Color Envy Lip Repair Potion',
  //       price: '36',
  //     },
  //     {
  //       image:
  //         'https://www.esteelauder.com/media/export/cms/products/640x640/el_sku_PN0L09_640x640_0.jpg',
  //       name: 'Whipped Matte Lip Color with Moringa Butte',
  //       price: '36',
  //     },
  //   ],
  // },
  return (
    <div>
      {!provider ? (
        <ArgentLoginButton
          options={{
            chainId: 280,
            rpcUrl: 'https://zksync2-testnet.zksync.dev',
          }}
          onConnect={handleConnect}
          onError={console.error}
        />
      ) : (
        <>
          <h2>Connected as {provider.getSigner()._address}</h2>
          <p>
            <button onClick={handleDisconnect}>Disconnect</button>
          </p>
        </>
      )}
    </div>
  )
}
