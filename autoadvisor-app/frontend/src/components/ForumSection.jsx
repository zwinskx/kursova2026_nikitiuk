import React, { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Reply, Send, Trash2, Lock, X, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

const MAX_DEPTH = 4;

export default function ForumSection() {
  const { theme } = useTheme();
  const {
    user, lang, setIsAuthModalOpen, setAuthMode,
    forumMessages, forumAvatars, forumInput, setForumInput,
    handleSendForumMessage, postForumMessage, handleDeleteForumMessage, fetchForumMessages
  } = useApp();

  const ua = lang === 'ua';
  const dark = theme === 'dark';

  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [sendingReply, setSendingReply] = useState(false);
  const API = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
  const [myReactions, setMyReactions] = useState({});
  const [votingId, setVotingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!user?.access_token) {
      setMyReactions({});
      return;
    }
    const load = async () => {
      try {
        const response = await fetch(`${API}/api/forum/reactions/me`, {
          headers: { Authorization: `Bearer ${user.access_token}` }
        });
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled) setMyReactions(data.reactions || {});
      } catch (error) {
        console.error('Cannot load forum reactions:', error);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [API, user?.access_token]);

  const reactToMessage = async (messageId, choice) => {
    if (!user?.access_token) {
      openLogin();
      return;
    }
    if (votingId !== null) return;
    setVotingId(messageId);
    try {
      const current = myReactions[String(messageId)] || null;
      const remove = current === choice;
      const response = await fetch(`${API}/api/forum/${messageId}/reaction`, {
        method: remove ? 'DELETE' : 'PUT',
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          ...(!remove ? { 'Content-Type': 'application/json' } : {})
        },
        ...(!remove ? { body: JSON.stringify({ value: choice }) } : {})
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.detail || 'Не вдалося зберегти реакцію.');
      setMyReactions(prev => {
        const next = { ...prev };
        if (remove) delete next[String(messageId)];
        else next[String(messageId)] = choice;
        return next;
      });
      await fetchForumMessages();
    } catch (error) {
      alert(error.message);
    } finally {
      setVotingId(null);
    }
  };


  const tree = useMemo(() => {
    const byParent = {};
    (Array.isArray(forumMessages) ? forumMessages : []).forEach((m) => {
      const key = m.parent_id ?? 'root';
      (byParent[key] = byParent[key] || []).push(m);
    });
    return byParent;
  }, [forumMessages]);

  const rootPosts = [...(tree.root || [])].reverse();

  const openLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const inputCls = `w-full p-3.5 border rounded-2xl text-xs font-medium outline-none resize-none ${
    dark
      ? 'bg-slate-900 border-slate-700 text-white'
      : 'bg-slate-50 border-slate-300 text-slate-900'
  }`;

  const formatDate = (iso) =>
    iso
      ? new Date(iso).toLocaleString(ua ? 'uk-UA' : 'en-US', {
          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
        })
      : '';

  const renderAvatar = (m) => {
    const src = forumAvatars?.[m.user_email];
    return src ? (
      <img
        src={src}
        alt=""
        className="w-8 h-8 rounded-full object-cover shrink-0 border border-emerald-500/50"
      />
    ) : (
      <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
        {m.author?.[0]?.toUpperCase() || '?'}
      </div>
    );
  };

  const submitReply = async (parentId) => {
    if (sendingReply || !replyText.trim()) return;
    setSendingReply(true);
    try {
      const ok = await postForumMessage(replyText, parentId);
      if (ok) {
        setReplyTo(null);
        setReplyText('');
      }
    } finally {
      setSendingReply(false);
    }
  };

  const deleteMessage = async (messageId) => {
    if (deletingId !== null) return;
    setDeletingId(messageId);
    try {
      const ok = await handleDeleteForumMessage(messageId);
      if (ok && replyTo === messageId) {
        setReplyTo(null);
        setReplyText('');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const renderPost = (m, depth = 0) => {
    const children = tree[m.id] || [];
    const canDelete = Boolean(user) && (
      Boolean(user.is_admin) ||
      String(m.user_email || '').toLowerCase() === String(user.email || '').toLowerCase()
    );

    return (
      <div key={m.id} className={depth > 0 ? 'ml-2 sm:ml-5 pl-2 sm:pl-4 border-l border-slate-500/30' : ''}>
        <div className={`p-4 rounded-2xl border mb-3 ${
          dark
            ? 'bg-slate-900 border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center gap-2.5 mb-2">
            {renderAvatar(m)}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{m.author}</p>
              <p className="text-[10px] opacity-60">{formatDate(m.created_at)}</p>
            </div>
            {canDelete && (
              <button
                type="button"
                onClick={() => deleteMessage(m.id)}
                disabled={deletingId !== null}
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title={ua ? 'Видалити' : 'Delete'}
                aria-label={ua ? 'Видалити повідомлення' : 'Delete message'}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          <p className="text-xs font-medium leading-relaxed whitespace-pre-wrap break-words text-left">
            {m.message}
          </p>

          <div className="mt-3 flex items-center gap-3 flex-wrap" role="group" aria-label={ua ? 'Реакції на повідомлення' : 'Message reactions'}>
            {[
              { value: 1, Icon: ThumbsUp, count: m.likes ?? 0, title: ua ? 'Подобається' : 'Like' },
              { value: -1, Icon: ThumbsDown, count: m.dislikes ?? 0, title: ua ? 'Не подобається' : 'Dislike' }
            ].map(({ value, Icon, count, title }) => {
              const active = myReactions[String(m.id)] === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => reactToMessage(m.id, value)}
                  disabled={votingId === m.id}
                  aria-label={`${title}: ${count}`}
                  aria-pressed={active}
                  title={user ? title : (ua ? 'Увійдіть для голосування' : 'Sign in to vote')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 ${active
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                    : dark ? 'border-slate-700 text-slate-300 hover:border-emerald-500' : 'border-slate-200 text-slate-600 hover:border-emerald-500'
                  }`}
                >
                  <Icon size={15} strokeWidth={2} fill={active ? 'currentColor' : 'none'} />
                  <span>{count}</span>
                </button>
              );
            })}
          </div>

          {user && depth < MAX_DEPTH && (
            <button
              type="button"
              onClick={() => {
                setReplyTo(replyTo === m.id ? null : m.id);
                setReplyText('');
              }}
              className="mt-3 text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Reply size={12} /> {ua ? 'Відповісти' : 'Reply'}
            </button>
          )}

          {replyTo === m.id && (
            <div className="mt-3 space-y-2">
              <textarea
                autoFocus
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={ua ? `Відповідь для ${m.author}...` : `Reply to ${m.author}...`}
                className={`${inputCls} h-20`}
                maxLength={1000}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => submitReply(m.id)}
                  disabled={!replyText.trim() || sendingReply}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={12} /> {ua ? 'Надіслати' : 'Send'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReplyTo(null);
                    setReplyText('');
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    dark ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  <X size={12} /> {ua ? 'Скасувати' : 'Cancel'}
                </button>
              </div>
            </div>
          )}
        </div>

        {children.map((c) => renderPost(c, depth + 1))}
      </div>
    );
  };

  return (
    <div className={`border rounded-3xl p-3 sm:p-8 mb-12 shadow-2xl text-left ${
      dark
        ? 'bg-[#121824] border-slate-800 text-white'
        : 'bg-white border-slate-200 text-slate-900'
    }`}>
      <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
        {ua ? 'Спільнота' : 'Community'}
      </span>
      <h3 className="text-2xl font-black mt-1 mb-6 flex items-center gap-2">
        <MessageCircle size={22} className="text-emerald-400" />
        {ua ? 'Форум обговорень' : 'Discussion forum'}
        <span className="text-xs font-bold opacity-50">({Array.isArray(forumMessages) ? forumMessages.length : 0})</span>
      </h3>

      {user ? (
        <form onSubmit={handleSendForumMessage} className="space-y-3 mb-8">
          <textarea
            value={forumInput}
            onChange={(e) => setForumInput(e.target.value)}
            placeholder={ua
              ? 'Поділіться думкою або поставте питання...'
              : 'Share a thought or ask a question...'}
            className={`${inputCls} h-24`}
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={!forumInput.trim()}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Send size={14} /> {ua ? 'Опублікувати' : 'Post'}
          </button>
        </form>
      ) : (
        <div className={`mb-8 p-5 rounded-2xl border flex items-center justify-between gap-4 flex-wrap ${
          dark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-300'
        }`}>
          <div className="flex items-center gap-2 text-xs font-semibold opacity-90">
            <Lock size={16} className="text-emerald-400" />
            {ua
              ? 'Писати та відповідати можуть лише зареєстровані користувачі.'
              : 'Only registered users can post and reply.'}
          </div>
          <button
            type="button"
            onClick={openLogin}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            {ua ? 'Увійти' : 'Sign in'}
          </button>
        </div>
      )}

      {rootPosts.length === 0 ? (
        <p className="text-xs opacity-60 text-center py-6">
          {ua ? 'Поки що тут тихо. Станьте першим!' : 'Nothing here yet. Be the first!'}
        </p>
      ) : (
        <div>{rootPosts.map((m) => renderPost(m))}</div>
      )}
    </div>
  );
}
