export const tooltipGroups: { [groupId: string]: HTMLElement } = {};

export function tooltipGroup(groupId?: string) {
  return (element: HTMLElement | null) => {
    groupId ??= `tooltipGroup_${Math.round(Math.random() * 100000).toString()}`;

    function handleMouseOver(e: MouseEvent) {
      tooltipGroups[groupId!] = e.currentTarget as HTMLElement;
    }

    if (!element) {
      return;
    }

    element.addEventListener('mouseover', handleMouseOver, { capture: true });
    element.dataset.okTooltipGroupId = groupId;
  };
}
