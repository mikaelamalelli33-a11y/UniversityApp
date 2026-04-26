import { useState, useEffect } from 'react';
import { Badge, Button, Dropdown, Empty, List, Tag, Typography } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { njoftimService } from '@/services/njoftimService';
import { useNotificationStream } from '@/hooks/useNotificationStream';

const { Text } = Typography;

const typeColor = { info: 'blue', sukses: 'green', paralajmerim: 'orange' };
const typeLabel = { info: 'Info', sukses: 'Sukses', paralajmerim: 'Paralajmërim' };

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  // Load existing notifications once on mount
  useEffect(() => {
    njoftimService
      .getAll()
      .then((res) => setNotifications(res.data ?? []))
      .catch(() => {});
  }, []);

  // SSE: when the server pushes a new notification, prepend it to the list
  useNotificationStream((newNotification) => {
    setNotifications((prev) => [newNotification, ...prev]);
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAll = async (e) => {
    e.stopPropagation();
    await njoftimService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleMarkOne = async (id) => {
    await njoftimService.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const dropdownContent = (
    <div
      style={{
        width: 340,
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
        maxHeight: 400,
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text strong>Njoftimet</Text>
        {unreadCount > 0 && (
          <Button size="small" type="link" icon={<CheckOutlined />} onClick={handleMarkAll}>
            Shëno të gjitha
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Empty description="Nuk ka njoftime" style={{ padding: 24 }} />
      ) : (
        <List
          dataSource={notifications}
          renderItem={(n) => (
            <List.Item
              style={{
                padding: '10px 16px',
                background: n.isRead ? '#fff' : '#f0f7ff',
                cursor: 'pointer',
              }}
              onClick={() => !n.isRead && handleMarkOne(n.id)}
            >
              <List.Item.Meta
                title={
                  <span>
                    <Tag color={typeColor[n.type]}>{typeLabel[n.type]}</Tag>
                    {n.title}
                  </span>
                }
                description={
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {n.body}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      dropdownRender={() => dropdownContent}
      trigger={['click']}
      placement="bottomRight"
    >
      <Badge count={unreadCount} size="small" offset={[-2, 2]}>
        <Button type="text" icon={<BellOutlined style={{ fontSize: 18 }} />} />
      </Badge>
    </Dropdown>
  );
}
