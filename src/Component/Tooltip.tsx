import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  useArrowContainer,
  usePopover,
  PopoverState,
} from 'react-tiny-popover';
import { useSingleton } from './use-singleton';
import {
  DEFAULT_DELAY,
  initTooltipMethods,
  resetTooltipMethods,
  setGlobalTooltipProps,
} from '../tooltip-methods';
import { createCssVarsForStyleProp, cx } from './Tooltip.utils';
import styles from './Tooltip.module.scss';

export default function Tooltip({
  backgroundColor = 'var(--color-black)',
  borderColor = '#3a3a3a',
  arrowSize = 5,
  delay = DEFAULT_DELAY,
  className,
  arrowClassName,
}: {
  backgroundColor?: string;
  borderColor?: string;
  arrowSize?: number;
  delay?: number;
  className?: string;
  arrowClassName?: string;
} = {}) {
  useSingleton('tooltip');

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [popoverState, setPopoverState] = useState<PopoverState>({
    childRect: {} as any,
    popoverRect: {} as any,
    parentRect: {} as any,
    boundaryRect: {} as any,
    padding: 10,
    nudgedLeft: 0,
    nudgedTop: 0,
    boundaryInset: 10,
  });

  const childRef = useRef<HTMLElement>();

  const { positionPopover, popoverRef } = usePopover({
    childRef,
    positions: ['bottom'],
    align: 'center',
    padding: 10,
    reposition: true,
    boundaryInset: 0,
    parentElement: document.body,
    boundaryElement: document.body,
    onPositionPopover: setPopoverState,
  });

  const { arrowContainerStyle, arrowStyle } = useArrowContainer({
    ...popoverState,
    arrowColor: backgroundColor,
    arrowSize: arrowSize,
  });

  useEffect(() => {
    initTooltipMethods({
      setPopperTooltipTriggerRef: (ref) => {
        childRef.current = ref ?? undefined;
      },
      setAppTooltipProps: (props) => {
        if (
          !props ||
          !contentRef.current ||
          !titleRef.current ||
          !subtitleRef.current
        ) {
          return;
        }

        contentRef.current.style.maxWidth = props.maxWidth ?? 'none';
        titleRef.current.innerText = props.title;
        subtitleRef.current.style.display = props.subtitle ? 'block' : 'none';
        subtitleRef.current.innerText = props.subtitle ?? '';
      },
      setAppTooltipVisible: setTooltipVisible,
      popperTooltipUpdate: positionPopover,
    });

    return () => {
      resetTooltipMethods();
    };
  }, [positionPopover]);

  useEffect(() => {
    setGlobalTooltipProps({
      delay: delay,
    });
  }, [delay]);

  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  return ReactDOM.createPortal(
    <div
      ref={popoverRef}
      className={cx(styles.tooltipContainer, className)}
      style={{
        visibility: tooltipVisible ? 'visible' : 'hidden',
        ...arrowContainerStyle,
        ...createCssVarsForStyleProp({
          '--arrow-size': `${arrowSize}px`,
          '--background-color': backgroundColor,
          '--border-color': borderColor,
        }),
      }}
    >
      <div className={cx(styles.arrow, arrowClassName)} style={arrowStyle} />
      <div className={styles.content} ref={contentRef}>
        <div className={styles.title} ref={titleRef}></div>
        <div className={styles.subtitle} ref={subtitleRef}></div>
      </div>
    </div>,
    document.body
  );
}
