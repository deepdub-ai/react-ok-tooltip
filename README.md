# React Ok Tooltip

React Ok Tooltip is a simple and easy to use tooltip component for React.

<img src="https://i.imgur.com/jLRn7Iy.gif"/>

## Usage

Inside **App.tsx**:

```tsx
import { Tooltip } from '@deepdub/react-ok-tooltip';
import '@deepdub/react-ok-tooltip/dist/tooltip.css';

function App() {
  return (
    <>
      {/* insert app here... */}
      <Tooltip arrowSize={5} />
    </>
  );
}
```

Then, inside **Component.tsx**:

<!-- prettier-ignore -->
```tsx
import { tooltip } from '@deepdub/react-ok-tooltip';

function Component() {
  return (
    <button ref={tooltip('I am a tooltip!')}>Hover me!</button>
  );
}
```

## Options

### Tooltip Options

`tooltip()` method accepts two parameters: `title` (a string) and `options` (an object of shape `TooltipProps`).

`TooltipProps` may include any of the follwing:

- **subtitle**: `string` - A subtitle that will appear, well, below the title.
- **maxWidth**: `string` - A **string**, passed to the tooltip's `style.maxWidth`.

All are optional.

### Global Tooltip Options

Customize the tooltip by passing any of these to `<Tooltip>`:

- **arrowSize**: `number` - The size of the arrow.
- **backgroundColor**: `string` - The background color of the tooltip.
- **borderColor**: `string` - The border color of the tooltip.
- **delay**: `number` - Tooltip delay in milliseconds (default: 1000).
- **className**: `string` - Will be passed on the to tooltip itself.
- **arrowClassName**: `string` - Will be passed on the to tooltip itself.

All are optional.

## Tooltip Group

React Ok Tooltip also supports a concept we've called "tooltip group".

A tooltip group lets you anchor multiple tooltips to a single element (as shown in the GIF above, when the cursor hovers the middle section).

### Usage

```tsx
import { tooltip } from '@deepdub/react-ok-tooltip';

function Component() {
  return (
    <div ref={tooltipGroup()}>
      <button ref={tooltip('Cut Selection')}>Cut</button>
      <button ref={tooltip('Copy Selection')}>Copy</button>
      <button ref={tooltip('Paste')}>Paste</button>
    </div>
  );
}
```
