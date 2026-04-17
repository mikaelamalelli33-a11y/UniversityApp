import { Result } from 'antd';
import { ScheduleOutlined } from '@ant-design/icons';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function OrariStudentPage() {
  usePageTitle('Orari');

  return (
    <Result
      icon={<ScheduleOutlined style={{ color: '#1677ff' }} />}
      title="Orari juaj"
      subTitle="Funksionaliteti i orarit është duke u implementuar. Do të jetë i disponueshëm së shpejti."
    />
  );
}
