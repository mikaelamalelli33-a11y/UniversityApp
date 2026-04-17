import { Suspense } from 'react';
import { Layout, Menu, Button, Typography, Space, Avatar, Tooltip } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useUiStore } from '@/store/uiStore';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_DEFAULT_ROUTES, ROUTES } from '@/router/routes';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import NotificationBell from '@/components/common/NotificationBell';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const PROFILE_ROUTES = {
  admin: ROUTES.ADMIN.PROFILI,
  pedagog: ROUTES.PEDAGOG.PROFILI,
  student: ROUTES.STUDENT.PROFILI,
};

/**
 * DashboardLayout — shared layout for all three portals (student, pedagog, admin).
 *
 * Structure:
 *   ┌─────────────────────────────────┐
 *   │  Sider (sidebar menu)           │
 *   ├──────────────────────────────── │
 *   │  Header (page title + user)     │
 *   ├─────────────────────────────────│
 *   │  Content (<Outlet /> = page)    │
 *   └─────────────────────────────────┘
 *
 * HOW IT CONNECTS TO PAGES:
 *   - <Outlet /> is where React Router renders the active child page.
 *   - menuItems are passed from router/index.jsx via MENU_CONFIG — do not hardcode them here.
 *   - pageTitle is set by each page using the usePageTitle() hook — this layout just displays it.
 *
 * SUSPENSE:
 *   - Pages are lazy-loaded (see router/index.jsx).
 *   - Suspense here shows a spinner only inside Content while the page chunk downloads.
 *   - This keeps the sidebar and header visible during navigation — do not move Suspense elsewhere.
 */
export default function DashboardLayout({ menuItems }) {
  const navigate = useNavigate();
  const location = useLocation();

  // pageTitle is set by each page via usePageTitle() hook
  const { sidebarCollapsed, toggleSidebar, pageTitle } = useUiStore();

  // user comes from the auth store, populated on login or page refresh via initializeAuth()
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const handleBrandClick = () => {
    navigate(ROLE_DEFAULT_ROUTES[user?.role] ?? ROUTES.LOGIN);
  };

  const handleProfileClick = () => {
    const route = PROFILE_ROUTES[user?.role];
    if (route) navigate(route);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* ── Sidebar ── */}
      <Sider collapsible collapsed={sidebarCollapsed} onCollapse={toggleSidebar} theme="dark">
        <Tooltip title="Ballina" placement="right">
          <div
            onClick={handleBrandClick}
            style={{
              padding: '16px',
              color: '#fff',
              fontWeight: 600,
              textAlign: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 64,
              overflow: 'hidden',
            }}
          >
            {sidebarCollapsed ? <HomeIcon /> : 'UAMD'}
          </div>
        </Tooltip>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        {/* ── Header ── */}
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
            height: 64,
            lineHeight: 'normal',
          }}
        >
          <Text strong style={{ fontSize: 16 }}>
            {pageTitle}
          </Text>

          <Space size="middle" align="center">
            <NotificationBell />
            <Tooltip title="Profili">
              <Space
                size={8}
                align="center"
                onClick={handleProfileClick}
                style={{ cursor: 'pointer' }}
              >
                <Avatar src={user?.avatarUrl} icon={<UserOutlined />} />
                <Text>{user?.name}</Text>
              </Space>
            </Tooltip>
            <Button icon={<LogoutOutlined />} onClick={handleLogout} type="text">
              Dil
            </Button>
          </Space>
        </Header>

        {/* ── Content ── */}
        <Content
          style={{
            margin: '24px',
            padding: '24px',
            background: '#fff',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Suspense shows a spinner here (not full-page) while lazy page chunks load */}
          <Suspense fallback={<LoadingSpinner fill />}>
            <Outlet />
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
}

// Home icon rendered when sidebar is collapsed — replaces "UA" abbreviation
function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9.5z"
        stroke="#fff"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
