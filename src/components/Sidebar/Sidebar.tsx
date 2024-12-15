import { useCallback } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { fetchEntryData } from '@/api';
import { EntryData } from '@/types';

interface SidebarProps {
    entryId: string;
}

const Sidebar = ({ entryId }: SidebarProps) => {
    const fetchFunction = useCallback(() => fetchEntryData(entryId), [entryId]);
    const { data, loading, error } = useFetch<EntryData | null>(fetchFunction);

    // TODO : create a loader component
    if (loading) return <div>Loading entry data...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!data) return <div>Entry not found</div>;

    const { name, description } = data;

    return (
        <div>
            <h2>{name}</h2>
            <p>{description || 'No description available'}</p>
        </div>
    );
};

export default Sidebar;
