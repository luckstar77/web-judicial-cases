import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchComments, selectCommentsByFileset } from '../redux/commentSlice';

interface Props {
  filesetId: number;
}

const CommentList: React.FC<Props> = ({ filesetId }) => {
    const dispatch = useAppDispatch();
    const comments = useAppSelector(selectCommentsByFileset(filesetId));
    const loading = useAppSelector((s) => s.comments.loading);

    useEffect(() => {
        dispatch(fetchComments(filesetId));
    }, [dispatch, filesetId]);

    if (loading) return <div>載入中…</div>;
    if (!comments.length) return <div>尚無留言</div>;

    return (
        <>
            {comments.map((c) => (
                <div key={c.id}>
                    <p>{c.content}</p>
                    <small>
                        名字：{c.name} IP：({c.ip}) - 留言時間：{new Date(c.createdAt).toLocaleString()}
                    </small>
                </div>
            ))}
        </>
    );
};
export default CommentList;
