import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

export default function PublicLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#003087', color: '#fff', padding: '0 24px' }}>
        <span style={{ fontSize: 18, fontWeight: 600 }}>UAMD</span>
      </Header>
      <Content style={{ padding: '24px' }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        UAMD © {new Date().getFullYear()} — Universiteti Aleksander Moisiu Durrës
      </Footer>
    </Layout>
  );
}
