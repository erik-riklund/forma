import { makeFileWatcher } from '.'

declare global
{
  namespace FileWatcher
  {
    /**
     * A function type that is called when a tracked file changes.
     */
    type Callback = (file: FileHandler.FileObject) => void;

    /**
     * The type of events that can be triggered by the file watcher.
     */
    type Event = 'create' | 'change' | 'delete';

    /**
     * The type of an instantiated file watcher, returned by `makeFileWatcher`.
     */
    type Instance = ReturnType<typeof makeFileWatcher>;

    /**
     * Represents a single listener registered with the file watcher,
     * including its callback function and a timestamp of the last time it was invoked.
     */
    type Listener = { callback: Callback, lastInvoked: number };

    /**
     * Configuration options for the file watcher,
     * controlling check interval and debounce time.
     */
    type Options = { interval: number, debounce: number };

    /**
     * Represents the current state of a file being tracked, including
     * the file object itself and its last known modification timestamp.
     */
    type TrackedFileState = { file: FileHandler.FileObject, modified: number };
  }
}