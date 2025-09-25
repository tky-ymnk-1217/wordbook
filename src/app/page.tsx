'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  Box,
} from '@mui/material';
import { Check, Add, Close, ArrowForward } from '@mui/icons-material';

type Word = {
  id: number;
  term: string;
  meaning: string;
  check_count: number;
  correct_count: number;
};

export default function Home() {
  const [quizWord, setQuizWord] = useState<Word | null>(null);
  const [answer, setAnswer] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [newTerm, setNewTerm] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    fetchWord();
  }, []);

  const fetchWord = async () => {
    const res = await fetch('/api/words/random');
    const data = await res.json();
    setQuizWord(data);
    setAnswer('');
    setResult(null);
  };

  const checkWord = async () => {
    if (!quizWord) return;
    const cleanAnswer = answer.replace(/・/g, '').trim().toLowerCase();
    const cleanMeaning = quizWord.meaning.replace(/・/g, '').trim().toLowerCase();
    const isCorrect = cleanAnswer === cleanMeaning;

    setResult(isCorrect ? '正解' : '不正解：' + quizWord.meaning);

    await fetch(`/api/words/${quizWord.id}/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correct: isCorrect }),
    });

    setQuizWord({
      ...quizWord,
      check_count: quizWord.check_count + 1,
      correct_count: quizWord.correct_count + (isCorrect ? 1 : 0),
    });
  };

  const deleteWord = async () => {
    if (!quizWord) return;
    await fetch(`/api/words/${quizWord.id}`, { method: 'DELETE' });
    fetchWord();
  };

  const addWord = async () => {
    if (!newTerm || !newMeaning) return;
    await fetch('/api/words', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ term: newTerm, meaning: newMeaning }),
    });
    setNewTerm('');
    setNewMeaning('');
    setModalOpen(false);
  };

  const percentage = quizWord?.check_count
    ? ((quizWord.correct_count / quizWord.check_count) * 100).toFixed(1)
    : '0.0';

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', my: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* 上段：学習カード */}
      <Card>
        <CardHeader
          title="単語帳"
          sx={{ bgcolor: 'primary.main', color: 'white', textAlign: 'center' }}
        />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5" align="center">{quizWord?.term ?? '---'}</Typography>
            <TextField
              label="読み方"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              fullWidth
            />

            {/* ボタン + 結果 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button variant="contained" color="success" onClick={checkWord}>
                  <Check />
                </Button>
                <Typography variant="body2">
                  {quizWord ? `${quizWord.correct_count}/${quizWord.check_count} (${percentage}%)` : ''}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" color="error" onClick={deleteWord}><Close /></Button>
                <Button variant="contained" color="primary" onClick={fetchWord}><ArrowForward /></Button>
              </Box>
            </Box>

            {result && <Typography align="center" variant="subtitle1">{result}</Typography>}
          </Box>
        </CardContent>
      </Card>

      {/* 下段：単語追加モーダル */}
      <Box sx={{ textAlign: 'center' }}>
        <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
          <Add />
        </Button>
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="単語" value={newTerm} onChange={(e) => setNewTerm(e.target.value)} />
            <TextField label="読み方" value={newMeaning} onChange={(e) => setNewMeaning(e.target.value)} />
          </DialogContent>
          <DialogActions>
            <Button color="success" onClick={addWord}><Check /></Button>
            <Button color="error" onClick={() => setModalOpen(false)}><Close /></Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
