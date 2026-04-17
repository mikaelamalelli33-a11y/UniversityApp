import {
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  BarChartOutlined,
  FileTextOutlined,
  ScheduleOutlined,
  EuroOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { ROUTES } from './routes';

// Profile (incl. change password) is reached via the header avatar/name — not via sidebar.
export const MENU_CONFIG = {
  student: [
    { key: ROUTES.STUDENT.ROOT, icon: <HomeOutlined />, label: 'Ballina' },
    {
      key: 'student-raportet',
      icon: <BarChartOutlined />,
      label: 'Raportet',
      children: [
        { key: ROUTES.STUDENT.NOTAT, icon: <FileTextOutlined />, label: 'Notat' },
        { key: ROUTES.STUDENT.FATURA, icon: <EuroOutlined />, label: 'Faturat' },
      ],
    },
    { key: ROUTES.STUDENT.ORARI, icon: <ScheduleOutlined />, label: 'Orari' },
  ],
  pedagog: [
    { key: ROUTES.PEDAGOG.ROOT, icon: <HomeOutlined />, label: 'Ballina' },
    { key: ROUTES.PEDAGOG.RAPORTET, icon: <BarChartOutlined />, label: 'Raportet' },
    { key: ROUTES.PEDAGOG.ORARI, icon: <ScheduleOutlined />, label: 'Orari' },
  ],
  admin: [
    { key: ROUTES.ADMIN.ROOT, icon: <HomeOutlined />, label: 'Ballina' },
    { key: ROUTES.ADMIN.STUDENTAT, icon: <TeamOutlined />, label: 'Studentat' },
    { key: ROUTES.ADMIN.PEDAGOGAT, icon: <UserOutlined />, label: 'Pedagogët' },
    { key: ROUTES.ADMIN.LENDET, icon: <BookOutlined />, label: 'Lëndët' },
    { key: ROUTES.ADMIN.RAPORTET, icon: <BarChartOutlined />, label: 'Raportet' },
    { key: ROUTES.ADMIN.NJOFTIMET, icon: <BellOutlined />, label: 'Njoftimet' },
  ],
};
