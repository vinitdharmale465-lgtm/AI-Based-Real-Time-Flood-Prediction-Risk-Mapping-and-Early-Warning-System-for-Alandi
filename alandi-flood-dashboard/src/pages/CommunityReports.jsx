
import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useApp } from '../context.jsx';
import { locations } from '../data.js';
import { submitReport, getReports } from '../services/api';

const CATS = [
  'Waterlogging',
  'Blocked drain',
  'Road damage',
  'River overflow',
  'Other'
];

export default function CommunityReports() {
  const { reports, setReports, toast } = useApp();

  const [f, setF] = useState({
    location: '',
    category: '',
    desc: ''
  });

  const [err, setErr] = useState({});
  const [loading, setLoading] = useState(false);

  // Load reports from MongoDB
  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await getReports();

        const formattedReports = data.map((r) => ({
          id: r._id,
          location: r.location,
          category: r.issue,
          desc: r.description,
          date: r.createdAt?.slice(0, 10),
          status: r.status
        }));

        setReports(formattedReports);
      } catch (error) {
        toast('Could not load reports from server.', 'error');
        console.error(error);
      }
    };

    loadReports();
  }, []);

  // Submit report to backend
  const submit = async (e) => {
    e.preventDefault();

    const er = {};

    if (f.location.trim().length < 3) {
      er.location = 'Enter a location (at least 3 characters).';
    }

    if (!f.category) {
      er.category = 'Choose a category.';
    }

    if (f.desc.trim().length < 10) {
      er.desc = 'Describe what you see in at least 10 characters.';
    }

    setErr(er);

    if (Object.keys(er).length) {
      return toast('Fix the highlighted fields.', 'error');
    }

    try {
      setLoading(true);

      const response = await submitReport({
        name: 'Community Member',
        location: f.location.trim(),
        issue: f.category,
        description: f.desc.trim()
      });

      const savedReport = response.report;

      const newReport = {
        id: savedReport._id,
        location: savedReport.location,
        category: savedReport.issue,
        desc: savedReport.description,
        date: savedReport.createdAt?.slice(0, 10),
        status: savedReport.status
      };

      setReports((prev) => [newReport, ...prev]);

      setF({
        location: '',
        category: '',
        desc: ''
      });

      toast('Report saved successfully!', 'success');

    } catch (error) {
      console.error(error);
      toast('Failed to save report. Check backend connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const bind = (k) => ({
    value: f[k],
    onChange: (e) =>
      setF({ ...f, [k]: e.target.value }),
    className: err[k] ? 'invalid' : ''
  });

  return (
    <div className="grid g2 align-start">

      <form className="card form" onSubmit={submit} noValidate>
        <h3>Submit a report</h3>

        <p className="muted sm">
          Submit a flood-related report for Alandi.
        </p>

        <label>
          Location
          <input
            list="locs"
            placeholder="e.g. Alandi Bridge"
            {...bind('location')}
          />
        </label>

        {err.location && (
          <span className="err">{err.location}</span>
        )}

        <datalist id="locs">
          {locations.map((l) => (
            <option key={l.id} value={l.name} />
          ))}
        </datalist>

        <label>
          Category
          <select {...bind('category')}>
            <option value="">Select category</option>
            {CATS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        {err.category && (
          <span className="err">{err.category}</span>
        )}

        <label>
          Description
          <textarea
            rows={4}
            placeholder="What did you see?"
            {...bind('desc')}
          />
        </label>

        {err.desc && (
          <span className="err">{err.desc}</span>
        )}

        <button className="btn" type="submit" disabled={loading}>
          <Send size={16} />
          {loading ? 'Submitting...' : 'Submit report'}
        </button>
      </form>

      <section className="card">
        <h3>Previous reports</h3>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Location</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.date}</td>
                  <td>{r.location}</td>
                  <td>{r.category}</td>
                  <td>
                    <span className={`status ${r.status}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
