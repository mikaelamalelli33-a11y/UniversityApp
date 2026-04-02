import { Component } from 'react';
import { Result, Button } from 'antd';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Diçka shkoi gabim"
          subTitle="Ndodhi një gabim i papritur. Ju lutem ringarkoni faqen."
          extra={
            <Button type="primary" onClick={() => window.location.reload()}>
              Ringarko
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}
