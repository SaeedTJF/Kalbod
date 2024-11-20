
import React from 'react';
import SimpleCodeEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python'; // یا هر زبان دیگری که نیاز دارید
import 'prismjs/themes/prism.css';

const Codeedit = ({ value, onChange }) => {
    const handleChange = (code) => {
        onChange(code);
    };

    return (
        <SimpleCodeEditor
            value={value}
            onValueChange={handleChange}
            highlight={(code) => highlight(code, languages.python, 'python')}
            padding={10}
            style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
                minHeight: 300,
                border: '1px solid #ddd',
            }}
        />
    );
};

export default Codeedit;