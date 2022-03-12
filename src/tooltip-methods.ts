export const DEFAULT_DELAY = 1000;

export interface TooltipProps {
  title: string;
  subtitle?: string;
  maxWidth?: string;
}

interface GlobalTooltipProps {
  delay: number;
}

interface TooltipMethods {
  setPopperTooltipTriggerRef?: (element: HTMLElement | null) => void;
  setAppTooltipProps?: (props: TooltipProps | undefined) => void;
  setAppTooltipVisible?: (visible: boolean) => void;
  popperTooltipUpdate?: Function | null;
}

export const tooltipMethods: TooltipMethods = {};

export const globalTooltipProps: GlobalTooltipProps = {
  delay: DEFAULT_DELAY,
};

export function resetTooltipMethods() {
  (Object.keys(tooltipMethods) as (keyof TooltipMethods)[]).forEach((key) => {
    delete tooltipMethods[key];
  });
}

export function initTooltipMethods(methods: TooltipMethods) {
  Object.assign(tooltipMethods, methods);
}

export function setGlobalTooltipProps(props: GlobalTooltipProps) {
  Object.assign(globalTooltipProps, props);
}
