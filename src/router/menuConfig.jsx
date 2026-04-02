import {
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  BarChartOutlined,
  FileTextOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { ROUTES } from './routes';

export const MENU_CONFIG = {
  student: [
    { key: ROUTES.STUDENT.ROOT, icon: <HomeOutlined />, label: 'Ballina' },
    { key: ROUTES.STUDENT.NOTAT, icon: <FileTextOutlined />, label: 'Notat' },
    { key: ROUTES.STUDENT.ORARI, icon: <ScheduleOutlined />, label: 'Orari' },
  ],
  pedagog: [
    { key: ROUTES.PEDAGOG.ROOT, icon: <HomeOutlined />, label: 'Ballina' },
    { key: ROUTES.PEDAGOG.KURSET, icon: <BookOutlined />, label: 'Kurset' },
    { key: ROUTES.PEDAGOG.ORARI, icon: <ScheduleOutlined />, label: 'Orari' },
  ],
  admin: [
    { key: ROUTES.ADMIN.ROOT, icon: <HomeOutlined />, label: 'Ballina' },
    { key: ROUTES.ADMIN.STUDENTAT, icon: <TeamOutlined />, label: 'Studentat' },
    { key: ROUTES.ADMIN.PEDAGOGAT, icon: <UserOutlined />, label: 'Pedagogat' },
    { key: ROUTES.ADMIN.LENDET, icon: <BookOutlined />, label: 'Lëndët' },
    { key: ROUTES.ADMIN.RAPORTET, icon: <BarChartOutlined />, label: 'Raportet' },
  ],
};
