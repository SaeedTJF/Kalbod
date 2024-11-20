import React from 'react';
import Codeedit from "@/components/ChatConversation/codeeditor";

const markdownToHtml = (markdown) => {
    if (typeof markdown !== 'string') {
        markdown = String(markdown);
    }

    const codeBlocks = [];
    const html = markdown
        .replace(/```([^`]+)```/g, (match, code) => {
            codeBlocks.push(code.trim());
            return `<code-block></code-block>`;
        })
        .replace(/\n/g, '<br/>');

    return { html, codeBlocks };
};

const MarkdownRenderer = ({ markdown }) => {
    const { html, codeBlocks } = markdownToHtml(markdown);

    return (
        <div>
            {html.split('<code-block></code-block>').map((part, index) => (
                <React.Fragment key={index}>
                    <div dangerouslySetInnerHTML={{ __html: part }} />
                    {index < codeBlocks.length && (
                        <Codeedit initialCode={codeBlocks[index]} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default MarkdownRenderer;
