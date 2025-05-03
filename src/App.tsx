import { useState, useRef, useEffect } from 'react'
import { Box, Particle, PortalBox } from './styles.ts';
import { WindowObserver } from './WindowObserver';
import { AnimationParams, Path as IPath } from './types.ts';
import { Path } from './Path';
import { StorageManager } from './StorageManager';
const wo = new WindowObserver();
let pathBuilder: Path;

function App() {
  const [path, setPath] = useState<IPath>();
  const portalRef = useRef(null);

  const getPortalPosition = () => {
    if (portalRef?.current) {
      const position: DOMRect = portalRef.current.getBoundingClientRect();
      return position;
    }

    return null;
  };

  const handleOpenNewWindow = () => {
    window.open('/', `window ${self.crypto.randomUUID()}`, 'width=600,height=400');
  }

  const handleUpdateStorage = (event) => {
    if (event && event.newValue) {
      const parsed = JSON.parse(event.newValue);

      pathBuilder.update({
        windowParams: parsed[wo.id],
        anotherWindowParams: parsed[wo.getAnotherWindowParamsFromStore()?.id],
      });
      updatePath();
    }
  };

  const handleUpdateWindow = () => {
    pathBuilder.update({
      windowParams: wo.getWindowParamsFromStore(),
      anotherWindowParams: wo.getAnotherWindowParamsFromStore(),
    });
    updatePath();
  }

  useEffect(() => {
    // TODO: listen for another window
    window.addEventListener('storage', handleUpdateStorage, true);
    window.addEventListener('updateWindow', handleUpdateWindow);

    return () => window.removeEventListener('storage', handleUpdateStorage);
  }, []);

  const updatePath = () => {
    const to = pathBuilder.getIntersectionPoint();
    const from: AnimationParams = {
      x: getPortalPosition()?.x || 0,
      y: getPortalPosition()?.y || 0,
    };

    setPath({
      from,
      to,
    });
  };

  useEffect(() => {
      const position: DOMRect | null = getPortalPosition();

      if (position) {
        pathBuilder = new Path({
          portalPosition: position,
          windowParams: wo.getWindowParamsFromStore(),
          anotherWindowParams: wo.getAnotherWindowParamsFromStore(),
          isMain: wo.isMain(),
        });

        updatePath();
      }
  }, []);

  return (
    <Box>
      Window {wo.id}
      <button onClick={() => wo.start()}>Start</button>
      <button onClick={() => wo.stop()}>Stop</button>
      <button onClick={() => wo.clear()}>Clear</button>
      <button onClick={handleOpenNewWindow}>Open new window</button>

      {
        wo.isMain() ? <Particle
          from={{ x: path?.from?.x, y: path?.from?.y }}
          to={{ x: path?.to?.x, y: path?.to?.y }}
        /> : null
      }

      <PortalBox ref={portalRef} />
    </Box>
  );
}

export default App
