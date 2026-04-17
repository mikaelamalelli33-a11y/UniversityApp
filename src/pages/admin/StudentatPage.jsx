import { Result } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function StudentatPage() {
  usePageTitle('Studentat');

  return (
    <Result
      icon={<TeamOutlined style={{ color: '#1677ff' }} />}
      title="Menaxhimi i studentëve"
      subTitle="API-ja e listimit dhe menaxhimit të studentëve është duke u implementuar. Do të jetë e disponueshme së shpejti."
    />
  );
}
