import ConsolePane from "@/components/ConsolePane";
import EditorPane from "@/components/EditorPane";
import Toolbar from "@/components/Toolbar";


const HomePage = () => {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr]">
      <Toolbar />
      <main className="grid grid-cols-1 gap-0 lg:grid-cols-2">
        <EditorPane />
        <ConsolePane />
      </main>
    </div>
  );
};

export default HomePage;