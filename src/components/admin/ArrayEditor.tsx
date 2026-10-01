import { useState } from 'react';
import { Plus, Trash2, Edit2, GripVertical } from 'lucide-react';

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'array';
  options?: string[]; // for select/array maybe
}

interface ArrayEditorProps {
  items: any[];
  title: string;
  fields: FieldConfig[];
  onChange: (items: any[]) => void;
}

export const ArrayEditor = ({ items, title, fields, onChange }: ArrayEditorProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<any | null>(null);

  const handleAdd = () => {
    const newItem: Record<string, any> = { id: Date.now().toString(), order: items.length + 1 };
    fields.forEach(f => {
      if (f.type === 'array') newItem[f.key] = [];
      else if (f.type === 'boolean') newItem[f.key] = false;
      else newItem[f.key] = '';
    });
    setEditItem(newItem);
    setEditingId(newItem.id);
  };

  const handleSave = () => {
    if (items.find(i => i.id === editItem.id)) {
      onChange(items.map(i => i.id === editItem.id ? editItem : i));
    } else {
      onChange([...items, editItem]);
    }
    setEditingId(null);
    setEditItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      onChange(items.filter(i => i.id !== id));
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)', fontSize: '0.875rem', marginBottom: '1rem'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, textTransform: 'capitalize' }}>{title}</h2>
        <button 
          onClick={handleAdd}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', fontWeight: 500 }}
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.sort((a, b) => (a.order || 0) - (b.order || 0)).map(item => (
          <div key={item.id} style={{ 
            padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', 
            backgroundColor: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem' 
          }}>
            {editingId === item.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  {fields.map(field => (
                    <div key={field.key} style={field.type === 'textarea' ? { gridColumn: '1 / -1' } : {}}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>{field.label}</label>
                      {field.type === 'textarea' ? (
                        <textarea 
                          value={editItem[field.key] || ''} 
                          onChange={e => setEditItem({ ...editItem, [field.key]: e.target.value })}
                          style={{ ...inputStyle, minHeight: '100px' }}
                        />
                      ) : field.type === 'boolean' ? (
                         <input 
                           type="checkbox"
                           checked={editItem[field.key] || false}
                           onChange={e => setEditItem({ ...editItem, [field.key]: e.target.checked })}
                         />
                      ) : field.type === 'array' ? (
                        <input 
                          type="text" 
                          placeholder="Comma separated values"
                          value={Array.isArray(editItem[field.key]) ? editItem[field.key].join(', ') : ''}
                          onChange={e => setEditItem({ ...editItem, [field.key]: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}
                          style={inputStyle}
                        />
                      ) : (
                        <input 
                          type="text" 
                          value={editItem[field.key] || ''} 
                          onChange={e => setEditItem({ ...editItem, [field.key]: e.target.value })}
                          style={inputStyle}
                        />
                      )}
                    </div>
                  ))}
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Order</label>
                    <input 
                      type="number" 
                      value={editItem.order || 0} 
                      onChange={e => setEditItem({ ...editItem, order: parseInt(e.target.value) || 0 })}
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button onClick={() => setEditingId(null)} style={{ padding: '0.5rem 1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>Cancel</button>
                  <button onClick={handleSave} style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--accent-primary)', color: 'white', borderRadius: 'var(--radius-md)' }}>Save Changes</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <GripVertical size={20} style={{ color: 'var(--text-tertiary)', cursor: 'grab', marginTop: '4px' }} />
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                      {item.title || item.name || item.role || item.degree || 'Untitled Item'}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      {item.company || item.institution || item.issuer || item.category || item.subtitle || ''}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => { setEditItem(item); setEditingId(item.id); }} style={{ padding: '0.5rem', color: 'var(--accent-primary)' }}>
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} style={{ padding: '0.5rem', color: '#ef4444' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            No {title} added yet. Click "Add New" to get started.
          </div>
        )}
      </div>
    </div>
  );
};
