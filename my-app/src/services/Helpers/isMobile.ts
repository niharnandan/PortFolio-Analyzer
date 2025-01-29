import { useState, useEffect } from 'react';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const checkMobile = () => {
    setIsMobile(window.innerWidth <= 768); // 768px or less is generally mobile
  };

  useEffect(() => {
    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile); // Check on resize

    return () => {
      window.removeEventListener('resize', checkMobile); // Clean up listener
    };
  }, []);

  return isMobile;
};

export default useIsMobile;
