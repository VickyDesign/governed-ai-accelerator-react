import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  useLocation,
  useNavigate,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import * as I from 'lucide-react';
import './styles.css';

const API_URL = 'http://127.0.0.1:8000';

/* =========================
   BACKEND DATA
========================= */

function useAgents() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/agents`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch agents');
        }
        return response.json();
      })
      .then((data) => {
        setAgents(data.agents || []);
      })
      .catch((error) => {
        console.error('Failed to load agents:', error);
      });
  }, []);

  return agents;
}

/* =========================
   REGISTER AGENT MODAL
========================= */

function RegisterAgentModal({ open, onClose }) {
  const [form, setForm] = useState({
    name: '',
    owner: '',
    risk: 'Medium',
    status: 'Ready',
    model: '',
    cost: '$0',
    run: ''
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Agent name is required.');
      return;
    }

    if (!form.owner.trim()) {
      setError('Owner is required.');
      return;
    }

    if (!form.model.trim()) {
      setError('Model is required.');
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/api/agents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name.trim(),
          owner: form.owner.trim(),
          risk: form.risk,
          status: form.status,
          model: form.model.trim(),
          cost: form.cost.trim() || '$0',
          run: form.run.trim() || null
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.detail || 'Failed to register agent.');
      }

      onClose();

      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          'Unable to register agent. Make sure the backend is running.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '24px'
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '620px',
          background: '#fff',
          borderRadius: '18px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '22px 24px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '5px'
              }}
            >
              Agent Registry
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: '22px',
                color: '#111827'
              }}
            >
              Register agent
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: 0,
              background: '#f3f4f6',
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={submit}>
          <div
            style={{
              padding: '24px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '18px'
            }}
          >
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={modalLabel}>Agent name</label>
              <input
                style={modalInput}
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g. Invoice Risk Analyzer"
              />
            </div>

            <div>
              <label style={modalLabel}>Owner</label>
              <input
                style={modalInput}
                value={form.owner}
                onChange={(e) => updateField('owner', e.target.value)}
                placeholder="e.g. Priya Sharma"
              />
            </div>

            <div>
              <label style={modalLabel}>Risk tier</label>
              <select
                style={modalInput}
                value={form.risk}
                onChange={(e) => updateField('risk', e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div>
              <label style={modalLabel}>Status</label>
              <select
                style={modalInput}
                value={form.status}
                onChange={(e) => updateField('status', e.target.value)}
              >
                <option>Ready</option>
                <option>Running</option>
                <option>Production-ready</option>
                <option>Approval pending</option>
              </select>
            </div>

            <div>
              <label style={modalLabel}>Model</label>
              <input
                style={modalInput}
                value={form.model}
                onChange={(e) => updateField('model', e.target.value)}
                placeholder="e.g. GPT-4.1"
              />
            </div>

            <div>
              <label style={modalLabel}>Monthly cost</label>
              <input
                style={modalInput}
                value={form.cost}
                onChange={(e) => updateField('cost', e.target.value)}
                placeholder="$0"
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={modalLabel}>Last run</label>
              <input
                style={modalInput}
                value={form.run}
                onChange={(e) => updateField('run', e.target.value)}
                placeholder="e.g. Oct 04, 10:30 AM"
              />
            </div>

            {error && (
              <div
                style={{
                  gridColumn: '1 / -1',
                  padding: '12px 14px',
                  borderRadius: '9px',
                  background: '#fef2f2',
                  color: '#b91c1c',
                  fontSize: '14px'
                }}
              >
                {error}
              </div>
            )}
          </div>

          <div
            style={{
              padding: '18px 24px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px'
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="btn"
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn primary"
              disabled={saving}
            >
              {saving ? 'Registering...' : 'Register agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const modalLabel = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '7px'
};

const modalInput = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '11px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '9px',
  outline: 'none',
  fontSize: '14px',
  background: '#fff'
};

/* =========================
   NAVIGATION
========================= */

const nav = [
  ['Overview', '/', 'Home'],
  ['Agent Registry', '/agents', 'Boxes'],
  ['Requests', '/requests', 'FileText'],
  ['PolicyIQ', '/policy', 'ShieldCheck'],
  ['Approvals', '/approvals', 'CheckCircle2'],
  ['ReadyScan', '/readiness', 'ScanSearch'],
  ['RunBridge', '/runs', 'Play'],
  ['CostLink', '/cost', 'ChartNoAxesCombined'],
  ['AuditRecord', '/evidence', 'FileCheck2']
];

const Icon = ({ name, size = 17 }) => {
  const C = I[name] || I.Circle;
  return <C size={size} />;
};

/* =========================
   LAYOUT
========================= */

function Layout({ children }) {
  const loc = useLocation();
  const [q, setQ] = useState('');

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandmark">◇</div>

          <div>
            <b>
              Governed Production
              <br />
              AI Accelerator
            </b>

            <small>CONTROL PLANE</small>
          </div>
        </div>

        <nav>
          {nav.map(([label, path, icon]) => (
            <Link
              key={path}
              className={
                (path === '/'
                  ? loc.pathname === path
                  : loc.pathname.startsWith(path))
                  ? 'active'
                  : ''
              }
              to={path}
            >
              <Icon name={icon} />
              <span>{label}</span>

              {label === 'Requests' && <em>6</em>}
            </Link>
          ))}
        </nav>

        <div className="sideBottom">
          <button>
            <Icon name="Settings" />
            Platform settings
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="workspace">
            <Icon name="Database" size={15} />
            Databricks Workspace
            <I.ChevronDown size={14} />
          </button>

          <div className="search">
            <I.Search size={16} />

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search agents, requests, owners…"
            />

            <kbd>⌘ K</kbd>
          </div>

          <div className="topActions">
            <I.Bell size={18} />
            <span className="notify"></span>
            <div className="avatar">VR</div>
            <span>Vignesh R</span>
            <I.ChevronDown size={14} />
          </div>
        </header>

        <section className="content">{children}</section>
      </main>
    </div>
  );
}

/* =========================
   SHARED COMPONENTS
========================= */

const Badge = ({ children, type = 'green' }) => (
  <span className={'badge ' + type}>{children}</span>
);

const Button = ({
  children,
  primary = false,
  danger = false,
  onClick
}) => (
  <button
    onClick={onClick}
    className={
      'btn ' +
      (primary ? 'primary ' : '') +
      (danger ? 'danger' : '')
    }
  >
    {children}
  </button>
);

function Title({ eyebrow, title, sub, actions }) {
  return (
    <div className="titleRow">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {sub && <div className="sub">{sub}</div>}
      </div>

      <div className="actions">{actions}</div>
    </div>
  );
}

function Metric({ label, value, trend, warning }) {
  return (
    <div className="card metric">
      <div className="label">{label}</div>
      <div className="value">{value}</div>

      {trend && (
        <div className={'trend ' + (warning ? 'warning' : '')}>
          {trend}
        </div>
      )}
    </div>
  );
}

/* =========================
   REGISTER BUTTON
========================= */

function RegisterButton({ children = '＋ Register agent' }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button primary onClick={() => setOpen(true)}>
        {children}
      </Button>

      <RegisterAgentModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

/* =========================
   PIPELINE
========================= */

function Pipeline() {
  const steps = [
    ['Register', 'Registry'],
    ['Request', 'RequestFlow'],
    ['Decide', 'PolicyIQ'],
    ['Approve', 'Human'],
    ['Ready', 'ReadyScan'],
    ['Execute', 'RunBridge'],
    ['Account', 'CostLink'],
    ['Evidence', 'AuditRecord']
  ];

  return (
    <div className="card pipeline">
      <div className="pipelineHead">
        <div>
          <h2>Governance pipeline</h2>

          <span className="sub">
            One request ID runs the whole way from registration to evidence.
          </span>
        </div>

        <Button>View all requests →</Button>
      </div>

      <div className="steps">
        {steps.map((s, i) => (
          <div
            className={
              'step ' +
              (i < 5 ? 'done ' : '') +
              (i === 5 ? 'current' : '')
            }
            key={s[0]}
          >
            <div className="bubble">{i + 1}</div>
            <b>{s[0]}</b>
            <small>{s[1]}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================
   AGENT TABLE
========================= */

function AgentTable({ limit = 5 }) {
  const agents = useAgents();
  const [deleteAgent, setDeleteAgent] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteAgent) return;

    setDeleting(true);

    try {
      const response = await fetch(
        `${API_URL}/api/agents/${deleteAgent.id}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete agent');
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Failed to delete agent. Please try again.');
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="card tableWrap">
        <table>
          <thead>
            <tr>
              <th>Agent</th>
              <th>Owner</th>
              <th>Risk</th>
              <th>Status</th>
              <th>Last run</th>
              <th>Monthly cost</th>
              <th>Evidence</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {agents.slice(0, limit).map((a) => (
              <tr key={a.id || a.name}>
                <td>
                  <b>{a.name}</b>
                </td>

                <td>{a.owner}</td>

                <td>
                  <Badge
                    type={
                      a.risk === 'High'
                        ? 'red'
                        : a.risk === 'Medium'
                        ? 'amber'
                        : 'blue'
                    }
                  >
                    {a.risk}
                  </Badge>
                </td>

                <td>
                  <Badge
                    type={
                      a.status?.toLowerCase().includes('pending')
                        ? 'amber'
                        : 'green'
                    }
                  >
                    {a.status}
                  </Badge>
                </td>

                <td>{a.run || '—'}</td>
                <td>{a.cost || '$0'}</td>
                <td className="spark">▂▅▇▆</td>

                <td>
                  <button
                    className="btn danger"
                    onClick={() => setDeleteAgent(a)}
                    type="button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteAgentModal
        agent={deleteAgent}
        onCancel={() => setDeleteAgent(null)}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </>
  );
}

/* =========================
   OVERVIEW
========================= */

function Overview() {
  return (
    <>
      <Title
        eyebrow="Overview"
        title="Governed Production AI Accelerator"
        sub="Databricks runs the agent. We make it owned, approved, production-ready, cost accountable and auditable."
      />

      <div className="grid4">
        <Metric
          label="Total agents"
          value="24"
          trend="↑ +3 this month"
        />

        <Metric
          label="Pending approvals"
          value="6"
          trend="2 need attention"
          warning
        />

        <Metric
          label="Production ready"
          value="18"
          trend="75% of total"
        />

        <Metric
          label="Monthly spend"
          value="$42.8k"
          trend="↑ 12% vs last month"
        />
      </div>

      <Pipeline />

      <div className="section">
        <div className="sectionHead">
          <h2>
            Active agents <span className="sub">(24)</span>
          </h2>

          <div className="filters">
            <div className="filter">⌕ Search agents</div>
            <div className="filter">All risk tiers⌄</div>
            <div className="filter">All status⌄</div>

            <RegisterButton />
          </div>
        </div>

        <AgentTable />
      </div>
    </>
  );
}

function DeleteAgentModal({ agent, onCancel, onConfirm, deleting }) {
  if (!agent) return null;

  return (
    <div className="modalOverlay" onClick={onCancel}>
      <div
        className="deleteModal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="deleteIcon">
          <I.Trash2 size={22} />
        </div>

        <div className="deleteModalContent">
          <h2>Delete agent?</h2>

          <p>
            Are you sure you want to delete{' '}
            <strong>{agent.name}</strong>?
          </p>

          <p className="deleteWarning">
            This action will permanently remove this agent from the
            Agent Registry and cannot be undone.
          </p>
        </div>

        <div className="deleteModalActions">
          <button
            className="btn"
            type="button"
            onClick={onCancel}
            disabled={deleting}
          >
            Cancel
          </button>

          <button
            className="deleteConfirmBtn"
            type="button"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete agent'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   AGENTS
========================= */

function Agents() {
  const agents = useAgents();
  const [filter, setFilter] = useState('All');
  const [deleteAgent, setDeleteAgent] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const list = useMemo(
    () =>
      filter === 'All'
        ? agents
        : agents.filter((a) => a.risk === filter),
    [filter, agents]
  );

  async function handleDelete() {
  if (!deleteAgent) return;

  setDeleting(true);

  try {
    const response = await fetch(
      `${API_URL}/api/agents/${deleteAgent.id}`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete agent');
    }

    window.location.reload();
  } catch (error) {
    console.error(error);
    alert('Failed to delete agent. Please try again.');
    setDeleting(false);
  }
}

  return (
    <>
      <Title
        eyebrow="Agent Registry"
        title="Agents"
        sub="The system of record for every production AI agent."
        actions={
          <>
            <Button>Export</Button>
            <RegisterButton />
          </>
        }
      />

      <div className="grid4">
        <Metric
          label="All agents"
          value={agents.length}
          trend="+3 this month"
        />

        <Metric
          label="Production-ready"
          value={
            agents.filter(
              (a) =>
                a.status?.toLowerCase().includes('production-ready')
            ).length
          }
        />

        <Metric
          label="High risk"
          value={agents.filter((a) => a.risk === 'High').length}
          trend="2 pending review"
          warning
        />

        <Metric
          label="Owners assigned"
          value={
            agents.length
              ? `${Math.round(
                  (agents.filter((a) => a.owner?.trim()).length /
                    agents.length) *
                    100
                )}%`
              : '0%'
          }
        />
      </div>

      <div className="section">
        <div className="sectionHead">
          <h2>Agent registry</h2>

          <div className="filters">
            <div className="filter">
              ⌕ Search by name, owner
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>All</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>

        <div className="card tableWrap">
          <table>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Owner</th>
                <th>Risk tier</th>
                <th>Model</th>
                <th>Status</th>
                <th>Monthly cost</th>
                <th>Last updated</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {list.map((a) => (
                <tr key={a.id || a.name}>
                  <td>
                    <Link
                      className="rowLink"
                      to="/agent/invoice-risk-analyzer"
                    >
                      <b>{a.name}</b>

                      <small>
                        {a.name === 'Invoice Risk Analyzer'
                          ? 'Fraud & anomaly detection'
                          : 'Production AI workload'}
                      </small>
                    </Link>
                  </td>

                  <td>{a.owner}</td>

                  <td>
                    <Badge
                      type={
                        a.risk === 'High'
                          ? 'red'
                          : a.risk === 'Medium'
                          ? 'amber'
                          : 'blue'
                      }
                    >
                      {a.risk}
                    </Badge>
                  </td>

                  <td>{a.model}</td>

                  <td>
                    <Badge
                      type={
                        a.status?.toLowerCase().includes('pending')
                          ? 'amber'
                          : 'green'
                      }
                    >
                      {a.status}
                    </Badge>
                  </td>

                  <td>{a.cost}</td>
                  <td>Oct 04</td>

                  <td>
                    <button
                      className="btn danger"
                      onClick={() => setDeleteAgent(a)}
                      type="button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

            <DeleteAgentModal
        agent={deleteAgent}
        onCancel={() => setDeleteAgent(null)}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </>
  );
}

/* =========================
   AGENT DETAIL
========================= */

function AgentDetail() {
  return (
    <>
      <Title
        eyebrow="Agent Registry / Invoice Risk Analyzer"
        title={
          <>
            Invoice Risk Analyzer{' '}
            <Badge>● Production-ready</Badge>
          </>
        }
        sub="Detects invoice anomalies, fraud risk and policy violations using ML models."
        actions={
          <>
            <Button>Request change</Button>
            <Button primary>View evidence</Button>
          </>
        }
      />

      <div className="card heroCard">
        <div className="meta">
          {[
            ['Owner', 'Priya Sharma'],
            ['Risk tier', 'High'],
            ['Model', 'Databricks Model Serving'],
            ['Last updated', 'Sep 28, 2026']
          ].map((x) => (
            <div className="metaItem" key={x[0]}>
              <small>{x[0]}</small>

              <b
                className={
                  x[0] === 'Risk tier'
                    ? 'dangerText'
                    : ''
                }
              >
                {x[1]}
              </b>
            </div>
          ))}
        </div>

        <div className="tabs">
          <span className="active">Overview</span>
          <span>Versions</span>
          <span>Policy</span>
          <span>Runs</span>
          <span>Cost</span>
          <span>Evidence</span>
        </div>

        <div className="detailGrid">
          <div>
            <h2>Agent summary</h2>

            <KV
              k="Business purpose"
              v="Analyse supplier invoices for anomalies and fraud-risk signals."
            />

            <KV
              k="Data sources"
              v="AP Invoices · Supplier Master · Policy Rules"
            />

            <KV
              k="Target endpoint"
              v="/v1/invoice-risk"
            />

            <KV
              k="Schedule"
              v="On demand (API)"
            />

            <KV
              k="Kill switch"
              v={<Button danger>Disable agent</Button>}
            />
          </div>

          <Timeline />
        </div>
      </div>
    </>
  );
}

function KV({ k, v }) {
  return (
    <div className="kv">
      <span>{k}</span>
      <b>{v}</b>
    </div>
  );
}

function Timeline() {
  return (
    <div>
      <h2>Governance timeline</h2>

      <div className="timeline">
        <Event
          t="Request submitted"
          d="REQ-2026-0918-0012 · Priya Sharma"
        />

        <Event
          t="Policy decision"
          d="Allowed with conditions"
        />

        <Event
          t="Approved by Rohit Menon"
          d="Platform Head"
        />

        <Event
          t="Readiness scan passed"
          d="12 / 12 checks"
        />

        <Event
          t="Evidence record created"
          d="AUD-2026-0918-0012"
        />
      </div>
    </div>
  );
}

function Event({ t, d }) {
  return (
    <div className="event">
      <div className="dot"></div>

      <div>
        <b>{t}</b>
        <small>{d}</small>
      </div>

      <time>Sep 20</time>
    </div>
  );
}

/* =========================
   REQUESTS
========================= */

function Requests() {
  return (
    <>
      <Title
        eyebrow="Requests"
        title="Production access requests"
        sub="Every request gets one ID and one traceable lifecycle."
        actions={<Button primary>＋ New request</Button>}
      />

      <div className="grid4">
        <Metric label="Open requests" value="6" />
        <Metric label="Awaiting approval" value="3" />
        <Metric label="Policy review" value="2" />
        <Metric
          label="Completed this month"
          value="18"
        />
      </div>

      <div className="section">
        <div className="card tableWrap">
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Agent</th>
                <th>Requester</th>
                <th>Risk</th>
                <th>Stage</th>
                <th>Created</th>
                <th>SLA</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <Link
                    className="rowLink"
                    to="/request/REQ-2026-1001-0047"
                  >
                    <b>REQ-2026-1001-0047</b>
                  </Link>
                </td>

                <td>Document Extractor</td>
                <td>Karthik R</td>

                <td>
                  <Badge type="amber">Medium</Badge>
                </td>

                <td>
                  <Badge type="amber">
                    Awaiting approval
                  </Badge>
                </td>

                <td>Oct 01, 10:12 AM</td>
                <td>2 business days</td>
              </tr>

              <tr>
                <td>
                  <b>REQ-2026-1001-0044</b>
                </td>

                <td>Dynamic Pricing Agent</td>
                <td>Neha Gupta</td>

                <td>
                  <Badge type="red">High</Badge>
                </td>

                <td>
                  <Badge type="blue">
                    Policy review
                  </Badge>
                </td>

                <td>Oct 01, 09:40 AM</td>
                <td>1 business day</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* =========================
   REQUEST DETAIL
========================= */

function RequestDetail() {
  const [approved, setApproved] = useState(false);

  return (
    <>
      <Title
        eyebrow="Requests / REQ-2026-1001-0047"
        title={
          <>
            Request production access{' '}
            <Badge type={approved ? 'green' : 'amber'}>
              {approved ? 'Approved' : 'Awaiting approval'}
            </Badge>
          </>
        }
        sub="Created Oct 01, 2026 at 10:12 AM by Karthik R"
        actions={
          <>
            <Button danger>Reject</Button>

            <Button
              primary
              onClick={() => setApproved(true)}
            >
              {approved ? 'Approved ✓' : 'Approve'}
            </Button>
          </>
        }
      />

      <div className="card pipeline">
        <div className="steps four">
          {[
            'Request',
            'Policy decision',
            'Human approval',
            'Readiness'
          ].map((x, i) => (
            <div
              className={
                'step ' +
                (i < 2 ? 'done ' : '') +
                (i === 2 ? 'current' : '')
              }
              key={x}
            >
              <div className="bubble">
                {i < 2 ? '✓' : i + 1}
              </div>

              <b>
                {i + 1}. {x}
              </b>

              <small>
                {i === 1
                  ? 'Allowed with conditions'
                  : i === 2
                  ? approved
                    ? 'Approved'
                    : 'Named approver'
                  : 'Details complete'}
              </small>
            </div>
          ))}
        </div>
      </div>

      <div className="requestLayout">
        <div className="card formCard">
          <h2>Request details</h2>

          <div className="formGrid">
            {[
              [
                'Business purpose',
                'Extract and classify invoice data from multiple formats.'
              ],
              ['Agent', 'Document Extractor'],
              ['Target environment', 'Production'],
              ['Target endpoint', '/v1/document-extractor'],
              ['Schedule', 'On demand (API)'],
              ['Estimated monthly cost', '$5,000'],
              ['Risk tier', 'Medium'],
              ['Approver', 'Rohit Menon · Platform Head']
            ].map((x) => (
              <div className="field" key={x[0]}>
                <label>{x[0]}</label>
                <input value={x[1]} readOnly />
              </div>
            ))}
          </div>
        </div>

        <div className="card formCard">
          <h2>PolicyIQ decision</h2>

          <div className="decision">
            <Badge type="amber">
              Allowed with conditions
            </Badge>

            {[
              'Use approved model (llama-3-70b)',
              'Data must be masked (PII redaction)',
              'Cost limit: $5,000 / month',
              'Enable audit logging'
            ].map((x) => (
              <div className="check" key={x}>
                <I.Check size={15} />
                {x}
              </div>
            ))}
          </div>

          <div className="sla">
            <span>SLA</span>
            <b>2 business days</b>
            <small>
              Due by Oct 03, 2026 · 10:12 AM
            </small>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================
   GENERIC PAGES
========================= */

function Generic({
  kind,
  title,
  eyebrow,
  sub
}) {
  return (
    <>
      <Title
        eyebrow={eyebrow}
        title={title}
        sub={sub}
        actions={<Button primary>＋ Create</Button>}
      />

      <div className="grid4">
        <Metric
          label="Active"
          value={kind === 'PolicyIQ' ? '14' : '24'}
          trend="Healthy"
        />

        <Metric
          label="In progress"
          value="6"
        />

        <Metric
          label="Attention"
          value="2"
          trend="Needs action"
          warning
        />

        <Metric
          label="Coverage"
          value="99%"
        />
      </div>

      <div className="lower">
        <div className="card panel">
          <div className="sectionHead">
            <h2>{kind} workspace</h2>
            <Button>Manage</Button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Version</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>

            <tbody>
              {[
                'Production AI baseline',
                'PII handling',
                'High-risk model policy',
                'Customer Support policy'
              ].map((x, i) => (
                <tr key={x}>
                  <td>
                    <b>{x}</b>
                  </td>

                  <td>v{3 - i}.4</td>
                  <td>Platform</td>

                  <td>
                    <Badge type="green">
                      Active
                    </Badge>
                  </td>

                  <td>Sep {28 - i * 2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card panel">
          <h2>Latest activity</h2>

          <div className="timeline">
            {[
              'Policy evaluated',
              'Approval completed',
              'Readiness scan passed',
              'Evidence record created'
            ].map((x) => (
              <Event
                key={x}
                t={x}
                d="Today · system record"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================
   COST
========================= */

function Cost() {
  const agents = useAgents();

  return (
    <>
      <Title
        eyebrow="CostLink"
        title="Spend & cost accountability"
        sub="Cost is tied to the agent and its named owner—not one big platform bill."
        actions={
          <>
            <Button>Last 30 days⌄</Button>
            <Button>Export</Button>
          </>
        }
      />

      <div className="grid4">
        <Metric
          label="Total spend"
          value="$42.8k"
          trend="↑ 12% vs previous 30 days"
        />

        <Metric
          label="Highest agent"
          value="$8.4k"
          trend="Invoice Risk Analyzer"
        />

        <Metric
          label="Allocated"
          value="100%"
        />

        <Metric
          label="Unlinked spend"
          value="$0"
          trend="Healthy"
        />
      </div>

      <div className="lower">
        <div className="card panel">
          <div className="sectionHead">
            <h2>Daily spend</h2>
            <span className="sub">Last 30 days</span>
          </div>

          <div className="bars">
            {Array.from({ length: 28 }, (_, i) => (
              <div
                className={
                  'bar ' +
                  (i % 5 === 0 ? 'purple' : '')
                }
                style={{
                  height:
                    25 + ((i * 13) % 75) + 'px'
                }}
                key={i}
              />
            ))}
          </div>
        </div>

        <div className="card panel">
          <h2>Cost by agent</h2>

          {agents.slice(0, 4).map((a) => (
            <div className="sideStat" key={a.id || a.name}>
              <span>{a.name}</span>
              <b>{a.cost}</b>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* =========================
   EVIDENCE
========================= */

function Evidence() {
  return (
    <>
      <Title
        eyebrow="AuditRecord"
        title="Evidence records"
        sub="Evidence is produced as work happens—not written later."
        actions={
          <Button primary>
            Download bundle
          </Button>
        }
      />

      <div className="grid4">
        <Metric
          label="Evidence records"
          value="1,284"
        />

        <Metric
          label="Complete"
          value="100%"
        />

        <Metric
          label="Audit health"
          value="99.8%"
        />

        <Metric
          label="Retention"
          value="7 years"
        />
      </div>

      <div className="section">
        <div className="card tableWrap">
          <table>
            <thead>
              <tr>
                <th>Evidence ID</th>
                <th>Request</th>
                <th>Agent</th>
                <th>Decision</th>
                <th>Run</th>
                <th>Cost</th>
                <th>Created</th>
                <th>Health</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <b>AUD-2026-1001-0047</b>
                </td>

                <td>REQ-2026-1001-0047</td>
                <td>Document Extractor</td>

                <td>
                  <Badge type="amber">
                    Allowed + conditions
                  </Badge>
                </td>

                <td>RUN-92840</td>
                <td>$1.12</td>
                <td>10:23 AM</td>

                <td>
                  <Badge>Complete</Badge>
                </td>
              </tr>

              <tr>
                <td>
                  <b>AUD-2026-0918-0012</b>
                </td>

                <td>REQ-2026-0918-0012</td>
                <td>Invoice Risk Analyzer</td>

                <td>
                  <Badge>Approved</Badge>
                </td>

                <td>RUN-92841</td>
                <td>$0.84</td>
                <td>Sep 20</td>

                <td>
                  <Badge>Complete</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* =========================
   RUNS
========================= */

function Runs() {
  return (
    <>
      <Title
        eyebrow="RunBridge"
        title="Production runs"
        sub="Execution stays in your Databricks environment. We keep the accountability trail."
        actions={
          <>
            <Button>Filters</Button>
            <Button>Export</Button>
          </>
        }
      />

      <div className="grid4">
        <Metric
          label="Runs today"
          value="1,842"
          trend="↑ 8%"
        />

        <Metric
          label="Success rate"
          value="99.2%"
        />

        <Metric
          label="Failed"
          value="15"
          trend="3 need review"
          warning
        />

        <Metric
          label="Avg. latency"
          value="2.8s"
        />
      </div>

      <div className="section">
        <div className="card tableWrap">
          <table>
            <thead>
              <tr>
                <th>Run ID</th>
                <th>Agent</th>
                <th>Started</th>
                <th>Duration</th>
                <th>Result</th>
                <th>Cost</th>
                <th>Evidence</th>
              </tr>
            </thead>

            <tbody>
              {[
                [
                  'RUN-92841',
                  'Invoice Risk Analyzer',
                  '10:24 AM',
                  '2.1s',
                  'Success',
                  '$0.84'
                ],
                [
                  'RUN-92840',
                  'Document Extractor',
                  '10:22 AM',
                  '4.8s',
                  'Success',
                  '$1.12'
                ],
                [
                  'RUN-92839',
                  'Dynamic Pricing Agent',
                  '10:19 AM',
                  '—',
                  'Blocked',
                  '$0'
                ]
              ].map((r) => (
                <tr key={r[0]}>
                  {r.slice(0, 4).map((x, i) => (
                    <td key={i}>
                      <b>
                        {i === 0 || i === 1
                          ? x
                          : ''}
                      </b>
                      {i > 1 ? x : ''}
                    </td>
                  ))}

                  <td>
                    <Badge
                      type={
                        r[4] === 'Blocked'
                          ? 'red'
                          : 'green'
                      }
                    >
                      {r[4]}
                    </Badge>
                  </td>

                  <td>{r[5]}</td>
                  <td>Available</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* =========================
   APP ROUTES
========================= */

function App() {
  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={<Overview />}
        />

        <Route
          path="/agents"
          element={<Agents />}
        />

        <Route
          path="/agent/invoice-risk-analyzer"
          element={<AgentDetail />}
        />

        <Route
          path="/requests"
          element={<Requests />}
        />

        <Route
          path="/request/REQ-2026-1001-0047"
          element={<RequestDetail />}
        />

        <Route
          path="/policy"
          element={
            <Generic
              kind="PolicyIQ"
              eyebrow="PolicyIQ"
              title="Policy control"
              sub="Versioned rules determine whether an agent can move forward."
            />
          }
        />

        <Route
          path="/approvals"
          element={
            <Generic
              kind="Approvals"
              eyebrow="Human approval"
              title="Approval queue"
              sub="Named approvers make the final production decision."
            />
          }
        />

        <Route
          path="/readiness"
          element={
            <Generic
              kind="ReadyScan"
              eyebrow="ReadyScan"
              title="Production readiness"
              sub="A clear, repeatable check before anything goes live."
            />
          }
        />

        <Route
          path="/runs"
          element={<Runs />}
        />

        <Route
          path="/cost"
          element={<Cost />}
        />

        <Route
          path="/evidence"
          element={<Evidence />}
        />
      </Routes>
    </Layout>
  );
}

/* =========================
   START REACT
========================= */

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);