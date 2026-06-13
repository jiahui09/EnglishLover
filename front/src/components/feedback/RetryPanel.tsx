import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export interface RetryPanelProps {
  title: string;
  description: string;
  retryLabel?: string;
  isRetrying?: boolean;
  onRetry: () => void;
}

export function RetryPanel({
  title,
  description,
  retryLabel = '重试',
  isRetrying = false,
  onRetry,
}: RetryPanelProps) {
  return (
    <Card variant="outlined">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="secondary" isLoading={isRetrying} onClick={onRetry}>
          {retryLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
