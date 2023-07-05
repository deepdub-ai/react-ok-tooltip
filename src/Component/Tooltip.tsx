import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useArrowContainer, usePopover, PopoverState } from 'react-tiny-popover';
import { useSingleton } from './use-singleton';
import { DEFAULT_DELAY, initTooltipMethods, resetTooltipMethods, setGlobalTooltipProps } from '../tooltip-methods';
import { createCssVarsForStyleProp, cx } from './Tooltip.utils';
import styles from './Tooltip.module.scss';

export default function Tooltip({
  backgroundColor = '#ffffff',
  textColor = '#000000',
  textColorMuted = '#444444',
  borderColor = '#3a3a3a',
  arrowSize = 5,
  maxWidth,
  delay = DEFAULT_DELAY,
  className,
  arrowClassName,
}: {
  backgroundColor?: string;
  textColor?: string;
  textColorMuted?: string;
  borderColor?: string;
  arrowSize?: number;
  maxWidth?: string;
  delay?: number;
  className?: string;
  arrowClassName?: string;
} = {}) {
  useSingleton('tooltip');

  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [arrowColor, setArrowColor] = useState(backgroundColor);

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
    position: 'bottom',
  });

  const childRef = useRef<HTMLElement>();

  const { positionPopover, popoverRef } = usePopover({
    childRef,
    positions: ['bottom', 'top'],
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
    arrowColor: arrowColor,
    arrowSize: arrowSize,
  });

  useEffect(() => {
    initTooltipMethods({
      setPopperTooltipTriggerRef: (ref) => {
        childRef.current = ref ?? undefined;
      },
      setAppTooltipProps: (props) => {
        if (!props || !contentRef.current || !titleRef.current || !subtitleRef.current || !videoRef.current) {
          return;
        }

        if (props.video) {
          popoverRef.current.classList.add(styles.hasVideo);
          setArrowColor('var(--color-white)');
        } else {
          popoverRef.current.classList.remove(styles.hasVideo);
          setArrowColor(backgroundColor);
        }

        contentRef.current.style.maxWidth = props.maxWidth ?? maxWidth ?? 'none';

        titleRef.current.innerText = props.title;

        subtitleRef.current.style.display = props.subtitle ? 'block' : 'none';
        subtitleRef.current.innerText = props.subtitle ?? '';

        if (props.video) {
          videoRef.current.src = props.video;
          videoRef.current.style.display = '';
        } else {
          videoRef.current.style.display = 'none';
        }

        positionPopover({ positionIndex: props.position === 'top' ? 1 : 0 });
      },
      setAppTooltipVisible: setTooltipVisible,
      popperTooltipUpdate: (position) => {
        positionPopover({ positionIndex: position === 'top' ? 1 : 0 });
      },
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

  return ReactDOM.createPortal(
    <div
      ref={popoverRef}
      className={cx(styles.tooltipContainer, className)}
      style={{
        visibility: tooltipVisible ? 'visible' : 'hidden',
        ...arrowContainerStyle,
        ...createCssVarsForStyleProp({
          '--ok-tooltip-arrow-size': `${arrowSize}px`,
          '--ok-tooltip-background-color': backgroundColor,
          '--ok-tooltip-border-color': borderColor,
          '--ok-tooltip-text-color': textColor,
          '--ok-tooltip-text-color-muted': textColorMuted,
        }),
      }}
    >
      <div
        className={cx(
          styles.arrow,
          popoverState.position === 'top' ? styles.top : undefined,
          popoverState.position === 'bottom' ? styles.bottom : undefined,
          arrowClassName
        )}
        style={arrowStyle}
      />
      <div className={styles.content} ref={contentRef}>
        <div className={styles.title} ref={titleRef}></div>
        <div className={styles.subtitle} ref={subtitleRef}></div>
        <video className={styles.video} ref={videoRef} autoPlay loop></video>
      </div>
    </div>,
    document.body
  );
}
