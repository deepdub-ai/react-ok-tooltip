import { useEffect, useRef } from 'react';
import { tooltipGroups } from './tooltip-groups';
import { deferredHideTooltip, deferredShowTooltip } from './tooltip-helpers';
import { globalTooltipProps, tooltipMethods, TooltipProps } from './tooltip-methods';

export const DEFAULT_DELAY = 1000;

const registeredElements = new WeakMap<HTMLElement, TooltipProps>();
const unregisterCallbacks = new WeakMap<HTMLElement, () => void>();

function isEqual(a: TooltipProps | undefined, b: TooltipProps) {
  if (!a) {
    return false;
  }

  return !Object.keys(a).some((key) => a[key as keyof TooltipProps] !== b[key as keyof TooltipProps]);
}

export function tooltip(
  title: string,
  { groupId, ...appTooltipProps }: { groupId?: string | null } & Omit<TooltipProps, 'title'> = {}
) {
  return (element: HTMLElement | null) => {
    if (!element) {
      return;
    }

    const tooltipProps = { title, ...appTooltipProps };

    const isUpdate = element && registeredElements.has(element);

    if (isEqual(registeredElements.get(element), tooltipProps)) {
      return;
    }

    registeredElements.set(element, tooltipProps);

    // Once the tooltip is shown, and only while it's shown, we set an interval
    // to check if the anchor element is in the viewport, if it's not, we remove
    // the tooltip.
    //
    let unmountPollingInterval: NodeJS.Timer;

    function onMouseEnter() {
      const wrappingGroupId = element!.closest<HTMLElement>('[data-ok-tooltip-group-id]')?.dataset.okTooltipGroupId;

      // If groupId is undefined, we fallback to wrappingGroupId.
      // If groupId === null, we want selectdGroupId to be null as well.
      // Otherwise (groupId is of type string), we use groupId.
      //
      const selectedGroupId = groupId === undefined ? wrappingGroupId : groupId;

      const triggerEl = selectedGroupId ? tooltipGroups[selectedGroupId] : element;

      if (appTooltipProps.whenOverflow && triggerEl && triggerEl?.scrollWidth <= triggerEl?.clientWidth) {
        return;
      }

      tooltipMethods.setPopperTooltipTriggerRef?.(triggerEl);
      tooltipMethods.setAppTooltipProps?.({ title, ...appTooltipProps });
      tooltipMethods.popperTooltipUpdate?.(appTooltipProps.position);

      deferredShowTooltip(globalTooltipProps.delay, () => {
        tooltipMethods.setAppTooltipVisible?.(true);

        clearInterval(unmountPollingInterval);

        unmountPollingInterval = setInterval(() => {
          if (triggerEl?.closest('body')) {
            return;
          }

          tooltipMethods.setAppTooltipVisible?.(false);
          clearInterval(unmountPollingInterval);
        }, 500);
      });
    }

    function onMouseLeave() {
      deferredHideTooltip(() => {
        tooltipMethods.setAppTooltipVisible?.(false);
        clearInterval(unmountPollingInterval);
      });
    }

    function onMouseDown() {
      deferredHideTooltip();
      tooltipMethods.setAppTooltipVisible?.(false);
      clearInterval(unmountPollingInterval);
    }

    element.addEventListener('mouseenter', onMouseEnter);
    element.addEventListener('mouseleave', onMouseLeave);
    element.addEventListener('mousedown', onMouseDown);

    if (isUpdate) {
      unregisterCallbacks.get(element)?.();
    }

    unregisterCallbacks.set(element, () => {
      element.removeEventListener('mouseenter', onMouseEnter);
      element.removeEventListener('mouseleave', onMouseLeave);
      element.removeEventListener('mousedown', onMouseDown);
    });
  };
}

const absPositionTriggerEl = document.createElement('div');
Object.assign(absPositionTriggerEl.style, {
  position: 'fixed',
  width: '1px',
  height: '1px',
});
absPositionTriggerEl.id = 'okTooltipAbsPositionTriggerEl';
document.body.appendChild(absPositionTriggerEl);

export function showTooltip(title: string, x: number, y: number, props: Omit<TooltipProps, 'title'>) {
  tooltipMethods.setAppTooltipProps?.({ title, ...props });
  absPositionTriggerEl.style.left = `${x}px`;
  absPositionTriggerEl.style.top = `${y}px`;
  tooltipMethods.setPopperTooltipTriggerRef?.(absPositionTriggerEl);
  tooltipMethods.setAppTooltipVisible?.(true);
}

export function hideTooltip() {
  tooltipMethods.setAppTooltipVisible?.(false);
}
