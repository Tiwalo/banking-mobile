import { StyleSheet, View } from 'react-native';

import { Button } from './button';
import { Icon } from './icon';
import { TiwaloText } from './tiwalo-text';
import { colors, radius, space } from './tokens';

type StateProps = {
  title: string;
  description?: string;
};

export function LoadingState({ title, description }: StateProps) {
  return <FeedbackState title={title} description={description} kind="pending" />;
}

export function EmptyState({ title, description }: StateProps) {
  return <FeedbackState title={title} description={description} kind="inbox" />;
}

type ErrorStateProps = StateProps & { onRetry?: () => void };

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return <FeedbackState title={title} description={description} kind="error" onRetry={onRetry} />;
}

function FeedbackState({
  kind,
  title,
  description,
  onRetry,
}: ErrorStateProps & { kind: 'pending' | 'inbox' | 'error' }) {
  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Icon name={kind} color={kind === 'error' ? colors.text.error : colors.text.heading} />
        <TiwaloText
          accessibilityLiveRegion={kind === 'inbox' ? 'none' : 'polite'}
          accessibilityRole="header"
          variant="label"
          tone={kind === 'error' ? 'error' : 'heading'}
          style={styles.title}
        >
          {title}
        </TiwaloText>
      </View>
      {!!description && <TiwaloText selectable={kind === 'error'}>{description}</TiwaloText>}
      {onRetry && <Button label="Try again" onPress={onRetry} variant="secondary" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: space.md,
    gap: space.sm,
    borderColor: colors.border.divider,
    borderWidth: 1,
    borderRadius: radius.card,
    backgroundColor: colors.surface.card,
  },
  heading: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  title: { flex: 1 },
});
