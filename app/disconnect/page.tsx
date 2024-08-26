'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const DisconnectClient = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const address = searchParams.get('address');
  const [unlinked, setUnlinked] = useState(false);

  const { ready, authenticated, user, unlinkEmail, unlinkWallet, unlinkPhone, unlinkGoogle, unlinkTwitter, unlinkDiscord } = usePrivy();

  useEffect(() => {
    const type = searchParams.get('type');
    const address = searchParams.get('address');
    const usernameOrId = searchParams.get('usernameOrId');

    if (!user || unlinked) {
      console.log('No user');
      return;
    }

    if (type) {
      if (type === 'wallet' && address) {
        console.log('unlinkWallet');
        const data = unlinkWallet(address);
        console.log('data');
        console.log(data);
        setUnlinked(true);
      } else if (usernameOrId) {
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
          default:
            console.log(`No action for type: ${type}`);
        }
      }
    }
  }, [user, searchParams, unlinkWallet, unlinkEmail, unlinkPhone, unlinkGoogle, unlinkTwitter, unlinkDiscord]);

  return (
    <>
      <div>Type: {type}</div>
      <div>Address: {address}</div>
    </>
  );
};

export default DisconnectClient;
