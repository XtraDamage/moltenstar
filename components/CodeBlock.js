'use client';
import { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import php from 'highlight.js/lib/languages/php';
import ruby from 'highlight.js/lib/languages/ruby';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import sql from 'highlight.js/lib/languages/sql';
import yaml from 'highlight.js/lib/languages/yaml';
import markdown from 'highlight.js/lib/languages/markdown';
import swift from 'highlight.js/lib/languages/swift';
import kotlin from 'highlight.js/lib/languages/kotlin';
import dart from 'highlight.js/lib/languages/dart';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('css', css);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('java', java);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('php', php);
hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('swift', swift);
hljs.registerLanguage('kotlin', kotlin);
hljs.registerLanguage('dart', dart);

const FILE_EXTENSIONS = { javascript: 'js', typescript: 'ts', python: 'py', java: 'java', cpp: 'cpp', csharp: 'cs', php: 'php', ruby: 'rb', go: 'go', rust: 'rs', sql: 'sql', yaml: 'yml', markdown: 'md', swift: 'swift', kotlin: 'kt', dart: 'dart', json: 'json', css: 'css', html: 'html', xml: 'xml', bash: 'sh' };

export default function CodeBlock({ code, language }) {
  const codeRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleDownload = () => {
    const ext = FILE_EXTENSIONS[language] || 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="code-block">
      <div className="code-block__header">
        <span className="code-block__language">{language || 'text'}</span>
        <div className="code-block__actions">
          <button className="code-block__btn" onClick={handleCopy}>
            <span className="material-symbols-rounded">{copied ? 'check' : 'content_copy'}</span>
            <span className="code-block__btn-label">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button className="code-block__btn" onClick={handleDownload}>
            <span className="material-symbols-rounded">download</span>
            <span className="code-block__btn-label">Download</span>
          </button>
        </div>
      </div>
      <div className="code-block__content">
        <pre>
          <code ref={codeRef} className={`language-${language || 'plaintext'}`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
