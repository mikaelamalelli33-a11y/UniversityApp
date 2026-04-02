import { useEffect } from 'react';
import { useUiStore } from '@/store/uiStore';

const APP_NAME = import.meta.env.VITE_APP_NAME || 'UAMD';

export const usePageTitle = (title) => {
  const setPageTitle = useUiStore((s) => s.setPageTitle);

  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
    setPageTitle(title || '');
  }, [title, setPageTitle]);
};
