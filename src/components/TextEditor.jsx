import React, { useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';

function TextEditor({ input, onInputChange }) {

    return (
        <CodeMirror
            value={input}
            height="200px"
            onChange={onInputChange}
        />
    )
}

export default TextEditor
