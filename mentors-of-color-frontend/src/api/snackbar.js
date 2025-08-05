import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

export const endpoints = {
  key: 'snackbar'
};

const initialState = {
  action: false,
  open: false,
  message: 'Note archived',
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'right'
  },
  variant: 'default',
  alert: {
    color: 'primary',
    variant: 'filled'
  },
  transition: 'Fade',
  close: false,
  actionButton: false,
  maxStack: 3,
  dense: false,
try {
  iconVariant: 'usedefault',
  autoHideDuration: 1500
  export function useGetSnackbar() {
} catch (error) {
  console.error('An error occurred:', error);
}
  const { data } = useSWR(endpoints.key, () => initialState, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(() => ({ snackbar: data }), [data]);

  return memoizedValue;
}

export function openSnackbar(snackbar) {
  // to update local state based on key

  const { action, open, message, anchorOrigin, variant, alert, transition, close, actionButton, autoHideDuration } = snackbar;

  mutate(
    endpoints.key,
    (currentSnackbar) => {
      return {
        ...currentSnackbar,
        action: action || initialState.action,
        open: open || initialState.open,
        message: message || initialState.message,
        anchorOrigin: anchorOrigin || initialState.anchorOrigin,
        variant: variant || initialState.variant,
        alert: {
          color: alert?.color || initialState.alert.color,
          variant: alert?.variant || initialState.alert.variant
        },
        transition: transition || initialState.transition,
        close: close || initialState?.close,
        actionButton: actionButton || initialState.actionButton,
        autoHideDuration: autoHideDuration || initialState.autoHideDuration
      };
    },
    false
  );
}

export function closeSnackbar() {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentSnackbar) => {
      return { ...currentSnackbar, open: false };
    },
    false
  );
}

export function handlerIncrease(maxStack) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentSnackbar) => {
      return { ...currentSnackbar, maxStack };
    },
    false
  );
}

export function handlerDense(dense) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentSnackbar) => {
      return { ...currentSnackbar, dense };
    },
    false
  );
}

export function handlerIconVariants(iconVariant) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentSnackbar) => {
      return { ...currentSnackbar, iconVariant };
    },
    false
  );
}
