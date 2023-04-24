import Image from 'next/image';
import { useEffect, useState } from 'react';

import CandyMachine from '@/components/CandyMachine';
import twitterLogo from '@/public/twitter-logo.svg';
import styles from '@/styles/Home.module.css';

// Constants
const TWITTER_HANDLE = 'ta_ka_sea0';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const Home = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString(),
          );

          /*
           * ユーザーの公開鍵を後から使える状態にします。
           */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      className={`${styles.ctaButton} ${styles.connectWalletButton}`}
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div>
          <p className={styles.header}>🍭 Candy Drop</p>
          <p className={styles.subText}>NFT drop machine with fair mint</p>
          {/* ウォレットアドレスを持っていない場合にのみ表示する条件を追加する */}
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        {/* Check for walletAddress and then pass in walletAddress */}
        {walletAddress && <CandyMachine walletAddress={window.solana} />}
        <div className={styles.footerContainer}>
          <Image
            alt="Twitter Logo"
            className={styles.twitterLogo}
            src={twitterLogo}
          />
          <a
            className={styles.footerText}
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </main>
  );
};
export default Home;
