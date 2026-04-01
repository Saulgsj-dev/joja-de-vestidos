import { useState, useCallback } from 'react';
import { apiRequest } from '../lib/apiClient';

export function useSections(profileId) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSections = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest(`/api/sections?profile_id=${profileId}&show_all=true`);
      if (data && data.length > 0) {
        setSections(data);
      } else {
        await apiRequest('/api/sections/init', { method: 'POST' });
        const newData = await apiRequest(`/api/sections?profile_id=${profileId}&show_all=true`);
        setSections(newData);
      }
    } catch (e) {
      console.error('Erro ao carregar seções:', e);
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  const saveSection = useCallback(async (sectionData) => {
    await apiRequest('/api/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sectionData)
    });
    await loadSections();
  }, [loadSections]);

  const togglePublish = useCallback(async (section, newStatus) => {
    await saveSection({
      id: section.id,
      section_type: section.section_type,
      section_order: section.section_order,
      content: section.content,
      styles: section.styles,
      is_active: newStatus ? 1 : 0
    });
  }, [saveSection]);

  const deleteSection = useCallback(async (sectionId) => {
    await apiRequest(`/api/sections/${sectionId}`, { method: 'DELETE' });
    await loadSections();
  }, [loadSections]);

  return { sections, loading, loadSections, saveSection, togglePublish, deleteSection };
}