import { Result } from 'antd';
import { ScheduleOutlined } from '@ant-design/icons';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function OrariStudentPage() {
  usePageTitle('Orari');

  return (
    <Result
      icon={<ScheduleOutlined style={{ color: '#FFD300' }} />}
      title="Orari juaj"
      subTitle="Funksionaliteti i orarit është duke u implementuar. Do të jetë i disponueshëm së shpejti."
    />
  );
}
