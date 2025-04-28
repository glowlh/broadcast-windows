import { useState } from 'react'
import { Box } from "./styles.ts";
import { WindowObserver } from './WindowObserver';
const wo = new WindowObserver();

function App() {
  const [count, setCount] = useState(0);

  const handleOpenNewWindow = (event) => {
    window.open('/', `window ${self.crypto.randomUUID()}`, 'width=600,height=400');
  }

  return (
    <Box>
      Window {wo.id}
      <button onClick={() => wo.stop()}>Stop</button>
      <button onClick={() => wo.clear()}>Clear</button>
      <button onClick={handleOpenNewWindow}>Open new window</button>
    </Box>
  );
}

export default App
