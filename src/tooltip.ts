import { tooltipGroups } from './tooltip-groups';
import { deferredHideTooltip, deferredShowTooltip } from './tooltip-helpers';
import { globalTooltipProps, tooltipMethods } from './tooltip-methods';

export const DEFAULT_DELAY = 1000;

export interface TooltipProps {
  title: string;
  subtitle?: string;
  maxWidth?: string;
  whenOverflow?: boolean;
}

export function tooltip(
  title: string,
  {
    groupId,
    ...appTooltipProps
  }: { groupId?: string | null } & Omit<TooltipProps, 'title'> = {}
) {
  return (element: HTMLElement | null) => {
    // Once the tooltip is shown, and only while it's shown, we set an interval
    // to check if the anchor element is in the viewport, if it's not, we remove
    // the tooltip.
    //
    let unmountPollingInterval: number;

    function onMouseEnter() {
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

      if (
        appTooltipProps.whenOverflow &&
        triggerEl &&
        triggerEl?.scrollWidth <= triggerEl?.clientWidth
      ) {
        return;
      }

      tooltipMethods.setPopperTooltipTriggerRef?.(triggerEl);
      tooltipMethods.setAppTooltipProps?.({ title, ...appTooltipProps });
      tooltipMethods.popperTooltipUpdate?.();

      deferredShowTooltip(globalTooltipProps.delay, () => {
        tooltipMethods.setAppTooltipVisible?.(true);

        unmountPollingInterval = setInterval(() => {
          if (triggerEl?.closest('body')) {
            return;
          }

          tooltipMethods.setAppTooltipVisible?.(false);
          clearInterval(unmountPollingInterval);
        }, 500) as unknown as number;
      });
    }

    function onMouseLeave() {
      deferredHideTooltip(() => {
        tooltipMethods.setAppTooltipVisible?.(false);
        clearInterval(unmountPollingInterval);
      });
    }

    element?.addEventListener('mouseenter', onMouseEnter);
    element?.addEventListener('mouseleave', onMouseLeave);
  };
}
