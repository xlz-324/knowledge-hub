import { useEffect, useState } from 'react';
import { getReadiness } from './api/health';
import './App.css';

type HealthState = 'checking' | 'ready' | 'unavailable';

const healthContent: Record<
  HealthState,
  { label: string; title: string; description: string }
> = {
  checking: {
    label: '检查中',
    title: '正在连接后端服务',
    description: '正在请求 /api/v1/health/ready，请稍候。',
  },
  ready: {
    label: '运行正常',
    title: '前后端已连接',
    description: 'NestJS 已确认 API 可用。数据库检查将在 W2 接入。',
  },
  unavailable: {
    label: '连接失败',
    title: '暂时无法连接后端',
    description: '请确认 API 已启动，然后重新检查。页面不会把失败显示为正常。',
  },
};

function App() {
  const [health, setHealth] = useState<HealthState>('checking');
  const [requestKey, setRequestKey] = useState(0);
  const [checking, setChecking] = useState(true);
  const content = healthContent[health];

  const checkHealth = () => {
    setHealth('checking');
    setChecking(true);
    setRequestKey((key) => key + 1);
  };

  useEffect(() => {
    const controller = new AbortController();

    getReadiness(controller.signal)
      .then(() => setHealth('ready'))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        setHealth('unavailable');
      })
      .finally(() => {
        if (!controller.signal.aborted) setChecking(false);
      });

    return () => controller.abort();
  }, [requestKey]);

  return (
    <main className="app-shell">
      <header className="brand">
        <span className="brand-mark" aria-hidden="true">
          K
        </span>
        KnowledgeHub
      </header>

      <section className="welcome" aria-labelledby="page-title">
        <p className="eyebrow">W1 · 可运行骨架</p>
        <h1 id="page-title">保存资料，也保存理解的线索。</h1>
        <p className="intro">
          网页收藏、Markdown 笔记与知识问答。当前先验证前后端的真实连接。
        </p>
      </section>

      <section
        className={`health-card ${health}`}
        aria-labelledby="health-title"
      >
        <div className="status-heading">
          <span className="status-dot" aria-hidden="true" />
          <span>{content.label}</span>
        </div>
        <h2 id="health-title">{content.title}</h2>
        <p>{content.description}</p>
        <div className="health-footer">
          <code>GET /api/v1/health/ready</code>
          <button type="button" onClick={checkHealth} disabled={checking}>
            {checking ? '检查中…' : '重新检查'}
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
