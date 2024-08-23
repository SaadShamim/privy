'use client';

import { useLogin, usePrivy } from '@privy-io/react-auth';
import WebApp from '@twa-dev/sdk';
import axios from 'axios';
import { read } from 'fs';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

export default function Disconnect() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Use useSearchParams to access query parameters

  const [userData, setUserData] = useState<UserData | null>(null);
  const { ready, authenticated, user } = usePrivy();
  const {
    logout,
    linkEmail,
    linkWallet,
    unlinkEmail,
    linkPhone,
    unlinkPhone,
    unlinkWallet,
    linkGoogle,
    unlinkGoogle,
    linkTwitter,
    unlinkTwitter,
    linkDiscord,
    unlinkDiscord,
    linkFarcaster,
  } = usePrivy();

  console.log(ready);

  useEffect(() => {
    // Extract the type and any other query parameters from the URL
    const type = searchParams.get('type') as string;
    const address = searchParams.get('address') as string;
    const usernameOrId = searchParams.get('usernameOrId') as string;
    // Debugging logs

    console.log('Extracted type:', type);
    console.log('Extracted address:', address);
    console.log('Extracted usernameOrId:', usernameOrId);

    if (type) {
      console.log(`Disconnect type: ${type}`);

      // Perform any necessary action based on the disconnect type
      if (type === 'wallet' && address) {
        console.log(`Unlinking wallet with address: ${address}`);
        unlinkWallet(address);
      } else if (usernameOrId) {
        console.log(`Unlinking account of type: ${type} with identifier: ${usernameOrId}`);
        switch (type) {
          case 'email':
            unlinkEmail(usernameOrId);
            break;
          case 'phone':
            unlinkPhone(usernameOrId);
            break;
          case 'google':
            unlinkGoogle(usernameOrId);
            break;
          case 'twitter':
            unlinkTwitter(usernameOrId);
            break;
          case 'discord':
            unlinkDiscord(usernameOrId);
            break;
          // Add more cases as necessary
          default:
            console.log(`No action for type: ${type}`);
        }
      }
    }
  }, [searchParams, unlinkWallet, unlinkEmail, unlinkPhone, unlinkGoogle, unlinkTwitter, unlinkDiscord]);

  return <main>Disconnect</main>;
}