import React, { useMemo, useState } from 'react';
import { MessageCircle, Reply, Send, Trash2, Lock, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

const MAX_DEPTH = 4;

export default function ForumSection() {
  const { theme } = useTheme();
  const {
    user, lang, setIsAuthModalOpen, setAuthMode,
    forumMessages, forumAvatars, forumInput, setForumInput,
    handleSendForumMessage, postForumMessage, handleDeleteForumMessage
  } = useApp();

  const ua = lang === 'ua';
  const dark = theme === 'dark';

  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Дерево з плоского списку
  const tree = useMemo(() => {
    const byParent = {};
    forumMessages.forEach((m) => {
      const key = m.parent_id ?? 'root';
      (byParent[key] = byParent[key] || []).push(m);
    });
    return byParent;
  }, [forumMessages]);

  const rootPosts = [...(tree.root || [])].reverse(); // нові зверху

  const openLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const inputCls = `w-full p-3.5 border rounded-2xl text-xs font-medium outline-none resize-none ${
    dark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
  }`;

  const formatDate = (iso) =>
    iso
      ? new Date(iso).toLocaleString(ua ? 'uk-UA' : 'en-US', {
          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
        })
      : '';

  const renderAvatar = (m) => {
    const src = forumAvatars?.[m.user_email];
    return src ? (
      <img src={src} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 border border-emerald-500/50" />
    ) : (
      <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
        {m.author?.[0]?.toUpperCase()}
      </div>
    );
  };

  const submitReply = async (parentId) => {
    const ok = await postForumMessage(replyText, parentId);
    if (ok) {
      setReplyTo(null);
      setReplyText('');
    }
  };

  const renderPost = (m, depth = 0) => {
    const children = tree[m.id] || [];
    const canDelete = user && (m.user_email === user.email || user.is_admin);

    return (
      <div key={m.id} className={depth > 0 ? 'ml-5 pl-4 border-l border-slate-500/30' : ''}>
        <div className={`p-4 rounded-2xl border mb-3 ${dark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
          <div className="flex items-center gap-2.5 mb-2">
            {renderAvatar(m)}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{m.author}</p>
              <p className="text-[10px] opacity-60">{formatDate(m.created_at)}</p>
            </div>
            {canDelete && (
              <button
                onClick={() => handleDeleteForumMessage(m.id)}
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer"
                title={ua ? 'Видалити' : 'Delete'}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          <p className="text-xs font-medium leading-relaxed whitespace-pre-wrap break-words text-left">{m.message}</p>

          {user && depth < MAX_DEPTH && (
            <button
              onClick={() => { setReplyTo(replyTo === m.id ? null : m.id); setReplyText(''); }}
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
                  onClick={() => submitReply(m.id)}
                  disabled={!replyText.trim()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={12} /> {ua ? 'Надіслати' : 'Send'}
                </button>
                <button
                  onClick={() => setReplyTo(null)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer ${dark ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-800'}`}
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
    <div className={`border rounded-3xl p-8 mb-12 shadow-2xl text-left ${dark ? 'bg-[#121824] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
      <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
        {ua ? 'Спільнота' : 'Community'}
      </span>
      <h3 className="text-2xl font-black mt-1 mb-6 flex items-center gap-2">
        <MessageCircle size={22} className="text-emerald-400" />
        {ua ? 'Форум обговорень' : 'Discussion forum'}
        <span className="text-xs font-bold opacity-50">({forumMessages.length})</span>
      </h3>

      {user ? (
        <form onSubmit={handleSendForumMessage} className="space-y-3 mb-8">
          <textarea
            value={forumInput}
            onChange={(e) => setForumInput(e.target.value)}
            placeholder={ua ? 'Поділіться думкою або поставте питання...' : 'Share a thought or ask a question...'}
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
        <div className={`mb-8 p-5 rounded-2xl border flex items-center justify-between gap-4 flex-wrap ${dark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
          <div className="flex items-center gap-2 text-xs font-semibold opacity-90">
            <Lock size={16} className="text-emerald-400" />
            {ua ? 'Писати та відповідати можуть лише зареєстровані користувачі.' : 'Only registered users can post and reply.'}
          </div>
          <button onClick={openLogin} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer">
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