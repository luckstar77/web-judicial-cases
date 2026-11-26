import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/auth-context';
import { buildCaseListPath } from '@/shared/constants/routes';

export const COMMUNITY_SEARCH_REASON = '為保護當事人隱私，搜尋網友回報需要先登入';

/** 網友回報精確搜尋需登入：未登入先開登入視窗，登入後自動前往搜尋結果。 */
export const useCommunitySearch = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  return useCallback(
    (keyword: string) => {
      requireAuth(() => navigate(buildCaseListPath({ keyword })), COMMUNITY_SEARCH_REASON);
    },
    [navigate, requireAuth],
  );
};
