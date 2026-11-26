import { Navigate, type RouteObject } from 'react-router-dom';
import { RouteErrorPage } from '@/pages/RouteErrorPage';
import { AppLoading } from '@/shared/components/AppLoading';
import { ROUTES } from '@/shared/constants/routes';
import { AppShell } from './layout/AppShell';

/** 路由設定：每個頁面皆 lazy 載入（route-level code splitting）。 */
export const appRoutes: RouteObject[] = [
  {
    path: ROUTES.home,
    element: <AppShell />,
    errorElement: <RouteErrorPage />,
    HydrateFallback: AppLoading,
    children: [
      {
        errorElement: <RouteErrorPage />,
        children: [
          { index: true, lazy: async () => ({ Component: (await import('@/pages/HomePage')).HomePage }) },
          { path: ROUTES.judgments, lazy: async () => ({ Component: (await import('@/features/judgments/JudgmentSearchPage')).JudgmentSearchPage }) },
          { path: ROUTES.judgmentDetail, lazy: async () => ({ Component: (await import('@/features/judgments/JudgmentDetailPage')).JudgmentDetailPage }) },
          { path: ROUTES.cases, lazy: async () => ({ Component: (await import('@/features/cases/CaseListPage')).CaseListPage }) },
          { path: ROUTES.caseCreate, lazy: async () => ({ Component: (await import('@/features/cases/CaseCreatePage')).CaseCreatePage }) },
          { path: ROUTES.caseDetail, lazy: async () => ({ Component: (await import('@/features/cases/CaseDetailPage')).CaseDetailPage }) },
          { path: ROUTES.legacyUpload, element: <Navigate to={ROUTES.caseCreate} replace /> },
          { path: ROUTES.profile, lazy: async () => ({ Component: (await import('@/features/profile/ProfilePage')).ProfilePage }) },
          { path: ROUTES.faq, lazy: async () => ({ Component: (await import('@/pages/FaqPage')).FaqPage }) },
          { path: ROUTES.about, lazy: async () => ({ Component: (await import('@/pages/AboutPage')).AboutPage }) },
          { path: '*', lazy: async () => ({ Component: (await import('@/pages/NotFoundPage')).NotFoundPage }) },
        ],
      },
    ],
  },
];
