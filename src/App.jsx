import React, { useState, useEffect, useRef } from 'react';
import { Zap, Shield, Layers, Globe, ChevronRight, Wallet, X } from 'lucide-react';

// Fade-in wrapper component
const FadeInWrapper = ({ children, duration = 0.8, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity ${duration}s ease, transform ${duration}s ease`,
      }}
    >
      {children}
    </div>
  );
};

// Enhanced Loading Screen Component
const LoadingScreen = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 10;
        });
      }, 120);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-50 flex items-center justify-center">
      {/* Sophisticated animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'pulse 4s ease-in-out infinite alternate'
          }}></div>
          
          {/* Subtle gradient orbs */}
          <div className="absolute top-1/3 left-1/5 w-72 h-72 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/5 w-72 h-72 bg-gradient-to-l from-gray-300/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
      
      <div className="text-center relative z-10 max-w-md mx-auto px-6">
        {/* Logo/Brand */}
        <div className="mb-16">
          <div className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-[0.3em] relative">
            <span className="inline-block animate-pulse">H</span>
            <span className="inline-block animate-pulse" style={{ animationDelay: '0.1s' }}>O</span>
            <span className="inline-block animate-pulse" style={{ animationDelay: '0.2s' }}>D</span>
            <span className="inline-block animate-pulse" style={{ animationDelay: '0.3s' }}>L</span>
            <span className="inline-block animate-pulse" style={{ animationDelay: '0.4s' }}>R</span>
          </div>
          
          {/* Sophisticated progress bar */}
          <div className="relative mb-8">
            <div className="w-full h-[2px] bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-gray-500 via-white to-gray-400 rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                <div className="absolute right-0 top-0 w-4 h-full bg-white/50 blur-sm"></div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-gray-500 text-xs font-medium">Initializing</span>
              <span className="text-gray-400 text-xs font-mono">
                {Math.round(Math.min(progress, 100))}%
              </span>
            </div>
          </div>
          
          <div className="text-gray-400 text-sm font-light">
            Building the future of holder rewards
          </div>
        </div>
        
        {/* Minimalist loading dots */}
        <div className="flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.3}s`,
                animationDuration: '1.5s'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Wallet Connection Component with Multiple Options
const WalletConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  // Check if mobile app is installed
  const checkMobileApp = (appScheme) => {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = appScheme;
      
      let timeout = setTimeout(() => {
        resolve(false);
        document.body.removeChild(iframe);
      }, 1000);
      
      window.addEventListener('blur', () => {
        clearTimeout(timeout);
        resolve(true);
        document.body.removeChild(iframe);
      }, { once: true });
      
      document.body.appendChild(iframe);
    });
  };

  const walletOptions = [
    {
      name: 'Phantom',
      icon: (
        <svg width="32" height="32" viewBox="0 0 128 128" fill="none">
          <rect width="128" height="128" rx="20" fill="url(#phantom-gradient)"/>
          <path d="M96 41.5c-16.5-16.5-43.5-43.5-60 0-16.5 16.5-16.5 43.5 0 60 8.25 8.25 19.12 12.37 30 12.37s21.75-4.12 30-12.37c16.5-16.5 16.5-43.5 0-60z" fill="white"/>
          <defs>
            <linearGradient id="phantom-gradient">
              <stop stopColor="#9945FF"/>
              <stop offset="1" stopColor="#14F195"/>
            </linearGradient>
          </defs>
        </svg>
      ),
      detect: () => window.solana && window.solana.isPhantom,
      detectMobile: () => checkMobileApp('phantom://'),
      mobileDeepLink: 'phantom://browse/' + encodeURIComponent(window.location.href),
      connect: async () => {
        if (isMobile && !window.solana) {
          window.location.href = 'phantom://browse/' + encodeURIComponent(window.location.href);
          return null;
        }
        const response = await window.solana.connect();
        return response.publicKey.toString();
      }
    },
    {
      name: 'Solflare',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#FFC107"/>
          <path d="M12 4l8 8-8 8-8-8 8-8z" fill="white"/>
        </svg>
      ),
      detect: () => window.solflare && window.solflare.isSolflare,
      detectMobile: () => checkMobileApp('solflare://'),
      mobileDeepLink: 'solflare://browse/' + encodeURIComponent(window.location.href),
      connect: async () => {
        if (isMobile && !window.solflare) {
          window.location.href = 'solflare://browse/' + encodeURIComponent(window.location.href);
          return null;
        }
        const response = await window.solflare.connect();
        return response.publicKey.toString();
      }
    },
    {
      name: 'Backpack',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#E33E7F"/>
          <path d="M6 8h12v10H6V8zm2-2h8l-2-2H10l-2 2z" fill="white"/>
        </svg>
      ),
      detect: () => window.backpack,
      detectMobile: () => checkMobileApp('backpack://'),
      mobileDeepLink: 'backpack://browse/' + encodeURIComponent(window.location.href),
      connect: async () => {
        if (isMobile && !window.backpack) {
          window.location.href = 'backpack://browse/' + encodeURIComponent(window.location.href);
          return null;
        }
        const response = await window.backpack.connect();
        return response.publicKey.toString();
      }
    }
  ];

  const connectWallet = async (wallet) => {
    // Only allow connection if wallet is detected
    if (!wallet.detect()) {
      return;
    }

    setIsConnecting(true);
    setShowWalletModal(false);
    
    try {
      const address = await wallet.connect();
      setWalletAddress(address);
      setIsConnected(true);
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
  };

  const closeModal = () => {
    setShowWalletModal(false);
  };

  // Get detected wallets
  const detectedWallets = walletOptions.filter(wallet => wallet.detect());

    // Wallet Modal - Fixed with proper overlay and close functionality
  const WalletModal = () => {
    if (!showWalletModal) return null;

    return (
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 min-h-screen"
        onClick={closeModal}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div
          className="bg-gray-900 backdrop-blur-xl border border-gray-700/80 rounded-3xl p-6 sm:p-12 w-[95vw] sm:w-[90vw] max-w-2xl relative shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button 
            onClick={closeModal}
            className="absolute top-6 right-6 bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white rounded-full p-3 border border-gray-600 hover:border-gray-500 transition-all duration-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          {/* Header */}
          <div className="mb-8 sm:mb-12 text-center">
            <h3 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">Connect Your Wallet</h3>
            <p className="text-gray-400 text-base sm:text-lg">Choose your preferred Solana wallet to get started</p>
          </div>
          
          {detectedWallets.length > 0 ? (
            <div className="space-y-4 sm:space-y-6">
              {detectedWallets.map((wallet, index) => (
                <button
                  key={index}
                  onClick={() => connectWallet(wallet)}
                  className="w-full flex items-center justify-between p-4 sm:p-8 bg-gray-800/60 hover:bg-gray-700/80 rounded-2xl sm:rounded-3xl transition-all duration-300 border border-gray-700/50 hover:border-gray-600 group hover:scale-[1.02] transform"
                >
                  <div className="flex items-center space-x-3 sm:space-x-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl sm:rounded-2xl bg-gray-700/50 group-hover:bg-gray-600/50 transition-colors">
                      {wallet.icon}
                    </div>
                    <div className="text-left">
                      <span className="text-white font-semibold text-lg sm:text-2xl block">{wallet.name}</span>
                      <span className="text-gray-400 text-sm sm:text-lg">Click to connect</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <span className="text-xs sm:text-sm text-green-400 bg-green-400/20 px-2 py-1 sm:px-4 sm:py-2 rounded-full font-medium">
                      Detected
                    </span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 group-hover:text-white transition-colors sm:w-6 sm:h-6">
                      <polyline points="9,18 15,12 9,6"></polyline>
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-20">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-800 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-8">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 sm:w-12 sm:h-12">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <circle cx="12" cy="16" r="1"></circle>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h4 className="text-white font-semibold text-xl sm:text-3xl mb-3 sm:mb-4">No Wallets Detected</h4>
              <p className="text-gray-400 text-base sm:text-lg mb-8 sm:mb-12 leading-relaxed max-w-md mx-auto px-4">
                Please install a Solana wallet extension to connect and start trading
              </p>
              <div className="space-y-3 sm:space-y-4 max-w-sm mx-auto px-4">
                <a 
                  href="https://phantom.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 transition-all duration-300 px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-medium border border-purple-600/30 hover:border-purple-500/50 text-base sm:text-lg"
                >
                  Install Phantom Wallet →
                </a>
                <a 
                  href="https://solflare.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 hover:text-yellow-300 transition-all duration-300 px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-medium border border-yellow-600/30 hover:border-yellow-500/50 text-base sm:text-lg"
                >
                  Install Solflare Wallet →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isConnected) {
    return (
      <button
        onClick={disconnectWallet}
        className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 text-sm flex items-center space-x-2 shadow-lg hover:shadow-xl"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <circle cx="12" cy="16" r="1"></circle>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <span className="hidden sm:inline">{walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</span>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowWalletModal(true)}
        disabled={isConnecting}
        className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 text-sm flex items-center space-x-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
      >
        {isConnecting ? (
          <>
            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            <span className="hidden sm:inline">Connecting...</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <circle cx="12" cy="16" r="1"></circle>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span className="hidden sm:inline">Connect</span>
          </>
        )}
      </button>
      <WalletModal />
    </>
  );
};

// Enhanced Header Component
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-2 sm:top-4 left-1/2 transform -translate-x-1/2 z-40 transition-all duration-700 ease-out px-4">
      <nav className={`${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-xl border border-gray-700/80 rounded-full px-4 sm:px-6 py-3 w-[95vw] sm:w-[90vw] md:w-[600px]' 
          : 'bg-black/60 backdrop-blur-xl border border-gray-600/60 rounded-2xl px-4 sm:px-8 py-3 sm:py-4 w-[95vw] sm:w-[90vw] md:w-[80vw] max-w-5xl'
      } transition-all duration-700 ease-out flex items-center justify-between shadow-2xl`}>
        
        <div className="text-lg sm:text-xl font-bold text-white tracking-wide">HODLR</div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Navigation links - only show on larger screens when not scrolled or when scrolled */}
          <div className={`${isScrolled ? 'hidden lg:flex' : 'hidden md:flex'} items-center space-x-3 lg:space-x-6`}>
            <button 
              onClick={() => scrollToSection('home')} 
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('tokenomics')} 
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Tokenomics
            </button>
            <button 
              onClick={() => scrollToSection('roadmap')} 
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Roadmap
            </button>
          </div>
          
          <WalletConnection />
        </div>
      </nav>
    </header>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden pt-20 sm:pt-24">
      {/* Enhanced grid background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Enhanced gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white opacity-[0.08] rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-300 opacity-[0.08] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <FadeInWrapper delay={0.2}>
          <div className="inline-flex items-center bg-gray-900/60 border border-gray-700/80 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
            <span className="text-sm text-gray-300 font-medium">🚀 Built on Solana Network</span>
          </div>
        </FadeInWrapper>
        
        <FadeInWrapper delay={0.4}>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight tracking-tight">
            The Future of
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
              Holder Rewards
            </span>
          </h1>
        </FadeInWrapper>
        
        <FadeInWrapper delay={0.6}>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Revolutionary memecoin with automated rewards system. 
            Hold $HODLR and earn passive income through our advanced staking protocol.
          </p>
        </FadeInWrapper>
        
        <FadeInWrapper delay={0.8}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-2xl">
              <span>Buy $HODLR</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </FadeInWrapper>
      </div>
    </section>
  );
};

// Features Section (unchanged)
const FeaturesSection = () => {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast',
      description: 'Instant transactions and real-time reward distribution powered by Solana\'s speed'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Diamond Hands Rewards',
      description: 'The longer you hold, the higher your reward multiplier becomes'
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: 'Auto-Compound',
      description: 'Your rewards automatically compound, maximizing your earning potential'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Cross-Platform',
      description: 'Access your rewards from any device, anywhere in the world'
    }
  ];

  return (
    <section id="features" className="py-32 bg-gray-950/50">
      <div className="max-w-6xl mx-auto px-6">
        <FadeInWrapper>
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Revolutionary Reward System
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the next generation of DeFi rewards on Solana
            </p>
          </div>
        </FadeInWrapper>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FadeInWrapper key={index} delay={index * 0.1}>
              <div className="bg-black/50 border border-gray-800 rounded-2xl p-8 hover:border-gray-600 hover:bg-black/70 transition-all duration-300 group backdrop-blur-sm">
                <div className="text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </FadeInWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};

// Tokenomics Section (unchanged)
const TokenomicsSection = () => {
  const tokenomics = [
    { label: 'Holder Rewards', value: 40, color: '#ffffff' },
    { label: 'Liquidity Pool', value: 30, color: '#d1d5db' },
    { label: 'Development', value: 20, color: '#9ca3af' },
    { label: 'Marketing', value: 10, color: '#6b7280' }
  ];

  return (
    <section id="tokenomics" className="py-32 bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <FadeInWrapper>
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Tokenomics
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Designed for sustainable growth and maximum holder value
            </p>
          </div>
        </FadeInWrapper>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeInWrapper delay={0.2}>
            <div className="bg-gray-950/50 border border-gray-800 rounded-2xl p-10 backdrop-blur-sm">
              <div className="space-y-8">
                {tokenomics.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-white font-medium text-lg">{item.label}</span>
                    </div>
                    <span className="text-white font-bold text-xl">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeInWrapper>
          
          <FadeInWrapper delay={0.4}>
            <div className="text-gray-400 space-y-8">
              <div>
                <h3 className="text-white text-2xl font-semibold mb-4">Fair Distribution</h3>
                <p className="text-lg leading-relaxed">No team allocation, no VC rounds. 100% of tokens are allocated to community growth and rewards.</p>
              </div>
              <div>
                <h3 className="text-white text-2xl font-semibold mb-4">Sustainable Model</h3>
                <p className="text-lg leading-relaxed">Our tokenomics are designed to reward long-term holders while maintaining healthy liquidity.</p>
              </div>
            </div>
          </FadeInWrapper>
        </div>
      </div>
    </section>
  );
};

// Roadmap Section (unchanged)
const RoadmapSection = () => {
  const roadmapItems = [
    {
      phase: 'Phase 1',
      title: 'Foundation',
      description: 'Token launch, initial community building, and basic infrastructure setup',
      status: 'completed'
    },
    {
      phase: 'Phase 2',
      title: 'Rewards System',
      description: 'Deploy automated reward distribution and staking platform',
      status: 'active'
    },
    {
      phase: 'Phase 3',
      title: 'Platform Expansion',
      description: 'Mobile app launch and advanced DeFi integrations',
      status: 'upcoming'
    },
    {
      phase: 'Phase 4',
      title: 'Ecosystem Growth',
      description: 'Major exchange listings and partnership integrations',
      status: 'upcoming'
    }
  ];

  return (
    <section id="roadmap" className="py-32 bg-gray-950/50">
      <div className="max-w-6xl mx-auto px-6">
        <FadeInWrapper>
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Roadmap
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our journey to revolutionize holder rewards
            </p>
          </div>
        </FadeInWrapper>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roadmapItems.map((item, index) => (
            <FadeInWrapper key={index} delay={index * 0.1}>
              <div className="bg-black/50 border border-gray-800 rounded-2xl p-8 relative backdrop-blur-sm hover:bg-black/70 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-gray-400 font-medium">{item.phase}</span>
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'completed' ? 'bg-green-500' :
                    item.status === 'active' ? 'bg-yellow-500' : 'bg-gray-600'
                  }`}></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            </FadeInWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};

// Simplified Footer
// Simplified Footer
const Footer = () => {
  const [activeModal, setActiveModal] = useState(null);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const modalContent = {
    'how-to-buy': {
      title: 'How to Buy $HODLR',
      content: (
        <div className="space-y-6">
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700/50">
            <h4 className="text-white font-semibold text-lg mb-4 flex items-center">
              <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
              Connect Your Wallet
            </h4>
            <p className="text-gray-400">Install and connect a Solana wallet like Phantom or Solflare to get started.</p>
          </div>
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700/50">
            <h4 className="text-white font-semibold text-lg mb-4 flex items-center">
              <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
              Get SOL
            </h4>
            <p className="text-gray-400">Ensure you have SOL in your wallet for transaction fees and to swap for $HODLR.</p>
          </div>
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700/50">
            <h4 className="text-white font-semibold text-lg mb-4 flex items-center">
              <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</span>
              Visit DEX
            </h4>
            <p className="text-gray-400">Go to Raydium or Jupiter to swap SOL for $HODLR tokens using our contract address.</p>
          </div>
          <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700/50">
            <h4 className="text-white font-semibold text-lg mb-4 flex items-center">
              <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">4</span>
              Start Earning
            </h4>
            <p className="text-gray-400">Hold your $HODLR tokens and start earning automatic rewards!</p>
          </div>
        </div>
      )
    },
    'staking-guide': {
      title: 'Staking Guide',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-2xl p-6 border border-green-700/30">
            <h4 className="text-white font-semibold text-lg mb-3">Automatic Rewards</h4>
            <p className="text-gray-300">$HODLR features automatic reward distribution - no manual staking required! Simply hold tokens in your wallet.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700/50">
              <h5 className="text-white font-medium mb-2">Reward Rate</h5>
              <p className="text-gray-400 text-sm">5-15% APY based on holding duration</p>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700/50">
              <h5 className="text-white font-medium mb-2">Distribution</h5>
              <p className="text-gray-400 text-sm">Every 24 hours automatically</p>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700/50">
              <h5 className="text-white font-medium mb-2">Minimum Hold</h5>
              <p className="text-gray-400 text-sm">100 $HODLR tokens</p>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700/50">
              <h5 className="text-white font-medium mb-2">Compound</h5>
              <p className="text-gray-400 text-sm">Rewards auto-compound daily</p>
            </div>
          </div>
          <div className="bg-yellow-900/20 rounded-2xl p-6 border border-yellow-700/30">
            <h4 className="text-yellow-400 font-semibold mb-2">💎 Diamond Hands Bonus</h4>
            <p className="text-gray-300">Hold for 30+ days to unlock multiplier rewards up to 3x!</p>
          </div>
        </div>
      )
    },
    'faq': {
      title: 'Frequently Asked Questions',
      content: (
        <div className="space-y-4">
          <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700/50">
            <h4 className="text-white font-medium mb-2">What is $HODLR?</h4>
            <p className="text-gray-400 text-sm">$HODLR is a revolutionary memecoin on Solana that rewards long-term holders with automatic passive income through our advanced staking protocol.</p>
          </div>
          <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700/50">
            <h4 className="text-white font-medium mb-2">How do I earn rewards?</h4>
            <p className="text-gray-400 text-sm">Simply hold $HODLR tokens in your wallet. Rewards are automatically distributed every 24 hours based on your holding amount and duration.</p>
          </div>
          <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700/50">
            <h4 className="text-white font-medium mb-2">What's the total supply?</h4>
            <p className="text-gray-400 text-sm">Total supply is 1 billion $HODLR tokens with no team allocation - 100% fair launch for the community.</p>
          </div>
          <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700/50">
            <h4 className="text-white font-medium mb-2">Are there any fees?</h4>
            <p className="text-gray-400 text-sm">Only standard Solana network fees apply. No additional fees for holding or receiving rewards.</p>
          </div>
          <div className="bg-gray-800/60 rounded-xl p-5 border border-gray-700/50">
            <h4 className="text-white font-medium mb-2">Is it safe?</h4>
            <p className="text-gray-400 text-sm">Our smart contracts are audited and built on Solana's secure blockchain. Always DYOR and never invest more than you can afford to lose.</p>
          </div>
        </div>
      )
    }
  };

  // Modal Component
  const InfoModal = () => {
    if (!activeModal) return null;

    const modal = modalContent[activeModal];

    return (
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 min-h-screen"
        onClick={closeModal}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div
          className="bg-gray-900 backdrop-blur-xl border border-gray-700/80 rounded-3xl p-6 sm:p-12 w-[95vw] sm:w-[90vw] max-w-3xl relative shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button 
            onClick={closeModal}
            className="absolute top-6 right-6 bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white rounded-full p-3 border border-gray-600 hover:border-gray-500 transition-all duration-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          {/* Header */}
          <div className="mb-8 sm:mb-12 text-center">
            <h3 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">{modal.title}</h3>
          </div>
          
          {/* Content */}
          <div className="text-left">
            {modal.content}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <footer className="bg-black border-t border-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-1">
              <div className="text-2xl font-bold text-white mb-4">HODLR</div>
              <p className="text-gray-400">Next-generation holder rewards on Solana</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Navigation</h4>
              <div className="space-y-3">
                <button 
                  onClick={() => scrollToSection('features')} 
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('tokenomics')} 
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Tokenomics
                </button>
                <button 
                  onClick={() => scrollToSection('roadmap')} 
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Roadmap
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Get Started</h4>
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveModal('how-to-buy')}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  How to Buy
                </button>
                <button 
                  onClick={() => setActiveModal('staking-guide')}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Staking Guide
                </button>
                <button 
                  onClick={() => setActiveModal('faq')}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 HODLR. All rights reserved.</p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Contract: <span className="text-white font-mono">Coming Soon</span>
            </p>
          </div>
        </div>
      </footer>
      <InfoModal />
    </>
  );
};

// Main App Component
const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <LoadingScreen isLoading={isLoading} />
      {!isLoading && (
        <>
          <Header />
          <HeroSection />
          <FeaturesSection />
          <TokenomicsSection />
          <RoadmapSection />
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;