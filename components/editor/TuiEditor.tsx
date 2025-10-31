'use client';

import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { useRef, forwardRef, useImperativeHandle } from 'react';

interface TuiEditorProps {
  initialValue?: string;
  height?: string;
  placeholder?: string;
}

export interface TuiEditorHandle {
  getMarkdown: () => string;
  getHTML: () => string;
  setMarkdown: (markdown: string) => void;
  setHTML: (html: string) => void;
}

const TuiEditor = forwardRef<TuiEditorHandle, TuiEditorProps>(
  ({ initialValue = '', height = '500px', placeholder = '내용을 입력하세요' }, ref) => {
    const editorRef = useRef<Editor>(null);

    useImperativeHandle(ref, () => ({
      getMarkdown: () => {
        return editorRef.current?.getInstance().getMarkdown() || '';
      },
      getHTML: () => {
        return editorRef.current?.getInstance().getHTML() || '';
      },
      setMarkdown: (markdown: string) => {
        editorRef.current?.getInstance().setMarkdown(markdown);
      },
      setHTML: (html: string) => {
        editorRef.current?.getInstance().setHTML(html);
      },
    }));

    return (
      <Editor
        ref={editorRef}
        initialValue={initialValue}
        previewStyle="vertical"
        height={height}
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        placeholder={placeholder}
        hideModeSwitch={false}
      />
    );
  }
);

TuiEditor.displayName = 'TuiEditor';

export default TuiEditor;
