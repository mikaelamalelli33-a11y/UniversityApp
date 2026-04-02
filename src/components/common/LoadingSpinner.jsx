import { Spin } from 'antd';

export default function LoadingSpinner({ fullPage = false }) {
  if (fullPage) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
      <Spin size="large" />
    </div>
  );
}
