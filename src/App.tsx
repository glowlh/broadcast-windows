import {useState, useRef, useEffect} from 'react'
import {Box, Particle, PortalBox} from "./styles.ts";
import { WindowObserver } from './WindowObserver';
import { Path as IPath } from "./types.ts";
import {Path} from "./Path";
const wo = new WindowObserver();
let p: Path;

function App() {
  const [portalPosition, setPortalPosition] = useState<DOMRect>(null);
  const [path, setPath] = useState<IPath>();
  const portalRef = useRef(null);

  const handleOpenNewWindow = (event) => {
    window.open('/', `window ${self.crypto.randomUUID()}`, 'width=600,height=400');
  }

  const handleUpdateStorage = (event) => {
    console.log('storage');
    if (event && event.newValue) {
      const parsed = JSON.parse(event.newValue);
      console.dir({
        windowParams: parsed[wo.id],
        anotherWindowParams: parsed[wo.getAnotherWindowParamsFromStore()?.id],
      });

      p.update({
        windowParams: parsed[wo.id],
        anotherWindowParams: parsed[wo.getAnotherWindowParamsFromStore()?.id],
      });
      updatePath();
    }
  };

  useEffect(() => {
    // TODO: listen for another window
    window.addEventListener('storage', handleUpdateStorage, true);

    return () => window.removeEventListener('storage', handleUpdateStorage);
  }, []);

  const updatePath = () => {
    const to = p.getIntersectionPoint();
    const from = {
      x: portalPosition?.x,
      y: portalPosition?.y,
    };

    setPath({
      from,
      to,
    });
  };

  useEffect(() => {
    if (portalRef?.current) {
      const position: DOMRect = portalRef.current.getBoundingClientRect();
      setPortalPosition(position);

      p = new Path({
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
