import React, { useState } from 'react';
import { useAppDispatch } from '../hooks/redux';
import { addComment } from '../redux/commentSlice';

interface Props {
  filesetId: number;
}

const CommentForm: React.FC<Props> = ({ filesetId }) => {
    const [content, setContent] = useState('');
    const dispatch = useAppDispatch();

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        dispatch(addComment({ filesetId, content }));
        setContent('');
    };

    return (
        <form onSubmit={submit}>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} />
            <button type="submit">送出</button>
        </form>
    );
};
export default CommentForm;
