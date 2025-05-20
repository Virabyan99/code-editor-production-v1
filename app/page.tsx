// app/page.tsx
import ConsolePane from '@/components/ConsolePane';
import EditorPane from '@/components/EditorPane';
import Toolbar from '@/components/Toolbar';
import DialogBridge from '@/components/DialogBridge';
import TimerBridge from '@/components/TimerBridge';
import { DialogHost } from '@/components/DialogHost';

const HomePage = () => {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr]">
      <Toolbar />
      <main className="grid grid-cols-1 gap-0 lg:grid-cols-2">
        <EditorPane />
        <ConsolePane />
      </main>
      <DialogBridge />
      <TimerBridge />
      <DialogHost />
    </div>
  );
};

export default HomePage;