type TooltipState =
  | 'await-show'
  | 'visible'
  | 'await-hide'
  | 'hidden-grace'
  | 'hidden';

let state: TooltipState = 'hidden';
let timeout: number;

function wait(callback: Function, delay: number) {
  timeout = window.setTimeout(callback, delay);
}

function unwait() {
  clearTimeout(timeout);
}

export function deferredShowTooltip(delay: number, showTooltip: Function) {
  if (state === 'await-show') {
    return;
  }

  if (state === 'visible') {
    return;
  }

  if (state === 'await-hide' || state === 'hidden-grace') {
    unwait();
    state = 'visible';
    showTooltip();
  }

  if (state === 'hidden') {
    state = 'await-show';

    wait(() => {
      state = 'visible';
      showTooltip();
    }, delay);
  }
}

export function deferredHideTooltip(hideTooltip: Function) {
  if (state === 'await-show') {
    unwait();
    state = 'hidden';
  }

  if (state === 'visible') {
    state = 'await-hide';
    wait(() => {
      hideTooltip();
      state = 'hidden-grace';
      wait(() => {
        state = 'hidden';
      }, 500);
    }, 50);
  }

  if (state === 'await-hide') {
    return;
  }

  if (state === 'hidden-grace') {
    return;
  }

  if (state === 'hidden') {
    return;
  }
}
