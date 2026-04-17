import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  notification,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';

const { Title, Text } = Typography;

const ROLE_LABELS = {
  admin: 'Admin',
  pedagog: 'Pedagog',
  student: 'Student',
};

const ROLE_COLORS = {
  admin: 'red',
  pedagog: 'blue',
  student: 'green',
};

function ProfileInfo({ user }) {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
        <Avatar size={96} src={user?.avatarUrl} icon={<UserOutlined />} />
        <div>
          <Title level={3} style={{ margin: 0 }}>
            {user?.name}
          </Title>
          <Text type="secondary">{user?.email}</Text>
          <div style={{ marginTop: 8 }}>
            <Tag color={ROLE_COLORS[user?.role]}>{ROLE_LABELS[user?.role] ?? user?.role}</Tag>
          </div>
        </div>
      </div>

      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Emri">{user?.name ?? '—'}</Descriptions.Item>
        <Descriptions.Item label="Email">{user?.email ?? '—'}</Descriptions.Item>
        <Descriptions.Item label="Roli">{ROLE_LABELS[user?.role] ?? user?.role}</Descriptions.Item>
        <Descriptions.Item label="Mënyra e hyrjes">
          {user?.provider === 'google' ? 'Google OAuth' : 'Email + fjalëkalim'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}

function ChangePasswordForm() {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const res = await authService.changePassword({
        current_password: values.current_password,
        new_password: values.new_password,
        new_password_confirmation: values.confirm_password,
      });
      notification.success({ message: res.message ?? 'Fjalëkalimi u ndryshua me sukses.' });
      form.resetFields();
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Ndryshimi i fjalëkalimit dështoi.';
      notification.error({ message: msg });
    }
  };

  return (
    <Card style={{ maxWidth: 480 }}>
      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item
          name="current_password"
          label="Fjalëkalimi aktual"
          rules={[{ required: true, message: 'Fjalëkalimi aktual është i detyrueshëm.' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Fjalëkalimi aktual" />
        </Form.Item>

        <Form.Item
          name="new_password"
          label="Fjalëkalimi i ri"
          rules={[
            { required: true, message: 'Fjalëkalimi i ri është i detyrueshëm.' },
            { min: 8, message: 'Minimumi 8 karaktere.' },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Fjalëkalimi i ri" />
        </Form.Item>

        <Form.Item
          name="confirm_password"
          label="Konfirmo fjalëkalimin"
          dependencies={['new_password']}
          rules={[
            { required: true, message: 'Konfirmimi është i detyrueshëm.' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('new_password') === value) return Promise.resolve();
                return Promise.reject(new Error('Fjalëkalimet nuk përputhen.'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Konfirmo fjalëkalimin e ri" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Ndrysho fjalëkalimin
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default function ProfilePage() {
  usePageTitle('Profili');
  const { user } = useAuth();

  // Students log in via Google OAuth only — they have no password to change.
  const canChangePassword = user?.role !== 'student';

  const tabs = [
    { key: 'info', label: 'Informacionet e Mia', children: <ProfileInfo user={user} /> },
    canChangePassword && {
      key: 'password',
      label: 'Ndrysho Fjalëkalimin',
      children: <ChangePasswordForm />,
    },
  ].filter(Boolean);

  return (
    <div>
      <Title level={4}>Profili</Title>
      <Tabs defaultActiveKey="info" items={tabs} />
    </div>
  );
}
