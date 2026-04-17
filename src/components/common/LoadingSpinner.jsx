import { Spin } from 'antd';

/**
 * LoadingSpinner — flexible spinner used across the app.
 *
 *   <LoadingSpinner />           → inline, centered horizontally with padding
 *   <LoadingSpinner fullPage />  → centered in the full viewport (e.g. route Suspense fallback)
 *   <LoadingSpinner fill />      → fills the nearest positioned/flex parent (e.g. Content area)
 *   <LoadingSpinner tip="..." /> → label underneath
 */
export default function LoadingSpinner({ fullPage = false, fill = false, tip, size = 'large' }) {
  const spinner = (
    <Spin size={size} tip={tip}>
      {tip ? <div style={{ padding: 24 }} /> : null}
    </Spin>
  );

  if (fullPage) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100%',
        }}
      >
        {spinner}
      </div>
    );
  }

  if (fill) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          minHeight: '100%',
          width: '100%',
        }}
      >
        {spinner}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>{spinner}</div>
  );
}
