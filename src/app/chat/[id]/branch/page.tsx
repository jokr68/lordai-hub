'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { ArrowRight, ArrowLeft, GitBranch, Save, Trash2, Plus } from 'lucide-react';

interface Message {
  id: number;
  sender: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  branchId?: number;
}

interface Branch {
  id: number;
  name: string;
  parentId: number | null;
  createdAt: Date;
  messages: Message[];
}

export default function ConversationBranchingPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { t, dir } = useTranslation();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranchId, setCurrentBranchId] = useState<number | null>(null);
  const [newBranchName, setNewBranchName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const response = await fetch(`/api/chat/branches?conversationId=${(await params).id}`);
      if (response.ok) {
        const data = await response.json();
        setBranches(data.branches || []);
        if (data.branches && data.branches.length > 0) {
          setCurrentBranchId(data.branches[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBranch = async () => {
    if (!newBranchName.trim()) return;

    try {
      const response = await fetch('/api/chat/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: (await params).id,
          name: newBranchName,
          parentId: currentBranchId,
          messageIds: Array.from(selectedMessages),
        }),
      });

      if (response.ok) {
        const newBranch = await response.json();
        setBranches([...branches, newBranch]);
        setCurrentBranchId(newBranch.id);
        setNewBranchName('');
        setShowCreateModal(false);
        setSelectedMessages(new Set());
      }
    } catch (error) {
      console.error('Error creating branch:', error);
    }
  };

  const deleteBranch = async (branchId: number) => {
    if (!confirm(t('branching.confirmDelete'))) return;

    try {
      const response = await fetch(`/api/chat/branches/${branchId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBranches(branches.filter(b => b.id !== branchId));
        if (currentBranchId === branchId && branches.length > 1) {
          setCurrentBranchId(branches[0].id);
        }
      }
    } catch (error) {
      console.error('Error deleting branch:', error);
    }
  };

  const mergeBranches = async (sourceBranchId: number, targetBranchId: number) => {
    try {
      const response = await fetch('/api/chat/branches/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceBranchId,
          targetBranchId,
        }),
      });

      if (response.ok) {
        await loadBranches();
      }
    } catch (error) {
      console.error('Error merging branches:', error);
    }
  };

  const toggleMessageSelection = (messageId: number) => {
    const newSelection = new Set(selectedMessages);
    if (newSelection.has(messageId)) {
      newSelection.delete(messageId);
    } else {
      newSelection.add(messageId);
    }
    setSelectedMessages(newSelection);
  };

  const currentBranch = branches.find(b => b.id === currentBranchId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800" dir={dir}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {t('branching.title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('branching.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Branches List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {t('branching.branchesList')}
                </h2>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {branches.map((branch) => (
                  <div
                    key={branch.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      currentBranchId === branch.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                    onClick={() => setCurrentBranchId(branch.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-slate-900 dark:text-white">
                          {branch.name}
                        </span>
                      </div>
                      {branch.parentId && (
                        <span className="text-xs text-slate-500">
                          {t('branching.forked')}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {branch.messages.length} {t('branching.messages')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Branch Content */}
          <div className="lg:col-span-2">
            {currentBranch ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {currentBranch.name}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {new Date(currentBranch.createdAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <GitBranch className="w-4 h-4" />
                      {t('branching.createBranch')}
                    </button>
                    {branches.length > 1 && (
                      <button
                        onClick={() => {
                          const targetBranch = branches.find(b => b.id !== currentBranchId);
                          if (targetBranch && currentBranchId && confirm(t('branching.confirmMerge'))) {
                            mergeBranches(currentBranchId, targetBranch.id);
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        {t('branching.merge')}
                      </button>
                    )}
                    <button
                      onClick={() => currentBranchId && deleteBranch(currentBranchId)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t('branching.delete')}
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {currentBranch.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-50 dark:bg-blue-900/20 ml-8'
                          : 'bg-slate-50 dark:bg-slate-700/50 mr-8'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-600 text-white'
                        }`}>
                          {message.sender === 'user' ? (
                            <ArrowLeft className="w-4 h-4" />
                          ) : (
                            <ArrowRight className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-900 dark:text-white">
                            {message.content}
                          </p>
                          <p className="text-xs text-slate-500 mt-2">
                            {new Date(message.createdAt).toLocaleString('ar-SA')}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedMessages.has(message.id)}
                          onChange={() => toggleMessageSelection(message.id)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Messages Info */}
                {selectedMessages.size > 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      {selectedMessages.size} {t('branching.messagesSelected')}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 text-center">
                <GitBranch className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {t('branching.noBranches')}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {t('branching.createFirstBranch')}
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  {t('branching.createBranch')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Create Branch Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                {t('branching.createNewBranch')}
              </h3>
              <input
                type="text"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
                placeholder={t('branching.branchNamePlaceholder')}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={createBranch}
                  disabled={!newBranchName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('branching.create')}
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewBranchName('');
                  }}
                  className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  {t('branching.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}