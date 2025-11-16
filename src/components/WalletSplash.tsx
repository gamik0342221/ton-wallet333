import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import SeedImportModal from './SeedImportModal';

interface TonPrice {
  price: number;
  change24h: number;
}

const WalletSplash: React.FC = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importButtonPressed, setImportButtonPressed] = useState(false);
  const [createButtonPressed, setCreateButtonPressed] = useState(false);
  const [tonPrice, setTonPrice] = useState<TonPrice | null>(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);

  // Fetch TON price from CoinGecko API
  useEffect(() => {
    const fetchTonPrice = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd&include_24hr_change=true'
        );
        const data = await response.json();
        
        if (data['the-open-network']) {
          setTonPrice({
            price: data['the-open-network'].usd,
            change24h: data['the-open-network'].usd_24h_change || 0
          });
        }
        setIsLoadingPrice(false);
      } catch (error) {
        console.error('Error fetching TON price:', error);
        setIsLoadingPrice(false);
      }
    };

    // Fetch immediately
    fetchTonPrice();

    // Update every 30 seconds
    const interval = setInterval(fetchTonPrice, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleImportWallet = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Import wallet clicked');
    setImportButtonPressed(true);
    setTimeout(() => {
      setIsImportModalOpen(true);
      setImportButtonPressed(false);
    }, 300);
  };

  const handleCreateWallet = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Create wallet clicked');
    setCreateButtonPressed(true);
    setTimeout(() => {
      window.location.href = 'https://tonkeeper.com';
    }, 300);
  };

  const socialLinks = [
    {
      name: 'Telegram',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.121.099.154.232.17.325.016.093.036.305.02.472z"/>
        </svg>
      ),
      url: 'https://t.me/toncoin',
      color: 'hover:text-[#0088cc]'
    },
    {
      name: 'GitHub',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      ),
      url: 'https://github.com/ton-blockchain',
      color: 'hover:text-gray-300'
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      url: 'https://www.facebook.com/toncoin',
      color: 'hover:text-[#1877f2]'
    },
    {
      name: 'Twitter',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      url: 'https://twitter.com/ton_blockchain',
      color: 'hover:text-white'
    }
  ];

  return (
    <>
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0088cc] via-[#005599] to-[#003366] flex items-center justify-center">
        {/* TON Price Widget - Top Right - Mobile Optimized */}
        <div className="absolute top-3 right-3 sm:top-6 sm:right-6 z-20 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-6 sm:py-4 shadow-xl">
            {isLoadingPrice ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 sm:w-8 sm:h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-white/60 text-xs sm:text-sm">Loading...</span>
              </div>
            ) : tonPrice ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <svg viewBox="0 0 56 56" className="w-6 h-6 sm:w-8 sm:h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z" fill="#0088CC"/>
                    <path d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644 42.9409C27.0345 44.2765 28.9644 44.2765 29.7345 42.9409L41.5357 22.4861C43.3045 19.4202 41.0761 15.6277 37.5603 15.6277Z" fill="white"/>
                  </svg>
                  <div className="hidden sm:flex flex-col">
                    <span className="text-white font-bold text-sm sm:text-lg">TON</span>
                    <span className="text-white/60 text-xs">Toncoin</span>
                  </div>
                </div>
                <div className="h-6 sm:h-8 w-px bg-white/20 hidden sm:block"></div>
                <div className="flex flex-col items-end">
                  <span className="text-white font-bold text-sm sm:text-xl">
                    ${tonPrice.price.toFixed(4)}
                  </span>
                  <span className={`text-xs font-semibold flex items-center gap-1 ${
                    tonPrice.change24h >= 0 ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {tonPrice.change24h >= 0 ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    {Math.abs(tonPrice.change24h).toFixed(2)}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-white/60 text-xs sm:text-sm">Unable to load</div>
            )}
          </div>
        </div>

        {/* Animated background elements - TON style */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[600px] sm:h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>

        {/* Main content - Mobile Optimized */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 text-center max-w-2xl w-full">
          {/* TON Official Logo - Mobile Optimized */}
          <div className="mb-6 sm:mb-8 relative">
            <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 relative animate-float">
              {/* Official TON Logo */}
              <svg 
                viewBox="0 0 56 56" 
                className="w-full h-full drop-shadow-2xl"
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z" 
                  fill="#0088CC"
                />
                <path 
                  d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644 42.9409C27.0345 44.2765 28.9644 44.2765 29.7345 42.9409L41.5357 22.4861C43.3045 19.4202 41.0761 15.6277 37.5603 15.6277Z" 
                  fill="white"
                />
              </svg>
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-cyan-400/30 rounded-full blur-2xl animate-pulse"></div>
          </div>

          {/* Title - Mobile Optimized */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 font-heading drop-shadow-lg animate-fade-in">
            TON Wallet
          </h1>
          
          {/* Subtitle - Mobile Optimized */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-8 sm:mb-10 md:mb-12 font-light animate-fade-in-delay px-2">
            Управляйте вашими криптоактивами безопасно
          </p>

          {/* Buttons - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md animate-slide-up px-2">
            {/* Import Wallet - White Button */}
            <Button
              type="button"
              onClick={handleImportWallet}
              size="lg"
              className={`
                group flex-1 relative overflow-hidden
                bg-white hover:bg-gray-50
                text-[#0088cc] hover:text-[#006699]
                border-0
                transition-all duration-500
                text-base sm:text-lg py-5 sm:py-6 font-button font-bold
                shadow-2xl hover:shadow-3xl
                rounded-xl sm:rounded-2xl
                min-h-[56px] sm:min-h-[64px]
                touch-manipulation
                ${importButtonPressed ? 'scale-95 shadow-inner' : 'active:scale-95 sm:hover:scale-105'}
              `}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Import Wallet
              </span>
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
              
              {/* Ripple effect on click */}
              {importButtonPressed && (
                <span className="absolute inset-0 bg-[#0088cc]/20 rounded-xl sm:rounded-2xl animate-ping pointer-events-none"></span>
              )}
            </Button>
            
            {/* Create Wallet - Glass Button */}
            <Button
              type="button"
              onClick={handleCreateWallet}
              variant="outline"
              size="lg"
              className={`
                group flex-1 relative overflow-hidden
                bg-white/10 hover:bg-white/20
                backdrop-blur-md
                text-white
                border-2 border-white/30 hover:border-white/50
                transition-all duration-500
                text-base sm:text-lg py-5 sm:py-6 font-button font-bold
                shadow-xl hover:shadow-2xl
                rounded-xl sm:rounded-2xl
                min-h-[56px] sm:min-h-[64px]
                touch-manipulation
                ${createButtonPressed ? 'scale-95 shadow-inner' : 'active:scale-95 sm:hover:scale-105'}
              `}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Wallet
              </span>
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
              
              {/* Glass shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
              
              {/* Ripple effect on click */}
              {createButtonPressed && (
                <span className="absolute inset-0 bg-white/30 rounded-xl sm:rounded-2xl animate-ping pointer-events-none"></span>
              )}
            </Button>
          </div>

          {/* TON Branding - Mobile Optimized */}
          <div className="mt-8 sm:mt-10 md:mt-12 flex items-center gap-2 text-white/60 text-xs sm:text-sm animate-fade-in-delay-2">
            <svg viewBox="0 0 56 56" className="w-4 h-4 sm:w-5 sm:h-5 opacity-60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z" fill="currentColor"/>
              <path d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644 42.9409C27.0345 44.2765 28.9644 44.2765 29.7345 42.9409L41.5357 22.4861C43.3045 19.4202 41.0761 15.6277 37.5603 15.6277Z" fill="#0088CC"/>
            </svg>
            <span className="hidden sm:inline">Powered by The Open Network</span>
            <span className="sm:hidden">Powered by TON</span>
          </div>

          {/* Social Media Icons - Mobile Optimized */}
          <div className="mt-6 sm:mt-8 flex items-center justify-center gap-4 sm:gap-6 animate-fade-in-delay-2">
            {socialLinks.map((social, index) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  relative group
                  text-white/60 ${social.color}
                  transition-all duration-300
                  active:scale-110 sm:hover:scale-125 sm:hover:-translate-y-1
                  touch-manipulation
                  p-2 -m-2
                `}
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                aria-label={social.name}
              >
                <div className="relative">
                  {social.icon}
                  {/* Glow effect on hover/touch */}
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Floating particles - Reduced on mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-white/20 rounded-full animate-float-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Import Modal */}
      <SeedImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
      />
    </>
  );
};

export default WalletSplash;
