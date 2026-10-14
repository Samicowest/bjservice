'use client';

import React, { useState } from 'react';
import { useCyber } from '../context/CyberContext';
import { CyberService, ServiceField } from '../types';
import { CATEGORIES } from '../data/services';
import {
  Layers,
  Plus,
  Search,
  Edit3,
  Trash2,
  Copy,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  X,
  ChevronUp,
  ChevronDown,
  Upload,
  RotateCcw,
  Tag,
  DollarSign,
  HelpCircle,
  Settings,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function ServiceManagerView() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const {
    services,
    createService,
    updateService,
    deleteService,
    resetServicesToDefault,
    setSelectedServiceForOrder,
    setActiveModal,
    showToast
  } = useCyber();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [editingService, setEditingService] = useState<CyberService | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewingService, setPreviewingService] = useState<CyberService | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form Studio State
  const [activeStudioTab, setActiveStudioTab] = useState<'basics' | 'pricing' | 'fields' | 'docs' | 'preview'>('basics');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<string>('Fees & Payments');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formBasePrice, setFormBasePrice] = useState<number>(0);
  const [formServiceFee, setFormServiceFee] = useState<number>(1500);
  const [formEstimatedMins, setFormEstimatedMins] = useState<number>(20);
  const [formImage, setFormImage] = useState<string>('/images/hub_remita_payment.jpg');
  const [formPopular, setFormPopular] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<ServiceField[]>([]);
  const [formDocs, setFormDocs] = useState<string[]>([]);
  const [newDocInput, setNewDocInput] = useState('');

  // Interactive Live Preview Simulation State inside Studio
  const [previewSimData, setPreviewSimData] = useState<Record<string, any>>({});

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()) ||
      s.fields.some((f) => f.label.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCat === 'All' || s.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const openCreateModal = () => {
    setEditingService(null);
    setIsCreating(true);
    setActiveStudioTab('basics');
    setFormName('');
    setFormCategory('Fees & Payments');
    setFormShortDesc('');
    setFormDesc('');
    setFormBasePrice(5000);
    setFormServiceFee(1500);
    setFormEstimatedMins(20);
    setFormImage('');
    setFormPopular(false);
    setFormFields([
      {
        id: 'matricNumber',
        label: 'FUTO Matric / Registration Number',
        type: 'text',
        placeholder: 'e.g. 2023/109482',
        required: true,
        helperText: 'Enter student official matric or registration number.'
      },
      {
        id: 'department',
        label: 'Admitted Department / Programme',
        type: 'text',
        placeholder: 'e.g. Computer Science',
        required: true
      }
    ]);
    setFormDocs(['Statement of Result or Admission Slip']);
    setPreviewSimData({});
  };

  const openEditModal = (service: CyberService) => {
    setEditingService(service);
    setIsCreating(false);
    setActiveStudioTab('basics');
    setFormName(service.name);
    setFormCategory(service.category);
    setFormShortDesc(service.shortDesc || '');
    setFormDesc(service.description || '');
    setFormBasePrice(service.basePrice || 0);
    setFormServiceFee(service.serviceFee || 0);
    setFormEstimatedMins(service.estimatedMinutes || 20);
    setFormImage(service.image || '/images/hub_remita_payment.jpg');
    setFormPopular(service.popular || false);
    setFormFields(JSON.parse(JSON.stringify(service.fields || [])));
    setFormDocs([...(service.requiredDocTypes || [])]);
    setPreviewSimData({});
  };

  const handleDuplicate = (service: CyberService) => {
    const duplicated: Omit<CyberService, 'id'> = {
      ...service,
      name: `${service.name} (Copy)`,
      popular: false
    };
    createService(duplicated);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Invalid File', 'Please choose an image file (PNG, JPG, WEBP).', 'warning');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('File Too Large', 'Please choose an image smaller than 5MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormImage(reader.result);
        showToast('Image Uploaded', `${file.name} selected as banner.`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveStudio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Validation Error', 'Service name is required.', 'warning');
      return;
    }

    const payload = {
      name: formName.trim(),
      category: formCategory as CyberService['category'],
      shortDesc: formShortDesc.trim() || 'Verified FUTO online registry processing with instant tracking.',
      description: formDesc.trim() || formShortDesc.trim(),
      basePrice: Number(formBasePrice) || 0,
      serviceFee: Number(formServiceFee) || 0,
      totalPrice: (Number(formBasePrice) || 0) + (Number(formServiceFee) || 0),
      estimatedMinutes: Number(formEstimatedMins) || 20,
      image: formImage,
      iconName: editingService?.iconName || 'FileText',
      popular: formPopular,
      fields: formFields,
      requiredDocTypes: formDocs
    };

    if (editingService) {
      updateService(editingService.id, payload);
    } else {
      createService(payload);
    }

    setEditingService(null);
    setIsCreating(false);
  };

  // Field manipulation helpers
  const addField = () => {
    const newId = `field_${Date.now().toString().slice(-4)}`;
    setFormFields([
      ...formFields,
      {
        id: newId,
        label: `New Field ${formFields.length + 1}`,
        type: 'text',
        required: true,
        placeholder: 'Enter details...'
      }
    ]);
  };

  const updateFieldItem = (index: number, updates: Partial<ServiceField>) => {
    const next = [...formFields];
    next[index] = { ...next[index], ...updates };
    setFormFields(next);
  };

  const removeFieldItem = (index: number) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === formFields.length - 1)) return;
    const target = direction === 'up' ? index - 1 : index + 1;
    const copy = [...formFields];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setFormFields(copy);
  };

  const addPresetField = (preset: { label: string; id: string; type: 'text' | 'number' | 'select'; options?: string[]; placeholder?: string }) => {
    setFormFields([
      ...formFields,
      {
        id: preset.id + '_' + Date.now().toString().slice(-3),
        label: preset.label,
        type: preset.type,
        options: preset.options,
        placeholder: preset.placeholder || '',
        required: true
      }
    ]);
  };

  const addDoc = () => {
    if (!newDocInput.trim()) return;
    if (!formDocs.includes(newDocInput.trim())) {
      setFormDocs([...formDocs, newDocInput.trim()]);
    }
    setNewDocInput('');
  };

  const removeDoc = (doc: string) => {
    setFormDocs(formDocs.filter((d) => d !== doc));
  };

  const calculatedTotal = (Number(formBasePrice) || 0) + (Number(formServiceFee) || 0);

  return (
    <div>
      {/* Top Banner & Control Deck */}
      <div
        className="glass-card"
        style={{
          padding: '1.75rem 2rem',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          background: 'var(--bg-card)',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              <Layers size={16} />
              <span>EXECUTIVE FORMS & SERVICE STUDIO</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
              Services Catalog & Dynamic Form Builder
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '0.4rem 0 0', maxWidth: '680px', lineHeight: 1.55 }}>
              Create new institutional forms and cybercafe services on the fly. Configure dynamic input questions, Remita & desk processing fee structures, and required student attachments without code changes.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={resetServicesToDefault}
              className="btn btn-outline btn-sm"
              style={{ borderRadius: '10px', fontSize: '0.8rem', padding: '0.6rem 0.95rem' }}
              title="Reset catalog back to initial 14 templates"
            >
              <RotateCcw size={14} />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={openCreateModal}
              className="btn btn-primary"
              style={{ borderRadius: '12px', fontSize: '0.88rem', padding: '0.65rem 1.35rem', fontWeight: 700 }}
            >
              <Plus size={16} />
              <span>Create New Service & Form</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Total Live Services</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>{services.length}</div>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Total Form Inputs</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
              {services.reduce((sum, s) => sum + (s.fields?.length || 0), 0)}
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Service Categories</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
              {new Set(services.map((s) => s.category)).size}
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Avg SLA Turnaround</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-orange)', marginTop: '2px' }}>
              ~{Math.round(services.reduce((sum, s) => sum + (s.estimatedMinutes || 20), 0) / (services.length || 1))}m
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search services or custom fields..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.7rem 1rem 0.7rem 2.6rem',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-card)',
              fontSize: '0.86rem'
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: selectedCat === cat ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                background: selectedCat === cat ? 'var(--primary-light)' : 'var(--bg-card)',
                color: selectedCat === cat ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))', gap: '1.5rem' }}>
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="glass-card hover-lift"
            style={{
              borderRadius: '20px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-card)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            {/* Header / Thumbnail Area */}
            <div style={{ position: 'relative', height: '140px', width: '100%', background: 'var(--bg-inset)' }}>
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
                  <Layers size={36} />
                </div>
              )}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%)'
                }}
              />

              {/* Category Pill */}
              <div style={{ position: 'absolute', top: '10px', left: '12px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: 'var(--primary)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  {service.category}
                </span>
              </div>

              {/* Turnaround badge */}
              <div style={{ position: 'absolute', top: '10px', right: '12px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <Clock size={11} /> ~{service.estimatedMinutes}m
                </span>
              </div>

              {/* Service Title over image bottom */}
              <div style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: 0, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                  {service.name}
                </h3>
              </div>
            </div>

            {/* Card Content Body */}
            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 1rem' }}>
                  {service.shortDesc}
                </p>

                {/* Pricing Breakdown Box */}
                <div
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.75rem 0.9rem',
                    borderRadius: '12px',
                    marginBottom: '1rem',
                    fontSize: '0.78rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Base Portal / Remita Fee:</span>
                    <strong style={{ color: 'var(--text-main)' }}>₦{service.basePrice.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Desk Processing Fee:</span>
                    <strong style={{ color: 'var(--text-main)' }}>₦{service.serviceFee.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Total Application Fee:</span>
                    <strong style={{ fontWeight: 800, color: '#10b981', fontSize: '0.9rem' }}>
                      ₦{service.totalPrice.toLocaleString()}
                    </strong>
                  </div>
                </div>

                {/* Form Fields & Attachments Badge List */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                      Configured Inputs ({service.fields?.length || 0})
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {service.requiredDocTypes?.length || 0} upload(s)
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {service.fields && service.fields.length > 0 ? (
                      service.fields.slice(0, 3).map((f) => (
                        <span
                          key={f.id}
                          style={{
                            fontSize: '0.72rem',
                            padding: '2px 7px',
                            borderRadius: '6px',
                            background: 'var(--bg-inset)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-main)'
                          }}
                        >
                          {f.label.split(' ')[0]} ({f.type})
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>No dynamic inputs</span>
                    )}
                    {service.fields && service.fields.length > 3 && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          background: 'var(--primary-light)',
                          color: 'var(--primary)',
                          fontWeight: 700
                        }}
                      >
                        +{service.fields.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border-subtle)',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => setPreviewingService(service)}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.76rem', padding: '0.45rem 0.65rem', borderRadius: '8px' }}
                    title="Preview applicant form modal"
                  >
                    <Eye size={13} />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => handleDuplicate(service)}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.76rem', padding: '0.45rem 0.65rem', borderRadius: '8px' }}
                    title="Duplicate as new service template"
                  >
                    <Copy size={13} />
                  </button>

                  <button
                    onClick={() => setConfirmDeleteId(service.id)}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.76rem', padding: '0.45rem 0.65rem', borderRadius: '8px', color: '#ef4444' }}
                    title="Delete service"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <button
                  onClick={() => openEditModal(service)}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.78rem', padding: '0.48rem 0.95rem', borderRadius: '8px', fontWeight: 700 }}
                >
                  <Edit3 size={13} />
                  <span>Edit Form</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="modal-overlay">
          <div className="modal-content-box" style={{ maxWidth: '420px', padding: '1.75rem', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Delete Service & Form?
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              This will remove the service from the public catalog and forms desk. Active and completed pipeline tasks will preserve their records.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="btn btn-outline"
                style={{ borderRadius: '10px', fontSize: '0.85rem' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteService(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="btn btn-primary"
                style={{ borderRadius: '10px', fontSize: '0.85rem', background: '#dc2626', borderColor: '#dc2626' }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Form Preview Modal */}
      {previewingService && (
        <div className="modal-overlay">
          <div className="modal-content-box" style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '4px' }}>
                  Student View Preview
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  {previewingService.name}
                </h3>
              </div>
              <button onClick={() => setPreviewingService(null)} style={{ padding: '0.4rem', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {/* Fee Breakdown Banner */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
                  border: '1px solid rgba(2, 132, 199, 0.22)',
                  borderRadius: '16px',
                  padding: '1.15rem 1.4rem',
                  marginBottom: '1.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.85rem'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', display: 'block' }}>
                    Official Application Fee
                  </span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.2, marginTop: '2px' }}>
                    ₦{previewingService.totalPrice.toLocaleString()}
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                  <div>Base Registry Fee: <strong style={{ color: 'var(--text-main)' }}>₦{previewingService.basePrice.toLocaleString()}</strong></div>
                  <div>Portal Clearance & Stamp: <strong style={{ color: 'var(--text-main)' }}>₦{previewingService.serviceFee.toLocaleString()}</strong></div>
                </div>
              </div>

              {/* Form Inputs Simulation */}
              <div className="form-section-card" style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span>Form Input Questions ({previewingService.fields?.length || 0})</span>
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {previewingService.fields?.map((f) => (
                    <div key={f.id}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                        {f.label} {f.required && <span style={{ color: '#ef4444' }}>*</span>}
                      </label>
                      {f.type === 'select' ? (
                        <select className="form-select" defaultValue="">
                          <option value="">-- Choose Option --</option>
                          {f.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : f.type === 'textarea' ? (
                        <textarea rows={3} placeholder={f.placeholder} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid var(--border-subtle)', background: 'var(--bg-surface)' }} />
                      ) : (
                        <input type={f.type} placeholder={f.placeholder} />
                      )}
                      {f.helperText && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>{f.helperText}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents Required */}
              {previewingService.requiredDocTypes && previewingService.requiredDocTypes.length > 0 && (
                <div className="form-section-card" style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span>Required Document Uploads</span>
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    {previewingService.requiredDocTypes.map((doc, i) => (
                      <li key={i} style={{ marginBottom: '6px' }}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ textAlign: 'right' }}>
                <button onClick={() => setPreviewingService(null)} className="btn btn-primary" style={{ borderRadius: '10px' }}>
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Studio Builder Modal */}
      {(isCreating || editingService) && (
        <div className="modal-overlay">
          <div className="modal-content-box" style={{ maxWidth: '820px', maxHeight: '92vh', overflowY: 'auto' }}>
            {/* Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Settings size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    {editingService ? `Edit Service & Form: ${editingService.name}` : 'Create New Service & Custom Form'}
                  </h3>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    Configure service profile, pricing, custom dynamic input questions, and documents.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditingService(null);
                  setIsCreating(false);
                }}
                style={{ padding: '0.4rem', color: 'var(--text-muted)', borderRadius: '8px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Studio Navigation Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '0.4rem',
                padding: '0.75rem 1.5rem',
                background: 'var(--bg-surface)',
                borderBottom: '1px solid var(--border-subtle)',
                overflowX: 'auto'
              }}
            >
              {[
                { id: 'basics', label: '1. Service Info' },
                { id: 'pricing', label: '2. Remita & Fees' },
                { id: 'fields', label: `3. Form Fields (${formFields.length})` },
                { id: 'docs', label: `4. Required Docs (${formDocs.length})` },
                { id: 'preview', label: '5. Live Form Preview' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveStudioTab(tab.id as any)}
                  style={{
                    padding: '0.45rem 0.95rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    background: activeStudioTab === tab.id ? 'var(--primary)' : 'transparent',
                    color: activeStudioTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    transition: 'var(--transition)'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveStudio}>
              <div className="p-4 sm:p-6">
                {/* TAB 1: BASIC DETAILS */}
                {activeStudioTab === 'basics' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                        Service / Form Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Direct Entry Screening & Document Verification"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                          Category
                        </label>
                        <select
                          className="form-select"
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                          <option value="Custom">Custom Academic Service</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                          Estimated Turnaround (Minutes)
                        </label>
                        <input
                          type="number"
                          min="5"
                          step="5"
                          value={formEstimatedMins}
                          onChange={(e) => setFormEstimatedMins(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                        Short Summary (Shown on service catalog card)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Direct Entry portal invoice generation, result verification & official slip."
                        value={formShortDesc}
                        onChange={(e) => setFormShortDesc(e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                        Full Guidance Instructions (Shown when student opens form)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Provide detailed submission requirements, registry office notes, or instructions for the student..."
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '10px',
                          border: '1.5px solid var(--border-subtle)',
                          background: 'var(--bg-surface)',
                          color: 'var(--text-main)',
                          fontSize: '0.88rem',
                          resize: 'vertical',
                          fontFamily: 'inherit'
                        }}
                      />
                    </div>

                    {/* Banner Image Upload Area */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                        Service Banner Image
                      </label>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />

                      {formImage ? (
                        <div
                          style={{
                            border: '1.5px solid var(--border-subtle)',
                            borderRadius: '14px',
                            overflow: 'hidden',
                            background: 'var(--bg-surface)',
                            position: 'relative'
                          }}
                        >
                          <div style={{ position: 'relative', height: '170px', width: '100%' }}>
                            <img
                              src={formImage}
                              alt="Service banner preview"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to top, rgba(15,23,42,0.7) 0%, transparent 60%)',
                                display: 'flex',
                                alignItems: 'flex-end',
                                padding: '1rem',
                                justifyContent: 'space-between'
                              }}
                            >
                              <span style={{ color: '#ffffff', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <CheckCircle2 size={15} color="#10b981" />
                                <span>Banner image chosen</span>
                              </span>

                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="btn btn-secondary btn-sm"
                                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', borderRadius: '8px' }}
                                >
                                  <Upload size={13} />
                                  <span>Change Image</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setFormImage('')}
                                  className="btn btn-outline btn-sm"
                                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', borderRadius: '8px', background: 'rgba(239,68,68,0.2)', color: '#ffffff', borderColor: 'rgba(239,68,68,0.4)' }}
                                >
                                  <Trash2 size={13} />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            border: '2px dashed rgba(2, 132, 199, 0.4)',
                            borderRadius: '14px',
                            padding: '2.25rem 1.5rem',
                            textAlign: 'center',
                            background: 'rgba(2, 132, 199, 0.03)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--primary)';
                            e.currentTarget.style.background = 'rgba(2, 132, 199, 0.06)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(2, 132, 199, 0.4)';
                            e.currentTarget.style.background = 'rgba(2, 132, 199, 0.03)';
                          }}
                        >
                          <div
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '12px',
                              background: 'var(--primary-light)',
                              color: 'var(--primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 0.75rem'
                            }}
                          >
                            <Upload size={22} />
                          </div>

                          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                            Upload Service Image
                          </div>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 1rem' }}>
                            Choose a photo from your computer (PNG, JPG, or WEBP up to 5MB)
                          </p>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                            className="btn btn-primary btn-sm"
                            style={{ borderRadius: '8px', fontSize: '0.82rem', padding: '0.5rem 1.25rem', fontWeight: 700 }}
                          >
                            <Upload size={14} />
                            <span>Choose Image File</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.5rem' }}>
                      <input
                        type="checkbox"
                        id="formPopular"
                        checked={formPopular}
                        onChange={(e) => setFormPopular(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--accent-orange)' }}
                      />
                      <label htmlFor="formPopular" style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}>
                        Feature as &quot;Popular&quot; on Homepage and Catalog
                      </label>
                    </div>
                  </div>
                )}

                {/* TAB 2: PRICING & REMITA FEES */}
                {activeStudioTab === 'pricing' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-section-card">
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                        Fee Structure & Remita Breakdown
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                            Base Government / Portal Fee (₦) *
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="500"
                            required
                            value={formBasePrice}
                            onChange={(e) => setFormBasePrice(Number(e.target.value))}
                          />
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: '4px 0 0' }}>
                            Amount paid directly to Remita / FUTO official bursary account.
                          </p>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                            Cybercafe Desk Processing Fee (₦) *
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="200"
                            required
                            value={formServiceFee}
                            onChange={(e) => setFormServiceFee(Number(e.target.value))}
                          />
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: '4px 0 0' }}>
                            Desk queue handling, paperwork stamping, verification and laminated slip fee.
                          </p>
                        </div>
                      </div>

                      {/* Live Calculated Fee Display */}
                      <div
                        style={{
                          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
                          border: '1px solid rgba(2, 132, 199, 0.25)',
                          borderRadius: '14px',
                          padding: '1.25rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '1rem'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-dim)' }}>
                            Total Fee Charged in Application Form
                          </div>
                          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', lineHeight: 1.2 }}>
                            ₦{calculatedTotal.toLocaleString()}
                          </div>
                        </div>

                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                          <div>Base Portal: <strong>₦{(Number(formBasePrice) || 0).toLocaleString()}</strong></div>
                          <div>Desk Stamp: <strong>₦{(Number(formServiceFee) || 0).toLocaleString()}</strong></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: DYNAMIC FORM FIELDS STUDIO */}
                {activeStudioTab === 'fields' && (
                  <div>
                    {/* Header with Quick Presets */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                            Configure Dynamic Form Questions ({formFields.length})
                          </h4>
                          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                            Add input fields that the student or operator must fill out when applying.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={addField}
                          className="btn btn-primary btn-sm"
                          style={{ borderRadius: '8px', fontSize: '0.8rem', padding: '0.5rem 0.95rem' }}
                        >
                          <Plus size={14} />
                          <span>Add Custom Field</span>
                        </button>
                      </div>

                      {/* Quick Presets Bar */}
                      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center', background: 'var(--bg-surface)', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)' }}>Quick Add:</span>
                        <button
                          type="button"
                          onClick={() => addPresetField({ label: 'JAMB Registration Number', id: 'jambReg', type: 'text', placeholder: 'e.g. 202610483921FA' })}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px' }}
                        >
                          + JAMB Reg
                        </button>
                        <button
                          type="button"
                          onClick={() => addPresetField({ label: 'FUTO Matric Number', id: 'matricNo', type: 'text', placeholder: 'e.g. 2023/104928' })}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px' }}
                        >
                          + Matric No
                        </button>
                        <button
                          type="button"
                          onClick={() => addPresetField({ label: 'Current Level', id: 'level', type: 'select', options: ['100 Level', '200 Level', '300 Level', '400 Level', '500 Level', 'Postgraduate'] })}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px' }}
                        >
                          + Level Dropdown
                        </button>
                        <button
                          type="button"
                          onClick={() => addPresetField({ label: 'Academic Session', id: 'session', type: 'select', options: ['2024/2025', '2025/2026', '2026/2027'] })}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px' }}
                        >
                          + Session Dropdown
                        </button>
                        <button
                          type="button"
                          onClick={() => addPresetField({ label: 'Remita RRR Code', id: 'remitaRrr', type: 'text', placeholder: '12-digit RRR (if already generated)' })}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px' }}
                        >
                          + Remita RRR
                        </button>
                      </div>
                    </div>

                    {/* Field Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {formFields.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px dashed var(--border-strong)' }}>
                          <FileText size={32} color="var(--text-dim)" style={{ margin: '0 auto 0.5rem' }} />
                          <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', fontWeight: 600 }}>No custom inputs configured.</p>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Click &quot;Add Custom Field&quot; or choose a preset above.</p>
                        </div>
                      ) : (
                        formFields.map((field, idx) => (
                          <div
                            key={field.id}
                            style={{
                              background: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '14px',
                              padding: '1.25rem',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.6rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {idx + 1}
                                </span>
                                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                                  {field.label || 'Untitled Question'}
                                </span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <button
                                  type="button"
                                  onClick={() => moveField(idx, 'up')}
                                  disabled={idx === 0}
                                  style={{ padding: '4px', color: idx === 0 ? 'var(--text-dim)' : 'var(--text-main)', cursor: idx === 0 ? 'default' : 'pointer' }}
                                  title="Move Up"
                                >
                                  <ChevronUp size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveField(idx, 'down')}
                                  disabled={idx === formFields.length - 1}
                                  style={{ padding: '4px', color: idx === formFields.length - 1 ? 'var(--text-dim)' : 'var(--text-main)', cursor: idx === formFields.length - 1 ? 'default' : 'pointer' }}
                                  title="Move Down"
                                >
                                  <ChevronDown size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeFieldItem(idx)}
                                  style={{ padding: '4px', color: '#ef4444', marginLeft: '0.5rem', cursor: 'pointer' }}
                                  title="Remove Field"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', marginBottom: '0.85rem' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                                  Field Label / Question *
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={field.label}
                                  onChange={(e) => updateFieldItem(idx, { label: e.target.value })}
                                  placeholder="e.g. Matriculation Number"
                                />
                              </div>

                              <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                                  Input Type
                                </label>
                                <select
                                  className="form-select"
                                  value={field.type}
                                  onChange={(e) => updateFieldItem(idx, { type: e.target.value as any })}
                                >
                                  <option value="text">Single-line Text</option>
                                  <option value="number">Numeric Number</option>
                                  <option value="select">Dropdown Select (Menu)</option>
                                  <option value="textarea">Multi-line Paragraph (Textarea)</option>
                                </select>
                              </div>

                              <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                                  Placeholder Hint
                                </label>
                                <input
                                  type="text"
                                  value={field.placeholder || ''}
                                  onChange={(e) => updateFieldItem(idx, { placeholder: e.target.value })}
                                  placeholder="e.g. e.g. 2023/104928"
                                />
                              </div>
                            </div>

                            {/* Dropdown Options if Select */}
                            {field.type === 'select' && (
                              <div style={{ marginBottom: '0.85rem' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                                  Dropdown Options (Comma separated list) *
                                </label>
                                <input
                                  type="text"
                                  value={(field.options || []).join(', ')}
                                  onChange={(e) =>
                                    updateFieldItem(idx, {
                                      options: e.target.value
                                        .split(',')
                                        .map((opt) => opt.trim())
                                        .filter(Boolean)
                                    })
                                  }
                                  placeholder="e.g. 100 Level, 200 Level, 300 Level, 400 Level, 500 Level"
                                />
                              </div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                              <div style={{ flex: '1 1 240px' }}>
                                <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-dim)', marginBottom: '2px' }}>
                                  Helper Guidance Note (Optional):
                                </label>
                                <input
                                  type="text"
                                  value={field.helperText || ''}
                                  onChange={(e) => updateFieldItem(idx, { helperText: e.target.value })}
                                  placeholder="e.g. As stated on your official school identity card."
                                  style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
                                />
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                  type="checkbox"
                                  id={`req_${field.id}`}
                                  checked={field.required}
                                  onChange={(e) => updateFieldItem(idx, { required: e.target.checked })}
                                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                                />
                                <label htmlFor={`req_${field.id}`} style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', cursor: 'pointer' }}>
                                  Mandatory / Required Field
                                </label>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 4: REQUIRED ATTACHMENT DOCUMENTS */}
                {activeStudioTab === 'docs' && (
                  <div>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                        Required Document Uploads ({formDocs.length})
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                        Specify required physical clearance slips or certificates that students must upload.
                      </p>
                    </div>

                    {/* Add Document Input */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                      <input
                        type="text"
                        placeholder="e.g. JAMB Admission Letter or WAEC Statement of Result"
                        value={newDocInput}
                        onChange={(e) => setNewDocInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addDoc();
                          }
                        }}
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={addDoc}
                        className="btn btn-primary"
                        style={{ borderRadius: '10px', fontSize: '0.84rem' }}
                      >
                        <Plus size={15} />
                        <span>Add Document</span>
                      </button>
                    </div>

                    {/* Documents List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {formDocs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px dashed var(--border-strong)', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                          No document uploads currently required for this service.
                        </div>
                      ) : (
                        formDocs.map((doc, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)',
                              padding: '0.75rem 1rem',
                              borderRadius: '10px',
                              fontSize: '0.84rem'
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>
                              <FileText size={16} color="var(--primary)" />
                              {doc}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeDoc(doc)}
                              style={{ color: '#ef4444', padding: '4px' }}
                              title="Delete document"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 5: LIVE INTERACTIVE PREVIEW */}
                {activeStudioTab === 'preview' && (
                  <div>
                    <div style={{ background: 'var(--primary-light)', padding: '0.85rem 1rem', borderRadius: '12px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--primary)' }}>
                      <Sparkles size={16} />
                      <span>This is an active live preview of how applicants will experience your form in the modal.</span>
                    </div>

                    {/* Fee Summary Banner */}
                    <div
                      style={{
                        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
                        border: '1px solid rgba(2, 132, 199, 0.22)',
                        borderRadius: '16px',
                        padding: '1.15rem 1.4rem',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.85rem'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', display: 'block' }}>
                          Official Application Fee
                        </span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.2, marginTop: '2px' }}>
                          ₦{calculatedTotal.toLocaleString()}
                        </div>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                        <div>Base Registry Fee: <strong style={{ color: 'var(--text-main)' }}>₦{(Number(formBasePrice) || 0).toLocaleString()}</strong></div>
                        <div>Portal Clearance & Stamp: <strong style={{ color: 'var(--text-main)' }}>₦{(Number(formServiceFee) || 0).toLocaleString()}</strong></div>
                      </div>
                    </div>

                    {/* Simulated Fields */}
                    <div className="form-section-card" style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                        <span>2. {formName || 'Service Form'} Details</span>
                      </h4>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {formFields.map((f) => (
                          <div key={f.id}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.45rem' }}>
                              {f.label} {f.required && <span style={{ color: '#ef4444' }}>*</span>}
                            </label>
                            {f.type === 'select' ? (
                              <select
                                className="form-select"
                                value={previewSimData[f.id] || ''}
                                onChange={(e) => setPreviewSimData({ ...previewSimData, [f.id]: e.target.value })}
                              >
                                <option value="">-- Choose Option --</option>
                                {f.options?.map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : f.type === 'textarea' ? (
                              <textarea
                                rows={3}
                                placeholder={f.placeholder}
                                value={previewSimData[f.id] || ''}
                                onChange={(e) => setPreviewSimData({ ...previewSimData, [f.id]: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
                              />
                            ) : (
                              <input
                                type={f.type}
                                placeholder={f.placeholder}
                                value={previewSimData[f.id] || ''}
                                onChange={(e) => setPreviewSimData({ ...previewSimData, [f.id]: e.target.value })}
                              />
                            )}
                            {f.helperText && (
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>{f.helperText}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Required Documents Simulation */}
                    {formDocs.length > 0 && (
                      <div className="form-section-card" style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                          <span>3. Required Document Attachments ({formDocs.length})</span>
                        </h4>
                        <div style={{ border: '2px dashed rgba(2, 132, 199, 0.35)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', background: 'rgba(2, 132, 199, 0.04)' }}>
                          <Upload size={24} color="var(--primary)" style={{ margin: '0 auto 0.4rem' }} />
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                            Attach {formDocs.join(' or ')}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            PDF, JPG or PNG (Clear scan)
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Actions Bar */}
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  borderTop: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Configured Total Fee:</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981' }}>
                    ₦{calculatedTotal.toLocaleString()}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingService(null);
                      setIsCreating(false);
                    }}
                    className="btn btn-outline"
                    style={{ borderRadius: '10px', fontSize: '0.85rem' }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ borderRadius: '10px', fontSize: '0.88rem', fontWeight: 700, padding: '0.65rem 1.35rem' }}
                  >
                    <Check size={16} />
                    <span>{editingService ? 'Save Service & Form' : 'Publish New Service'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
