import { useState, useRef, useEffect } from 'react'
import boxImage from '../public/box.png';
import { Box, Button, ButtonsBox, HeaderTextID, Particle, PortalBox } from './styles.ts';
import { WindowObserver } from './WindowObserver';
import { AnimationParams, Path as IPath } from './types.ts';
import { Path } from './Path';
import { STORAGE_ANIMATION_STATE, STORAGE_WINDOWS_PARAMS_NAME } from './StorageManager';
import { ClearIcon, NewWindowIcon, StartIcon, StopIcon } from './Icons';
const wo = new WindowObserver();
let pathBuilder: Path;

function App() {
  const [path, setPath] = useState<IPath>();
  const [hasAnimation, setHasAnimation] = useState(false);
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
    if (event.key === STORAGE_WINDOWS_PARAMS_NAME) {
      pathBuilder.update({
        windowParams: wo.getWindowParamsFromStore(),
        anotherWindowParams: wo.getAnotherWindowParamsFromStore(),
      });
      updatePath();
    }

    if (event.key === STORAGE_ANIMATION_STATE && wo.activeAnimation === wo.id) {
      setHasAnimation(true);
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
    window.addEventListener('storage', handleUpdateStorage, true);
    window.addEventListener('updateWindow', handleUpdateWindow);

    return () => {
      window.removeEventListener('storage', handleUpdateStorage);
      window.removeEventListener('updateWindow', handleUpdateWindow);
    }
  }, []);

  const updatePath = () => {
    const to = pathBuilder.getIntersectionPoint();
    const from: AnimationParams = {
      x: getPortalPosition() ? getPortalPosition()?.x + getPortalPosition()?.width / 2 : 0,
      y: getPortalPosition() ? getPortalPosition()?.y + getPortalPosition()?.height / 2 : 0,
    };

    if (wo.isMain) {
      setPath({
        from,
        to,
      });
    } else {
      setPath({
        to: from,
        from: to,
      });
    }
  };

  useEffect(() => {
      const position: DOMRect | null = getPortalPosition();

      if (position) {
        pathBuilder = new Path({
          portalPosition: position,
          windowParams: wo.getWindowParamsFromStore(),
          anotherWindowParams: wo.getAnotherWindowParamsFromStore(),
          isMain: wo.isMain,
        });

        updatePath();
      }
  }, []);

  const handleStartAnimation = () => {
    wo.startAnimation();
    setHasAnimation(true);
  }

  const handleEndAnimation = () => {
    wo.stopAnimation();
    setHasAnimation(false);
  }

  const handleClickStart = () => {
    wo.start();
    setHasAnimation(wo.activeAnimation === wo.id || wo.animationCount === 1);
  }

  return (
    <Box>
      <ButtonsBox>
        <Button onClick={handleClickStart} hint='Start'><StartIcon /></Button>
        <Button onClick={() => wo.stop()} hint='Stop'><StopIcon /></Button>
        <Button onClick={() => wo.clear()} hint='Clear Cache'><ClearIcon /></Button>
        <Button onClick={handleOpenNewWindow} hint='Open New Window'><NewWindowIcon /></Button>
      </ButtonsBox>
      {
        wo.id && (<HeaderTextID>ID: {wo.id}</HeaderTextID>)
      }

      {
        hasAnimation ? <Particle
          hasAnimation={hasAnimation}
          onAnimationEnd={handleEndAnimation}
          onAnimationStart={handleStartAnimation}
          alt=''
          src={boxImage}
          from={{ x: path?.from?.x, y: path?.from?.y }}
          to={{ x: path?.to?.x, y: path?.to?.y }}
        /> : null
      }

      <PortalBox ref={portalRef} isMain={wo.isMain} />
    </Box>
  );
}

export default App
