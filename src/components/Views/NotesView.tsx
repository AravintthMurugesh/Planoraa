import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Plus,
  Star,
  Trash2,
  CheckSquare,
  Heading1,
  Heading2,
  Code,
  Quote,
  Table as TableIcon,
  Sparkles,
  Save,
  Search,
  Archive,
  Type,
  StickyNote,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Note, NoteBlock, NoteBlockType } from '../../types';
import { cn } from '../../lib/utils';
import { uid } from '../../lib/utils';

const BLOCK_TOOLBAR: { type: NoteBlockType; label: string; icon: React.ReactNode }[] = [
  { type: 'heading1', label: 'H1', icon: <Heading1 className="w-3.5 h-3.5" /> },
  { type: 'heading2', label: 'H2', icon: <Heading2 className="w-3.5 h-3.5" /> },
  { type: 'paragraph', label: 'Text', icon: <Type className="w-3.5 h-3.5" /> },
  { type: 'checklist', label: 'Checklist', icon: <CheckSquare className="w-3.5 h-3.5" /> },
  { type: 'code', label: 'Code', icon: <Code className="w-3.5 h-3.5" /> },
  { type: 'quote', label: 'Quote', icon: <Quote className="w-3.5 h-3.5" /> },
  { type: 'table', label: 'Table', icon: <TableIcon className="w-3.5 h-3.5" /> },
];

export const NotesView: React.FC = () => {
  const {
    notes,
    addNote,
    deleteNote,
    toggleNoteFavorite,
    toggleNoteArchive,
    updateNoteBlocks,
    updateNote,
  } = useApp();

  const [activeNoteId, setActiveNoteId] = useState<string>(() => notes.find((n) => !n.isArchived)?.id || '');
  const [search, setSearch] = useState('');

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes.find((n) => !n.isArchived);

  const handleCreateNote = () => {
    addNote({
      title: 'Untitled Note 📝',
      category: 'Work',
      tags: ['Ideas'],
      isFavorite: false,
      isArchived: false,
      coverColor: 'from-indigo-500/10 to-purple-500/10',
      icon: '📝',
      blocks: [
        { id: uid('b'), type: 'heading1', content: 'New Note' },
        { id: uid('b'), type: 'paragraph', content: 'Start typing your thought or idea...' },
      ],
    });
  };

  const handleAddBlock = (type: NoteBlock['type']) => {
    if (!activeNote) return;
    const newBlock: NoteBlock = {
      id: uid('b'),
      type,
      content: type === 'table' ? '' : 'New content block',
      tableData: type === 'table' ? [['Header 1', 'Header 2'], ['Cell 1', 'Cell 2']] : undefined,
    };
    updateNoteBlocks(activeNote.id, [...activeNote.blocks, newBlock]);
  };

  const handleUpdateBlockContent = (blockId: string, content: string) => {
    if (!activeNote) return;
    updateNoteBlocks(
      activeNote.id,
      activeNote.blocks.map((b) => (b.id === blockId ? { ...b, content } : b))
    );
  };

  const handleToggleBlockCheck = (blockId: string) => {
    if (!activeNote) return;
    updateNoteBlocks(
      activeNote.id,
      activeNote.blocks.map((b) => (b.id === blockId ? { ...b, checked: !b.checked } : b))
    );
  };

  const handleDeleteBlock = (blockId: string) => {
    if (!activeNote) return;
    updateNoteBlocks(
      activeNote.id,
      activeNote.blocks.filter((b) => b.id !== blockId)
    );
  };

  const filteredNotes = notes.filter(
    (n) =>
      !n.isArchived &&
      (n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      {/* ---------- Header ---------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-7 h-7 text-[var(--accent-color)]" />
            <span>Notes</span>
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Modular block editor for documentation, spec sheets, code blocks, and personal notes.
          </p>
        </div>

        <button
          onClick={handleCreateNote}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-hover)] hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-[var(--accent-soft)] btn-press flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Note</span>
        </button>
      </div>

      {/* ---------- Editor ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Notes list */}
        <div className="lg:col-span-4 glass-card p-4 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 no-scrollbar">
            {filteredNotes.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center mx-auto mb-3">
                  <StickyNote className="w-6 h-6 text-[var(--accent-color)]" />
                </div>
                <p className="text-xs font-semibold text-slate-400">
                  No notes found. Create one to start writing.
                </p>
              </div>
            )}

            {filteredNotes.map((note) => {
              const isSelected = note.id === activeNote?.id;
              return (
                <div
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={cn(
                    'p-3.5 rounded-2xl cursor-pointer transition-all border card-lift',
                    isSelected
                      ? 'bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-hover)] text-white border-transparent shadow-lg shadow-[var(--accent-soft)]'
                      : 'bg-slate-100/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-900 dark:text-white'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-lg">{note.icon || '📝'}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleNoteArchive(note.id);
                        }}
                        className={cn(
                          'cursor-pointer',
                          isSelected ? 'text-white/80 hover:text-white' : 'text-slate-400 hover:text-[var(--accent-color)]'
                        )}
                        title="Move to Vault"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleNoteFavorite(note.id);
                        }}
                        className={cn('cursor-pointer', isSelected ? 'text-amber-300' : 'text-slate-400 hover:text-amber-400')}
                      >
                        <Star className={cn('w-4 h-4', note.isFavorite && 'fill-current text-amber-400')} />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-extrabold text-sm mt-1 truncate">{note.title}</h4>

                  <div className="flex items-center justify-between mt-2 text-[10px] font-bold">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-md',
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      )}
                    >
                      {note.category}
                    </span>
                    <span className={isSelected ? 'text-white/80' : 'text-slate-400'}>
                      {note.blocks.length} blocks
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Editor */}
        {activeNote ? (
          <div className="lg:col-span-8 glass-card p-6 sm:p-8 space-y-6">
            <div className="space-y-3 pb-4 border-b border-slate-200/80 dark:border-white/10">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  <Save className="w-3.5 h-3.5" /> Auto Saved
                </span>
                <button
                  onClick={() => deleteNote(activeNote.id)}
                  className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>

              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                className="w-full text-2xl sm:text-3xl font-black bg-transparent text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                placeholder="Note Title..."
              />
            </div>

            {/* Block toolbar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200/80 dark:border-white/10 text-xs no-scrollbar">
              <span className="text-slate-500 dark:text-slate-400 font-bold shrink-0 mr-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                Insert:
              </span>
              {BLOCK_TOOLBAR.map((b) => (
                <button
                  key={b.type}
                  onClick={() => handleAddBlock(b.type)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1 shrink-0 cursor-pointer hover:bg-[var(--accent-soft)] hover:text-[var(--accent-color)] transition-colors btn-press"
                >
                  {b.icon}
                  {b.label}
                </button>
              ))}
            </div>

            {/* Blocks */}
            <div className="space-y-4">
              {activeNote.blocks.map((block) => (
                <div key={block.id} className="group relative flex items-start gap-2">
                  <div className="flex-1">
                    {block.type === 'heading1' && (
                      <input
                        type="text"
                        value={block.content}
                        onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                        className="w-full font-black text-xl sm:text-2xl text-slate-900 dark:text-white bg-transparent outline-none py-1"
                      />
                    )}

                    {block.type === 'heading2' && (
                      <input
                        type="text"
                        value={block.content}
                        onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                        className="w-full font-extrabold text-lg text-slate-900 dark:text-white bg-transparent outline-none py-1"
                      />
                    )}

                    {block.type === 'paragraph' && (
                      <textarea
                        rows={2}
                        value={block.content}
                        onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                        className="w-full text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-transparent outline-none resize-none leading-relaxed font-medium"
                      />
                    )}

                    {block.type === 'checklist' && (
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={block.checked || false}
                          onChange={() => handleToggleBlockCheck(block.id)}
                          className="w-4 h-4 rounded text-[var(--accent-color)] focus:ring-[var(--accent-color)] cursor-pointer"
                        />
                        <input
                          type="text"
                          value={block.content}
                          onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                          className={cn(
                            'w-full text-xs sm:text-sm bg-transparent outline-none',
                            block.checked ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white font-medium'
                          )}
                        />
                      </div>
                    )}

                    {block.type === 'code' && (
                      <div className="rounded-2xl bg-slate-950 text-emerald-400 p-4 font-mono text-xs border border-slate-800 shadow-inner">
                        <textarea
                          rows={4}
                          value={block.content}
                          onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                          className="w-full bg-transparent outline-none font-mono resize-none text-emerald-400"
                        />
                      </div>
                    )}

                    {block.type === 'quote' && (
                      <div className="border-l-4 border-[var(--accent-color)] pl-4 py-1.5 italic text-slate-700 dark:text-slate-300 text-xs sm:text-sm bg-[var(--accent-soft)] rounded-r-2xl">
                        <input
                          type="text"
                          value={block.content}
                          onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                          className="w-full bg-transparent outline-none font-semibold"
                        />
                      </div>
                    )}

                    {block.type === 'table' && (
                      <div className="overflow-x-auto border border-slate-200 dark:border-white/10 rounded-2xl p-2 text-xs bg-slate-100/80 dark:bg-slate-900/80">
                        <table className="w-full border-collapse">
                          <tbody>
                            {block.tableData?.map((row, rowIndex) => (
                              <tr key={rowIndex} className="border-b border-slate-200 dark:border-white/10">
                                {row.map((cell, colIndex) => (
                                  <td key={colIndex} className="p-2 border-r border-slate-200 dark:border-white/10">
                                    <input
                                      type="text"
                                      value={cell}
                                      onChange={(e) => {
                                        const newTable = [...(block.tableData || [])];
                                        newTable[rowIndex][colIndex] = e.target.value;
                                        updateNoteBlocks(
                                          activeNote.id,
                                          activeNote.blocks.map((b) =>
                                            b.id === block.id ? { ...b, tableData: newTable } : b
                                          )
                                        );
                                      }}
                                      className="w-full bg-transparent outline-none text-slate-900 dark:text-white font-bold"
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteBlock(block.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 rounded transition-opacity cursor-pointer"
                    title="Remove block"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 glass-card p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center mx-auto">
              <FileText className="w-7 h-7 text-[var(--accent-color)]" />
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              No note selected
            </p>
            <p className="text-xs text-slate-400">
              Select a note or create a new one to start writing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};