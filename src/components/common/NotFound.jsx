import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Faqja që kërkuat nuk u gjet."
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          Kthehu në fillim
        </Button>
      }
    />
  );
}
