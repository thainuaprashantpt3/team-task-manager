// // import { useState, useEffect } from 'react';
// // import { Link } from 'react-router-dom';
// // import api from '../../api/axiosInstance';
// // import { useAuth } from '../../context/AuthContext';
// // import Badge from '../../components/common/Badge';
// // import ProgressBar from '../../components/common/ProgressBar';
// // import Modal from '../../components/common/Modal';
// // import toast from 'react-hot-toast';

// // const EMPTY_FORM = {
// //   title: '', description: '', deadline: '', status: 'planning',
// // };

// // export default function Projects() {
// //   const { isAdmin } = useAuth();
// //   const [projects, setProjects] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [showModal, setShowModal] = useState(false);
// //   const [form, setForm] = useState(EMPTY_FORM);
// //   const [saving, setSaving] = useState(false);
// //   const [filter, setFilter] = useState('all');

// //   const fetchProjects = async () => {
// //     try {
// //       const { data } = await api.get('/projects');
// //       setProjects(data.data);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => { fetchProjects(); }, []);

// //   const handleChange = (e) =>
// //     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

// //   const handleCreate = async (e) => {
// //     e.preventDefault();
// //     setSaving(true);
// //     try {
// //       await api.post('/projects', form);
// //       toast.success('Project created!');
// //       setShowModal(false);
// //       setForm(EMPTY_FORM);
// //       fetchProjects();
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || 'Failed to create project');
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const handleDelete = async (id) => {
// //     if (!window.confirm('Delete this project and all its tasks?')) return;
// //     try {
// //       await api.delete(`/projects/${id}`);
// //       toast.success('Project deleted');
// //       fetchProjects();
// //     } catch {
// //       toast.error('Delete failed');
// //     }
// //   };

// //   const filtered = filter === 'all'
// //     ? projects
// //     : filter === 'overdue'
// //       ? projects.filter((p) => p.isOverdue)
// //       : projects.filter((p) => p.status === filter);

// //   if (loading) return (
// //     <div className="flex items-center justify-center h-64">
// //       <i className="ti ti-loader-2 animate-spin text-3xl text-brand-500" />
// //     </div>
// //   );

// //   return (
// //     <div className="p-6 space-y-6">
// //       <div className="flex items-center justify-between">
// //         <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
// //         <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
// //           <i className="ti ti-plus" /> New project
// //         </button>
// //       </div>

// //       {/* Filters */}
// //       <div className="flex gap-2 flex-wrap">
// //         {['all', 'active', 'planning', 'on-hold', 'completed', 'overdue'].map((f) => (
// //           <button
// //             key={f}
// //             onClick={() => setFilter(f)}
// //             className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border
// //               ${filter === f
// //                 ? 'bg-brand-600 text-white border-brand-600'
// //                 : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
// //               }`}
// //           >
// //             {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
// //           </button>
// //         ))}
// //       </div>

// //       {/* Project grid */}
// //       {filtered.length === 0 ? (
// //         <div className="card text-center py-12">
// //           <i className="ti ti-folder-off text-4xl text-gray-300" />
// //           <p className="text-gray-500 mt-3">No projects found</p>
// //         </div>
// //       ) : (
// //         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
// //           {filtered.map((p) => (
// //             <div key={p._id} className={`card hover:shadow-md transition-shadow ${p.isOverdue ? 'border-red-200' : ''}`}>
// //               <div className="flex items-start justify-between mb-3">
// //                 <Link
// //                   to={`/projects/${p._id}`}
// //                   className="text-sm font-semibold text-gray-900 hover:text-brand-600 transition-colors line-clamp-2"
// //                 >
// //                   {p.title}
// //                 </Link>
// //                 <Badge label={p.isOverdue ? 'overdue' : p.status} />
// //               </div>

// //               {p.description && (
// //                 <p className="text-xs text-gray-400 mb-3 line-clamp-2">{p.description}</p>
// //               )}

// //               <ProgressBar value={p.progress} className="mb-3" />

// //               <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
// //                 <span className="flex items-center gap-1">
// //                   <i className="ti ti-users text-sm" />
// //                   {p.members?.length || 0} members
// //                 </span>
// //                 {p.deadline && (
// //                   <span className="flex items-center gap-1">
// //                     <i className="ti ti-calendar text-sm" />
// //                     {new Date(p.deadline).toLocaleDateString()}
// //                   </span>
// //                 )}
// //               </div>

// //               {isAdmin && (
// //                 <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
// //                   <Link
// //                     to={`/projects/${p._id}`}
// //                     className="btn-secondary text-xs flex-1 text-center"
// //                   >
// //                     View details
// //                   </Link>
// //                   <button
// //                     onClick={() => handleDelete(p._id)}
// //                     className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
// //                     title="Delete project"
// //                   >
// //                     <i className="ti ti-trash text-sm" />
// //                   </button>
// //                 </div>
// //               )}
// //             </div>
// //           ))}
// //         </div>
// //       )}

// //       {/* Create project modal */}
// //       {showModal && (
// //         <Modal title="Create new project" onClose={() => setShowModal(false)}>
// //           <form onSubmit={handleCreate} className="space-y-4">
// //             <div>
// //               <label className="block text-xs font-medium text-gray-600 mb-1.5">Title *</label>
// //               <input name="title" value={form.title} onChange={handleChange}
// //                 required className="input" placeholder="Project title" />
// //             </div>
// //             <div>
// //               <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
// //               <textarea name="description" value={form.description} onChange={handleChange}
// //                 rows={3} className="input resize-none" placeholder="What is this project about?" />
// //             </div>
// //             <div className="grid grid-cols-2 gap-3">
// //               <div>
// //                 <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
// //                 <select name="status" value={form.status} onChange={handleChange} className="input">
// //                   {['planning', 'active', 'on-hold', 'completed'].map((s) => (
// //                     <option key={s} value={s}>{s.replace('-', ' ')}</option>
// //                   ))}
// //                 </select>
// //               </div>
// //               <div>
// //                 <label className="block text-xs font-medium text-gray-600 mb-1.5">Deadline</label>
// //                 <input type="date" name="deadline" value={form.deadline}
// //                   onChange={handleChange} className="input" />
// //               </div>
// //             </div>
// //             <div className="flex gap-3 pt-2">
// //               <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
// //                 Cancel
// //               </button>
// //               <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
// //                 {saving ? <i className="ti ti-loader-2 animate-spin" /> : <i className="ti ti-plus" />}
// //                 {saving ? 'Creating...' : 'Create project'}
// //               </button>
// //             </div>
// //           </form>
// //         </Modal>
// //       )}
// //     </div>
// //   );
// // }




// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../../api/axiosInstance';
// import { useAuth } from '../../context/AuthContext';
// import Badge from '../../components/common/Badge';
// import ProgressBar from '../../components/common/ProgressBar';
// import Modal from '../../components/common/Modal';
// import Spinner from '../../components/common/Spinner';
// import toast from 'react-hot-toast';

// const EMPTY_FORM = {
//   title: '', description: '', deadline: '', status: 'planning',
// };

// export default function Projects() {
//   const { isAdmin } = useAuth();
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading]   = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [form, setForm]         = useState(EMPTY_FORM);
//   const [saving, setSaving]     = useState(false);
//   const [filter, setFilter]     = useState('all');

//   const fetchProjects = async () => {
//     try {
//       const { data } = await api.get('/projects');
//       setProjects(data.data);
//     } catch (err) {
//       toast.error('Failed to load projects');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchProjects(); }, []);

//   const handleChange = (e) =>
//     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

//   const handleCreate = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       await api.post('/projects', form);
//       toast.success('Project created!');
//       setShowModal(false);
//       setForm(EMPTY_FORM);
//       fetchProjects();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to create project');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Delete this project and all its tasks?')) return;
//     try {
//       await api.delete(`/projects/${id}`);
//       toast.success('Project deleted');
//       fetchProjects();
//     } catch {
//       toast.error('Delete failed');
//     }
//   };

//   const filtered =
//     filter === 'all'     ? projects :
//     filter === 'overdue' ? projects.filter((p) => p.isOverdue) :
//                            projects.filter((p) => p.status === filter);

//   if (loading) return <Spinner className="h-64" />;

//   return (
//     <div className="p-6 space-y-6">

//       {/* Header — both admin and member can create projects */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
//           <p className="text-sm text-gray-400 mt-0.5">
//             {projects.length} project{projects.length !== 1 ? 's' : ''} found
//           </p>
//         </div>
//         <button
//           onClick={() => setShowModal(true)}
//           className="btn-primary flex items-center gap-2"
//         >
//           <i className="ti ti-plus" /> New project
//         </button>
//       </div>

//       {/* Filter pills */}
//       <div className="flex gap-2 flex-wrap">
//         {['all', 'active', 'planning', 'on-hold', 'completed', 'overdue'].map((f) => (
//           <button
//             key={f}
//             onClick={() => setFilter(f)}
//             className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
//               ${filter === f
//                 ? 'bg-brand-600 text-white border-brand-600'
//                 : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
//               }`}
//           >
//             {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
//           </button>
//         ))}
//       </div>

//       {/* Project grid */}
//       {filtered.length === 0 ? (
//         <div className="card text-center py-14">
//           <i className="ti ti-folder-off text-5xl text-gray-200" />
//           <p className="text-gray-500 mt-3 text-sm font-medium">No projects found</p>
//           <p className="text-gray-400 text-xs mt-1">
//             {filter !== 'all'
//               ? 'Try a different filter'
//               : 'Create your first project to get started'}
//           </p>
//           {filter === 'all' && (
//             <button
//               onClick={() => setShowModal(true)}
//               className="btn-primary mt-4 inline-flex items-center gap-2"
//             >
//               <i className="ti ti-plus" /> Create project
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//           {filtered.map((p) => (
//             <div
//               key={p._id}
//               className={`card hover:shadow-md transition-shadow
//                 ${p.isOverdue ? 'border-red-200 bg-red-50/20' : ''}`}
//             >
//               {/* Title + status */}
//               <div className="flex items-start justify-between mb-2">
//                 <Link
//                   to={`/projects/${p._id}`}
//                   className="text-sm font-semibold text-gray-900
//                              hover:text-brand-600 transition-colors line-clamp-2 flex-1 mr-2"
//                 >
//                   {p.title}
//                 </Link>
//                 <Badge label={p.isOverdue ? 'overdue' : p.status} />
//               </div>

//               {/* Description */}
//               {p.description && (
//                 <p className="text-xs text-gray-400 mb-3 line-clamp-2">{p.description}</p>
//               )}

//               {/* Progress */}
//               <ProgressBar value={p.progress} className="mb-3" />

//               {/* Meta */}
//               <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
//                 <span className="flex items-center gap-1">
//                   <i className="ti ti-users text-sm" />
//                   {p.members?.length || 0} member{p.members?.length !== 1 ? 's' : ''}
//                 </span>
//                 {p.deadline && (
//                   <span className={`flex items-center gap-1
//                     ${p.isOverdue ? 'text-red-400 font-medium' : ''}`}>
//                     <i className="ti ti-calendar text-sm" />
//                     {new Date(p.deadline).toLocaleDateString()}
//                   </span>
//                 )}
//               </div>

//               {/* Owner */}
//               <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
//                 <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center
//                                 justify-center text-xs font-bold text-brand-700">
//                   {p.owner?.name?.charAt(0).toUpperCase()}
//                 </div>
//                 <span className="text-xs text-gray-400 flex-1">
//                   {p.owner?.name}
//                 </span>

//                 <Link
//                   to={`/projects/${p._id}`}
//                   className="text-xs text-brand-600 hover:underline font-medium"
//                 >
//                   View →
//                 </Link>

//                 {/* Only admin can delete */}
//                 {isAdmin && (
//                   <button
//                     onClick={() => handleDelete(p._id)}
//                     className="p-1 text-gray-300 hover:text-red-500
//                                hover:bg-red-50 rounded-lg transition-colors"
//                     title="Delete project"
//                   >
//                     <i className="ti ti-trash text-sm" />
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Create project modal — available to all roles */}
//       {showModal && (
//         <Modal title="Create new project" onClose={() => { setShowModal(false); setForm(EMPTY_FORM); }}>
//           <form onSubmit={handleCreate} className="space-y-4">
//             <div>
//               <label className="block text-xs font-medium text-gray-600 mb-1.5">
//                 Project title *
//               </label>
//               <input
//                 name="title"
//                 value={form.title}
//                 onChange={handleChange}
//                 required
//                 className="input"
//                 placeholder="e.g. CRM Redesign"
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-medium text-gray-600 mb-1.5">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={form.description}
//                 onChange={handleChange}
//                 rows={3}
//                 className="input resize-none"
//                 placeholder="What is this project about?"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1.5">
//                   Status
//                 </label>
//                 <select
//                   name="status"
//                   value={form.status}
//                   onChange={handleChange}
//                   className="input"
//                 >
//                   {['planning', 'active', 'on-hold', 'completed'].map((s) => (
//                     <option key={s} value={s}>
//                       {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1.5">
//                   Deadline
//                 </label>
//                 <input
//                   type="date"
//                   name="deadline"
//                   value={form.deadline}
//                   onChange={handleChange}
//                   className="input"
//                   min={new Date().toISOString().split('T')[0]}
//                 />
//               </div>
//             </div>

//             <div className="flex gap-3 pt-2">
//               <button
//                 type="button"
//                 onClick={() => { setShowModal(false); setForm(EMPTY_FORM); }}
//                 className="btn-secondary flex-1"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="btn-primary flex-1 flex items-center justify-center gap-2"
//               >
//                 {saving
//                   ? <><i className="ti ti-loader-2 animate-spin" /> Creating...</>
//                   : <><i className="ti ti-plus" /> Create project</>
//                 }
//               </button>
//             </div>
//           </form>
//         </Modal>
//       )}
//     </div>
//   );
// }





import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';
import ProgressBar from '../../components/common/ProgressBar';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  title: '', description: '', deadline: '', status: 'planning', assignedMembers: [],
};

export default function Projects() {
  const { isAdmin } = useAuth();
  const [projects,   setProjects]   = useState([]);
  const [members,    setMembers]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  const [filter,     setFilter]     = useState('all');

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data.data);
    } catch { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  };

  const fetchMembers = async () => {
    try {
      const { data } = await api.get('/users');
      setMembers(data.data.filter(m => m.isActive && m.role === 'member'));
    } catch {}
  };

  useEffect(() => {
    fetchProjects();
    if (isAdmin) fetchMembers();
  }, [isAdmin]);

  // Multi-select toggle
  const toggleMember = (id) => {
    setForm(f => ({
      ...f,
      assignedMembers: f.assignedMembers.includes(id)
        ? f.assignedMembers.filter(m => m !== id)
        : [...f.assignedMembers, id],
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/projects', form);
      toast.success('Project created!');
      setShowModal(false);
      setForm(EMPTY_FORM);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      fetchProjects();
    } catch { toast.error('Delete failed'); }
  };

  const filtered =
    filter === 'all'     ? projects :
    filter === 'overdue' ? projects.filter(p => p.isOverdue) :
                           projects.filter(p => p.status === filter);

  if (loading) return <Spinner className="h-64" />;

  return (
    <div className="p-6 space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-400 mt-0.5">{projects.length} projects</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <i className="ti ti-plus" /> New project
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all','active','planning','on-hold','completed','overdue'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
              ${filter === f
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}>
            {f.charAt(0).toUpperCase() + f.slice(1).replace('-',' ')}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card text-center py-14">
          <i className="ti ti-folder-off text-5xl text-gray-200" />
          <p className="text-gray-400 text-sm mt-3">No projects found</p>
          <button onClick={() => setShowModal(true)}
            className="btn-primary mt-4 inline-flex items-center gap-2">
            <i className="ti ti-plus" /> Create project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p._id}
              className={`bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow
                ${p.isOverdue ? 'border-red-200 bg-red-50/20' : 'border-gray-100'}`}>

              <div className="flex items-start justify-between mb-2">
                <Link to={`/projects/${p._id}`}
                  className="text-sm font-semibold text-gray-900 hover:text-blue-600 flex-1 mr-2">
                  {p.title}
                </Link>
                <Badge label={p.isOverdue ? 'overdue' : p.status} />
              </div>

              {isAdmin && p.owner && (
                <p className="text-xs text-gray-400 mb-2">
                  By <span className="font-medium text-gray-600">{p.owner.name}</span>
                </p>
              )}

              {p.description && (
                <p className="text-xs text-gray-400 mb-3 line-clamp-2">{p.description}</p>
              )}

              <ProgressBar value={p.progress || 0} size="md" overdue={p.isOverdue} className="mb-3" />

              {/* Assigned members avatars */}
              {(p.assignedMembers || []).length > 0 && (
                <div className="flex items-center gap-1 mb-2">
                  {p.assignedMembers.slice(0,5).map(m => (
                    <div key={m._id} title={m.name}
                      className="w-5 h-5 rounded-full bg-blue-100 border border-white
                                 flex items-center justify-center text-xs font-bold text-blue-700">
                      {m.name?.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {p.assignedMembers.length > 5 && (
                    <span className="text-xs text-gray-400">+{p.assignedMembers.length - 5}</span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                {p.deadline && (
                  <span className={`text-xs flex items-center gap-1
                    ${p.isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                    <i className="ti ti-calendar text-sm" />
                    {new Date(p.deadline).toLocaleDateString()}
                  </span>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <Link to={`/projects/${p._id}`}
                    className="text-xs text-blue-600 hover:underline font-medium">
                    View →
                  </Link>
                  {isAdmin && (
                    <button onClick={() => handleDelete(p._id)}
                      className="p-1 text-gray-300 hover:text-red-500 rounded transition-colors">
                      <i className="ti ti-trash text-sm" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create project modal */}
      {showModal && (
        <Modal title="Create new project" onClose={() => { setShowModal(false); setForm(EMPTY_FORM); }}>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Title *</label>
              <input value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required className="input" placeholder="Project title" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
              <textarea value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2} className="input resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
                <select value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="input">
                  {['planning','active','on-hold','completed'].map(s => (
                    <option key={s} value={s}>{s.replace('-',' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Deadline</label>
                <input type="date" value={form.deadline}
                  onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                  className="input" min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>

            {/* Multi-select members — admin only */}
            {isAdmin && members.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Assign members
                </label>
                <div className="border border-gray-200 rounded-lg p-2 max-h-40 overflow-y-auto space-y-1">
                  {members.map(m => (
                    <label key={m._id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg
                                 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.assignedMembers.includes(m._id)}
                        onChange={() => toggleMember(m._id)}
                        className="accent-blue-600"
                      />
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center
                                      justify-center text-xs font-bold text-blue-700">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-700">{m.name}</span>
                      {m.department && (
                        <span className="text-xs text-gray-400 ml-auto">{m.department}</span>
                      )}
                    </label>
                  ))}
                </div>
                {form.assignedMembers.length > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    {form.assignedMembers.length} member{form.assignedMembers.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving
                  ? <><i className="ti ti-loader-2 animate-spin" /> Creating...</>
                  : <><i className="ti ti-plus" /> Create project</>
                }
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}