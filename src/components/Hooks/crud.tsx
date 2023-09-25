import * as React from "react";
function useFetchOneById<T>(id: string, fetchMethod: (id: string) => Promise<T>) {
    const [item, setItem] = React.useState<T | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<boolean>(false);
    const fetchData = async () => {
        console.log("useFetchOneById useEffect", item, loading, error);
        const _item: T = await fetchMethod(id);
        if (_item !== undefined) {
            console.log("useFetchOneById useEffect object fetched", _item);
            setItem({ ..._item });
        } else {
            setError(true);
        }
        setLoading(false);
    };

    const refresh = () => {
        setItem(null);
        setLoading(true);
        setError(false);
    }

    const reload = () => {
        setLoading(true);
        setError(false);
    }

    React.useEffect(() => {
        fetchData();
    }, [loading, error]);
    return { item, setItem, loading, error, refresh, reload };
}

export {
    useFetchOneById,
}