import { tooltipGroups } from './tooltip-groups';
import { deferredHideTooltip, deferredShowTooltip } from './tooltip-helpers';
import { globalTooltipProps, tooltipMethods } from './tooltip-methods';

export const DEFAULT_DELAY = 1000;

export interface TooltipProps {
  title: string;
  subtitle?: string;
  maxWidth?: string;
}

export function tooltip(
  title: string,
  {
    groupId,
    ...appTooltipProps
  }: { groupId?: string | null } & Omit<TooltipProps, 'title'> = {}
) {
  return (element: HTMLElement | null) => {
    function onMouseEnter(e: MouseEvent) {
      const wrappingGroupId = element!.closest<HTMLElement>(
        '[data-ok-tooltip-group-id]'
      )?.dataset.okTooltipGroupId;

      // If groupId is undefined, we fallback to wrappingGroupId.
      // If groupId === null, we want selectdGroupId to be null as well.
      // Otherwise (groupId is of type string), we use groupId.
      //
      const selectedGroupId = groupId === undefined ? wrappingGroupId : groupId;

      const triggerEl = selectedGroupId
        ? tooltipGroups[selectedGroupId]
        : element;

      tooltipMethods.setPopperTooltipTriggerRef?.(triggerEl);
      tooltipMethods.setAppTooltipProps?.({ title, ...appTooltipProps });
      tooltipMethods.popperTooltipUpdate?.();

      deferredShowTooltip(globalTooltipProps.delay, () =>
        tooltipMethods.setAppTooltipVisible?.(true)
      );
    }

    function onMouseLeave(e: MouseEvent) {
      deferredHideTooltip(() => tooltipMethods.setAppTooltipVisible?.(false));
    }

    element?.addEventListener('mouseenter', onMouseEnter);
    element?.addEventListener('mouseleave', onMouseLeave);
  };
}
