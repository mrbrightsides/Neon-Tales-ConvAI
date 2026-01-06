'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sparkles, User, Trash2, Edit, Check, X } from 'lucide-react'
import { getStorageManager, getFallbackStorage } from '@/lib/storage'
import type { Character } from '@/lib/storage'

interface CharacterCreatorProps {
  onCharacterSelect?: (character: Character) => void
  className?: string
}

export default function CharacterCreator({ onCharacterSelect, className = '' }: CharacterCreatorProps) {
  const [characters, setCharacters] = useState<Character[]>([])
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [personality, setPersonality] = useState<string>('kind')
  const [appearance, setAppearance] = useState<string>('')

  const personalities = [
    { value: 'kind', label: '😊 Baik Hati', emoji: '😊' },
    { value: 'brave', label: '💪 Pemberani', emoji: '💪' },
    { value: 'smart', label: '🧠 Cerdas', emoji: '🧠' },
    { value: 'funny', label: '😄 Lucu', emoji: '😄' },
    { value: 'curious', label: '🔍 Penasaran', emoji: '🔍' },
    { value: 'shy', label: '😳 Pemalu', emoji: '😳' },
    { value: 'energetic', label: '⚡ Energik', emoji: '⚡' },
    { value: 'calm', label: '😌 Tenang', emoji: '😌' }
  ]

  useEffect(() => {
    loadCharacters()
  }, [])

  const loadCharacters = async (): Promise<void> => {
    try {
      const storage = getStorageManager()
      await storage.init()
      const chars = await storage.getCharacters()
      setCharacters(chars)
    } catch (err) {
      console.error('Failed to load characters, using fallback:', err)
      const fallback = getFallbackStorage()
      const chars = await fallback.getCharacters()
      setCharacters(chars)
    }
  }

  const handleSave = async (): Promise<void> => {
    if (!name.trim()) return

    try {
      const character: Character = {
        id: editingId || `char-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        personality,
        appearance: appearance.trim(),
        timestamp: Date.now()
      }

      const storage = getStorageManager()
      await storage.init()
      await storage.saveCharacter(character)

      await loadCharacters()
      resetForm()
    } catch (err) {
      console.error('Failed to save character, using fallback:', err)
      const fallback = getFallbackStorage()
      const character: Character = {
        id: editingId || `char-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        personality,
        appearance: appearance.trim(),
        timestamp: Date.now()
      }
      await fallback.saveCharacter(character)
      await loadCharacters()
      resetForm()
    }
  }

  const handleEdit = (character: Character): void => {
    setName(character.name)
    setDescription(character.description)
    setPersonality(character.personality)
    setAppearance(character.appearance)
    setEditingId(character.id)
    setIsCreating(true)
  }

  const handleDelete = async (id: string): Promise<void> => {
    try {
      const storage = getStorageManager()
      await storage.init()
      await storage.deleteCharacter(id)
      await loadCharacters()
    } catch (err) {
      console.error('Failed to delete character, using fallback:', err)
      const fallback = getFallbackStorage()
      await fallback.deleteCharacter(id)
      await loadCharacters()
    }
  }

  const resetForm = (): void => {
    setName('')
    setDescription('')
    setPersonality('kind')
    setAppearance('')
    setEditingId(null)
    setIsCreating(false)
  }

  const getPersonalityEmoji = (pers: string): string => {
    const found = personalities.find((p) => p.value === pers)
    return found ? found.emoji : '😊'
  }

  return (
    <Card className={`bg-black/20 backdrop-blur-md border border-purple-500/30 ${className}`}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent flex items-center">
            <User className="h-5 w-5 text-purple-400 mr-2" />
            🎭 Character Creator
          </h3>
          {!isCreating && (
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white"
              size="sm"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Buat Karakter
            </Button>
          )}
        </div>

        {/* Create/Edit Form */}
        {isCreating && (
          <div className="space-y-4 p-4 bg-black/30 border border-purple-500/30 rounded-lg animate__animated animate__fadeIn">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-purple-300">
                {editingId ? 'Edit Karakter' : 'Karakter Baru'}
              </h4>
              <Button
                onClick={resetForm}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-white text-sm">Nama Karakter *</Label>
              <Input
                id="name"
                placeholder="Contoh: Luna si Kelinci"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-black/30 border-purple-500/50 text-white placeholder-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personality" className="text-white text-sm">Kepribadian</Label>
              <Select value={personality} onValueChange={setPersonality}>
                <SelectTrigger className="bg-black/30 border-purple-500/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-purple-500/50">
                  {personalities.map((p) => (
                    <SelectItem 
                      key={p.value} 
                      value={p.value}
                      className="text-white hover:bg-purple-500/20"
                    >
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appearance" className="text-white text-sm">Penampilan</Label>
              <Input
                id="appearance"
                placeholder="Contoh: Kelinci putih dengan telinga panjang"
                value={appearance}
                onChange={(e) => setAppearance(e.target.value)}
                className="bg-black/30 border-purple-500/50 text-white placeholder-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white text-sm">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Ceritakan tentang karakter ini..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-black/30 border-purple-500/50 text-white placeholder-white/40 min-h-[80px]"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleSave}
                disabled={!name.trim()}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                <Check className="h-4 w-4 mr-1" />
                {editingId ? 'Update' : 'Simpan'}
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                className="border-white/20 text-white/70 hover:bg-white/10"
              >
                Batal
              </Button>
            </div>
          </div>
        )}

        {/* Characters List */}
        {characters.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-white/30 mx-auto mb-3" />
            <p className="text-white/60 text-sm">Belum ada karakter</p>
            <p className="text-white/40 text-xs">Buat karakter untuk digunakan dalam cerita!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {characters.map((character: Character) => (
              <Card 
                key={character.id}
                className="bg-black/30 border border-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer"
                onClick={() => onCharacterSelect && onCharacterSelect(character)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{getPersonalityEmoji(character.personality)}</span>
                        <h4 className="text-white font-bold text-sm">{character.name}</h4>
                      </div>
                      {character.appearance && (
                        <p className="text-white/60 text-xs mb-1">👤 {character.appearance}</p>
                      )}
                      {character.description && (
                        <p className="text-white/50 text-xs line-clamp-2">{character.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-1 ml-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(character)
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(character.id)
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-400/60 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {characters.length > 0 && (
          <p className="text-white/50 text-xs text-center">
            💡 Klik karakter untuk menggunakannya dalam cerita
          </p>
        )}
      </CardContent>
    </Card>
  )
}
