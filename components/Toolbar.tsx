'use client';

import { useCodeRunner } from '@/lib/useCodeRunner';
import { useEditorStore } from '@/lib/store';
import {
  Sun,
  Moon,
  Download,
  Upload,
  ClipboardCopy,
  Code2Icon,
  Trash,
  Trash2,
  MoreHorizontal,
  Settings,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { z } from 'zod';
import { ChangeEvent, useRef, useState, useEffect } from 'react';
import { useConsoleStore } from '@/lib/consoleStore';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

const fileSchema = z.object({
  name: z
    .string()
    .endsWith('.js')
    .or(z.string().endsWith('.txt'))
    .or(z.string().endsWith('.json')),
  content: z.string().min(1),
});

export default function Toolbar() {
  const { run } = useCodeRunner();
  const { code, setCode, wordWrap, toggleWordWrap } = useEditorStore();
  const { clear: clearConsole, isOverwrite, toggleOverwrite } = useConsoleStore();
  const { resolvedTheme, setTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      console.info('Copied to clipboard');
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const download = () => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const ts = new Date().toISOString();
    a.download = `jspen_${ts}.js`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      fileSchema.parse({ name: file.name, content: text });
      setCode(text);
      clearConsole();
    } catch {
      alert('Invalid file type or empty content.');
    } finally {
      e.target.value = '';
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const clearAll = () => {
    setCode('');
    clearConsole();
  };

  return (
    <header className="flex items-center gap-2 border-b border-border px-4 shadow-sm bg-background">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="rounded-full bg-background text-foreground hover:text-gray-900 dark:hover:text-white transition-all duration-300">
              <img
                src={
                  mounted
                    ? resolvedTheme === 'dark'
                      ? '/logodark.png'
                      : '/logo.png'
                    : '/logo.png'
                }
                alt="jspen logo"
                className="h-12 w-auto"
              />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>JS Pen</p>
          </TooltipContent>
        </Tooltip>

        {/* Icon buttons with Tooltips */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => console.log('Current code:', code)} aria-label="Log current code">
              <Code2Icon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Log current code</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={copy} aria-label="Copy to clipboard">
              <ClipboardCopy className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy to clipboard</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={download} aria-label="Download file">
              <Download className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download file</p>
          </TooltipContent>
        </Tooltip>

        <input
          ref={inputRef}
          type="file"
          accept=".js,.txt,.json"
          className="hidden"
          onChange={onUpload}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => inputRef.current?.click()} aria-label="Upload file">
              <Upload className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Upload file</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {mounted ? (
                resolvedTheme === 'dark' ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )
              ) : (
                <Moon className="size-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle theme</p>
          </TooltipContent>
        </Tooltip>

        {/* Action buttons with Tooltips */}
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="default" size="sm" onClick={run}>
                Run
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Run the code</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="destructive" size="sm" onClick={clearAll}>
                <Trash />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear editor and console</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="destructive" size="sm" onClick={clearConsole}>
                <Trash2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear console only</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="More options">
                    <Settings className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>More options</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                checked={isOverwrite}
                onCheckedChange={() => toggleOverwrite()}
              >
                Overwrite
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={wordWrap}
                onCheckedChange={() => toggleWordWrap()}
              >
                Word Wrap
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TooltipProvider>
    </header>
  );
}