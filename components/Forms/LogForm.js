'use client';

import { useState } from 'react';

export default function LogForm({ initialData, projects, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hours: initialData?.hours || 2,
    description: initialData?.description || '',
    project: initialData?.project?._id || '',
    mood: initialData?.mood || 'productive',
    tags: initialData?.tags?.join(', ') || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    try {
      const url = initialData 
        ? `/api/logs/${initialData._id}`
        : '/api/logs';
      
      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Reset form
        setFormData({
          hours: 2,
          description: '',
          project: '',
          mood: 'productive',
          tags: '',
        });
        
        // Call success callback
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Error saving log:', error);
      alert('Failed to save log. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hours
        </label>
        <input
          type="number"
          step="0.5"
          min="0.5"
          max="24"
          value={formData.hours}
          onChange={(e) => setFormData({...formData, hours: parseFloat(e.target.value)})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          Enter hours spent (0.5 to 24)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="What did you work on today?"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project (Optional)
        </label>
        <select
          value={formData.project}
          onChange={(e) => setFormData({...formData, project: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a project</option>
          {projects?.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mood
        </label>
        <select
          value={formData.mood}
          onChange={(e) => setFormData({...formData, mood: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="productive">😊 Productive</option>
          <option value="focused">🎯 Focused</option>
          <option value="stuck">😓 Stuck</option>
          <option value="excited">🤩 Excited</option>
          <option value="tired">😴 Tired</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags (comma separated)
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({...formData, tags: e.target.value})}
          placeholder="react, node, bug-fix, feature"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Add tags to categorize your work
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Saving...
          </>
        ) : initialData ? 'Update Log' : 'Create Log'}
      </button>
    </form>
  );
}