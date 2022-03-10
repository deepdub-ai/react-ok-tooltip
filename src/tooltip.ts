import { deferredHideTooltip, deferredShowTooltip } from './tooltip.helpers';

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

const tooltipMethods: TooltipMethods = {};

const globalTooltipProps: GlobalTooltipProps = {
  delay: DEFAULT_DELAY,
};

const tooltipGroups: { [groupId: string]: HTMLElement } = {};

export function tooltipGroup(groupId?: string) {
  groupId ??= `tooltipGroup_${Math.round(Math.random() * 100000).toString()}`;

  function handleMouseOverCapture(e: React.MouseEvent<HTMLElement>) {
    tooltipGroups[groupId!] = e.currentTarget;
  }

  return {
    onMouseOverCapture: handleMouseOverCapture,
    'data-ok-tooltip-group-id': groupId,
  };
}

export function tooltip(
  title: string,
  {
    groupId,
    ...appTooltipProps
  }: { groupId?: string | null } & Omit<TooltipProps, 'title'> = {}
) {
  function onMouseEnter(e: React.MouseEvent<HTMLElement>) {
    const wrappingGroupId = e.currentTarget.closest<HTMLElement>(
      '[data-ok-tooltip-group-id]'
    )?.dataset.okTooltipGroupId;

    // If groupId is undefined, we fallback to wrappingGroupId.
    // If groupId === null, we want selectdGroupId to be null as well.
    // Otherwise (groupId is of type string), we use groupId.
    //
    const selectedGroupId = groupId === undefined ? wrappingGroupId : groupId;

    const triggerEl = selectedGroupId
      ? tooltipGroups[selectedGroupId]
      : e.currentTarget;

    tooltipMethods.setPopperTooltipTriggerRef?.(triggerEl);
    tooltipMethods.setAppTooltipProps?.({ title, ...appTooltipProps });
    tooltipMethods.popperTooltipUpdate?.();

    deferredShowTooltip(globalTooltipProps.delay, () =>
      tooltipMethods.setAppTooltipVisible?.(true)
    );
  }

  function onMouseLeave(e: React.MouseEvent<HTMLElement>) {
    deferredHideTooltip(() => tooltipMethods.setAppTooltipVisible?.(false));
  }

  return { onMouseEnter, onMouseLeave };
}

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
