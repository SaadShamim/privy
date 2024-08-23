'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';

import { useSearchParams } from 'next/navigation';

const DisconnectClient = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const address = searchParams.get('address');

  const [userData, setUserData] = useState(null);
  const { unlinkEmail, unlinkWallet, unlinkPhone, unlinkGoogle, unlinkTwitter, unlinkDiscord } = usePrivy();

  //   useEffect(() => {
  //     const type = searchParams.get('type');
  //     const address = searchParams.get('address');
  //     const usernameOrId = searchParams.get('usernameOrId');

  //     if (type) {
  //       if (type === 'wallet' && address) {
  //         unlinkWallet(address);
  //       } else if (usernameOrId) {
  //         switch (type) {
  //           case 'email':
  //             unlinkEmail(usernameOrId);
  //             break;
  //           case 'phone':
  //             unlinkPhone(usernameOrId);
  //             break;
  //           case 'google':
  //             unlinkGoogle(usernameOrId);
  //             break;
  //           case 'twitter':
  //             unlinkTwitter(usernameOrId);
  //             break;
  //           case 'discord':
  //             unlinkDiscord(usernameOrId);
  //             break;
  //           default:
  //             console.log(`No action for type: ${type}`);
  //         }
  //       }
  //     }
  //   }, [searchParams, unlinkWallet, unlinkEmail, unlinkPhone, unlinkGoogle, unlinkTwitter, unlinkDiscord]);

  return (
    <div>
      <p>Type: {type}</p>
      <p>Address: {address}</p>
    </div>
  );
};

export default DisconnectClient;
