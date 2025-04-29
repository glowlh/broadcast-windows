import {useState, useRef, useEffect} from 'react'
import {Box, Particle, PortalBox} from "./styles.ts";
import { WindowObserver } from './WindowObserver';
import { Path as IPath } from "./types.ts";
import {Path} from "./Path";
const wo = new WindowObserver();

function App() {
  const [portalPosition, setPortalPosition] = useState<DOMRect>(null);
  const [path, setPath] = useState<IPath>();
  const portalRef = useRef(null);

  const handleOpenNewWindow = (event) => {
    window.open('/', `window ${self.crypto.randomUUID()}`, 'width=600,height=400');
  }

  useEffect(() => {
    if (portalRef?.current) {
      const position: DOMRect = portalRef.current.getBoundingClientRect();
      setPortalPosition(position);

      const nextPath = new Path({
        portalPosition: position,
        windowParams: wo.getWindowParamsFromStore(),
        anotherWindowParams: wo.getAnotherWindowParamsFromStore(),
        isMain: wo.isMain(),
      });
      const to = nextPath.getIntersectionPoint();
      const from = {
        x: position.x,
        y: position.y,
      };

      setPath({
        from,
        to,
      });
    }
  }, []);

  return (
    <Box>
      Window {wo.id}
      <button onClick={() => wo.start()}>Start</button>
      <button onClick={() => wo.stop()}>Stop</button>
      <button onClick={() => wo.clear()}>Clear</button>
      <button onClick={handleOpenNewWindow}>Open new window</button>

      <Particle
        from={{ x: path?.from?.x, y: path?.from?.y }}
        to={{ x: path?.to?.x, y: path?.to?.y }}
      />
      <PortalBox ref={portalRef} />
    </Box>
  );
}

export default App
