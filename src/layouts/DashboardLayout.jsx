import { Suspense } from 'react';
import { Layout, Menu, Button, Typography, Space, Avatar } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useUiStore } from '@/store/uiStore';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/router/routes';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import NotificationBell from '@/components/common/NotificationBell';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* ── Sidebar ── */}
      <Sider collapsible collapsed={sidebarCollapsed} onCollapse={toggleSidebar} theme="dark">
        <div style={{ padding: '16px', color: '#fff', fontWeight: 600, textAlign: 'center' }}>
          {sidebarCollapsed ? 'UA' : 'UAMD'}
        </div>
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
          }}
        >
          <Text strong style={{ fontSize: 16 }}>
            {pageTitle}
          </Text>

          <Space>
            <NotificationBell />
            <Avatar icon={<UserOutlined />} />
            <Text>
              {user?.emri} {user?.mbiemri}
            </Text>
            <Button icon={<LogoutOutlined />} onClick={handleLogout} type="text">
              Dil
            </Button>
          </Space>
        </Header>

        {/* ── Content ── */}
        <Content style={{ margin: '24px', padding: '24px', background: '#fff', borderRadius: 8 }}>
          {/* Suspense shows a spinner here (not full-page) while lazy page chunks load */}
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
}
