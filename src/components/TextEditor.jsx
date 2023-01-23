import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { githubLightInit } from '@uiw/codemirror-theme-github';

function TextEditor({ input, onChange }) {

    return (
        <CodeMirror
            value={input}
            height="300px"
            onChange={onChange}
            theme={githubLightInit({
                settings: {
                    background: '#F5F6FA',
                    foreground: '#000',
                    // caret: '#F5F6FA',
                    // selection: '#F5F6FA',
                    // selectionMatch: '#F5F6FA',
                    // lineHighlight: '#F5F6FA',
                    gutterBackground: '#F5F6FA',
                    gutterForeground: '#adadad',
                }
            })}
        />
    )
}

export default TextEditor
